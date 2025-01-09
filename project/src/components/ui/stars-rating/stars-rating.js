class StarsRating extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.api = new WebAPI();
    console.log(this);
  }

  connectedCallback() {
    this.rating = parseFloat(this.getAttribute('stars')) || 0; // Текущий рейтинг
    this.reviews = this.getAttribute('reviews') || 0; // Текущий рейтинг
    this.productId = this.getAttribute('product-id') || null; // продукт
    this.counterView = this.getAttribute('counter-view') || true; // продукт
    this.maxStars = 5; // Максимальное количество звезд
    this.selectedRating = this.rating; // Рейтинг, выбранный пользователем
    this.render();
    this.readonly = this.getAttribute('readonly') || false ;
    console.log(`this.readonly ${this.readonly}`);
    if(this.readonly == false )
      this.addEventListeners();
  }


  render() {
    // Подключаем внешние стили
    const styleLink = document.createElement('link');
    styleLink.setAttribute('rel', 'stylesheet');
    styleLink.setAttribute('href', '/src/components/ui/stars-rating/css/stars-rating.css');
    const styleLink2 = document.createElement('link');
    styleLink2.setAttribute('rel', 'stylesheet');
    styleLink2.setAttribute('href', '/src/pages/plugins/fontawesome-free/css/all.min.css');

    this.shadowRoot.innerHTML = `
      <div class="rating-stars">
        <span class="rating-stars__value"></span>
        <div class="rating-stars__stars"></div>
        <div class="rating-stars__counter">${(this.rating == 0) ? `Еще нет отзывов о товаре` : ``}</div>
      </div>
    `;
    this.shadowRoot.appendChild(styleLink);
    this.shadowRoot.appendChild(styleLink2);
    this.updateStars();
  }

  updateStars() {
    if(this.rating == 0) return;
    const starsContainer = this.shadowRoot.querySelector('.rating-stars__stars');
    const starsValueContainer = this.shadowRoot.querySelector('.rating-stars__value');
    const starsCounterContainer = this.shadowRoot.querySelector('.rating-stars__counter');

    starsContainer.innerHTML = ''; // Очищаем контейнер

    for (let i = 1; i <= this.maxStars; i++) {
      const star = document.createElement('i');
      star.classList.add('fa-regular');
      star.classList.add('fa-star');

      if (i <= this.rating) {
	star.classList.add('fa-solid');
      } else if (i - 0.5 <= this.rating) {
	star.classList.add('fa-star-half-stroke');
      }
      star.dataset.value = i;
      if(this.getAttribute("star-size"))
        star.style.fontSize = this.getAttribute("star-size");
      starsContainer.appendChild(star);
    }
      if(this.rating > 0) starsValueContainer.innerHTML = `${this.rating}`; // количество проголосовавших
      let method = this.api?.getProductReviewCardMethod(this.productId);
      if(method && this.productId) {
         starsCounterContainer.innerHTML = 
	  ((this.counterView == true) 
	    ? `( <a href="${method}">${(this.reviews < 1000) ? this.reviews : (this.reviews / 1000).toFixed(0) + 'k'}</a> )`
	    : ``)
	} else 
	if(this.reviews > 0)
         starsCounterContainer.innerHTML = 
	` ( ${(this.reviews < 1000) ? this.reviews : (this.reviews / 1000).toFixed(0) + 'k'} )`; // количество проголосовавших
  }

  addEventListeners() {
    const starsContainer = this.shadowRoot.querySelector('.rating-stars__stars');
    starsContainer.addEventListener('click', (event) => {
      if (event.target.classList.contains('fa-star')) {
        this.selectedRating = parseInt(event.target.dataset.value);
        this.rating = this.selectedRating;
        this.updateStars();
        this.sendRating();
      }
    });
  }

  async sendRating() {
    try {
      const response = await fetch(this.api.setRatingMethod(this.productId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rating: this.selectedRating })
      });
      if (response.ok) {
        console.log('Рейтинг успешно отправлен:', this.selectedRating);
      } else {
        console.error('Ошибка при отправке рейтинга');
      }
    } catch (error) {
      console.error('Ошибка сети:', error);
    }
  }
}

// Регистрация кастомного элемента
customElements.define('stars-rating', StarsRating);
