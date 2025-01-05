class ReviewForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.api = new WebAPI();
    this.uploadedFiles = [];
  }

  connectedCallback() {
    this.rating = this.getAttribute("rating") || 0; // Получаем атрибут rating
    this.productId = this.getAttribute("product-id") || null; // Получаем атрибут rating
    this.render();
  }


  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="/src/pages/plugins/fontawesome-free/css/all.min.css">
      <link rel="stylesheet" href="/src/components/ui/review-form/css/review-form.css">
      <link rel="stylesheet" href="/src/pages/css/bootstrap.min.css">
      <div class="review-form card">
        <h3 class="review-form__title">Оставить отзыв</h3>
        <div class="review-box__rating row">
	   <div class="review-box__rating-title col-5 text-start">Установите рейтинг </div> 
	   <div class="review-box__rating-stars col-7 text-start">
                 <stars-rating stars="${this?.rating || 0}" product-id="${this?.productId|| null}" star-size="1.4rem" ></stars-rating>
	     </div> 		
	</div>
        <textarea class="review-form__textarea" rows="4" placeholder="Напишите ваш отзыв..."></textarea>
        <div class="review-form__emoji-panel">
        <ul class="review-form__buttons">
	  <li><button class="emoji review-form__add-emoji-button">😊</button></li>
	  <li><button class="emoji review-form__add-emoji-button">😍</button></li>
	  <li><button class="emoji review-form__add-emoji-button">😂</button></li>
	  <li><button class="emoji review-form__add-emoji-button">🤔</button></li>
	  <li><button class="emoji review-form__add-emoji-button">😢</button></li>
	  <li><button class="emoji review-form__add-emoji-button">👍</button></li>
	  <li><button class="emoji review-form__add-emoji-button">👎</button></li>
        </ul>
        </div>
	<h3 class="review-form__title">Добавьте фотографии</h3>
        <div class="review-form__photos">
 	  <file-upload file-upload-id="${this.productId}" allowed-types="image/png,image/jpeg,image/jpg" max-size="10"></file-upload>
        </div>
        <button class="review-form__submit-button">Оставить отзыв</button>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    let o = this;
    const textarea = this.shadowRoot.querySelector('.review-form__textarea');
    const emojiPanel = this.shadowRoot.querySelector('.review-form__emoji-panel');
    const photoInput = this.shadowRoot.querySelector(`file-upload[file-upload-id="${this.productId}"]`);
    const thumbnails = this.shadowRoot.querySelector('.review-form__thumbnails');
    const submitButton = this.shadowRoot.querySelector('.review-form__submit-button');

    // Динамическое изменение высоты textarea
    textarea.addEventListener('input', () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    });

    // Вставка эмодзи
    emojiPanel.addEventListener('click', (e) => {
      if (e.target.tagName === 'SPAN') {
        textarea.value += e.target.textContent;
        textarea.focus();
      }
    });

    // Отправка отзыва
    submitButton.addEventListener('click', async () => {
      const reviewData = {
        review: textarea.value,
        files: this.uploadedFiles,
      };

      try {
        const response = await fetch(
	o.api.setReviewMethod(o.productId), 
	{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reviewData),
        });

        if (response.ok) {
          alert('Отзыв успешно отправлен!');
          textarea.value = '';
          this.uploadedFiles = [];
          thumbnails.innerHTML = '';
        } else {
          throw new Error('Ошибка при отправке отзыва');
        }
      } catch (error) {
        console.error(error);
        alert('Не удалось отправить отзыв');
      }
    });
  }
}

customElements.define('review-form', ReviewForm);
