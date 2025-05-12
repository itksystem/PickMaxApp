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
        this.link = this.getAttribute('link') || null;
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
        this.toggleButton.addEventListener('click', () => this.toggle(true));
	this.toggle(false);
    }

    toggle(click = false) {
        if(this.link && click) document.location.href = this.link;
        const isExpanded = this.toggleButton.getAttribute('aria-expanded') === 'true';
        this.toggleButton.setAttribute('aria-expanded', !isExpanded);
	    if(this.link) {
                this.section.classList.add('dropdown-link');
	    }
            if (isExpanded) {
                this.section.classList.remove('dropdown-open');
            } else {
	    if(!this.link) 
                this.section.classList.add('dropdown-open');
            }

    }

    disconnectedCallback() {
        this.toggleButton.removeEventListener('click', this.toggle);
    }


    open() {
        this.toggleButton.setAttribute('aria-expanded', 'true');
        this.section.classList.add('dropdown-open');
    }

    // Новый метод для принудительного закрытия
    close() {
        this.toggleButton.setAttribute('aria-expanded', 'false');
        this.section.classList.remove('dropdown-open');
    }


}

// Регистрация кастомного элемента
customElements.define('dropdown-section', DropdownSection);
