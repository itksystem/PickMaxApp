class TextInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="text-input.css">
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet">

      <div class="text-input-group">
        <label class="text-input-title"></label>
        <div class="text-input-container">
           <div class="input-group-prepend">
	     <span class="text-input-logo"><i class="fas"></i></span>
	   </div>
          <input type="text" class="text-input-field" />
          <button class="text-input-clear-btn" hidden>&times;</button>
        </div>
        <div class="text-input-error-message"></div>
      </div>
    `;

    this.inputField = this.shadowRoot.querySelector('.text-input-field');
    this.clearButton = this.shadowRoot.querySelector('.text-input-clear-btn');
    this.errorMessage = this.shadowRoot.querySelector('.text-input-error-message');
    this.logo = this.shadowRoot.querySelector('.text-input-logo i');
    this.titleElement = this.shadowRoot.querySelector('.text-input-title');

    this.inputField.addEventListener('input', this.handleInput.bind(this));
    this.inputField.addEventListener('blur', this.validateInput.bind(this)); // Проверка при потере фокуса
    this.clearButton.addEventListener('click', this.clearInput.bind(this));
  }

  handleInput() {
    this.clearButton.hidden = this.inputField.value === ''; // Показать/скрыть кнопку очистки
  }

  clearInput() {
    this.inputField.value = ''; // Очистить текст
    this.clearButton.hidden = true; // Скрыть кнопку очистки
    this.errorMessage.textContent = ''; // Очистить сообщение об ошибке
  }

  validateInput() {
    const pattern = this.getAttribute('text-pattern');
    if (pattern) {
      const regex = new RegExp(pattern);
      if (!regex.test(this.inputField.value)) {
        this.errorMessage.textContent = 'Input does not match the pattern.';
      } else {
        this.errorMessage.textContent = '';
      }
    }
  }

  connectedCallback() {
    const logoClass = this.getAttribute('logo') || 'fa-envelope';
    this.logo.className = `fas ${logoClass}`;

    this.inputField.placeholder = this.getAttribute('placeholder') || 'Input text...';
    this.titleElement.textContent = this.getAttribute('title') || 'Title';

    // Установка максимальной длины текста, если указано
    if (this.getAttribute('text-length')) {
      this.inputField.maxLength = this.getAttribute('text-length');
    }
  }
}

customElements.define('text-input', TextInput);
