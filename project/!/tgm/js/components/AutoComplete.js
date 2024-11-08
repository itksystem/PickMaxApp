class Autocomplete extends HTMLElement {
  constructor() {
    super();

    // Создаем shadow DOM
    this.shadow = this.attachShadow({ mode: 'open' });

    // Создаем input элемент
    this.input = document.createElement('input');
    this.input.setAttribute('type', 'text');


    // Создаем div для отображения вариантов автозаполнения
    this.autocompleteItems = document.createElement('div');
    this.autocompleteItems.classList.add('autocomplete-items');

    // Добавляем стили для shadow DOM
    const style = document.createElement('style');
    style.textContent = `
      .autocomplete-items {
	    position: absolute;
	    border-right: 1px solid #ccc;
	    border-left: 1px solid #ccc;
	    border-top: 1px solid #ccc;
	    border-bottom: 1px solid #ccc;
	    background-color: #fff;
	    z-index: 9999;
	    right: 0;
	    margin: 0 1.5rem 1rem 0;
	    line-height: 1.5;
	    top: 2.4rem;
	    left: 1.3rem;
      }

      .autocomplete-item {
        padding: 5px;
        cursor: pointer;
        background-color: #fff;
      }

      .autocomplete-input {
        border: none;
        font-size: 1rem;
        background-color: none;
        width: 100%;
        font-family: inherit;
        font-weight: 400;
        color: #495057;
        padding-top: 0.2rem;
      }

      .autocomplete-input:hover {
        border: none;
        font-size: 1rem;
        background-color: none;
        width: 100%;
        font-family: inherit;
        font-weight: 400;
        color: #495057;
        padding-top: 0.2rem;
      }

      .autocomplete-input:focus {
        outline: none;
        border: none;
        font-size: 1rem;
        background-color: none;
        width: 100%;
        font-family: inherit;
        font-weight: 400;
        color: #495057;
        padding-top: 0.2rem;
      }

    `;
    this.shadow.appendChild(style);

    // Добавляем элементы в shadow DOM
    this.shadow.appendChild(this.input);
    this.shadow.appendChild(this.autocompleteItems);

    // Обработчики событий
    this.input.addEventListener('input', () => this.handleInput());
    this.input.addEventListener('focus', () => this.handleInput());
    this.input.addEventListener('blur', () => this.handleBlur());
    this.input.classList.add('autocomplete-input');
    this.autocompleteItems.classList.add('d-none');
  }

  // Функция для обновления элементов автозаполнения
  async updateItems(value) {
    // Очищаем список вариантов
    // Загружаем данные через AJAX
    const result = await this.fetchData(value);
    console.log(result);
    this.autocompleteItems.innerHTML = '';
    this.autocompleteItems.classList.add('d-none');
    // Добавляем отфильтрованные элементы в список
    if(this.onLoadCallback)
         this.onLoadCallback(result);
    }

  onLoad(callback = null) {
    console.log('onLoad');
    if(callback) 
      this.onLoadCallback = callback;
      return this;
  }

  onRequest(callback = null){
    console.log('onRequest');
    if(callback) 
      this.onRequestCallback = callback;
      return this;
  }

  onSelect(callback = null){
    console.log('onSelect');
    if(callback) 
      this.onSelectCallback = callback;
      return this;

  }

  // Функция для загрузки данных через AJAX
  async fetchData(value) {
    try {
      if(value.length <= 3) return [];
      var options = {
            method: this.methodType,
            headers: {"Content-Type": "application/json","Accept": "application/json"}
       }
      let api= new WebAPI();
      this.onRequestCallback(this);
      const response = await fetch( this.url , options);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  }

   dropDownListItemDraw(el, value, text){
      const item = document.createElement('div');
      item.value = value;
      item.textContent = text;
      item.classList.add('autocomplete-item');
      item.addEventListener('click', () => this.selectItem(el, value, text));
      this.autocompleteItems.appendChild(item);
      this.autocompleteItems.classList.add('d-block');
      return this
   }


  // Обработчик события input для поля ввода
  handleInput() {
    this.updateItems(this.input.value);
  }

  // Обработчик события blur для поля ввода
  handleBlur() {
    setTimeout(() => {
      this.autocompleteItems.innerHTML = '';
    }, 200);
  }

  // Функция для выбора элемента из списка
  selectItem(item, value, text) {
    this.setValue(text);
    this.setValueId(value);
    this.setObject(item);
    this.autocompleteItems.innerHTML = '';
    this.onSelectCallback(item);
    return this;
  }

  // Геттер для атрибута options
  get options() {
    return this.getAttribute('options').split(',');
  }

  // Сеттер для атрибута options
  set options(value) {
    this.setAttribute('options', value.join(','));
    return this
  }

  getObject(){
    return this.input.object;
  }

  setObject(object){
    this.input.object = object;
    return this
  }  

  getValue(){
    return this.input.value;
  }

  setValue(text){
    this.input.value = text;
    return this
  }  

  getValueId(){
    return this.input.valueId;
  }

  setValueId(value){
    this.input.valueId = value;
    return this
  }  

  setPlaceholder(value){
    this.input.placeholder = value;
    return this
  }  

  getPlaceholder(){
    return this.input.placeholder;
  }  



  // Обработка изменения атрибутов
  static get observedAttributes() {
    return ['options'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'options') {
      this.updateItems(this.input.value);
    }
  }


}

