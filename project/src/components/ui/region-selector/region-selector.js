class RussiaRegionSelector extends HTMLElement {
    constructor() {
        super();
        this.token = "bc9d9254dea2089592ccee5328f19ce9d004a43c";
        this.timeoutId = null;
        this.selectedSuggestion = null;
        this.onSelectCallback = null;
        this.selectedRegions = [];
        this.maxSelection = 3; // Максимальное количество выбираемых городов
        this.attachShadow({ mode: 'open' });

        this.common = new CommonFunctions();
        this.api = new WebAPI();
        this.webRequest = new WebRequest();
    }

    async loadInitialRegions() {
        try {
            const regions = await this.getClientRegions();
            
            if (regions && regions.length > 0) {
                const formattedRegions = await this.convertToDaDataFormat(regions);
                
                formattedRegions.forEach(region => {
                    this.selectedRegions.push({
                        label: region.regionName,
                        value: region.fiasId,
                        data: { fias_id: region.fiasId }
                    });
                });
                
                this.updateChips();
                
                const button = this.shadowRoot.getElementById('select-button');
                button.disabled = this.selectedRegions.length >= this.maxSelection;
                
                if (this.selectedRegions.length >= this.maxSelection) {
                    this.showLimitMessage();
                }
            }
        } catch (error) {
            console.error('Ошибка при загрузке начальных регионов:', error);
        }
    }

    async convertToDaDataFormat(regions) {
        const results = [];
        
        for (const region of regions) {
            try {
                const response = await fetch("https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/address", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": "Token " + this.token
                    },
                    body: JSON.stringify({
                        query: region.fiasId,
                        count: 1
                    })
                });

                if (!response.ok) throw new Error("Ошибка запроса");
                
                const data = await response.json();
                if (data.suggestions && data.suggestions.length > 0) {
                    const suggestion = data.suggestions[0];
                    results.push({
                        regionName: `${suggestion.data.region} ${this.getRegionTitle(suggestion)}`,
                        fiasId: suggestion.data.region_fias_id
                    });
                }
            } catch (error) {
                console.error(`Ошибка при получении данных для региона ${region.fiasId}:`, error);
                results.push({
                    regionName: region.regionName || "Неизвестный регион",
                    fiasId: region.fiasId
                });
            }
        }
        
        return results;
    }

    connectedCallback() {
        this.render();
        this.initEventListeners();
        this.loadInitialRegions(); // Загружаем регионы при инициализации
    }

    setOnSelectCallback(callback) {
        if (typeof callback === 'function') {
            this.onSelectCallback = callback;
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <div class="town-select">
                <div class="input-container">
                    <input type="text" class="form-control is-valid" placeholder="Укажите регионы" id="region-input">
                    <button id="select-button" disabled>+</button>
                </div>
                <div class="suggestions-container" id="suggestions-container"></div>
                <div class="limit-message" id="limit-message"></div>
                <div class="chips-container" id="chips-container"></div>
            </div>
            ${this.getStyles()}
        `;
    }

    getStyles() {
        return `
            <style>
                .town-select {
                    position: relative;
                    width: 100%;
                    font-family: Arial, sans-serif;
                }
                
                .input-container {
                    display: flex;
                    gap: 10px;
                }
                .town-select input:focus {
                    border-color: var(--bs-form-valid-border-color);
                    outline: none;
                    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
                }
                
                .town-select input {
                    display: block;
                    width: 100%;
                    padding: .375rem .75rem;
                    font-size: 1rem;
                    font-weight: 400;
                    line-height: 1.5;
                    color: var(--bs-body-color);
                    background-color: var(--bs-body-bg);
                    background-clip: padding-box;
                    border: var(--bs-border-width) solid var(--bs-border-color);
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                    border-radius: var(--bs-border-radius);
                    border-color: var(--bs-form-valid-border-color);
                    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
                }
                
                .town-select button {
                    padding: 10px 15px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.3s;
                }
                
                .town-select button:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                }
                
                .town-select button:not(:disabled):hover {
                    background-color: #45a049;
                }
                
                .suggestions-container {
                    position: absolute;
                    left: 0;
                    right: 0;
                    background: white;
                    border: 1px solid #ddd;
                    border-top: none;
                    border-radius: 0 0 4px 4px;
                    max-height: 300px;
                    overflow-y: auto;
                    z-index: 1000;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    display: none;
                }
                
                .region-selector-suggestion-item {
                    padding: 10px;
                    cursor: pointer;
                    border-bottom: 1px solid #eee;
                    font-size: 0.87rem;
                }
                
                .region-selector-suggestion-item:last-child {
                    border-bottom: none;
                }
                
                .region-selector-suggestion-item:hover, .region-selector-suggestion-item.highlighted {
                    background-color: #f5f5f5;
                }
                
                .loading {
                    padding: 10px;
                    color: #666;
                    text-align: center;
                    font-style: italic;
                }
                
                .chips-container {
                    display: flex;
                    flex-wrap: wrap;
                    margin-top: 10px;
                    gap: 5px;
                }
                .limit-message {
                    color: #e74c3c;
                    font-size: 0.9rem;
                    margin-top: 5px;
                    display: none;
                }
            </style>
        `;
    }

    initEventListeners() {         
        try {
            const input = this.shadowRoot.getElementById('region-input');
            const button = this.shadowRoot.getElementById('select-button');
            const container = this.shadowRoot.getElementById('suggestions-container');

            input.addEventListener('input', this.handleInput.bind(this));
            input.addEventListener('focus', this.showSuggestionsIfData.bind(this));
            input.addEventListener('keydown', this.handleKeyDown.bind(this));
            button.addEventListener('click', this.handleButtonClick.bind(this));
            this.shadowRoot.addEventListener('chip-removed', this.handleChipRemoved.bind(this));

            document.addEventListener('click', (e) => {
                if (!this.shadowRoot.contains(e.target)) {
                    container.style.display = 'none';
                }
            });
        } catch(error) {
            console.log(error);
        }
    }

    async getClientRegions() {
        try {
            console.log('getClientRegions');
            const response = await this.webRequest.get(
                this.api.getClientRegionsMethod(),
                {},
                true
            );
            return response?.regions || [];
        } catch (error) {
            console.log('Ошибка при получении регионов:', error);
            return [];
        }
    }

    handleChipRemoved(e) {
        const value = e.detail.value;
        this.selectedRegions = this.selectedRegions.filter(region => region.value !== value);
        this.updateChips();

        // Разблокируем кнопку если стало меньше максимального количества
        if (this.selectedRegions.length < this.maxSelection) {
            const button = this.shadowRoot.getElementById('select-button');
            button.disabled = false;
            const message = this.shadowRoot.getElementById('limit-message');
            message.style.display = 'none';
        }
    }

    showLimitMessage() {
        const message = this.shadowRoot.getElementById('limit-message');
        message.textContent = `Доступно не более ${this.maxSelection} регионов`;
        message.style.display = 'block';
    }

    showSuggestionsIfData() {
        const container = this.shadowRoot.getElementById('suggestions-container');
        if (container.children.length > 0) {
            container.style.display = 'block';
        }
    }

    async handleInput(e) {
        const query = e.target.value.trim();
        clearTimeout(this.timeoutId);

        const button = this.shadowRoot.getElementById('select-button');
        button.disabled = true;

        if (query.length === 0) {
            this.hideSuggestions();
            return;
        }

        this.timeoutId = setTimeout(async () => {
            await this.fetchAndShowSuggestions(query);
        }, 300);
    }

    async fetchAndShowSuggestions(query) {
        const input = this.shadowRoot.getElementById('region-input');
        const container = this.shadowRoot.getElementById('suggestions-container');
        
        container.innerHTML = '<div class="loading">Загрузка...</div>';
        container.style.display = 'block';

        try {
            const suggestions = await this.fetchSuggestions(query);
            this.showSuggestions(suggestions, input.value);
        } catch (error) {
            console.error('Ошибка:', error);
            container.innerHTML = '<div class="loading">Ошибка загрузки данных</div>';
        }
    }

    async fetchSuggestions(query) {
        const response = await fetch("https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Token " + this.token
            },
            body: JSON.stringify({
                query: query,
                locations: [
                    { fias_level: 1 }
                ],
                restrict_value: true
            })
        });

        if (!response.ok) throw new Error("Ошибка запроса");
        const data = await response.json();
        return data.suggestions || [];
    }

    getRegionTitle(suggestion) {
        if (!suggestion?.data?.region_type_full) return '';

        if (suggestion.data.region_type_full === "город" ) {
            return "";
        }

        if (suggestion.data.region_type_full === "республика") {
            return "Республика";
        }

        return suggestion.data.region_type_full;
    }

    showSuggestions(suggestions, currentValue) {
        const container = this.shadowRoot.getElementById('suggestions-container');
        container.innerHTML = '';
        
        if (suggestions.length === 0) {
            container.innerHTML = '<div class="loading">Ничего не найдено</div>';
            return;
        }

        suggestions.forEach(suggestion => {
            let isRegion = suggestion.data.region_fias_id == suggestion.data.fias_id;
            
            if (isRegion && !this.selectedRegions.some(r => r.value === suggestion.data.region_fias_id)) {
                const item = document.createElement('div');
                item.className = 'region-selector-suggestion-item';
                item.textContent = `${suggestion?.data?.region} ${this.getRegionTitle(suggestion)}`;
                item.dataset.value = JSON.stringify(suggestion);
                
                item.addEventListener('click', () => {
                    this.selectSuggestion(suggestion, false); // Не добавляем чип сразу
                });
                
                container.appendChild(item);
            }
        });

        container.style.display = 'block';
    }

    hideSuggestions() {
        const container = this.shadowRoot.getElementById('suggestions-container');
        container.style.display = 'none';
    }

    selectSuggestion(suggestion, addChip = true) {
        const input = this.shadowRoot.getElementById('region-input');
        const button = this.shadowRoot.getElementById('select-button');
        
        input.value = `${suggestion?.data?.region} ${this.getRegionTitle(suggestion)}`;
        this.selectedSuggestion = suggestion;
        this.hideSuggestions();
        button.disabled = false;

        if (addChip && !this.selectedRegions.some(r => r.value === suggestion.data.region_fias_id)) {
            const regionName = `${suggestion.data.region} ${this.getRegionTitle(suggestion)}`;
            this.selectedRegions.push({
                label: regionName,
                value: suggestion.data.region_fias_id,
                data: suggestion.data
            });
            this.updateChips();
        }

        if (this.onSelectCallback) {
            this.onSelectCallback(suggestion);
        }

        // Отключаем кнопку если выбрано максимальное количество городов
        if (this.selectedRegions.length === this.maxSelection) {
            const button = this.shadowRoot.getElementById('select-button');
            button.disabled = true;
            this.showLimitMessage();
        }
    }

    updateChips() {
        const container = this.shadowRoot.getElementById('chips-container');
        container.innerHTML = '';
        
        this.selectedRegions.forEach(region => {
            const chip = document.createElement('chip-button');
            chip.setAttribute('label', region.label);
            chip.setAttribute('value', region.value);
            chip.setAttribute('title', `ФИАС ID: ${region.value}`);
            container.appendChild(chip);
        });
    }

    handleButtonClick() {
        let o = this;
        if (this.selectedSuggestion) {
            this.selectSuggestion(this.selectedSuggestion, true); // Добавляем чип при нажатии кнопки
            const input = this.shadowRoot.getElementById('region-input');
            input.value = '';
            input.focus();
            const button = this.shadowRoot.getElementById('select-button');
            button.disabled = true;

            let selectedSuggestion = this.selectedSuggestion;
            selectedSuggestion.regionName = `${this.selectedSuggestion.data.region} ${this.getRegionTitle(this.selectedSuggestion)}`;
            this.dispatchEvent(new CustomEvent('region-selected', {
                detail: { selectedSuggestion },
                bubbles: true,
                composed: true
            }));
        }
    }

    handleKeyDown(e) {
        const container = this.shadowRoot.getElementById('suggestions-container');
        const items = container.querySelectorAll('.region-selector-suggestion-item');
        let currentIndex = -1;

        if (container.style.display !== 'block') return;

        items.forEach((item, index) => {
            if (item.classList.contains('highlighted')) {
                item.classList.remove('highlighted');
                currentIndex = index;
            }
        });

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % items.length;
            items[nextIndex].classList.add('highlighted');
            items[nextIndex].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIndex = (currentIndex - 1 + items.length) % items.length;
            items[prevIndex].classList.add('highlighted');
            items[prevIndex].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const highlighted = container.querySelector('.region-selector-suggestion-item.highlighted');
            if (highlighted) {
                const suggestion = JSON.parse(highlighted.dataset.value);
                this.selectSuggestion(suggestion, false); // Не добавляем чип при Enter
            } else if (items.length > 0) {
                const suggestion = JSON.parse(items[0].dataset.value);
                this.selectSuggestion(suggestion, false); // Не добавляем чип при Enter
            }
        } else if (e.key === 'Escape') {
            this.hideSuggestions();
        }
    }
}

customElements.define('region-selector', RussiaRegionSelector);