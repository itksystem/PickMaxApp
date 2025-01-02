class BottomDrawer extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        // Подключаем внешние стили
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', '/src/components/ui/bottom-drawer/css/bottom-drawer.css');
        this.shadowRoot.appendChild(link);

        const link2 = document.createElement('link');
        link2.setAttribute('rel', 'stylesheet');
        link2.setAttribute('href', '/src/pages/css/bootstrap.min.css'); // Укажите правильный путь к CSS-файлу
        this.shadowRoot.appendChild(link2);


        // Основной HTML контент
	this.shadowRoot.innerHTML += `
	    <div class="bottom-drawer">
	        <div class="bottom-drawer__content">
        	    <slot></slot>
	        </div>
	        <div class="bottom-drawer__actions">
		 <div class="row w-100">
        	    <div class="col text-center"> <button class="w-100 bottom-drawer__button bottom-drawer__button--close">Закрыть</button></div>
	            ${(this.getAttribute('action-id'))
	                ? ''
        	        : `<div class="col text-center"><button class="w-100 bottom-drawer__button bottom-drawer__button--action">Выполнить</button></div>`}
  	          </div>                
	        </div>                
	    </div>
	`;

        this.drawer = this.shadowRoot.querySelector('.bottom-drawer');
        this.closeButton = this.shadowRoot.querySelector('.bottom-drawer__button--close');
        this.actionButton = this.shadowRoot.querySelector('.bottom-drawer__button--action');
        this.isOpen = false; // Состояние открытия
    }

    connectedCallback() {
        this.attachEvents();
    }

    attachEvents() {
        this.closeButton.addEventListener('click', () => this.close());
        this.actionButton.addEventListener('click', () => this.triggerAction());
//        document.addEventListener('click', this.handleOutsideClick.bind(this));
    }

     handleOutsideClick(event) {
        if (
   	    !this.isOpen &&
            !this.shadowRoot.contains(event.target) &&
            !this.contains(event.target)
        ) {
            this.close();
        }
    }


    open(event) {
        console.log(`open()`);
        this.isOpen = true; // Состояние открытия
        this.drawer.classList.add('open');
    }

    close(event) {
        console.log(`close()`);
        this.isOpen = false; // Состояние открытия
        this.drawer.classList.remove('open');
    }

    triggerAction() {
        const actionId = this.getAttribute('action-id') || 'unknown';
        this.dispatchEvent(new CustomEvent('bottom-drawer-action', {
            detail: { actionId },
            bubbles: true,
            composed: true
        }));
        this.close();
    }

    /**
     * Устанавливает динамический контент для BottomDrawer.
     * @param {string | HTMLElement} content - HTML-строка или DOM-элемент
     */
    setContent(content) {
        if (typeof content === 'string') {
            this.contentContainer.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            this.contentContainer.innerHTML = ''; // Очистка
            this.contentContainer.appendChild(content);
        } else {
            console.warn('Content must be a string or HTMLElement');
        }
    }

}

customElements.define('bottom-drawer', BottomDrawer);
