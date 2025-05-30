class BottomDrawer extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        // Подключаем стили
	const styles = [
	  '/src/components/ui/bottom-drawer/css/bottom-drawer.css',
	  '/src/pages/css/bootstrap.min.css',
	  '/src/pages/plugins/fontawesome-free/css/all.min.css'
	];

	styles.forEach(url => {
	  const link = document.createElement('link');
	  link.rel = 'stylesheet';
	  link.href = url;
	  this.shadowRoot.appendChild(link);
	});

        // Разметка
        this.shadowRoot.innerHTML += `
            <div class="bottom-drawer">
		<div class="bottom-drawer__content_slide_header">
			<div class="bottom-drawer__content_slide_header_line"></div>
			<span class="bottom-drawer__content_header_close_button"><i class="fa-solid fa-circle-xmark"></i></span>
		</div>
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

    disconnectedCallback() {
	  document.removeEventListener(this.getAttribute('action-id'), this.handleActionEvent);
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
