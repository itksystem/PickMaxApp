class Sidebar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Подключаем стили
    const _link = document.createElement('link');
    _link.setAttribute('rel', 'stylesheet');
    _link.setAttribute('href', 'sidebar.css');
    this.shadowRoot.appendChild(_link);

    // Подключаем Font Awesome через CDN
    const faLink = document.createElement('link');
    faLink.setAttribute('rel', 'stylesheet');
    faLink.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
    this.shadowRoot.appendChild(faLink);

    // Разметка компонента
    this.shadowRoot.innerHTML += `
      <div class="sidebar-overlay"></div>
      <div class="sidebar">
        <div class="sidebar-internal-box">
          <div class="sidebar-header">
            <h3 class="sidebar-title">${this.getAttribute('title') || 'Меню'}</h3>
            <button class="sidebar-close-btn" aria-label="Закрыть боковую панель">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div class="sidebar-content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.sidebar = this.shadowRoot.querySelector('.sidebar');
    this.overlay = this.shadowRoot.querySelector('.sidebar-overlay');
    this.closeBtn = this.shadowRoot.querySelector('.sidebar-close-btn');
    
    this.isOpen = false;
    this.attachEvents();
    
    // Устанавливаем начальную позицию с задержкой
    requestAnimationFrame(() => {
      this.sidebar.style.right = `-${this.sidebar.offsetWidth}px`;
    });
  }

  // Остальные методы без изменений
  attachEvents() {
    this.closeBtn.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', () => this.close());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });
  }

  open() {
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
    this.sidebar.style.right = '0';
    this.overlay.style.display = 'block';
    setTimeout(() => {
      this.overlay.style.opacity = '1';
    }, 10);
  }

  close() {
    this.isOpen = false;
    document.body.style.overflow = '';
    this.sidebar.style.right = `-${this.sidebar.offsetWidth}px`;
    this.overlay.style.opacity = '0';
    setTimeout(() => {
      this.overlay.style.display = 'none';
    }, 300);
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  setTitle(title) {
    const titleEl = this.shadowRoot.querySelector('.sidebar-title');
    if (titleEl) titleEl.textContent = title;
  }
}

customElements.define('right-sidebar', Sidebar);
