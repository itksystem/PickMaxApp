class ConfirmationCodeElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <div class="code-container">
                <input type="text" class="code-input" maxlength="1" inputmode="numeric" pattern="[0-9]*">
                <input type="text" class="code-input" maxlength="1" inputmode="numeric" pattern="[0-9]*">
                <input type="text" class="code-input" maxlength="1" inputmode="numeric" pattern="[0-9]*">
                <input type="text" class="code-input" maxlength="1" inputmode="numeric" pattern="[0-9]*">
                <input type="text" class="code-input" maxlength="1" inputmode="numeric" pattern="[0-9]*">
            </div>
            <style>
                .code-container {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                }
                .code-input {
                    width: 30px;
                    height: 50px;
                    text-align: center;
                    font-size: 24px;
                    border: 2px solid #ccc;
                    border-radius: 5px;
                    transition: all 0.2s ease-in-out;
                }
                .code-input:focus {
                    outline: none;
                    border-color: #007bff;
                    transform: scale(1.1);
                    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
                }
                .code-input.filled {
                    border-color: #28a745;
                }
                .code-input:disabled {
                    background-color: #f0f0f0;
                    border-color: #ddd;
                    cursor: not-allowed;
                    opacity: 0.7;
                }
            </style>
        `;

        // Callback по умолчанию
        this.onComplete = null;
    }

    connectedCallback() {
        this.inputs = this.shadowRoot.querySelectorAll(".code-input");
        this.setupEventListeners();
        
        if (this.disabled) {
            this.setDisabledState(true);
        } else {
            this.focusFirstInput();
        }
    }

    setupEventListeners() {
        this.inputs.forEach((input, index) => {
            input.addEventListener("input", () => {
                input.value = input.value.replace(/\D/g, "");
                
                if (input.value) {
                    input.classList.add("filled");
                    setTimeout(() => input.classList.remove("filled"), 200);
                    
                    if (index < this.inputs.length - 1) {
                        this.inputs[index + 1].focus();
                    }
                }
                
                this.checkCompletion();
            });

            input.addEventListener("keydown", (e) => {
                if (e.key === "Backspace" && !input.value && index > 0) {
                    this.inputs[index - 1].focus();
                }
            });
        });
    }

    // Метод для очистки всех полей ввода
    clear() {
        this.inputs.forEach(input => {
            input.value = "";
            input.classList.remove("filled");
        });
        this.focusFirstInput();
    }

    // Метод для установки фокуса на первый input
    focusFirstInput() {
        if (this.inputs && this.inputs.length > 0) {
            this.inputs[0].focus();
        }
    }

    // Метод для установки callback
    setOnCompleteCallback(callback) {
        if (typeof callback === 'function') {
            this.onComplete = callback;
        } else {
            console.warn('Callback must be a function');
        }
    }

    checkCompletion() {
        const code = this.getCode();
        if (code.length === this.inputs.length) {
            // Вызываем callback если он установлен
            if (this.onComplete) {
                this.onComplete(code);
            }
            
            // Также диспатчим событие для внешних подписчиков
            this.dispatchEvent(new CustomEvent('complete', {
                detail: { code }
            }));
        }
    }

    // Метод для получения полного кода
    getCode() {
        return Array.from(this.inputs).map(input => input.value).join("");
    }

    // Геттер для свойства disabled
    get disabled() {
        return this.hasAttribute("disabled");
    }

    // Сеттер для свойства disabled
    set disabled(value) {
        if (value) {
            this.setAttribute("disabled", "");
        } else {
            this.removeAttribute("disabled");
        }
        this.setDisabledState(value);
        if (!value) {
            this.focusFirstInput();
        }
    }

    // Метод для обновления состояния disabled
    setDisabledState(isDisabled) {
        this.inputs.forEach(input => {
            input.disabled = isDisabled;
        });
    }
}

customElements.define('confirmation-code', ConfirmationCodeElement);