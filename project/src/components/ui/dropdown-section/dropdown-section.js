class DropdownSection extends HTMLElement {
    constructor() {
        super();

        // Создаем Shadow DOM
        this.attachShadow({ mode: 'open' });

        // Подключаем внешний CSS
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', '/src/components/ui/dropdown-section/css/dropdown-section.css');
        this.shadowRoot.appendChild(link);
        let expanded = this.getAttribute('aria-expanded') || false;
        // Шаблон компонента
        this.shadowRoot.innerHTML += `
            <div class="dropdown-section">
                <div class="dropdown-section__header">
                    <h3><slot name="title">Dropdown Section</slot></h3>
                    <button class="dropdown-section__toggle footer__btn-open" aria-expanded="${!expanded}"></button>
                </div>
                <div class="dropdown-section__content"><slot></slot></div>
            </div>
        `;
    }

    connectedCallback() {
        this.toggleButton = this.shadowRoot.querySelector('.dropdown-section__toggle');
        this.content = this.shadowRoot.querySelector('.dropdown-section__content');
        this.section = this.shadowRoot.querySelector('.dropdown-section');
        this.toggleButton.addEventListener('click', () => this.toggle());
	this.toggle();
    }

    toggle() {
        const isExpanded = this.toggleButton.getAttribute('aria-expanded') === 'true';
        this.toggleButton.setAttribute('aria-expanded', !isExpanded);
            if (isExpanded) {
                this.section.classList.remove('dropdown-open');
            } else {
                this.section.classList.add('dropdown-open');
            }

    }

    disconnectedCallback() {
        this.toggleButton.removeEventListener('click', this.toggle);
    }
}

// Регистрация кастомного элемента
customElements.define('dropdown-section', DropdownSection);
