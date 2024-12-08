class MaskInput extends HTMLElement {
    constructor() {
        super();
        // Создание Shadow DOM
        this.shadow = this.attachShadow({ mode: 'open' });

        // Импорт внешнего CSS
        this.styleLink = document.createElement('link');
        this.styleLink.rel = 'stylesheet';
        this.styleLink.href = 'mask-input.css';

        // Создание контейнера
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('mask-input-wrapper');

        // Метка
        this.label = document.createElement('label');
        this.label.textContent = this.getAttribute('label') || 'Введите текст';
        this.label.htmlFor = 'input';

        // Поле ввода
        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.id = 'input';
        this.input.placeholder = this.getAttribute('placeholder') || '+7 (XXX) XXX-XXXX';
        this.input.classList.add('form-control');

        // Сообщение об ошибке
        this.error = document.createElement('div');
        this.error.id = 'error';
        this.error.classList.add('invalid-feedback');
        this.error.textContent = this.getAttribute('error-message') || 'Некорректный ввод.';
        this.error.style.display = 'none';

     
        // Добавление элементов в Shadow DOM
        this.wrapper.appendChild(this.label);
        this.wrapper.appendChild(this.input);
        this.wrapper.appendChild(this.error);
        this.shadow.appendChild(this.styleLink);
        this.shadow.appendChild(this.wrapper);

        this.inputMask = new Inputmask("+7 (999) 999-9999");
        this.inputMask.mask(this.input);  
    }
}

