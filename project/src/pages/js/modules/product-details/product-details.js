class ProductDetails extends HTMLElement {
  static get observedAttributes() {
    return ['product-id', 'title', 'description', 'price', 'del-price', 
            'stars', 'reviews', 'like', 'discount', 'seller-type', 'images'];
  }

  constructor() {
    super();
    this.api = new WebAPI();
    this.common = new CommonFunctions();
    this.loading = false;
    this.page = 1;
    this.limit = 10;
    this.attachShadow({ mode: 'open' });
    this._initializeTemplate();
    this._cacheElements();
  }

  connectedCallback() {
    this._render();
    this._addEventListeners();
  }

  disconnectedCallback() {
    if (this._scrollHandler) {
      window.removeEventListener('scroll', this._scrollHandler);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this._handleAttributeChange(name, newValue);
    }
  }

  // Приватные методы
  _initializeTemplate() {
    const template = document.createElement('template');
    template.innerHTML = `
      <link rel="stylesheet" href="/src/pages/js/modules/product-details/css/product-details.css">
      <link rel="stylesheet" href="/src/pages/css/bootstrap.min.css">
      
      <div class="product-details-card-dialog">
        <div class="product-details-card-box">
          <div class="ribbon-wrapper ribbon-lg">
            <div class="ribbon"></div>
          </div>
          <icon-button template="return" redirect="/products/page" class="return-button"></icon-button>
          <icon-button template="like" class="like-button"></icon-button>
          
          <image-gallery class="product-gallery" show-indicators loop event="event" 
            autoplay autoplay-interval="5000" active-index="0"></image-gallery>

          <div class="product-details__content">
            <div class="row">
              <div class="col-6 price-col">
                <p>
                  <span class="product-details__price"></span>     
                  <del class="price-block__old-price"></del>     
                </p>
                <div class="discount-box"></div>
              </div>
              <div class="col-6 rating-col">
                <stars-rating class="product-rating" readonly></stars-rating>
                <reviews class="product-reviews"></reviews>
              </div>
            </div>
          </div>
          
          <div class="product-details-card-title-box">
            <div class="product-details__seller-type"></div>
            <h1 class="product-details__title"></h1>
            <basket-button class="button-add-to-basket"></basket-button>
          </div>

          <dropdown-section class="description-section">
            <span slot="title">Описание товара</span>
            <p class="product-details__description"></p>
          </dropdown-section>

          <div class="product-details__content_addon w-100">
            <div class="row">
              <div class="col-6 pe-1">
                <dropdown-section class="reviews-box">
                 <span slot="title">Отзывы о товаре</span>
                 <p class="product-details__reviews"></p>
                </dropdown-section>
              </div>
              <div class="col-6 ps-1">
               <dropdown-section class="mail-box">
                <span slot="title">Ваша переписка</span>
                <p class="product-details__reviews"></p>
               </dropdown-section>
              </div>
            </div>
           </div>
          </div>

          <dropdown-section class="see-also-box mt-3" aria-expanded="true">
            <span slot="title">Смотреть также</span>
            <div class="product-card-container"></div>
          </dropdown-section>
        </div>
      </div>
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  _cacheElements() {
    this.elements = {
      gallery: this.shadowRoot.querySelector('.product-gallery'),
      price: this.shadowRoot.querySelector('.product-details__price'),
      oldPrice: this.shadowRoot.querySelector('.price-block__old-price'),
      title: this.shadowRoot.querySelector('.product-details__title'),
      description: this.shadowRoot.querySelector('.product-details__description'),
      rating: this.shadowRoot.querySelector('.product-rating'),
      reviews: this.shadowRoot.querySelector('.product-reviews'),
      likeButton: this.shadowRoot.querySelector('.like-button'),
      discountBox: this.shadowRoot.querySelector('.discount-box'),
      sellerType: this.shadowRoot.querySelector('.product-details__seller-type'),
      basketButton: this.shadowRoot.querySelector('.button-add-to-basket'),
      reviewsSection: this.shadowRoot.querySelector('.reviews-box'),
      mailsSection: this.shadowRoot.querySelector('.mail-box'),
      productContainer: this.shadowRoot.querySelector('.product-card-container')
    };
  }

  _render() {
    const productId = this.getAttribute('product-id') || '';
    const images = this.getAttribute('images') || '';

    if (this.elements.gallery) {
      this.elements.gallery.setAttribute('title', this.getAttribute('title') || '');
      this.elements.gallery.setAttribute('images', images);
      this.elements.gallery.setAttribute('id', productId);
    }

    this._setTextContent(this.elements.description, 'description', 'Описание отсутствует');
    this._setTextContent(this.elements.price, 'price', '0 ₽');
    this._setTextContent(this.elements.oldPrice, 'del-price', '');
    this._setTextContent(this.elements.title, 'title', '');
    
    this._setRating();
    this._setLikeButton();
    this._setDiscountBox();
    this._setSellerType();
    this._setBasketButton();
    this._setComponentLinks(productId);
    
    this._loadMoreProducts();
  }

  _handleAttributeChange(name, value) {
    switch (name) {
      case 'product-id':
        this._setComponentLinks(value);
        this.elements.basketButton?.setAttribute('product-id', value);
        this.elements.likeButton?.setAttribute('id', value);
        break;
      case 'title':
        this.elements.title.textContent = value;
        this.elements.gallery?.setAttribute('title', value);
        break;
      case 'description':
        this.elements.description.textContent = value;
        break;
      case 'price':
        this.elements.price.textContent = value;
        break;
      case 'del-price':
        this.elements.oldPrice.textContent = value;
        break;
      case 'stars':
      case 'reviews':
        this._setRating();
        break;
      case 'like':
        this.elements.likeButton?.setAttribute('value', value);
        break;
      case 'discount':
        this._setDiscountBox();
        break;
      case 'seller-type':
        this._setSellerType();
        break;
      case 'images':
        this.elements.gallery?.setAttribute('images', value);
        break;
    }
  }

  _addEventListeners() {
    this._scrollHandler = this._debounce(() => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && !this.loading) {
        this.page++;
        this._loadMoreProducts();
      }
    }, 200);

    window.addEventListener('scroll', this._scrollHandler);
  }

  _debounce(func, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // Методы обновления компонентов
  _setRating() {
    if (this.elements.rating) {
      this.elements.rating.setAttribute('stars', this.getAttribute('stars') || '0');
      this.elements.rating.setAttribute('reviews', this.getAttribute('reviews') || '0');
    }
  }

  _setLikeButton() {
    if (this.elements.likeButton) {
      this.elements.likeButton.setAttribute('value', this.getAttribute('like') || '0');
      this.elements.likeButton.setAttribute('id', this.getAttribute('product-id') || '');
    }
  }

  _setDiscountBox() {
    const discount = parseInt(this.getAttribute('discount')) || 0;
    this.elements.discountBox.textContent = discount > 0 ? `Скидка ${discount}%` : '';
    this.elements.discountBox.style.display = discount > 0 ? 'block' : 'none';
  }

  _setSellerType() {
    const sellerType = this.getAttribute('seller-type') || '';
    this.elements.sellerType.innerHTML = this.common.sellerType(sellerType);
  }

  _setBasketButton() {
    if (this.elements.basketButton) {
      this.elements.basketButton.setAttribute('product-id', this.getAttribute('product-id') || '');
    }
  }

  _setComponentLinks(productId) {
    if (!productId) return;

    if (this.elements.reviewsSection) {
      this.elements.reviewsSection.setAttribute('link', this.api.getProductReviewCardMethod(productId));
    }

    if (this.elements.mailsSection) {
      this.elements.mailsSection.setAttribute('link', this.api.getProductMailsCardMethod(productId));
    }

    if (this.elements.rating) {
      this.elements.rating.setAttribute('product-id', productId);
    }
  }

  async _loadMoreProducts() {
    if (this.loading) return;
    this.loading = true;

    try {
      const webRequest = new WebRequest();
      const data = await webRequest.post(
        this.api.getShopProductsMethod(this.page, this.limit), 
        {}, 
        false
      );

      if (!data?.length) return;

      data.forEach(product => {
        const productCard = document.createElement('product-card');
        productCard.setAttribute('product-id', product.productId);
        productCard.setAttribute('like', product.like);
        productCard.setAttribute('status', 'active');
        productCard.setAttribute('image-src', product.mediaFiles[0]?.mediaKey || '');
        productCard.setAttribute('image-alt', product.productName);
        productCard.setAttribute('name', product.productName);
        productCard.setAttribute('current-price', product.price);
        productCard.setAttribute('old-price', product.price * 1.3);
        productCard.setAttribute('currency-type', '₽');
        productCard.setAttribute('basket-count', product.basketCount);

        this.elements.productContainer.appendChild(productCard);
      });
    } catch (error) {
      console.error('Error loading products:', error);
      toastr.error('Ошибка при загрузке товаров', 'Ошибка', { timeOut: 3000 });
    } finally {
      this.loading = false;
    }
  }

  _setTextContent(element, attribute, defaultValue = '') {
    if (element) {
      element.textContent = this.getAttribute(attribute) || defaultValue;
    }
  }
}

customElements.define('product-details', ProductDetails);
