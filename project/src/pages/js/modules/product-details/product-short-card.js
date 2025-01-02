class ProductShortDetails extends HTMLElement {
  constructor() {
    super();
    let o = this;
    this.api = new WebAPI();
    this.attachShadow({ mode: 'open' });
    // Шаблон компонента
    const template = document.createElement('template');
    template.innerHTML = `
      <link rel="stylesheet" href="/src/pages/js/modules/product-details/css/product-details.css">
      <link rel="stylesheet" href="/src/pages/css/bootstrap.min.css">
        <div class = "product-details-card-dialog">
         <div class = "product-details-card-box">
             <div class="ribbon-wrapper ribbon-lg">
                <div class="ribbon"></div>
             </div>
   	      <icon-button template="product.details" style="position: absolute; left: 2rem; top: 1rem;"></icon-button>

        <div class="product-details__swiper">
          <div class="product-details__swiper-container">
          </div>
          <div class="product-details__swiper-indicators"></div>
        </div>
        <div class="product-details__content">
     	  <div class="row">
           <div class="col-6">
              <p>
               <span class="product-details__price"></span>     
               <del class="price-block__old-price"></del>     
              </p>
	    </div>
       </div>
     </div>
   </div>
  <div class="product-details-card-title-box">
     <div class="row">
   	 <div class="col-12">
       	    <div class="product-details__seller-type"></div>
         </div>
	 <div class="col-12">
            <div class="product-details__title"></div>
         </div>
      </div>
  </div>

  <dropdown-section>
       <span slot="title">Описание товара</span>
       <p class="product-details__description"></p>
  </dropdown-section>
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
    this.shadowRoot.querySelector('.product-details__description').textContent = this.getAttribute('description') || 'Product Description';

    this.shadowRoot.querySelectorAll('.product-details__price').forEach(el => {
       el.textContent = this.getAttribute('price') || '$0.00';
    });
    this.shadowRoot.querySelectorAll('del').forEach(el => {
        el.textContent = this.getAttribute('del-price') || '$0.00';
    });
    this.shadowRoot.querySelectorAll('.product-details__title').forEach(el => {
        el.textContent = this.getAttribute('title') || '';
    });
    this.shadowRoot.querySelectorAll('.product-details__short_title').forEach(el => {
        el.textContent = this.getAttribute('title') || '';
    });

    this.setGotoProductCardButton(this.getAttribute('product-id') || 0);
    this.setMainImage();
  }

  _addEventListeners() {
    let o = this;
    const swiperContainer = this.shadowRoot.querySelector('.product-details__swiper-container');
    swiperContainer?.addEventListener('touchstart', this._onTouchStart.bind(this));
    swiperContainer?.addEventListener('touchmove', this._onTouchMove.bind(this));
    swiperContainer?.addEventListener('touchend', this._onTouchEnd.bind(this));

 // Добавляем обработчик для события прокрутки колесика мыши
    swiperContainer?.addEventListener('wheel', this._onWheel.bind(this));
  }

  setMainImage(){
    // Добавление изображений
    const imageUrls = this.hasAttribute('images') && this.getAttribute('images')
	    ? this.getAttribute('images').split(',').map(url => url.trim()).filter(Boolean)
	    : ['/src/pages/images/card_no_photo_image.png'];

    console.log(imageUrls);
    const swiperContainer = this.shadowRoot.querySelector('.product-details__swiper-container');
    const indicatorsContainer = this.shadowRoot.querySelector('.product-details__swiper-indicators');

    if(imageUrls)
     imageUrls.forEach((url, index) => {
      const img = document.createElement('img');
       img.src = url || '/src/pages/images/card_no_photo_image.png';
       img.alt = this.getAttribute('title');
       img.classList.add('product-details__swiper-image');
       swiperContainer.appendChild(img);

      const indicator = document.createElement('span');
       indicator?.classList.add('product-details__swiper-indicator');
       if (index === 0) indicator?.classList.add('active');
       indicatorsContainer?.appendChild(indicator);
    });

    // Сохраняем контейнер в переменной, чтобы позже обновить его
    this.swiperContainer = swiperContainer;
    this._updateSwiper();
  }

  setGotoProductCardButton(id = null){
     const button = this.shadowRoot.querySelector('icon-button[template="product.details"]');
     button?.setAttribute('product-id', id); 
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

customElements.define('product-short-card', ProductShortDetails);
