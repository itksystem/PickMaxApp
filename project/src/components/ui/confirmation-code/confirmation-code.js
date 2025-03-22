        class ConfirmationCodeElement extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.shadowRoot.innerHTML = `
                    <div class="code-container">
                        <input type="text" class="code-input" maxlength="1">
                        <input type="text" class="code-input" maxlength="1">
                        <input type="text" class="code-input" maxlength="1">
                        <input type="text" class="code-input" maxlength="1">
                        <input type="text" class="code-input" maxlength="1">
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
                            transition: transform 0.2s ease-in-out, box-shadow 0.2s;
                        }
                        .code-input:focus {
                            outline: none !important;
                            border-color: #007bff !important;
                            transform: scale(1.1) !important;
                            box-shadow: 0 0 5px rgba(0, 123, 255, 0.5) !important;
                        }
                        .code-input.filled {
                            transform: scale(1.1);
                            border-color: #28a745;
                        }
                    </style>
                `;

            }

            connectedCallback() {
                this.inputs = this.shadowRoot.querySelectorAll(".code-input");
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
                        if (e.key === "Backspace" && index > 0 && !input.value) {
                            this.inputs[index - 1].focus();
                        }
                    });
                });
            }

            checkCompletion() {
                const code = Array.from(this.inputs).map(input => input.value).join("");
                if (code.length === this.inputs.length) {
                    console.log("Код подтверждения введён:", code);
                }
            }
        }
        customElements.define('confirmation-code', ConfirmationCodeElement);