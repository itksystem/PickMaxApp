class BottomDrawer extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        // Подключаем внешние стили
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', 'bottom-drawer.css');
        this.shadowRoot.appendChild(link);

        // Основной HTML контент
        this.shadowRoot.innerHTML += `
            <div class="bottom-drawer">
                <div class="bottom-drawer__content"></div>
                <div class="bottom-drawer__actions">
                    <button class="bottom-drawer__button bottom-drawer__button--close">Закрыть</button>
                    <button class="bottom-drawer__button bottom-drawer__button--action">Выполнить</button>
                </div>
            </div>
        `;

        this.drawer = this.shadowRoot.querySelector('.bottom-drawer');
        this.contentElement = this.shadowRoot.querySelector('.bottom-drawer__content');
        this.closeButton = this.shadowRoot.querySelector('.bottom-drawer__button--close');
        this.actionButton = this.shadowRoot.querySelector('.bottom-drawer__button--action');
    }

    connectedCallback() {
        this.render();
        this.attachEvents();
    }

    render() {
        this.contentElement.textContent = this.getAttribute('content') || 'Содержимое отсутствует';
    }

    attachEvents() {
        this.closeButton.addEventListener('click', () => this.close());
        this.actionButton.addEventListener('click', () => this.triggerAction());
        document.addEventListener('click', (event) => {
            if (!this.shadowRoot.contains(event.target) && this.drawer.classList.contains('open')) {
                this.close();
            }
        });
    }

    open() {
        this.drawer.classList.add('open');
    }

    close() {
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
}

customElements.define('bottom-drawer', BottomDrawer);
