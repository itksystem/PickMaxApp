class ReviewForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
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
	  <li class="webkit-fill-available">
		<div class="w-100 text-end padding-end">
			<button class="btn btn-outline-primary btn-block review-form__add-photo-button">
				<i class="fa-solid fa-paperclip"></i>
			</button>
		</div>
	  </li>
        </ul>
        </div>
	
        <div class="review-form__photos">
          <input type="file" id="photo-upload" class="review-form__photo-input" accept="image/*" multiple hidden>
                    <div class="review-form__thumbnails"></div>
        </div>
        <button class="review-form__submit-button">Оставить отзыв</button>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const textarea = this.shadowRoot.querySelector('.review-form__textarea');
    const emojiPanel = this.shadowRoot.querySelector('.review-form__emoji-panel');
    const photoInput = this.shadowRoot.querySelector('#photo-upload');
    const addPhotoButton = this.shadowRoot.querySelector('.review-form__add-photo-button');
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

    // Добавление фото
    addPhotoButton.addEventListener('click', () => {
      photoInput.click();
    });

    photoInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await fetch('/v1/review/photo/upload', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            this.uploadedFiles.push(data.url);

            const thumbnailWrapper = document.createElement('div');
            thumbnailWrapper.classList.add('review-form__thumbnail-wrapper');

            const img = document.createElement('img');
            img.src = data.url;
            img.alt = 'Thumbnail';

            const removeButton = document.createElement('button');
            removeButton.classList.add('review-form__thumbnail-remove');
            removeButton.textContent = '×';

            removeButton.addEventListener('click', () => {
              this.uploadedFiles = this.uploadedFiles.filter((url) => url !== data.url);
              thumbnailWrapper.remove();
            });

            thumbnailWrapper.appendChild(img);
            thumbnailWrapper.appendChild(removeButton);
            thumbnails.appendChild(thumbnailWrapper);
          }
        } catch (error) {
          console.error('Ошибка загрузки фото:', error);
        }
      }
    });

    // Отправка отзыва
    submitButton.addEventListener('click', async () => {
      const reviewData = {
        message: textarea.value,
        files: this.uploadedFiles,
      };

      try {
        const response = await fetch('/v1/review/my', {
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
