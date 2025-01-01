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
      <link rel="stylesheet" href="/src/pages/css/bootstrap.min.css">
        <div class = "product-details-card-dialog">
         <div class = "product-details-card-box">
             <div class="ribbon-wrapper ribbon-lg">
                <div class="ribbon"></div>
             </div>
	<icon-button  template="window.history.back" style="position: absolute; left: 2rem; top: 1rem;"></icon-button>
	<icon-button  template="like" style="position: absolute; right: 4rem; top: 1rem;"></icon-button>

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
            <div class="col-6">
               <div class="product-details__btn-group">
	 	 <div class="row">
        	   <div class="col-12">
                      <stars-rating stars="0"></stars-rating>
                   </div>
        	   <div class="col-12">
                      <reviews></reviews>
		   </div>
                 </div>		
              </div>
            </div>
       </div>
     </div>
	    <div class="discount-box"></div>
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


	 <div class="row">
           <div class="col-6 pe-1">
		<dropdown-section class="reviews-box" link="">
		  <span slot="title">Отзывы о товаре</span>
  		  <p class="product-details__reviews"></p>
	        </dropdown-section>
	   </div>
           <div class="col-6 ps-1">
		<dropdown-section class="product-my-mail-box" link="/products/mailbox/">
		  <span slot="title">Ваша переписка</span>
  		  <p class="product-details__reviews"></p>
	        </dropdown-section>
	    </div>
        </div>



	<dropdown-section class="see-also-box" aria-expanded="true">
		  <span slot="title">Смотреть также</span>
	  	  <div class="product-card-container"></div>
        </dropdown-section>

       <div class="product-details-add-basket-button-box">   	
	<div class="row">
           <div class="col-12">
              <div>
               <span class="product-details__price"></span>     
               <del class="price-block__old-price"></del>     
   	       <div class="product-details__short_title text-truncate" style="max-width: fit-content; padding: 0.4rem;"></div>
              </div>
	    </div>
            <div class="col-12">
                 <basket-button class="button-add-to-basket"></basket-button>
            </div>
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

  _getDiscount(discount){
   return (discount > 0 ) ? `Скидка ${discount}%` : ``;
  }

  _getSellerType(sellerType){
    switch(sellerType) {
    case `ORGANIZATION`:   return `Организация`;  
    case `INDIVIDUAL_ENTREPRENEUR`:   return `ИП`;  
    case `INDIVIDUAL`: 
    default:
     return `Физическое лицо`;  
    }
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

   /* */
    this.setRating(this.shadowRoot.querySelector('stars-rating'), (this.getAttribute('reviews') || 0));
    this.setReviewsBox(this.getAttribute('reviews') || 0);
    this.setLikeButton((this.getAttribute('like') || 0), (this.getAttribute('product-id') || null));
    this.setDiscountBox(this._getDiscount(this.getAttribute('discount') || 0));
    this.setSellerTypeBox(this._getSellerType(this.getAttribute('seller-type') || ''));
    this.setMainImage();
    this.setSeeAlsoBox();
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

  setSeeAlsoBox(){
    try {
        let o = this;
        o.page = 1;
        let webRequest = new WebRequest();
        const urlParams = new URLSearchParams(window.location.search); // Получаем текущий URL
        const active = urlParams.get('active'); // Извлекаем значение параметра 'active'

        
        function loadProducts(page) { // Функция загрузки товаров с пагинацией
            if (o.loading) return;    // Предотвращаем повторную загрузку
            o.loading = true;
            
            let request = webRequest.post(o.api.getShopProductsMethod(o.page, o.limit), {}, false )
            .then(function(data) {
                data.forEach(product => {
			const container = o.shadowRoot.querySelector("div.product-card-container");
			console.log(container);

			const productCard = document.createElement('product-card');
		        productCard.setAttribute('product-id', product.productId);
		        productCard.setAttribute('like', product.like);
		        productCard.setAttribute('status', 'active');
//		        productCard.setAttribute('href', o.api.getShopProductMethod(null, product.productId));
		        productCard.setAttribute('image-src', product.mediaFiles[0]?.mediaKey || '');
		        productCard.setAttribute('image-alt', product.productName);
		        productCard.setAttribute('brand', 'Brand');
		        productCard.setAttribute('name', product.productName);
		        productCard.setAttribute('current-price', product.price);
		        productCard.setAttribute('old-price', product.price * 1.3);
		        productCard.setAttribute('currency-type', '₽');
		        productCard.setAttribute('aria-label', product.productName);
		        productCard.setAttribute('basket-count', product.basketCount);

			container.appendChild(productCard);

               });
                o.loading = false; // Сбрасываем флаг загрузки
            })
            .catch(function(error) {
                console.log('initializeProductCard.Произошла ошибка =>', error);
		toastr.error('Ошибка при получении товаров', 'Товары', {timeOut: 3000});
                o.loading = false; // Сбрасываем флаг загрузки при ошибке
            });
        }

        // Изначально загружаем первую порцию товаров
        loadProducts(o.page);

        // Обработчик прокрутки страницы для догрузки товаров
        $(window).on('scroll', function() {
            if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
                o.page++; // Увеличиваем номер страницы
                loadProducts(o.page); // Загружаем следующую порцию товаров
            }
        });

    } catch (e) {
        console.log('initializeProductCard.catch =>', e);
    }
    return this;
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

  setRating(rating = null, reviews = null){
    rating?.setAttribute('stars', this.getAttribute('stars') || 0); // Устанавливаем новое значение атрибута
    rating?.setAttribute('reviews', reviews ); // Устанавливаем новое значение атрибут
  }

  setReviewsBox(reviews = null){
    let reviewsSection =this.shadowRoot.querySelector('dropdown-section.reviews-box');
    if(reviewsSection) {
      reviewsSection.setAttribute("link", `/reviews/${this.getAttribute("product-id")}/page`);
    }
    let reviewsBox = this.shadowRoot.querySelector('.reviews-box');
    if(reviews == 0)    
	reviewsBox?.classList.add('d-none');
    this.shadowRoot.querySelector('reviews').innerHTML = (reviews > 0 ) ? `` : 'Пока нет отзывов';
  }

  setSellerTypeBox(sellerType = null){
    this.shadowRoot.querySelector('.product-details__seller-type').innerHTML = sellerType;
  }

  setDiscountBox(discount = null){
    this.shadowRoot.querySelector('.discount-box').innerHTML = discount;
  }

  setLikeButton(like = null, likes = null){
    const likeButton = this.shadowRoot.querySelector('icon-button[template="like"]');
    likeButton?.setAttribute('value', like); 
    likeButton?.setAttribute('id', likes); 
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
