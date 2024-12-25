class ProductDetails extends HTMLElement {
  constructor() {
    super();
    let o = this;
    this.api = new WebAPI();
    this.attachShadow({ mode: 'open' });
    // Шаблон компонента
    const template = document.createElement('template');
    template.innerHTML = `
      <link rel="stylesheet" href="/src/pages/js/modules/product-details/css/product-details.css">
        <div>
            <div class="ribbon-wrapper ribbon-lg">
               <div class="ribbon"></div>
	         </div>
                       <a class="pred-link">
			 <div class="product-details-pred-wrap">
				<svg width="45" height="35" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">                    
				  <!-- Диагональные линии стрелки с белой окантовкой -->
				  <path d="M18 8L12 14L18 20" class="back-arrow" stroke="white" stroke-width="4" fill="none"></path>
  
				  <!-- Горизонтальная линия стрелки с белой окантовкой -->
				  <path d="M18 14H14 31" class="back-arrow" stroke="white" stroke-width="4" fill="none"></path>

				  <!-- Черная внутренняя линия, чтобы скрыть лишние белые промежутки -->
				  <path d="M18 8L12 14L18 20" class="back-arrow" stroke="black" stroke-width="2" fill="none"></path>
				  <path d="M18 14H14 30" class="back-arrow" stroke="black" stroke-width="2" fill="none"></path>
				</svg>
			</div>
		      </a>	

                       <a class="like-link">
			 <div class="like-wrap">
				<svg width="35" height="35" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
				  <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" 
				  class="like" stroke="black" stroke-width="2" fill="white"/>
			    </svg>
			</div>
		      </a>	

        <div class="product-details__swiper">
          <div class="product-details__swiper-container">
            <!-- Изображения будут добавлены динамически -->
          </div>
          <div class="product-details__swiper-indicators"></div>
        </div>
        <div class="product-details__content">
          <h3 class="product-details__title"></h3>
          <p class="product-details__description"></p>
          <div class="product-details__options">
            <strong>Подробнее о товаре:</strong>
            <div class="product-details__btn-group" id="color-options"></div>
          </div>
          <div class="product-details__price"></div>
          <div class="product-details__btn-group">
		<basket-button class="button-add-to-basket"></basket-button>
          </div>
        </div>
      </div>
    `;

    // Добавление шаблона в shadow DOM
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Переменные для свайпа
    this.currentIndex = 0;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.swiperContainer = null;
    this.isSwiping = false;
    this.swipeOffset = 0; // Для отслеживания текущего смещения при свайпе
  }

  connectedCallback() {
    this._render();
    this._addEventListeners();
  }

  _render() {
    // Заполнение данных
    this.shadowRoot.querySelector('.product-details__title').textContent = this.getAttribute('title') || 'Product Title';
    this.shadowRoot.querySelector('.product-details__description').textContent = this.getAttribute('description') || 'Product Description';
    this.shadowRoot.querySelector('.product-details__price').textContent = this.getAttribute('price') || '$0.00';

    // Добавление изображений
    console.log(this.hasAttribute('images'));

    const imageUrls = this.hasAttribute('images') && this.getAttribute('images')
    ? this.getAttribute('images').split(',').map(url => url.trim()).filter(Boolean)
    : ['/src/pages/images/card_no_photo_image.png'];

    console.log(imageUrls);
    const swiperContainer = this.shadowRoot.querySelector('.product-details__swiper-container');
    const indicatorsContainer = this.shadowRoot.querySelector('.product-details__swiper-indicators');

    if(imageUrls)
     imageUrls.forEach((url, index) => {
      const img = document.createElement('img');
      img.src = url || 'https://via.placeholder.com/300';
      img.alt = `Product Image ${index + 1}`;
      img.classList.add('product-details__swiper-image');
      swiperContainer.appendChild(img);

      const indicator = document.createElement('span');
      indicator.classList.add('product-details__swiper-indicator');
      if (index === 0) indicator.classList.add('active');
      indicatorsContainer.appendChild(indicator);
    });

    // Сохраняем контейнер в переменной, чтобы позже обновить его
    this.swiperContainer = swiperContainer;
    this._updateSwiper();
  }

  _addEventListeners() {
    let o = this;
    const swiperContainer = this.shadowRoot.querySelector('.product-details__swiper-container');
    swiperContainer.addEventListener('touchstart', this._onTouchStart.bind(this));
    swiperContainer.addEventListener('touchmove', this._onTouchMove.bind(this));
    swiperContainer.addEventListener('touchend', this._onTouchEnd.bind(this));

 // Добавляем обработчик для события прокрутки колесика мыши
    swiperContainer.addEventListener('wheel', this._onWheel.bind(this));

    const backButton = this.shadowRoot.querySelector('.product-details-pred-wrap');
    backButton.addEventListener('click', (e) => {
	    e.stopPropagation();
	    window.history.back();
	});

     let likeWrap = this.shadowRoot.querySelector('.like-link');
     let likePath = likeWrap.querySelector('path.like');
     const productId = this.getAttribute('product-id');
     let isLiked = this.getAttribute('like');
     console.log(isLiked);
     likeWrap.classList.add('liked'); // Добавляем класс liked
     likePath.setAttribute('stroke', (isLiked == 1) ? 'white' : 'black');
     likePath.setAttribute('fill', (isLiked == 1) ? 'red' : 'white');

    likeWrap.addEventListener('click', (e) => {
	console.log(e);
	    e.stopPropagation();
	    likeWrap.classList.toggle('liked');
	    const isLiked = likeWrap.classList.contains('liked');
	    likePath.setAttribute('stroke', isLiked ? 'white' : 'black');
	    likePath.setAttribute('fill', isLiked ? 'red' : 'white');
	    o.setLike(productId, isLiked);
    });
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


_onWheel(event) {
  const images = this.shadowRoot.querySelectorAll('.product-details__swiper-image');
  if (images.length === 0) return;

  // Отключаем прокрутку по оси Y
  event.preventDefault();

  // Если колесо мыши прокручено вверх, переходим к предыдущему изображению
  if (event.deltaY < 0) {
    this._showPreviousImage(images);
  }
  // Если колесо мыши прокручено вниз, переходим к следующему изображению
  else if (event.deltaY > 0) {
    this._showNextImage(images);
  }
}


  _onTouchStart(event) {
    this.touchStartX = event.touches[0].clientX;
    this.isSwiping = true;
    this.swipeOffset = 0; // Сброс смещения при новом свайпе
  }

  _onTouchMove(event) {
    if (!this.isSwiping) return;

    this.touchEndX = event.touches[0].clientX;
    this.swipeOffset = this.touchEndX - this.touchStartX; // Рассчитываем смещение

    const images = this.shadowRoot.querySelectorAll('.product-details__swiper-image');
    if (images.length > 0) {
      // Перемещаем изображения во время свайпа
      images.forEach(img => {
        img.style.transform = `translateX(${this.swipeOffset - (this.currentIndex * 100)}%)`;
      });
    }
  }

  _onTouchEnd() {
    this.isSwiping = false;
    const images = this.shadowRoot.querySelectorAll('.product-details__swiper-image');

    if (images.length > 0) {
      // Если смещение достаточно большое, перемещаем на следующее/предыдущее изображение
      if (Math.abs(this.swipeOffset) > 5) {
        if (this.swipeOffset > 0) {
          this._showPreviousImage(images);
        } else {
          this._showNextImage(images);
        }
      } else {
        // Если свайп был недостаточно большой, возвращаем изображение на исходную позицию
        this._updateSwiper(images);
      }
    }
  }

  _showPreviousImage(images) {
    // Переход к предыдущему изображению с цикличностью
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = 0; // Переход к последнему изображению
    }
    this._updateSwiper(images);
  }

  _showNextImage(images) {
    // Переход к следующему изображению с цикличностью
    if (this.currentIndex < images.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = images.length - 1; // Переход к первому изображению
    }
    this._updateSwiper(images);
  }

  _updateSwiper(images) {
    if (!images || images.length === 0) return;

    // Обновляем позицию изображений
    images.forEach((img, index) => {
      img.style.transition = 'transform 0.3s ease'; // Плавное перемещение после свайпа
      img.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    });

    // Обновление индикаторов
    const indicators = this.shadowRoot.querySelectorAll('.product-details__swiper-indicator');
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentIndex);
    });
  }
}

customElements.define('product-details', ProductDetails);
