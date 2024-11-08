class ActionButton extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Компонент не рендерит ничего сам, всё обрабатывается ActionToolbar
    }
}

// Регистрируем компонент кнопки
customElements.define('action-button', ActionButton);
