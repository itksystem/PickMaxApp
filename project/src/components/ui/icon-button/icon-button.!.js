// Регистрация кастомного элемента IconButton
class IconButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.active = false; // Изначальное состояние
    }

    connectedCallback() {
        this.iconPassive = this.getAttribute('icon-passive') || '';
        this.iconActive = this.getAttribute('icon-active') || '';
        this.value = this.getAttribute('value') || '';
        this.redirect = this.getAttribute('redirect') || '';

        this.action = this.getAttribute('action') || '';
        this.actionFailed = this.getAttribute('action-failed') || '';
        this.actionSuccess = this.getAttribute('action-success') || '';


        this.title = this.getAttribute('title') || '';

        // Инициализация кнопки
        this.render();

        // Добавление обработчика клика
        this.shadowRoot.querySelector('button').addEventListener('click', () => this.handleClick());
    }

    async handleClick() {
      if (this.redirect) {
         window.location.href = this.redirect;
      } else {
        try {
            const response = await fetch(this.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ value: this.value })
            });

            if (!response.ok) {
                throw new Error(`Ошибка запроса: ${response.statusText}`);
            }

            const result = await response.json();
            if (typeof result.active === 'boolean') {
                this.active = result.active;
                this.updateIcon();

                // Если атрибут redirect задан, перенаправляем
                if (this.action) {
                    window.location.href = this.actionSuccess;
                } 
            } else {
                console.warn('Некорректный формат ответа от сервера');
            }
        } catch (error) {
            console.error('Ошибка при выполнении POST-запроса:', error);
	   window.location.href = this.actionFailed;
        }
      }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 4px;
 		    position: absolute;
		    z-index: 100;
		    width: 2rem;
		}
                }
                button:focus {
                    outline: none;
                }
                .icon {
                    width: 24px;
                    height: 24px;
                }
            </style>
            <button title="${this.title}">
                <div class="icon">
                    ${this.active ? this.iconActive : this.iconPassive}
                </div>
            </button>
        `;
    }

    updateIcon() {
        const iconContainer = this.shadowRoot.querySelector('.icon');
        iconContainer.innerHTML = this.active ? this.iconActive : this.iconPassive;
    }
}

// Регистрация элемента
customElements.define('icon-button', IconButton);
