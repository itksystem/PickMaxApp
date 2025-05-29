
class TopHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.onSearchButtonClick = null;
        this.onEnterPress = null;
        this.onFilterButtonClick = null;
	this.onSearchInputChange = null;
        
        // Кэширование элементов
        this.elements = {
            header: null,
            searchInput: null,
            searchButton: null,
            filterButton: null
        };
    }

    static get observedAttributes() {
        return ['search-placeholder'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'search-placeholder' && this.elements.searchInput) {
            this.elements.searchInput.placeholder = newValue;
        }
    }

    connectedCallback() {
        this._render();
        this._setupEventListeners();
        this.setSearchButtonCallback(this.searchButtonCallback.bind(this));
        this.setFilterButtonCallback(this.filterButtonCallback.bind(this));
        this.setEnterPressCallback(this.enterPressCallback.bind(this));
        this.setSearchInputChangeCallback(this.searchInputChangeCallback.bind(this));

	document.addEventListener('DOMContentLoaded', () => {
        	this._setupScrollBehavior();
        });
    }

    _render() {
        // Создаем все стили сразу
        this.shadowRoot.innerHTML = `
            <style>
                @import "/src/components/ui/top-header/css/top-header.css";
                @import "/src/pages/plugins/fontawesome-free/css/all.min.css";
                @import "/src/pages/css/bootstrap.min.css";
            </style>
            <header class="header">
                <div class="header__container">
                    <div class="header__top">
                        <a href="/" class="header__logo"></a>
                    </div>
                    <div class="header__bottom">
                        <div class="header__search">
                            <query-search-selector  placeholder="${this.getAttribute('search-placeholder') || 'Поиск'}"></query-search-selector>
                            <button class="btn btn-outline-dark filter-button">
                                <i class="fas fa-filter"></i>
			       <custom-badge id="filter-badge" value="+" type="normal"></custom-badge>
                            </button>
			</div>
                    </div>
                </div>
            </header>
        `;

        // Кэшируем элементы
        this.elements.header = this.shadowRoot.querySelector('.header');
        this.elements.searchInput = this.shadowRoot.querySelector('.search-input');
        this.elements.searchButton = this.shadowRoot.querySelector('.search-button');
        this.elements.filterButton = this.shadowRoot.querySelector('.filter-button');
    }

    _setupEventListeners() {
        if (this.elements.searchInput) {
            this.elements.searchInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' && typeof this.onEnterPress === 'function') {
                    this.onEnterPress(this.elements.searchInput.value);
                }
            });
            this.elements.searchInput.addEventListener('input', (event) => {
                if (typeof this.onSearchInputChange === 'function') {
                    this.onSearchInputChange(this.elements.searchInput.value);
	 	if(this.elements.searchInput.value.trim() === ''){
                    this.elements.searchButton.classList.add('disabled')
		  } else
                    this.elements.searchButton.classList.remove('disabled')
                }
            });
        }

        if (this.elements.searchButton) {
            this.elements.searchButton.addEventListener('click', (event) => {
                if (typeof this.onSearchButtonClick === 'function') {
                    this.onSearchButtonClick(this.elements.searchInput.value);
                }
            });
        }

        if (this.elements.filterButton) {
            this.elements.filterButton.addEventListener('click', (event) => {
                if (typeof this.onFilterButtonClick === 'function') {
                    this.onFilterButtonClick();
                }
            });
        }


    }

 
 _setupScrollBehavior() {
        let lastScroll = 0;
        const headerHeight = this.elements.header?.offsetHeight || 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

            if (currentScroll > lastScroll && currentScroll > headerHeight) {
                this.elements.header.style.top = `-${headerHeight}px`;
            } else {
                this.elements.header.style.top = '0';
            }

            lastScroll = currentScroll <= 0 ? 0 : currentScroll;
        });

        // Обработка свайпов для мобильных устройств
        let touchStartY = 0;
        let touchEndY = 0;

        const handleGesture = () => {
            if (touchEndY < touchStartY - 50) {
                this.elements.header.style.top = `-${headerHeight}px`;
            }

            if (touchEndY > touchStartY + 50) {
                this.elements.header.style.top = '0';
            }
        };

        window.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        window.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].screenY;
            handleGesture();
        }, { passive: true });
    }

    // Методы для управления placeholder
    set searchPlaceholder(value) {
        this.setAttribute('search-placeholder', value);
    }

    get searchPlaceholder() {
        return this.getAttribute('search-placeholder');
    }

    // Методы для установки callback-ов
    setSearchButtonCallback(callback) {	
        this.onSearchButtonClick = callback;
    }

    searchButtonCallback(callback) {
	console.log(`searchButtonCallback`);
	this.sendEvent(QUEUE_TOP_HEADER_ACTIONS, {
	  event : EVENT_TOP_HEADER_SEARCH_ACTION, value : this.elements.searchInput.value
	})
    }

    setEnterPressCallback(callback) {
        this.onEnterPress = callback;
    }

    setSearchInputChangeCallback(callback) {
        this.onSearchInputChange = callback;
    }

    searchInputChangeCallback(){
	console.log(`searchInputChangeCallback`);
	this.sendEvent(QUEUE_TOP_HEADER_ACTIONS, {
	  event : EVENT_TOP_HEADER_SEARCH_INPUT_CHANGE_ACTION, value : this.elements.searchInput.value
	})
    }                          

    enterPressCallback(){
	console.log(`enterPressCallback`);
	this.sendEvent(QUEUE_TOP_HEADER_ACTIONS, {
	  event : EVENT_TOP_HEADER_SEARCH_ACTION, value : this.elements.searchInput.value
	})
    }

    setFilterButtonCallback(callback) {
        this.onFilterButtonClick = callback;
    }

    filterButtonCallback(){
	console.log(`filterButtonCallback`);
	this.sendEvent(QUEUE_TOP_HEADER_ACTIONS, {
	  event : EVENT_TOP_HEADER_FILTER_ACTION
	})
    }                        

    sendEvent(queue, o){
	console.log(queue, o);
      if (eventBus) {
        eventBus.emit(queue, o);
      }
    }
}

customElements.define('top-header', TopHeader);