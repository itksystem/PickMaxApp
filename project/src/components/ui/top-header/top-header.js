class TopHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
       // Создаем callback-ы
        this.onSearchButtonClick = null;
        this.onEnterPress = null;
    }

   static get observedAttributes() {
        return ['search-placeholder'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      console.log(name, oldValue, newValue);
        if (name === 'search-placeholder' && this.searchInput) {
            this.searchInput.setAttribute('placeholder', newValue);
        }
    }

    connectedCallback() {
        // Создаем структуру HTML меню
       const linkElem = document.createElement('link');
       linkElem.setAttribute('rel', 'stylesheet');
       linkElem.setAttribute('href', '/src/components/ui/top-header/css/top-header.css');
       this.shadowRoot.appendChild(linkElem);

       const linkElem2 = document.createElement('link');
       linkElem2.setAttribute('rel', 'stylesheet');
       linkElem2.setAttribute('href', '/src/pages/plugins/fontawesome-free/css/all.min.css');
       this.shadowRoot.appendChild(linkElem2);

       this.shadowRoot.innerHTML += `
            <header class="header">
                <div class="header__container">
                    <div class="header__top">
			<a href="/" class="header__logo">
                     
                        </a>
                    </div>
                    <div class="header__bottom">
                        <div class="header__search">
                            <input type="search" class="search-input" placeholder=""${this.getAttribute('search-placeholder') || 'Поиск'}">
                            <button type="button" class="search-button"><i class="fas fa-search"></i></button>
                        </div>
                    </div>
                </div>
            </header>
        `;  // 🔍
     // Обработчики событий для кнопки и клавиши Enter
        this.searchInput = this.shadowRoot.querySelector('.search-input');
        if( this.searchInput) {
        this.searchInput.addEventListener('keydown', (event) => {
            console.log(event.key);
            if (event.key === 'Enter' && typeof this.onEnterPress === 'function') {
                this.onEnterPress(this.searchInput.value);
            }
          });
        }
        this.searchButton = this.shadowRoot.querySelector('.search-button');
        if(this.searchButton) {
        this.searchButton.addEventListener('click', () => {
            console.log(event.key);
            if (typeof this.onSearchButtonClick === 'function') {
                this.onSearchButtonClick(this.searchInput.value);
            }
        });
      }
    }

    // Метод для установки placeholder через свойство
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

    setEnterPressCallback(callback) {
        this.onEnterPress = callback;
    }





}


document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('top-header').shadowRoot.querySelector('.header');
    let lastScroll = 0;

    // Функция для скрытия/отображения меню при прокрутке
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll > lastScroll && currentScroll > header.offsetHeight) {
            // Прокрутка вниз - скрыть меню
            header.style.top = `-${header.offsetHeight}px`;
        } else {
            // Прокрутка вверх - показать меню
            header.style.top = '0';
        }

        lastScroll = currentScroll <= 0 ? 0 : currentScroll; // Для мобильных устройств
    });

    // Обработка открытия мобильного меню

    const topHeader = document.querySelector('top-header').shadowRoot.querySelector('.header');
/*
    burger.addEventListener('click', () => {
        topHeader.classList.toggle('header--mobile-menu-open');
    });
*/
    // Обработка свайпов для мобильных устройств
    let touchStartY = 0;
    let touchEndY = 0;

    const handleGesture = () => {
        if (touchEndY < touchStartY - 50) {
            // Свайп вверх - скрыть меню
            header.style.top = `-${header.offsetHeight}px`;
        }

        if (touchEndY > touchStartY + 50) {
            // Свайп вниз - показать меню
            header.style.top = '0';
        }
    };

    window.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    }, false);

    window.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        handleGesture();
    }, false);

    // Закрытие мобильного меню при выборе пункта
    const navLinks = document.querySelector('top-header').shadowRoot.querySelectorAll('.header__nav-item a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            topHeader.classList.remove('header--mobile-menu-open');
        });
    });
});

console.log('initialize top-header... ');
customElements.define('top-header', TopHeader);

