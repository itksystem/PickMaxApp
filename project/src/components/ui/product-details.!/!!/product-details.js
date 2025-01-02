class ProductDetails extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Шаблон компонента
    const template = document.createElement('template');
    template.innerHTML = `
      <link rel="stylesheet" href="./css/product-details.css">
      <div>
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
            <strong>Available Colors:</strong>
            <div class="product-details__btn-group" id="color-options"></div>
          </div>
          <div class="product-details__price"></div>
          <div class="product-details__btn-group">
            <button class="product-details__btn product-details__btn--primary" id="add-to-basket">Add to Basket</button>
            <button class="product-details__btn product-details__btn--secondary" id="add-to-wishlist">Add to Wishlist</button>
          </div>
          <div class="product-details__share">
            <a href="#" aria-label="Share on Facebook">Facebook</a>
            <a href="#" aria-label="Share on Twitter">Twitter</a>
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
    const imageUrls = (this.getAttribute('images') || '').split(',').map(url => url.trim()).filter(Boolean);
    const swiperContainer = this.shadowRoot.querySelector('.product-details__swiper-container');
    const indicatorsContainer = this.shadowRoot.querySelector('.product-details__swiper-indicators');

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
  }

  _addEventListeners() {
    const swiperContainer = this.shadowRoot.querySelector('.product-details__swiper-container');
    swiperContainer.addEventListener('touchstart', this._onTouchStart.bind(this));
    swiperContainer.addEventListener('touchmove', this._onTouchMove.bind(this));
    swiperContainer.addEventListener('touchend', this._onTouchEnd.bind(this));
  }

  _onTouchStart(event) {
    this.touchStartX = event.touches[0].clientX;
  }

  _onTouchMove(event) {
    this.touchEndX = event.touches[0].clientX;
  }

  _onTouchEnd() {
    const deltaX = this.touchEndX - this.touchStartX;
    if (deltaX > 50) {
      this._showPreviousImage();
    } else if (deltaX < -50) {
      this._showNextImage();
    }
  }

  _showPreviousImage() {
    const images = this.shadowRoot.querySelectorAll('.product-details__swiper-image');
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this._updateSwiper(images);
    }
  }

  _showNextImage() {
    const images = this.shadowRoot.querySelectorAll('.product-details__swiper-image');
    if (this.currentIndex < images.length - 1) {
      this.currentIndex++;
      this._updateSwiper(images);
    }
  }

  _updateSwiper(images) {
    images.forEach((img, index) => {
      img.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    });

    const indicators = this.shadowRoot.querySelectorAll('.product-details__swiper-indicator');
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentIndex);
    });
  }
}

customElements.define('product-details', ProductDetails);
