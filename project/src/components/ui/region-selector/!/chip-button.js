        class ChipButton extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.render();

		 this.observer = new MutationObserver(mutations => {
	            mutations.forEach(mutation => {
	                if (mutation.attributeName === 'label') {
	                    const label = this.getAttribute('label') || 'Chip';
	                    const labelElement = this.shadowRoot.querySelector('.label');
        	            if (labelElement) labelElement.textContent = label;
	                }
        	    });
	        });

            }

            static get observedAttributes() {
                return ['label', 'value'];
            }

            connectedCallback() {
		this.observer.observe(this, { attributes: true });
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

	    disconnectedCallback() {
        	this.observer.disconnect();
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
	        const label = this.getAttribute('label') || 'Chip';
	        const value = this.getAttribute('value') || '';

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
                    <span class="label">${label}</span>
                    <button class="close-btn" value="${value}">&times;</button>
                `;
            }
        }
        customElements.define('chip-button', ChipButton);
