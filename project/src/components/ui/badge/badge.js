    class BadgeClass extends HTMLElement {
      static get observedAttributes() {
        return ['value', 'color', 'type'];
      }

      constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.badge = document.createElement('span');
        this.badge.className = 'badge hidden';

        const style = document.createElement('style');
        style.textContent = `
          .badge {
            display: inline-block;
            color: white;
            border-radius: 50%;
	    padding: 0.03rem 0.3rem;
            font-size: 0.8px;
            text-align: center;
            background-color: #10b20a;
            opacity: 0;
            transform: scale(0.8);
            animation: fadeInScale 0.3s ease-out forwards;
	    position: absolute;
	    z-index: 9999;
	    bottom: 0rem;
	    font-size: 0.7rem;
          }

          @keyframes fadeInScale {
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .hidden {
            display: none !important;
          }
        `;

        this.shadowRoot.append(style, this.badge);
      }

      connectedCallback() {
        this._update();
      }

      attributeChangedCallback(name, oldValue, newValue) {
        this._update();
      }

      _update() {
        this.badge.textContent = this.getAttribute('value') || '';

        const userColor = this.getAttribute('color');
        const type = this.getAttribute('type');

        if (userColor) {
          this.badge.style.backgroundColor = userColor;
        } else {
          switch (type) {
            case 'error':
              this.badge.style.backgroundColor = '#dc3545';
              this.badge.style.color = '#ffffff';
              break;
            case 'info':
              this.badge.style.backgroundColor = '#ffc107';
              this.badge.style.color = '#ffffff';
              break;
            case 'normal':
            default:
              this.badge.style.backgroundColor = '#20c997';
              this.badge.style.color = '#ffffff';
              break;

          }
        }
      }

     // Геттеры и сеттеры
      get value() {
        return this.getAttribute('value') || '';
      }
      set value(val) {
        this.setAttribute('value', val);
      }

      get type() {
        return this.getAttribute('type');
      }
      set type(val) {
        this.setAttribute('type', val);
      }

      get color() {
        return this.getAttribute('color');
      }
      set color(val) {
        this.setAttribute('color', val);
      }

      show() {
        this.badge.classList.remove('hidden');
        this.badge.style.animation = 'none';
        void this.badge.offsetWidth; // reflow
        this.badge.style.animation = 'fadeInScale 0.3s ease-out forwards';
      }

      hide() {
        this.badge.classList.add('hidden');
      }

    }

    customElements.define('custom-badge', BadgeClass);
