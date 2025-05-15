class ImageGallery extends HTMLElement {
  static get observedAttributes() {
    return  ['images', 'active-index', 'show-indicators', 'loop', 'autoplay', 'autoplay-interval', 'hide-navigation', 'href'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentIndex = 0;
    this.images = [];
    this.isSwiping = false;
    this.swipeOffset = 0;
    this.touchStartX = 0;
    
    // Шаблон с улучшенной структурой
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          overflow: hidden;
        }
        .gallery-container {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .swiper-track {
          display: flex;
          height: 100%;
          transition: transform 0.3s ease;
          will-change: transform;
        }
        .swiper-slide {
          flex: 0 0 100%;
          position: relative;
        }
        .swiper-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .indicators {
          position: absolute;
          bottom: 10px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 8px;
        }
        .indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          cursor: pointer;
        }
        .indicator.active {
          background: white;
        }
        .ribbon-wrapper {
          position: absolute;
          top: 0;
          right: 0;
          z-index: 10;
        }
      </style>
      <div class="gallery-container">
        <div class="ribbon-wrapper ribbon-lg">
          <div class="ribbon"></div>
        </div>
        <div class="swiper-track"></div>
        <div class="indicators"></div>
      </div>
    `;
    this._initElements();
  }

  connectedCallback() {
    this._parseImages();
    this._render();
    this._addEventListeners();
    
    if (this.autoplay) {
      this._startAutoplay();
    }
  }

  disconnectedCallback() {
    if (this._autoplayInterval) {
      clearInterval(this._autoplayInterval);
    }
  }


  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'images' && oldValue !== newValue) {
      this._parseImages();
      this._render();
    }
    if (name === 'active-index' && oldValue !== newValue) {
      this.currentIndex = Math.max(0, Math.min(parseInt(newValue) || 0, this.images.length - 1));
      this._updateSlider();
    }
  }

  _initElements() {
    this.track = this.shadowRoot.querySelector('.swiper-track');
    this.indicatorsContainer = this.shadowRoot.querySelector('.indicators');
    this.ribbon = this.shadowRoot.querySelector('.ribbon');
  }

  _parseImages() {
    this.images = (this.getAttribute('images') || '')
      .split(',')
      .map(url => url.trim())
      .filter(Boolean);
  }

  _render() {
    if (!this.images.length) return;

    // Очистка перед рендером
    this.track.innerHTML = '';
    this.indicatorsContainer.innerHTML = '';

    // Создание слайдов
    this.images.forEach((url, index) => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      
      const img = document.createElement('img');
      img.className = 'swiper-image';
      img.src = url;
      img.alt = `Image ${index + 1}`;
      img.loading = 'lazy';
      img.onerror = () => {
        img.src = 'https://via.placeholder.com/300?text=Image+Not+Found';
      };
      
      slide.appendChild(img);
      this.track.appendChild(slide);

      // Индикаторы
      if (this.showIndicators) {
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        indicator.dataset.index = index;
        if (index === this.currentIndex) indicator.classList.add('active');
        indicator.addEventListener('click', () => this._goToIndex(index));
        this.indicatorsContainer.appendChild(indicator);
      }
    });

    this._updateSlider();

// Добавить навигационные кнопки если нужно
    if (this.showNavigation) {
      const prevButton = document.createElement('button');
      prevButton.className = 'navigation-button prev-button';
      prevButton.innerHTML = '‹';
      prevButton.addEventListener('click', () => this.prev());
      
      const nextButton = document.createElement('button');
      nextButton.className = 'navigation-button next-button';
      nextButton.innerHTML = '›';
      nextButton.addEventListener('click', () => this.next());
      
      this.shadowRoot.querySelector('.gallery-container').appendChild(prevButton);
      this.shadowRoot.querySelector('.gallery-container').appendChild(nextButton);
    }
  }

  _addEventListeners() {
    // Touch события
    this.track.addEventListener('touchstart', this._onTouchStart.bind(this), { passive: true });
    this.track.addEventListener('touchmove', this._onTouchMove.bind(this), { passive: false });
    this.track.addEventListener('touchend', this._onTouchEnd.bind(this));

    // Mouse события
    this.track.addEventListener('mousedown', this._onMouseDown.bind(this));
    this.track.addEventListener('mousemove', this._onMouseMove.bind(this));
    this.track.addEventListener('mouseup', this._onMouseUp.bind(this));
    this.track.addEventListener('mouseleave', this._onMouseUp.bind(this));

    // Колесо мыши
    this.track.addEventListener('wheel', this._onWheel.bind(this), { passive: false });
    // клик	
    this.track.addEventListener('click', this._onClick.bind(this));
  }

  _onClick(e) {
    if(this.href)
      window.location.href=this.href;
    if(this.event && this.id)	
      this.sendEvent(this.event, this.id)
  }                                                                                                         

   sendEvent(event, o){
     console.log(`eventBus.${event}`,o);
     if (typeof window.eventBus === 'undefined' || 
        typeof window.eventBus.emit !== 'function') {
          console.warn('EventBus not initialized, event not sent:', event);
          return;
     }
     eventBus.emit(event, o);
  }


  // Обработчики событий (аналогичные вашим, но с улучшениями)
  _onTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
    this.isSwiping = true;
    this.swipeOffset = 0;
    this.track.style.transition = 'none';
  }

  _onTouchMove(e) {
    if (!this.isSwiping) return;
    e.preventDefault();
    
    this.swipeOffset = e.touches[0].clientX - this.touchStartX;
    this.track.style.transform = `translateX(calc(-${this.currentIndex * 100}% + ${this.swipeOffset}px)`;
  }

  _onTouchEnd() {
    if (!this.isSwiping) return;
    this.isSwiping = false;
    this.track.style.transition = 'transform 0.3s ease';

    if (Math.abs(this.swipeOffset) > 50) {
      if (this.swipeOffset > 0) {
        this.prev();
      } else {
        this.next();
      }
    } else {
      this._updateSlider();
    }
  }

  // Аналогичные методы для мыши
  _onMouseDown(e) {
    this.touchStartX = e.clientX;
    this.isSwiping = true;
    this.swipeOffset = 0;
    this.track.style.transition = 'none';
  }

  _onMouseMove(e) {
    if (!this.isSwiping) return;
    e.preventDefault();
    
    this.swipeOffset = e.clientX - this.touchStartX;
    this.track.style.transform = `translateX(calc(-${this.currentIndex * 100}% + ${this.swipeOffset}px)`;
  }

  _onMouseUp() {
    this._onTouchEnd();
  }

  _onWheel(e) {
    e.preventDefault();
    if (e.deltaY < 0) this.prev();
    else if (e.deltaY > 0) this.next();
  }

  // Навигация
  next() {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    } else if (this.loop) {
      this.currentIndex = 0;
    }
    this._updateSlider();
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else if (this.loop) {
      this.currentIndex = this.images.length - 1;
    }
    this._updateSlider();
  }

  _goToIndex(index) {
    this.currentIndex = index;
    this._updateSlider();
  }

  _updateSlider() {
    this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    
    // Обновление индикаторов
    this.shadowRoot.querySelectorAll('.indicator').forEach((ind, i) => {
      ind.classList.toggle('active', i === this.currentIndex);
    });
    
    // Обновление атрибута
    this.setAttribute('active-index', this.currentIndex);
  }

  // Геттеры/сеттеры для свойств
  get showIndicators() {
    return this.hasAttribute('show-indicators');
  }

  set showIndicators(value) {
    if (value) {
      this.setAttribute('show-indicators', '');
    } else {
      this.removeAttribute('show-indicators');
    }
  }

  get loop() {
    return this.hasAttribute('loop');
  }

  set loop(value) {
    if (value) {
      this.setAttribute('loop', '');
    } else {
      this.removeAttribute('loop');
    }
  }

  get href() {
    return this.getAttribute('href');
  }

  set href(value) {
    if (value) {
      this.setAttribute('href', value);
    } else {
      this.removeAttribute('href');
    }
  }

  get event() {
    return this.getAttribute('event');
  }

  get id() {
    return this.getAttribute('id');
  }


}

customElements.define('image-gallery', ImageGallery);
