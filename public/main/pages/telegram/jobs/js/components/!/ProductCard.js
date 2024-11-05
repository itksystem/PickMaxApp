class ProductCard extends HTMLElement {
    constructor() {
        super();
        // Создаем Shadow DOM
        this.attachShadow({ mode: 'open' });

        // Создаем шаблон
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                :host {
                    display: block;
                    max-width: 187px;
                    border-radius: 10px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    background-color: #fff;
                    margin: 10px;
                    overflow: hidden;
                    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
                    font-family: Arial, sans-serif;
                }
                
                :host(:hover) {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                }
                
                .wrapper {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                
                .link {
                    text-decoration: none;
                    color: inherit;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                
                .img-wrap {
                    width: 100%;
                    padding-top: 120%;
                    position: relative;
                    background-color: #f5f5f5;
                    overflow: hidden;
                }
                
                .image {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .info {
                    padding: 10px;
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                }
                
                .title {
    font-size: 13px;
    color: #555;
    white-space: nowrap; /* Обрезка текста в одну строку */
    overflow: hidden;    /* Скрытие излишков текста */
    text-overflow: ellipsis; /* Добавление многоточия в конце */
                }
                
                .brand {
                    font-weight: bold;
                    display: block;
                    margin-bottom: 5px;
                }
                
                .name {
                    font-size: 13px;
                    color: #555;
                }
                
                .price {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }
                
                .current-price {
                    font-size: 16px;
                    color: #e60000;
                    font-weight: bold;
                }
                
                .old-price {
                    font-size: 14px;
                    color: #999;
                    text-decoration: line-through;
                }
                
                .discount {
                    font-size: 13px;
                    color: #e60000;
                }
                
                .wallet-condition {
                    font-size: 12px;
                    color: #777;
                }
                                  
                /* Адаптивные стили */
                @media (max-width: 480px) {
                    :host {
                        max-width: 48%;
                    }
                }
                @media (min-width: 481px) and (max-width: 576px) {
                    :host {
                        max-width: 31%;
                    }
                }

                @media (min-width: 577px) and (max-width: 768px) {
                    :host {
                        max-width: 31%;
                    }
                }

                @media (min-width: 769px) and (max-width: 992px) {
                    :host {
                        max-width: 31%;
                    }
                }

                @media (min-width: 993px) {
                    :host {
                        max-width: 23%;
                    }
                }
            </style>
            <div class="wrapper">
                <a class="link" href="#" aria-label="">
                    <div class="img-wrap">
                        <img class="image" src="" alt="">
                    </div>
                    <div class="info">
                        <h2 class="title">
                            <span class="brand"></span>
                            <span class="name"></span>
                        </h2>
                        <div class="price">
                           <div class="row">
                              <span class="current-price"></span>
                              <del class="old-price"></del>
                              <span class="discount"></span>
                           </div>
                        </div>
                    </div>
                </a>
            </div>
        `;

        // Клонируем и добавляем шаблон в Shadow DOM
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    // Наблюдаемые атрибуты
    static get observedAttributes() {
        return [
            'href',
            'image-src',
            'image-alt',
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
        switch(name) {
            case 'href':
                this.shadowRoot.querySelector('.link').href = newValue;
                break;
            case 'image-src':
                this.shadowRoot.querySelector('.image').src = newValue;
                break;
            case 'image-alt':
                this.shadowRoot.querySelector('.image').alt = newValue;
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
                this.shadowRoot.querySelector('.link').setAttribute('aria-label', newValue);
                break;
        }
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
}

// Регистрация веб-компонента
customElements.define('product-card', ProductCard);
