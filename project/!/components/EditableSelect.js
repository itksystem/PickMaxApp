class EditableSelect extends HTMLElement {
  constructor() {
    super();

    // Создаем элементы, из которых будет состоять наш кастомный элемент
    this.select = document.createElement('select');
    this.input = document.createElement('input');
    this.input.style.display = 'none'; // Скрываем поле ввода изначально

    // Добавляем обработчики событий
    this.select.addEventListener('change', () => this.handleSelectChange());
    this.input.addEventListener('blur', () => this.handleInputBlur());

    // Добавляем элементы к кастомному элементу
    this.appendChild(this.select);
    this.appendChild(this.input);
  }

  // Метод, вызываемый при добавлении элемента в документ
  connectedCallback() {
    this.renderOptions();
  }

  // Метод для обработки изменений в поле выбора
  handleSelectChange() {
    this.input.value = this.select.value;
    this.toggleInput(true);
  }

  // Метод для обработки потери фокуса полем ввода
  handleInputBlur() {
    this.select.value = this.input.value;
    this.toggleInput(false);
  }

  // Метод для переключения между полем выбора и полем ввода
  toggleInput(showInput) {
    this.select.style.display = showInput ? 'none' : 'inline-block';
    this.input.style.display = showInput ? 'inline-block' : 'none';
  }

  // Метод для отображения вариантов выбора
  renderOptions() {
    const options = this.getAttribute('options').split(',');

    // Создаем опции для выпадающего списка
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.textContent = option.trim();
      optionElement.value = option.trim();
      this.select.appendChild(optionElement);
    });

    // Добавляем пустую опцию для возможности выбора
    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = 'Select an option or type to search...';
    this.select.insertBefore(placeholderOption, this.select.firstChild);
  }

  // Статический метод для определения атрибутов, которые нужно отслеживать
  static get observedAttributes() {
    return ['options'];
  }

  // Метод для обработки изменений атрибутов
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'options') {
      // Очищаем список и отрисовываем новые опции
      this.select.innerHTML = '';
      this.renderOptions();
    }
  }
}
