class ProductCard extends HTMLElement {
    constructor() {
        super();
        // Создаем Shadow DOM
        let o = this;
        this.api = new WebAPI();
        this.attachShadow({ mode: 'open' });
        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', '/src/components/ui/product-card/css/product-card.css'); // Укажите правильный путь к CSS-файлу
        this.shadowRoot.appendChild(linkElem);
        const linkElem2= document.createElement('link');
        linkElem2.setAttribute('rel', 'stylesheet');
        linkElem2.setAttribute('href', '/src/pages/plugins/adminlte/css/adminlte.min.css'); // Укажите правильный путь к CSS-файлу
        this.shadowRoot.appendChild(linkElem2);
        const linkElem3= document.createElement('link');
        linkElem3.setAttribute('rel', 'stylesheet');
        linkElem3.setAttribute('href', '/src/components/ui/basket-button/css/basket-button.css'); // Укажите правильный путь к CSS-файлу
        this.shadowRoot.appendChild(linkElem3);
        this.common = new CommonFunctions();                 
        // Создаем шаблон
        const template = document.createElement('template');
        const likeIconVisible = this.common.getAccessToken() ? `d-block`: `d-none`;
        template.innerHTML = `
            <div class="wrapper">
                <a class="link" href="#" aria-label="">
 	         <div class="ribbon-wrapper ribbon-lg">
	           <div class="ribbon"></div>
	         </div>
		 <a class="like-link">
			 <div class="like-wrap ${likeIconVisible}">
     			    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				  <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" 
				  class="like" stroke="black" stroke-width="2" fill="white"/>
			    </svg>
			</div>
		 </a>
                    <div class="media-wrap">
<image-gallery
  title="Amazing Product"
  show-indicators
  loop
  active-index="0">  
</image-gallery>
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
  			    <span class="currency-type"></span>
                            <del class="old-price"></del>
  			    <span class="currency-type"></span>
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
		<basket-button class="button-add-to-basket"></basket-button>
            </div>
	  </div>
        `;

        // Клонируем и добавляем шаблон в Shadow DOM
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        let likeWrap = this.shadowRoot.querySelector('.like-link');
        let likePath = likeWrap.querySelector('path.like');

	likeWrap.addEventListener('click', (e) => {
	    e.stopPropagation();
	    likeWrap.classList.toggle('liked');
	    const isLiked = likeWrap.classList.contains('liked');
	    likePath.setAttribute('stroke', isLiked ? 'white' : 'black');
	    likePath.setAttribute('fill', isLiked ? 'red' : 'white');
	    o.setLike(o.productId, isLiked);
	});

        let CardWrap = this.shadowRoot.querySelector('.wrapper');
        CardWrap.addEventListener('click', (e) => {
          e.stopPropagation();
	  if (CardWrap.classList.contains('clicked')) {
	        CardWrap.classList.remove('clicked');
	    } else {
	        CardWrap.classList.add('clicked');
		window.location.href = `/products/${this.productId}/page`;
	    }
        });


    }

    // Наблюдаемые атрибуты
    static get observedAttributes() {
        return [
            'like',
            'basket-count',
            'product-id',
            'href',
            'status',
            'image-src',
            'image-alt',
            'video-src',
            'brand',
            'name',
            'current-price',
            'currency-type',
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
        const imageGallery = this.shadowRoot.querySelector('image-gallery');
	console.log(`imageGallery`,imageGallery);
	console.log(name, oldValue, newValue);
        switch(name) {
	    case 'like':        
                let likeWrap = this.shadowRoot.querySelector('.like-link');
    	          if(newValue ==1) 
			  likeWrap.classList.add('liked'); // Добавляем класс liked
	        let likePath = likeWrap.querySelector('path.like');
	  	  likePath.setAttribute('stroke', (newValue == 1) ? 'white' : 'black');
          	  likePath.setAttribute('fill', (newValue == 1) ? 'red' : 'white');
            break;

	    case 'basket-count':
            const _basketButton = this.shadowRoot.querySelector('.button-add-to-basket');
            if (_basketButton) {
                _basketButton.setAttribute('basket-count', newValue || '');
            }

            break;

	    case 'product-id':
            this.productId = newValue;
            const basketButton = this.shadowRoot.querySelector('.button-add-to-basket');
            if (basketButton) {
                basketButton.setAttribute('product-id', newValue);
            }
            if (imageGallery) {
                imageGallery.setAttribute('product-id', newValue);
            }

            break;

            case 'status':
                this.shadowRoot.querySelector('.ribbon').textContent = (newValue != 'active' ? 'Блокирован' : '');
                this.shadowRoot.querySelector('.ribbon').classList.add((newValue != 'active' ? 'bg-danger' : 'd-none')); 
                this.shadowRoot.querySelector('.ribbon-wrapper').classList.add((newValue != 'active' ? '' : 'd-none')); 
                break;
            case 'href':
                element.href = newValue;
                break;
            case 'image-src':
	        if (imageGallery) {
			imageGallery.setAttribute('image-src', newValue == 'undefined' ? '' : newValue);                
	        }
                break;
            case 'image-alt':
	        if (imageGallery) {
			imageGallery.setAttribute('image-alt', newValue == 'undefined' ? '' : newValue);                
	        }
                break;
            case 'brand':
                this.shadowRoot.querySelector('.brand').textContent = (newValue == 'undefined' ? '' : newValue);
                break;
            case 'name':
                this.shadowRoot.querySelector('.name').textContent = (newValue == 'undefined' ? '' : newValue);
                break;
            case 'current-price':
                this.shadowRoot.querySelector('.current-price').textContent = (newValue == 'undefined' ? '' : newValue);
                break;
            case 'currency-type':
                this.shadowRoot.querySelector('.currency-type').textContent = (newValue == 'undefined' ? '' : newValue);
                break;
            case 'old-price':
                this.shadowRoot.querySelector('.old-price').textContent = (newValue == 'undefined' ? '' : newValue);
                break;
            case 'discount':
                this.shadowRoot.querySelector('.discount').textContent = (newValue == 'undefined' ? '' : newValue);
                break;
            case 'wallet-condition':
                this.shadowRoot.querySelector('.wallet-condition').textContent = (newValue == 'undefined' ? '' : newValue);
                break;
            case 'aria-label':
                element.setAttribute('aria-label', (newValue == 'undefined' ? '' : newValue));
                break;
        }
    }

   get id(){
    return this.getAttribute('product-id');
   }


    // Определение селекторов для каждого атрибута
    getSelector(attr) {
        const selectors = {
	    'like' : '.like-wrap',
            'basket-count': '.button-add-to-basket',
            'product-id': '.button-add-to-basket',
            'href': '.link',
            'status': '.ribbon',
            'image-src': 'image-gallery',
            'image-alt': 'image-gallery',
            'video-src': '.video source',
            'brand': '.brand',
            'name': '.name',
            'current-price': '.current-price',
            'currency-type': '.currency-type',
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

    setLike(productId , status) {
     let o = this; 
     let webRequest = new WebRequest();
     let request = webRequest.post(o.api.setProductLikeMethod(productId),  {productId , status}, false )
     .then(function(data) {
      })                                
     .catch(function(error) {
       console.log('setLike.Произошла ошибка =>', error);
     });
   }
}

customElements.define('product-card', ProductCard);
