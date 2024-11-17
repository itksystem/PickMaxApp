class BasketButton extends HTMLElement {
  constructor() {
    super();

    // Свойства компонента
    this.productId = this.getAttribute('product-id') || 1;
    console.log(this.getAttribute('basket-count'));
    this.count = parseInt(this.getAttribute('basket-count') || '0', 10); // Получаем значение count из атрибута

    this.api = new WebAPI();
    this.addUrl = this.getAttribute('add-url') || this.api.addToBasketMethod();
    this.removeUrl = this.getAttribute('remove-url') || this.api.removeFromBasketMethod();

    // Shadow DOM
    this.attachShadow({ mode: 'open' });

    // Подключение внешних стилей и отрисовка компонента
    this.attachStyles();
    this.render();
    this.addEventListeners();
  }

  // Метод для подключения внешних стилей
  attachStyles() {
    // Подключение стилей компонента
    const basketButtonStyle = document.createElement('link');
    basketButtonStyle.rel = 'stylesheet';
    basketButtonStyle.href = '/src/components/ui/basket-button/css/basket-button.css';

    // Подключение Font Awesome
    const fontAwesomeStyle = document.createElement('link');
    fontAwesomeStyle.rel = 'stylesheet';
    fontAwesomeStyle.href = '/src/pages/plugins/fontawesome-free/css/all.min.css';

    // Добавление в Shadow DOM
    this.shadowRoot.appendChild(basketButtonStyle);
    this.shadowRoot.appendChild(fontAwesomeStyle);
  }

  // Метод для рендеринга компонента
  render() {
    // Очищаем Shadow DOM
    const existingDiv = this.shadowRoot.querySelector('div');
      if (existingDiv) {
        this.shadowRoot.removeChild(existingDiv);
    }


    // Добавляем разметку в зависимости от состояния
    const content = document.createElement('div');
    if (this.count === 0) {
      content.innerHTML = `
        <button class="basket-button add-to-basket">
          В корзину <i class="fa-solid fa-basket-shopping"></i> 
        </button>
      `;
    } else {
      content.innerHTML = `
        <div class="basket-counter">
          <button class="basket-decrement">-</button>
          <span class="basket-count">${this.count}</span>
          <button class="basket-increment">+</button>
        </div>
      `;
    }
    this.shadowRoot.appendChild(content);
  }

  // Метод для добавления слушателей событий
  addEventListeners() {
    this.shadowRoot.addEventListener('click', (event) => {
      if (event.target.classList.contains('add-to-basket')) {
        this.updateBasket('add');
      } else if (event.target.classList.contains('basket-increment')) {
        this.updateBasket('add');
      } else if (event.target.classList.contains('basket-decrement')) {
        this.updateBasket('remove');
      }
    });
  }

  // Метод для обновления корзины
  async updateBasket(action) {
    const endpoint =
      action === 'add'
        ? this.addUrl // '/api/bff/warehouse/v1/basket/product-add'
        : this.removeUrl // '/api/bff/warehouse/v1/basket/product-remove'
	;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: this.productId, quantity: 1 }),
      });

      if (!response.ok) throw new Error('Ошибка при обновлении корзины');

      const result = await response.json();
      this.count = result.basket.quantity;
      this.render();
    } catch (error) {
      console.error(`Error during ${action} operation:`, error);
    }
  }
}

// Регистрация кастомного элемента
customElements.define('basket-button', BasketButton);
