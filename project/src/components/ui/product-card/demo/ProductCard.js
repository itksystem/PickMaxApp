class ProductCard extends HTMLElement {
    constructor() {
        super();
        // Создаем Shadow DOM
        this.attachShadow({ mode: 'open' });
        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', 'ProductCard.css'); // Укажите правильный путь к CSS-файлу
        this.shadowRoot.appendChild(linkElem);
                 
        // Создаем шаблон
        const template = document.createElement('template');
        template.innerHTML = `
            <div class="wrapper">
                <a class="link" href="#" aria-label="">
                    <div class="media-wrap">
                        <img class="image" src="" alt="" loading="lazy">
                        <video class="video" muted loop preload="metadata">
                            <source src="" type="video/mp4">
                            Ваш браузер не поддерживает видео.
                        </video>
                        <!-- Кнопки управления видео -->
                        <div class="video-controls">
                            <button class="video-button play">▶️</button>
                            <button class="video-button pause">⏸️</button>
                        </div>
                    </div>
                    <div class="info">
                        <span class="title">
                            <span class="brand"></span>
                            <span class="name"></span>
                        </span>
                        <div class="price">
 			 <div class="row">
			  <div class="col">
                            <span class="current-price"></span>
                            <del class="old-price"></del>
                            <span class="discount"></span>
                          </div>
                        </div>
		     </div>
		     <div class="additional-info">
 			 <div class="row">
			  <div class="col">
  			         <span class="star-image">⭐</span>
   		    	         <span class="star-info-counter">4.7</span>
  			         <span class="grade-mark">*</span>
  			         <span class="grade-counter">122</span>
   		    	         <span class="grade-description"> оценок</span>
		         </div>
		       </div>
	 	     </div>
                   </div>
                </a>
            </div>
	  </div>
        `;

        // Клонируем и добавляем шаблон в Shadow DOM
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // Добавляем обработчики событий для управления видео
        this.shadowRoot.querySelector('.play').addEventListener('click', (e) => {
            e.preventDefault();
            this.playVideo();
        });

        this.shadowRoot.querySelector('.pause').addEventListener('click', (e) => {
            e.preventDefault();
            this.pauseVideo();
        });
    }

    // Наблюдаемые атрибуты
    static get observedAttributes() {
        return [
            'href',
            'image-src',
            'image-alt',
            'video-src',
            'brand',
            'name',
            'current-price',
            'old-price',
            'discount',
            'wallet-condition',
            'aria-label'
        ];
    }

    // Обработка изменений атрибутов
    attributeChangedCallback(name, oldValue, newValue) {
        const selector = this.getSelector(name);
        if (!selector) return;
        const element = this.shadowRoot.querySelector(selector);

        if (!element) return;

        switch(name) {
            case 'href':
                element.href = newValue;
                break;
            case 'image-src':
                this.shadowRoot.querySelector('.image').src = newValue;
		const image = this.shadowRoot.querySelector('.image');
		image.onerror = () => {        // реакция на ошибку
		    image.src = 'path/to/default-image.webp';
                    this.shadowRoot.querySelector('.image').src = image.src;
		};
                break;
            case 'image-alt':
                this.shadowRoot.querySelector('.image').alt = newValue;
                break;
            case 'video-src':
                const video = this.shadowRoot.querySelector('.video');
                if (newValue) {
                    video.querySelector('source').src = newValue;
                    video.load();
                    this.setAttribute('video-src', newValue);
                } else {
                    video.querySelector('source').src = '';
                    video.load();
                    this.removeAttribute('video-src');
                }
                break;
            case 'brand':
                this.shadowRoot.querySelector('.brand').textContent = newValue;
                break;
            case 'name':
                this.shadowRoot.querySelector('.name').textContent = newValue;
                break;
            case 'current-price':
                this.shadowRoot.querySelector('.current-price').textContent = newValue;
                break;
            case 'old-price':
                this.shadowRoot.querySelector('.old-price').textContent = newValue;
                break;
            case 'discount':
                this.shadowRoot.querySelector('.discount').textContent = newValue;
                break;
            case 'wallet-condition':
                this.shadowRoot.querySelector('.wallet-condition').textContent = newValue;
                break;
            case 'aria-label':
                element.setAttribute('aria-label', newValue);
                break;
        }
    }

    // Определение селекторов для каждого атрибута
    getSelector(attr) {
        const selectors = {
            'href': '.link',
            'image-src': '.image',
            'image-alt': '.image',
            'video-src': '.video source',
            'brand': '.brand',
            'name': '.name',
            'current-price': '.current-price',
            'old-price': '.old-price',
            'discount': '.discount',
            'wallet-condition': '.wallet-condition',
            'aria-label': '.link'
        };
        return selectors[attr];
    }

    // Инициализация начальных значений
    connectedCallback() {
        // Установка атрибутов по умолчанию или их отсутствие
        const attrs = ProductCard.observedAttributes;
        attrs.forEach(attr => {
            if (this.hasAttribute(attr)) {
                this.attributeChangedCallback(attr, null, this.getAttribute(attr));
            }
        });
    }

    // Методы для управления видео
    playVideo() {
        const video = this.shadowRoot.querySelector('.video');
        if (video) {
            video.play();
        }
    }

    pauseVideo() {
        const video = this.shadowRoot.querySelector('.video');
        if (video) {
            video.pause();
        }
    }

    // Методы для изменения стилей через JavaScript
    /**
     * Метод для установки количества строк для поля 'name'
     * @param {number} lines - Количество строк (например, 1 или 2)
     */
    setNameLines(lines) {
        const nameElem = this.shadowRoot.querySelector('.name');
        if (lines === 1) {
            nameElem.style.whiteSpace = 'nowrap';
            nameElem.style.overflow = 'hidden';
            nameElem.style.textOverflow = 'ellipsis';
            nameElem.style.display = '';
            nameElem.style.webkitLineClamp = '';
            nameElem.style.webkitBoxOrient = '';
        } else if (lines > 1) {
            nameElem.style.whiteSpace = 'normal';
            nameElem.style.overflow = 'hidden';
            nameElem.style.textOverflow = '';
            nameElem.style.display = '-webkit-box';
            nameElem.style.webkitLineClamp = lines;
            nameElem.style.webkitBoxOrient = 'vertical';
        }
    }

    /**
     * Метод для изменения фона карточки
     * @param {string} color - Цвет фона (например, '#ffffff')
     */
    setBackgroundColor(color) {
        this.style.setProperty('--product-card-bg-color', color);
    }

    /**
     * Метод для изменения тени карточки
     * @param {string} shadow - CSS-тень (например, '0 4px 12px rgba(0, 0, 0, 0.2)')
     */
    setBoxShadow(shadow) {
        this.style.setProperty('--product-card-box-shadow', shadow);
    }

    /**
     * Метод для установки максимальной ширины карточки
     * @param {string} width - Максимальная ширина (например, '11.69rem' или '23%')
     */
    setMaxWidth(width) {
        this.style.setProperty('--product-card-max-width', width);
    }

    /**
     * Метод для установки радиуса скругления углов карточки
     * @param {number} borderRadiusRem - Радиус скругления в rem
     */
    setBorderRadius(borderRadiusRem) {
        this.style.setProperty('--product-card-border-radius', `${borderRadiusRem}rem`);
    }

    /**
     * Метод для установки трансформации при наведении
     * @param {number} translateYRem - Сдвиг по оси Y в rem
     */
    setHoverTransform(translateYRem) {
        this.style.setProperty('--product-card-hover-transform', `translateY(${translateYRem}rem)`);
    }

    /**
     * Метод для установки тени при наведении
     * @param {string} shadow - CSS-тень (например, '0 0.25rem 0.75rem rgba(0, 0, 0, 0.2)')
     */
    setHoverShadow(shadow) {
        this.style.setProperty('--product-card-hover-box-shadow', shadow);
    }
}

customElements.define('product-card', ProductCard);
