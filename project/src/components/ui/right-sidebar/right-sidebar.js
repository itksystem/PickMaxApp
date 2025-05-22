class Sidebar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });    
    this.storageKey = "USER_FILTERS_PROPERTIES";
    
    // Подключаем стили
    const _link = document.createElement('link');
    _link.setAttribute('rel', 'stylesheet');
    _link.setAttribute('href', '/src/components/ui/right-sidebar/css/right-sidebar.css');
    this.shadowRoot.appendChild(_link);

    // Подключаем Font Awesome через CDN
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/src/pages/css/bootstrap.min.css';
    document.head.appendChild(link);

    const faLink = document.createElement('link');
    faLink.setAttribute('rel', 'stylesheet');
    faLink.setAttribute('href', '/src/pages/plugins/fontawesome-free/css/all.min.css');
    this.shadowRoot.appendChild(faLink);

    // Разметка компонента
    this.shadowRoot.innerHTML += `
      <div class="sidebar-overlay"></div>
      <div class="sidebar">
        <div class="sidebar-internal-box">
          <div class="sidebar-header">
            <div class="sidebar-title">${this.getAttribute('title') || 'Меню'}</div>
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
    this.touchStartX = 0;
    this.touchEndX = 0;
    
    this.attachEvents();
    
    // Устанавливаем начальную позицию с задержкой
    requestAnimationFrame(() => {
      this.sidebar.style.right = `-${this.sidebar.offsetWidth}px`;
    });
  }

  // Загрузка состояния из localStorage
  loadState() {
    const savedState = localStorage.getItem(this.storageKey);
    return savedState ? JSON.parse(savedState) : {
	  priceMin: null,
	  priceMax: null,
	  selectedCategories: null,
	  selectedBrands: null
	};
  }

  // Сохранение состояния в localStorage
  saveState() {
   let o = {
	  priceMin: document.querySelector('#price-min').value || 0,
	  priceMax: document.querySelector('#price-max').value || Number.MAX_VALUE,
	  selectedCategories: Array.from(document.querySelectorAll('.category-checkbox:checked')).map(el => el.value),
	  selectedBrands: Array.from(document.querySelectorAll('.brand-checkbox:checked')).map(el => el.value)
	};
    localStorage.setItem(this.storageKey, JSON.stringify(o));
  }


  attachEvents() {
    // Основные события
    this.closeBtn.addEventListener('click', () => {
	  this.close()
	});
    this.overlay.addEventListener('click', () => {
	this.close()
    });
    document.addEventListener('keyup', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
	  this.close();
	}

    });

    // События для свайпа
    this.sidebar.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    this.sidebar.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.sidebar.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
  }

  // Обработка начала касания
handleTouchStart(e) {
  this.touchStartX = e.changedTouches[0].screenX;
  console.log(`handleTouchStart ${this.touchStartX}`);
}

handleTouchMove(e) {
  if (!this.isOpen) return;
  this.touchEndX = e.changedTouches[0].screenX;
  const diffX = this.touchEndX - this.touchStartX; // Изменено вычисление разницы
  console.log(`handleTouchMove ${this.touchEndX} ${diffX}`);  
  // Свайп вправо (diffX положительное значение)
  if (diffX > 0) {
    e.preventDefault();
    const translateX = Math.min(diffX, this.sidebar.offsetWidth);
    console.log(`handleTouchMove ${translateX}`);  
    this.sidebar.style.transform = `translateX(${translateX}px)`;
  }
}

handleTouchEnd(e) {
  if (!this.isOpen) return;
  this.touchEndX = e.changedTouches[0].screenX;
  const diffX = this.touchEndX - this.touchStartX; // Изменено вычисление разницы
  const threshold = this.sidebar.offsetWidth * 0.3;
  // Если свайп вправо достаточно большой
  if (diffX > threshold ) {
    console.log(`handleTouchEnd this.touchEndX ${this.touchEndX} this.touchStartX ${this.touchStartX}`);
    console.log(`handleTouchEnd ${diffX} > ${threshold} = ${(diffX > threshold)}`);
    this.close();
  } else {
    // Возвращаем на место
    console.log(`handleTouchEnd ${diffX} ${threshold} translateX(0)`);
    this.sidebar.style.transform = 'translateX(0)';
  }
}

  open() {
  console.log(`open() ${this.isOpen}`);
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
    this.sidebar.style.right = '0';
    this.sidebar.style.transform = 'translateX(0)';
    this.overlay.style.display = 'block';

    this.touchStartX = 0;
    this.touchEndX = 0;

    setTimeout(() => {
      this.overlay.style.opacity = '1';
    }, 30);
  }

  close() {
  console.log(`close() ${this.isOpen}`);
    this.isOpen = false;
    document.body.style.overflow = '';
    this.sidebar.style.right = `-${this.sidebar.offsetWidth}px`;
    this.sidebar.style.transform = 'translateX(0)';
    this.overlay.style.opacity = '0';

    this.touchStartX = 0;
    this.touchEndX = 0;

    setTimeout(() => {
      this.overlay.style.display = 'none';
    }, 300);
  }

  toggle() {
    console.log(`toggle() ${this.isOpen}`);
    this.isOpen ? this.close() : this.open();
  }

  setTitle(title) {
    const titleEl = this.shadowRoot.querySelector('.sidebar-title');
    if (titleEl) titleEl.textContent = title;
  }
}

customElements.define('right-sidebar', Sidebar);
