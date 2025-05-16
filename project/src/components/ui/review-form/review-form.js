class ReviewForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.api = new WebAPI();
    this.uploadedFiles = [];
  }

  connectedCallback() {
    this.rating = this.getAttribute("rating") || 0;
    this.productId = this.getAttribute("product-id") || null;
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="/src/pages/plugins/fontawesome-free/css/all.min.css">
      <link rel="stylesheet" href="/src/components/ui/review-form/css/review-form.css">
      <link rel="stylesheet" href="/src/pages/css/bootstrap.min.css">
      <div class="review-form card">
        <h3 class="review-form__title">Оставить или исправить отзыв</h3>
        <div class="review-box__rating row">
          <div class="review-box__rating-title col-5 text-start">Установите рейтинг</div> 
          <div class="review-box__rating-stars col-7 text-start">
            <stars-rating counter-view=false stars="${this?.rating || 0}" product-id="${this?.productId || null}" star-size="1.4rem"></stars-rating>
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
          <file-upload file-upload-id="${this.productId}" process-name="${this.api._USER_REVIEW_FILE_UPLOAD_EVENT_}" allowed-types="image/png,image/jpeg,image/jpg" max-size="10"></file-upload>
        </div>
        <div class="review-form__thumbnails"></div>
        <button class="review-form__submit-button" disabled >Оставить отзыв</button>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
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
      if (e.target.classList.contains('review-form__add-emoji-button')) {
        textarea.value += e.target.textContent;
        textarea.focus();
      }
    });

    textarea.addEventListener('keyup', (e) => {
           submitButton.disabled = (textarea.value.length > 0 ) ? false : true; 
    });


    // Получение списка загруженных файлов
     photoInput.addEventListener('review-file-upload-success', (e) => {
	    console.log('review-file-upload-success', e);
	    try {
        	// Проверяем, есть ли response и является ли он строкой
	        let fileId = e?.detail?.file?.fileId || null;
	        let response = e?.detail?.response ? JSON.parse(e?.detail?.response) : null;
	        let url = response?.files?.length > 0 ? response?.files[0]  : null;
	        if (fileId ) {
	            this.uploadedFiles.push({fileId : fileId, url : url}); 
	            console.log('Файл успешно добавлен:', fileId);
	        } else {
	            console.warn('Некорректный формат данных в response:', e?.response);
	        }
	    } catch (error) {
	        console.error('Ошибка при разборе JSON из response:', error);
	    }
	});


    // Отправка отзыва
    submitButton.addEventListener('click', async () => {
      const reviewData = {
        review: textarea.value,
        files: this.uploadedFiles, // Теперь используем корректный массив файлов
      };

      try {
        const response = await fetch(
          this.api.setReviewMethod(this.productId),
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData),
          }
        );
        console.log(response);
        if (response.ok) {
          toastr.success('Отзыв отправлен.','Отзыв', 3000);
	  window.location.href = window.location.pathname;
          textarea.value = '';
          this.uploadedFiles = [];
          thumbnails.innerHTML = '';
        } else {
          throw new Error('Ошибка при отправке отзыва');
        }
      } catch (error) {
	  console.log(error);
          toastr.error('Что-то пошло не так(','Упс...', 3000);
      }
    });
  }
}

customElements.define('review-form', ReviewForm);
