class PhoneInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // HTML разметка
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="phone-input.css">
      <div class="phone-input-group">
        <label class="phone-input-label"></label>
        <div class="phone-input-container">
          <input 
            type="text" 
            class="phone-input-field" 
            placeholder="(+7) 999-999-9999" />
          <button class="phone-clear-button" aria-label="Очистить поле">&times;</button>
        </div>
        <div class="phone-input-error"></div>
      </div>
    `;

    this.inputField = this.shadowRoot.querySelector('.phone-input-field');
    this.errorElement = this.shadowRoot.querySelector('.phone-input-error');
    this.labelElement = this.shadowRoot.querySelector('.phone-input-label');
    this.clearButton = this.shadowRoot.querySelector('.phone-clear-button');

    // Привязка обработчиков событий
    this.inputField.addEventListener('input', this.formatInput.bind(this));
    this.inputField.addEventListener('keydown', this.handleBackspace.bind(this));
    this.inputField.addEventListener('focus', this.showClearButton.bind(this));
    this.inputField.addEventListener('blur', this.hideClearButton.bind(this));
    this.clearButton.addEventListener('click', this.clearInput.bind(this));
  }

  // Метод для форматирования ввода
  formatInput(event) {
    const input = event.target;
    let value = input.value.replace(/\D/g, ''); // Удаляем все символы, кроме цифр.

    // Проверяем, чтобы номер начинался с "7" (или добавляем +7 по умолчанию)
    if (!value.startsWith('7')) {
      value = '7' + value;
    }

    // Ограничиваем ввод до 11 цифр (формат "+7" + 10 цифр)
    value = value.slice(0, 11);

    // Форматирование по маске (+7) 999-999-9999 с учетом заполнения
    let formattedValue = `(+${value.slice(0, 1)}) `; // Добавляем код страны

    if (value.length > 1 && value.length <= 4) {
      formattedValue += value.slice(1, 4); // Первая группа без дефиса
    } else if (value.length > 4 && value.length <= 7) {
      formattedValue += `${value.slice(1, 4)}-${value.slice(4, 7)}`; // Добавляем дефис после первой группы
    } else if (value.length > 7) {
      formattedValue += `${value.slice(1, 4)}-${value.slice(4, 7)}-${value.slice(7)}`; // Добавляем второй дефис
    }

    input.value = formattedValue;

    // Проверка на валидность ввода
    if (value.length < 11) {
      this.errorElement.textContent = `Укажите телефонный номер в формате ${this.getAttribute('placeholder')}`;
    } else {
      this.errorElement.textContent = '';
    }
    this.showClearButton() 
  }

  // Обработчик Backspace для корректного удаления
  handleBackspace(event) {
    if (event.key === 'Backspace') {
      const cursorPosition = this.inputField.selectionStart;
      const value = this.inputField.value;

      // Удаляем символ слева от курсора
      if (cursorPosition > 0) {
        const newValue = 
          value.slice(0, cursorPosition - 1) + value.slice(cursorPosition);
        this.inputField.value = newValue;
        this.inputField.selectionStart = this.inputField.selectionEnd = cursorPosition - 1;

        // Триггерим форматирование
        event.preventDefault(); // Останавливаем дефолтное поведение Backspace
        this.formatInput({ target: this.inputField });
      }
    }
  }

  // Метод для очистки ввода
  clearInput() {
    this.inputField.value = '';
    this.errorElement.textContent = '';
    this.inputField.focus();
  }

  // Показать кнопку очистки при фокусе
  showClearButton() {
    // Проверяем, чтобы кнопка отображалась только если есть текст в поле
    if (this.inputField.value.length > 0) {
      this.clearButton.style.display = 'inline';
    }
  }

  // Скрыть кнопку очистки при потере фокуса
  hideClearButton() {
    // Скрываем кнопку очистки, если поле пустое
    if (this.inputField.value.length === 0) {
      this.clearButton.style.display = 'none';
    }
  }

  connectedCallback() {
    // Настройка атрибутов, если они заданы
    this.labelElement.textContent = this.getAttribute('label') || 'Phone Number';
    this.inputField.placeholder = this.getAttribute('placeholder') || '(+7) 999-999-9999';
  }
}

// Регистрируем пользовательский элемент
customElements.define('phone-input', PhoneInput);
