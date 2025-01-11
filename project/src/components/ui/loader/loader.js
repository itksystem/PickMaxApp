        class Loader extends HTMLElement {
            constructor() {
                super();
                const shadow = this.attachShadow({ mode: 'open' });

                // Create overlay
                const overlay = document.createElement('div');
                overlay.className = 'loader-overlay';

                // Create loader
                const loader = document.createElement('div');
                loader.className = 'loader';
                overlay.append(loader);

                const link = document.createElement('link');
                link.setAttribute('rel', 'stylesheet');
                link.setAttribute('href', `/src/components/ui/loader/css/loader.css`);
                overlay.append(link);

                shadow.append(overlay);

                this.overlay = overlay;
                this.loader = loader;
                this.link = link;
            }

            open() {
                this.loader.style.display = 'block';
                this.overlay.style.display = 'block';
            }

            close() {
                this.loader.style.display = 'none';
                this.overlay.style.display = 'none';
            }

            static get observedAttributes() {
                return ['z-index'];
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (name === 'z-index') {
                    this.style.setProperty('--z-index', newValue);
                }
            }
        }

        customElements.define('custom-loader', Loader);
