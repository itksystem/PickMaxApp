        class ChipButton extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.render();
            }

            static get observedAttributes() {
                return ['label', 'value'];
            }

            connectedCallback() {
                this.shadowRoot.querySelector('.close-btn')
                    .addEventListener('click', () => {
                        this.dispatchEvent(new CustomEvent('chip-removed', {
                            detail: { value: this.getAttribute('value') },
                            bubbles: true,
                            composed: true
                        }));
                        this.remove();
                    });
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (name === 'label' && this.shadowRoot) {
                    const labelElement = this.shadowRoot.querySelector('.label');
                    if (labelElement) {
                        labelElement.textContent = newValue || 'Chip';
                    }
                }
            }

            render() {
                this.shadowRoot.innerHTML = `
                    <style>
                        :host {
                            display: inline-flex;
                            align-items: center;
                            padding: 0.3rem 0.8rem;
                            border-radius: 1rem;
                            font-size: 0.8rem;
                            cursor: pointer;
                            background-color: #3498db;
                            color: white;
                        }
                        .close-btn {
                            background: none;
                            border: none;
                            font-size: 1rem;
                            cursor: pointer;
                            color: white;
                            margin-left: 5px;
                        }
                    </style>
                    <span class="label">${this.getAttribute('label') || 'Chip'}</span>
                    <button class="close-btn" value="${this.getAttribute('value')}">&times;</button>
                `;
            }
        }
        customElements.define('chip-button', ChipButton);
