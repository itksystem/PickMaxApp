class TownSelector extends HTMLElement { 
    constructor() {
        super();
        this.token = "bc9d9254dea2089592ccee5328f19ce9d004a43c";
        this.timeoutId = null;
        this.selectedSuggestion = null;
        this.onSelectCallback = null;
        this.selectedTowns = [];
        this.maxSelection = 3; // Максимальное количество выбираемых городов
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.initEventListeners();
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
                    <input type="text" placeholder="Введите название города" id="town-input">
                    <button id="clear-button" class="clear-btn" title="Очистить поле">&times;</button>
                    <button id="select-button" disabled>Выбрать</button>
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
                    gap: 5px;
                    align-items: center;
                }

                .town-select input {
                    flex: 1;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    box-sizing: border-box;
                    font-size: 16px;
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

                .town-select button.clear-btn {
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    background-color: transparent;
                    color: #999;
                    font-size: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .town-select button.clear-btn:hover {
                    color: #666;
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

                .suggestion-item {
                    padding: 10px;
                    cursor: pointer;
                    border-bottom: 1px solid #eee;
                }

                .suggestion-item:last-child {
                    border-bottom: none;
                }

                .suggestion-item:hover, .suggestion-item.highlighted {
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
        const input = this.shadowRoot.getElementById('town-input');
        const clearButton = this.shadowRoot.getElementById('clear-button');
        const selectButton = this.shadowRoot.getElementById('select-button');
        const container = this.shadowRoot.getElementById('suggestions-container');

        input.addEventListener('input', this.handleInput.bind(this));
        input.addEventListener('focus', this.showSuggestionsIfData.bind(this));
        input.addEventListener('keydown', this.handleKeyDown.bind(this));
        clearButton.addEventListener('click', this.handleClearClick.bind(this));
        selectButton.addEventListener('click', this.handleButtonClick.bind(this));

        this.shadowRoot.addEventListener('chip-removed', this.handleChipRemoved.bind(this));

        document.addEventListener('click', (e) => {
            if (!this.shadowRoot.contains(e.target)) {
                container.style.display = 'none';
            }
        });
    }

    handleClearClick() {
        const input = this.shadowRoot.getElementById('town-input');
        input.value = '';
        input.focus();
        this.hideSuggestions();
        this.selectedSuggestion = null;
        const button = this.shadowRoot.getElementById('select-button');
        button.disabled = true;
    }

    handleChipRemoved(e) {
        const value = e.detail.value;
        this.selectedTowns = this.selectedTowns.filter(town => town.value !== value);
        this.updateChips();
        
        // Разблокируем кнопку если стало меньше максимального количества
        if (this.selectedTowns.length < this.maxSelection) {
            const button = this.shadowRoot.getElementById('select-button');
            button.disabled = false;
            const message = this.shadowRoot.getElementById('limit-message');
            message.style.display = 'none';
        }
    }

    showLimitMessage() {
        const message = this.shadowRoot.getElementById('limit-message');
        message.textContent = `Доступно не более ${this.maxSelection} городов`;
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
        const input = this.shadowRoot.getElementById('town-input');
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
                    { city_type_full: "город" },
                    { settlement_type_full: "рабочий поселок" },
                    { region_kladr_id: "2700000000000" },
                    { region_kladr_id: "1900000000000" }
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

        if (suggestion.data.fias_id == suggestion.data.region_fias_id ) {
            return "";
        }
        return `, ${suggestion.data.region_with_type}`;
    }

    showSuggestions(suggestions, currentValue) {
        const container = this.shadowRoot.getElementById('suggestions-container');
        container.innerHTML = '';
        
        if (suggestions.length === 0) {
            container.innerHTML = '<div class="loading">Ничего не найдено</div>';
            return;
        }

        suggestions.forEach(suggestion => {
            const isCity = suggestion.data.city_type_full === "город" 
                && suggestion.data.city?.includes(currentValue);
            const isWorkSettlement = suggestion.data.settlement_type_full === "рабочий поселок" 
                && suggestion.data.settlement?.includes(currentValue);
            
            if ((isCity || isWorkSettlement) 
                && (suggestion?.data?.fias_level == 1 || suggestion?.data?.fias_level == 4 || suggestion?.data?.fias_level == 6)
                && !suggestion?.data?.city_district_type
            ){
                const item = document.createElement('div');
                item.className = 'suggestion-item';

                const displayText = suggestion?.data?.city 
                    ? `${suggestion.data.city} ${this.getRegionTitle(suggestion)}`
                    : `${suggestion.data.settlement} ${this.getRegionTitle(suggestion)}`;
                    
                item.textContent = displayText;
                item.dataset.value = JSON.stringify(suggestion);
                
                item.addEventListener('click', () => {
                    this.selectSuggestion(suggestion, false);
                });
                
                container.appendChild(item);
            }
        });
    }

    selectSuggestion(suggestion, isHighlighted) {
        if (isHighlighted) {
            this.selectedSuggestion = suggestion;
        }
        
        if (this.selectedSuggestion && !this.selectedTowns.some(town => town.value === this.selectedSuggestion.value)) {
            if (this.selectedTowns.length < this.maxSelection) {
                this.selectedTowns.push(this.selectedSuggestion);
                this.updateChips();
                this.selectedSuggestion = null;
                this.hideSuggestions();
                
                // Отключаем кнопку если выбрано максимальное количество городов
                if (this.selectedTowns.length === this.maxSelection) {
                    const button = this.shadowRoot.getElementById('select-button');
                    button.disabled = true;
                    this.showLimitMessage();
                }
            }
        }
    }

    updateChips() {
        const container = this.shadowRoot.getElementById('chips-container');
        container.innerHTML = '';
        this.selectedTowns.forEach(town => {
            const chip = document.createElement('div');
            chip.className = 'chip';
            chip.textContent = town.value;
            chip.addEventListener('click', () => this.removeChip(town));
            container.appendChild(chip);
        });
    }

    removeChip(town) {
        this.selectedTowns = this.selectedTowns.filter(t => t !== town);
        this.updateChips();
    }

    hideSuggestions() {
        const container = this.shadowRoot.getElementById('suggestions-container');
        container.style.display = 'none';
    }
}
customElements.define('town-selector', TownSelector);
