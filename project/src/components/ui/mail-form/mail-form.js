class MailForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.api = new WebAPI();
    this.uploadedFiles = [];
  }

  connectedCallback() {
    this.rating = this.getAttribute("rating") || 0;
    this.productId = this.getAttribute("product-id") || null;
    this.uploadProcessName = this.api._USER_PRODUCT_MAIL_FILE_UPLOAD_EVENT_;
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="/src/pages/plugins/fontawesome-free/css/all.min.css">
      <link rel="stylesheet" href="/src/components/ui/mail-form/css/mail-form.css">
      <link rel="stylesheet" href="/src/pages/css/bootstrap.min.css">
      <bottom-drawer drawer-id="product-reply-message-dialog" action-id="product-reply-message-send" action-text="Отправить сообщение">
      <div class="mail-form">
        <h3 class="mail-form__title">Отправить сообщение</h3>
        <textarea class="mail-form__textarea" rows="4" placeholder="Напишите ваш отзыв..."></textarea>
        <div class="mail-form__emoji-panel">
          <ul class="mail-form__buttons">
            <li><button class="emoji mail-form__add-emoji-button">😊</button></li>
            <li><button class="emoji mail-form__add-emoji-button">😍</button></li>
            <li><button class="emoji mail-form__add-emoji-button">😂</button></li>
            <li><button class="emoji mail-form__add-emoji-button">🤔</button></li>
            <li><button class="emoji mail-form__add-emoji-button">😢</button></li>
            <li><button class="emoji mail-form__add-emoji-button">👍</button></li>
            <li><button class="emoji mail-form__add-emoji-button">👎</button></li>
          </ul>
        </div>
        <h3 class="mail-form__title">Добавьте фотографии</h3>
        <div class="mail-form__photos">
          <file-upload file-upload-id="${this.productId}" process-name="${this.api._USER_PRODUCT_MAIL_FILE_UPLOAD_EVENT_}"  allowed-types="image/png,image/jpeg,image/jpg" max-size="10"></file-upload>
        </div>
        <div class="mail-form__thumbnails"></div>
        </div>
      </bottom-drawer>
    `;

  }

    openDrawer(drawerId, detail) {
      this.drawer = this.shadowRoot.querySelector(`bottom-drawer[drawer-id="${drawerId}"]`);
      this.drawer?.setAttribute("reply-id", detail.replyId);
      this.setButtonDisabled(this.drawer || null);

      if (this.drawer) this.drawer.open();
   }

  setButtonDisabled(drawer = null){
      const submitButton = drawer?.shadowRoot.querySelector(".bottom-drawer__button--action");	
      const textarea = this.shadowRoot.querySelector('.mail-form__textarea');
      console.log(submitButton);
      if (submitButton && textarea) {
  	  submitButton.disabled = textarea.value.length > 0 ? false : true;
      }
  }

  setupEventListeners() {
    const textarea = this.shadowRoot.querySelector('.mail-form__textarea');
    const emojiPanel = this.shadowRoot.querySelector('.mail-form__emoji-panel');
    const photoInput = this.shadowRoot.querySelector(`file-upload[file-upload-id="${this.productId}"]`);
    const thumbnails = this.shadowRoot.querySelector('.mail-form__thumbnails');

    // Динамическое изменение высоты textarea
    textarea.addEventListener('input', () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    });

    // Вставка эмодзи
    emojiPanel.addEventListener('click', (e) => {
      if (e.target.classList.contains('mail-form__add-emoji-button')) {
        textarea.value += e.target.textContent;
        textarea.focus();
      }
    });

    textarea.addEventListener('keyup', (e) => {
        this.setButtonDisabled(this.drawer || null);
    });


    /** Открывает drawer  */
    let o = this;
    document.addEventListener('product-reply-message-dialog-open', (event) => {
        const title = this.shadowRoot.querySelector('.mail-form__title');    
        title.innerHTML = `Ответить клиенту ${event.detail.mail.author}`;
        o.openDrawer('product-reply-message-dialog', event.detail);
    });


   document.addEventListener('product-reply-message-send', (event) => {
        this.sendMessage();
  });

   // Получение списка загруженных файлов
    console.log(this.uploadProcessName);
    if(this.uploadProcessName) //если есть события
     photoInput.addEventListener(this.uploadProcessName+`-success`, (e) => {
	    console.log(this.uploadProcessName+`-success`, e);
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
  }

  // Отправка сообщения
  async sendMessage() {
    const textarea = this.shadowRoot.querySelector('.mail-form__textarea');
    const thumbnails = this.shadowRoot.querySelector('.mail-form__thumbnails');

    const messageData = {
     message: textarea.value,
     files: this.uploadedFiles, // Теперь используем корректный массив файлов
   };

   try {
    const response = await fetch(
      this.api.sendProductMailMethod(this.productId),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      }
    );

    if (response.ok) {
      toastr.success('Ответ успешно отправлен!', 'Отзыв', 3000);
      window.location.href = window.location.pathname; // Обновляем страницу
      textarea.value = '';
      this.uploadedFiles = [];
      thumbnails.innerHTML = '';
     } else {
      throw new Error('Ошибка при отправке отзыва');
     }
   } catch (error) {
    toastr.error('Что-то пошло не так', 'Упс...', 3000);
    console.error(error);
   }
 }
}

customElements.define('mail-form', MailForm);
