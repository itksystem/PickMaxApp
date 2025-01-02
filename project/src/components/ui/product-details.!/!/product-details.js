class ProductDetails extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./css/product-details.css">
      <div>
        <img src="" alt="Product Image" class="product-details__image">
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
            <a href="#">Facebook</a>
            <a href="#">Twitter</a>
          </div>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    // Заполнение данных из атрибутов
    this.shadowRoot.querySelector('.product-details__image').src = this.getAttribute('image') || 'https://via.placeholder.com/300';
    this.shadowRoot.querySelector('.product-details__title').textContent = this.getAttribute('title') || 'Product Title';
    this.shadowRoot.querySelector('.product-details__description').textContent = this.getAttribute('description') || 'Product Description';
    this.shadowRoot.querySelector('.product-details__price').textContent = this.getAttribute('price') || '$0.00';

    // Добавление цветов
    const colors = (this.getAttribute('colors') || '').split(',');
    const colorOptions = this.shadowRoot.getElementById('color-options');
    colors.forEach(color => {
      if (color.trim()) {
        const button = document.createElement('button');
        button.classList.add('product-details__btn', 'product-details__btn--secondary');
        button.textContent = color.trim();
        button.addEventListener('click', () => {
          alert(`Selected color: ${color.trim()}`);
        });
        colorOptions.appendChild(button);
      }
    });

    // Обработчики событий для кнопок
    this.shadowRoot.getElementById('add-to-basket').addEventListener('click', () => {
      alert('Product added to basket!');
    });
    this.shadowRoot.getElementById('add-to-wishlist').addEventListener('click', () => {
      alert('Product added to wishlist!');
    });
  }
}

// Регистрация компонента
customElements.define('product-details', ProductDetails);
