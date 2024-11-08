// action-toolbar.js

class ActionToolbar extends HTMLElement {
    constructor() {
        super();
        // Создаём Shadow DOM, если требуется инкапсуляция
        // Если стили глобальны, можно использовать this.innerHTML
        // Здесь используется Shadow DOM для лучшей изоляции
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        // Собираем все дочерние элементы <action-button>
        const buttons = Array.from(this.querySelectorAll('action-button'));

        // Генерируем HTML для панели
        const toolbarHtml = `
            <div class="toolbar-container">
                ${buttons.map(button => {
                    const label = button.getAttribute('label') || 'Button';
                    const icon = button.getAttribute('icon') || 'fa-eye';
                    const url = button.getAttribute('url') || '#';
                    const float = button.getAttribute('float') || 'left';
                    const btnClass = button.getAttribute('class') || '';
                    return `
                        <button class="btn btn-menu-2 btn-default ${btnClass} float-${float}" onclick="window.location.href='${url}'">
                            <i class="fa ${icon}"></i> ${label}
                        </button>
                    `;
                }).join('')}
            </div>
        `;

        // Подключаем внешние стили
        const styleLink = `
            <link rel="stylesheet" href="ActionToolbar.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
        `;

        // Вставляем стили и HTML в Shadow DOM
        this.shadowRoot.innerHTML = `
            ${styleLink}
            ${toolbarHtml}
        `;
    }
}

// Регистрируем компонент панели
customElements.define('action-toolbar', ActionToolbar);
