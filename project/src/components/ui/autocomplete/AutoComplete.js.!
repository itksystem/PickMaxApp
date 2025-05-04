class Autocomplete extends HTMLElement {
  constructor() {
    super();

    // Создаем shadow DOM
    this.shadow = this.attachShadow({ mode: 'open' });

    this.autocomplete = document.createElement('div');
    this.autocomplete.classList.add('autocomplete');


    // Создаем input элемент
    this.input = document.createElement('textarea');
    this.input.setAttribute('type', 'text');


    // Создаем div для отображения вариантов автозаполнения
    this.autocompleteItems = document.createElement('div');
    this.autocompleteItems.classList.add('autocomplete-items');
    this.autocompleteItems.classList.add('form-control');

    // Добавляем стили для shadow DOM
    const style = document.createElement('style');
    style.textContent = `              

      .autocomplete-items {
	    position: absolute;
	    left: 0;
	    right: 0;
	    background: white;
	    border: 1px solid #ddd;
	    border-top: none;
	    border-radius: 0 0 4px 4px;
	    max-height: 300px;
	    overflow-y: auto;
	    z-index: 1000;
	    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
	    display: none;
      }

      .d-none {
	display : none;
      }

      .d-block {
	display : block;
      }

      .autocomplete-item {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
    font-size: 0.87rem;
      }

      .autocomplete-input {
	position: relative;
        width: 100%;
        padding: 1.1rem;
        font-size: 1rem;
	border: 0.0625rem solid #ccc;
        border-radius: 0.5rem;
        box-sizing: border-box;
        transition: border-color 0.3s;
	height : 2rem;
        z-index: 1;
        height: 6rem;

      }

      .autocomplete-input:hover {
        box-shadow: 0 0 0 .25rem rgba(13,110,253,.25);
        border-color: #007bff;
        outline: none;
        border-radius : 0.5rem; 
      }

      .autocomplete-input:focus {
        border-radius : 0.5rem 0.5rem  0 0; 
        border-color: var(--bs-form-valid-border-color);
        outline: none;
        box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);

      }

	.autocomplete {
           position: relative;
	    width: 100%;
	    font-family: Arial, sans-serif;
	}


    `;
    this.shadow.appendChild(style);

    // Добавляем элементы в shadow DOM
    this.autocomplete.appendChild(this.input);
    this.autocomplete.appendChild(this.autocompleteItems);
    this.shadow.appendChild(this.autocomplete);

    // Обработчики событий
    this.input.addEventListener('input', () => this.handleInput());
    this.input.addEventListener('focus', () => this.handleInput());
    this.input.addEventListener('blur', () => this.handleBlur());
    this.input.classList.add('autocomplete-input');
    this.autocompleteItems.classList.add('d-none');
  }

  // Функция для обновления элементов автозаполнения
  async updateItems(value) {
    if (!value || value.length <= 3) {
        this.hideItemsBlock();
        return;
    }

    const result = await this.fetchData(value);
    this.autocompleteItems.innerHTML = '';
    this.autocompleteItems.classList.remove('d-none');

    if (this.onLoadCallback) {
        this.onLoadCallback(result);
    }
   try {
      result?.forEach(item => {
        this.dropDownListItemDraw(item, item.id, item.name);
       });
     } catch(error){
   }
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
	if (this.onRequestCallback) {
 	   this.onRequestCallback(this);
	}
      const response = await fetch( this.url+value , options);
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
      console.log(el, value, text);	
      return this
   }


  // Обработчик события input для поля ввода
  handleInput() {
    this.updateItems(this.input.value);
  }

  // Обработчик события blur для поля ввода
  handleBlur() {
    let o = this;
    setTimeout(() => {
      this.autocompleteItems.innerHTML = '';
      o.hideItemsBlock() 
    }, 200);
   
  }

  // Функция для выбора элемента из списка
  selectItem(item, value, text) {
    this.setValue(text);
    this.setValueId(value);
    this.setObject(item);
    this.autocompleteItems.innerHTML = '';
    this.hideItemsBlock();
    this.onSelectCallback(item);
    return this;
  }


  hideItemsBlock() {
    this.autocompleteItems.classList.add('d-none');
    this.autocompleteItems.classList.remove('d-block');
  }

  showItemsBlock() {
    this.autocompleteItems.classList.add('d-block');
    this.autocompleteItems.classList.remove('d-none');
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


  setUrl(url){
    this.url = url;
    return this
  }  

  getUrl(){
    return this.url;
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

// Регистрируем кастомный элемент
customElements.define('x-autocomplete',  Autocomplete);
