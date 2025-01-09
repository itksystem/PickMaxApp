class ProductMailItem extends PageBuilder {
    constructor(containerClass, mail) {
        super(containerClass); // Передаём containerClass в родительский конструктор
        // Найти контейнер с указанным классом
        this.api = new WebAPI();
        this.mail = mail;

        const container = document.querySelector(`.${containerClass}`);
        if (!container) {
            throw new Error(`Container with class '${containerClass}' not found.`);
        }

        // Создать элемент контейнера для отзыва
        const mailItemContainer = document.createElement("div");
        mailItemContainer.className = `mail-item ${(mail.self) ? 'self' :''}`;

        // Создать тело элемента с содержимым
        const mailItemBody = document.createElement("div");
        mailItemBody.className = "card-item-body";

        // Форматирование даты
        const createdAt = mail.created 
            ? this.formatDate(mail.created)
            : this.getCurrentTime();
        const createdTimeAt =  mail.created 
            ? this.formatTime(mail.created)
            : this.getCurrentTime();
    

	mail.rating =  (!mail.rating || mail.rating == 0 )  ? 0 : mail.rating;
        // Заполнить содержимое карточки
        mailItemBody.innerHTML = `
            <section class="mail-box__comment" message-id="${mail.id}">
                <div class="mail-box__user">
                    <div class="mail-box__info">
                        <div class="row">
                            <div class="col-4 top-avatar-header">
                                <div class="mail-box__avatar text-center">
                                    <img src="${mail.avatar || 'https://static-basket-01.wbbasket.ru/vol2/site/i/v3/user/avatar.png'}" alt="User avatar">
                                </div>
                                <div class="mail-box__author">${mail.author || 'Аноним'}</div>
                                <div class="mail-box__avatar text-start">Сообщение #${mail.id}</div>
                                <div class="mail-box__date">${createdAt}</div>
		                <div class="mail-box__date">${createdTimeAt}</div>
                            </div>
                            <div class="col-8">
                                <div class="mail-box__text">${mail.comment || 'Без комментария'}</div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-4 down-avatar-header">
		            ${(!mail.self) 
                                ? `<button type="button" class="btn btn-outline-primary btn-message-reply" reply-id="${mail.id}">
				   ${this.getButtonText(mail)}
				   </button>`
				: ``
			      }
			    </div>
                            <div class="col-8">
                                ${(mail.mediaFiles || []).map((img, index) => `
                                    <img src="${img.url}" drawer-id="${img.file_id}" class="mail-box__bottom-drawer-click mail-box__thumbnail_image">
                                    <bottom-drawer 
					drawer-id="${img.file_id}"
					${(this.isProductMailsPage(window.location.pathname)) ? `action-id="my-mail-image-delete"` :``}
					${(this.isProductMailsPage(window.location.pathname)) ? `action-text="Удалить"` :``}
					>
                                        	<h3 class="card-title">Фотографии</h3>
	                                        <img src="${img.url}">
                                    </bottom-drawer>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        // Подключаем стили
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', '/src/components/ui/bottom-drawer/css/bottom-drawer.css');
        mailItemContainer.appendChild(link);

        // Вставить тело в контейнер отзыва
        mailItemContainer.appendChild(mailItemBody);

        // Добавить контейнер отзыва в основной контейнер
        container.appendChild(mailItemContainer);

        // Привязка обработчиков событий
        this.attachEvents(mailItemContainer);
    }

    /**
     * Привязка событий для изображений в отзыве.
     * @param {HTMLElement} mailItemContainer 
     */
    attachEvents(mailItemContainer) {
        let o = this;
	document.addEventListener('my-mail-image-delete', (event) => {
         const fileId = event.detail.drawerId;
         const img = mailItemContainer.querySelector(`img[drawer-id="${fileId}"]`);
	  if(img){
	    console.log('Удаление картинки в mailItem:', img);
	    let webRequest = new WebRequest();
	     let request = webRequest.delete(o.api.deletemailMediaMethod(fileId), {fileId}, false )
	     .then(function(data) {
	       toastr.success('Картинка удалена', '' , 3000);
	      })                                
	     .catch(function(error) {
	       toastr.error('Что-то пошло не так(', 'Упс!' , 3000);
	     });
	    img.remove();	
	   }
	});


        const drawers = mailItemContainer?.querySelectorAll('.mail-box__bottom-drawer-click');
        drawers?.forEach(drawer => {
            drawer.addEventListener('click', (event) => {
                const drawerId = drawer.getAttribute("drawer-id");
                this.openDrawer(drawerId);
            });
        });

// переписка только спец странице
     if(this.isMyProductMailsPage(window.location.pathname) == true){ 
        const messageDrawers=mailItemContainer?.querySelectorAll('.btn-message-reply'); 
         messageDrawers?.forEach(drawer => {
        	drawer.addEventListener('click', (event) => {
		   console.log(event);
		   const replyId = drawer.getAttribute('reply-id');
	           const mail = o.mail;
	           document.dispatchEvent(new CustomEvent('product-reply-message-dialog-open',{ detail: { replyId, mail } }));
	        });
        });
     }
    }
      
    getButtonText(mail){
     console.log(window.location.pathname);
     console.log(this.isMyProductMailsPage(window.location.pathname));
     if(this.isMyProductMailsPage(window.location.pathname) == true) {
       return `Ответить`;
     } else	
     if(this.isProductMailsPage(window.location.pathname) == true) {
       return `<a href="/products/${mail.product_id}/mail-reply/${mail.user_id}/page">Ответить</a>`;
     }
    }


    /**
     * Открывает drawer по drawerId
     * @param {string} drawerId 
     */
    openDrawer(drawerId) {
        const drawer = document.querySelector(`bottom-drawer[drawer-id="${drawerId}"]`);
        if (drawer) drawer.open();
    }

    /**
     * Возвращает текущее время в читаемом формате.
     * @returns {string}
     */
    getCurrentTime() {
        return new Date().toLocaleString();
    }

    /**
     * Форматирует дату в пользовательский формат.
     * @param {string} dateStr 
     * @returns {string}
     */
    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }


    /**
     * Форматирует время в формате hh:mm
     * @param {string | Date} dateInput - Строка даты или объект Date
     * @returns {string} - Время в формате hh:mm
     */
    formatTime(dateInput) {
    const date = new Date(dateInput);
     if (isNaN(date)) {
         throw new Error("Invalid date input");
    }

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

   /**
     * Возвращает признак что текущая страница "Оставить свой отзыв"
     * @param {string} url
     * @returns {boolean}
   */
    isProductMailsPage(url) {                                                                                                  
	    return /^\/products\/[a-f0-9\-]+\/mails\/page$/.test(url);
    }

    isMyProductMailsPage(url) {
	    return /^\/products\/[a-f0-9\-]+\/mail-reply\/[a-f0-9\-]+\/page$/.test(url);
    }


}
