class BottomDrawer extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        // Подключаем стили
        ['bottom-drawer.css', 'bootstrap.min.css'].forEach(file => {
            const link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('href', `/src/${file.includes('bootstrap') ? 'pages/css' : 'components/ui/bottom-drawer/css'}/${file}`);
            this.shadowRoot.appendChild(link);
        });

        // Разметка
        this.shadowRoot.innerHTML += `
            <div class="bottom-drawer">
                <div class="bottom-drawer__content">
                    <slot></slot>
                </div>
                <div class="bottom-drawer__actions">
                    <div class="row w-100">
                        <div class="col text-center">
                            <button class="w-100 bottom-drawer__button bottom-drawer__button--close">Закрыть</button>
                        </div>
                        ${!this.getAttribute('action-id') ? '' : `
                            <div class="col text-center">
                                <button class="w-100 bottom-drawer__button bottom-drawer__button--action">${this.getAttribute('action-text') || 'Выполнить'}</button>
                            </div>`}
                    </div>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        this.drawerId = this.getAttribute("drawer-id") || 0;
        this.drawer = this.shadowRoot.querySelector('.bottom-drawer');
        this.closeButton = this.shadowRoot.querySelector('.bottom-drawer__button--close');
        this.actionButton = this.shadowRoot.querySelector('.bottom-drawer__button--action');
        this.contentContainer = this.shadowRoot.querySelector('.bottom-drawer__content');
        this.isOpen = false;

        this.attachEvents();
    }

    attachEvents() {
        this.closeButton.addEventListener('click', () => this.close());
        this.actionButton?.addEventListener('click', () => this.triggerAction());
	/* Обработка события удаления  картинки */
	document.addEventListener(this.getAttribute('action-id'), (event) => {
	  if(event.detail.drawerId == this.getAttribute('drawer-id')){
	    console.log('bottom-drawer', event.detail);
	   }
	});

    }

    handleOutsideClick(event) {
        if (this.isOpen && !this.shadowRoot.contains(event.target) && !this.contains(event.target)) {
            this.close();
        }
    }

    open() {
        this.isOpen = true;
        this.drawer.classList.add('open');
    }

    close() {
        this.isOpen = false;
        this.drawer.classList.remove('open');
    }

    triggerAction() {
        const actionId = this.getAttribute('action-id') || 'unknown';
        const drawerId = this.drawerId || '';
        let event = {
            detail: { actionId, drawerId },
            bubbles: true,
            composed: true
        };
        this.dispatchEvent(new CustomEvent(actionId, event));
        console.log(event);
        this.close();
    }

    setContent(content) {
        if (typeof content === 'string') {
            this.contentContainer.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            this.contentContainer.innerHTML = '';
            this.contentContainer.appendChild(content);
        } else {
            console.warn('Content must be a string or HTMLElement');
        }
    }
}

customElements.define('bottom-drawer', BottomDrawer);
