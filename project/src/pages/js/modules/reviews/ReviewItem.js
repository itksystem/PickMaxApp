class ReviewItem extends PageBuilder {
    constructor(containerClass, review) {
        super(containerClass); // Передаём containerClass в родительский конструктор
        // Найти контейнер с указанным классом

        const container = document.querySelector(`.${containerClass}`);
        if (!container) {
            throw new Error(`Container with class '${containerClass}' not found.`);
        }

        // Создать элемент контейнера для отзыва
        const reviewItemContainer = document.createElement("div");
        reviewItemContainer.className = "review-item";

        // Создать тело элемента с содержимым
        const reviewItemBody = document.createElement("div");
        reviewItemBody.className = "card-item-body";

        // Форматирование даты
        const createdAt = review.created 
            ? this.formatDate(review.created)
            : this.getCurrentTime();

        // Заполнить содержимое карточки
        reviewItemBody.innerHTML = `
            <section class="review-box__comment">
                <div class="review-box__user">
                    <div class="review-box__info">
                        <div class="row">
                            <div class="col-3 top-avatar-header">
                                <div class="review-box__avatar">
                                    <img src="${review.avatar || 'https://static-basket-01.wbbasket.ru/vol2/site/i/v3/user/avatar.png'}" alt="User avatar">
                                </div>
                                <div class="review-box__author">${review.author || 'Аноним'}</div>
                                <div class="review-box__rating">${'<i class="fa-solid fa-star"></i>'.repeat(review.rating || 5)}</div>
                                <div class="review-box__date">${createdAt}</div>
                            </div>
                            <div class="col-9">
                                <div class="review-box__text">${review.comment || 'Без комментария'}</div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-3 down-avatar-header"></div>
                            <div class="col-9">
                                ${(review.mediaFiles || []).map((img, index) => `
                                    <img src="${img.url}" drawer-id="${img.file_id}" class="review-box__bottom-drawer-click review-box__thumbnail_image">
                                    <bottom-drawer 
					drawer-id="${img.file_id}"
					${(this.isMyReviewPage(window.location.pathname)) ? `action-id="my-review-image-delete"` :``}
					${(this.isMyReviewPage(window.location.pathname)) ? `action-text="Удалить"` :``}
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
        reviewItemContainer.appendChild(link);

        // Вставить тело в контейнер отзыва
        reviewItemContainer.appendChild(reviewItemBody);

        // Добавить контейнер отзыва в основной контейнер
        container.appendChild(reviewItemContainer);

        // Привязка обработчиков событий
        this.attachEvents(reviewItemContainer);
    }

    /**
     * Привязка событий для изображений в отзыве.
     * @param {HTMLElement} reviewItemContainer 
     */
    attachEvents(reviewItemContainer) {
        let o = this;
	document.addEventListener('my-review-image-delete', (event) => {
         const img = reviewItemContainer.querySelector(`img[drawer-id="${event.detail.drawerId}"]`);
	  if(img){
	    console.log('Удаление картинки в ReviewItem:', img);
	    img.remove();	
	   }
	});


        const drawers = reviewItemContainer.querySelectorAll('.review-box__bottom-drawer-click');
        drawers.forEach(drawer => {
            drawer.addEventListener('click', (event) => {
                const drawerId = drawer.getAttribute("drawer-id");
                this.openDrawer(drawerId);
            });
        });
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
     * Возвращает признак что текущая страница "Оставить свой отзыв"
     * @param {string} url
     * @returns {boolean}
   */
    isMyReviewPage(url) {
	    return /^\/reviews\/[a-f0-9\-]+\/my\/review\/page$/.test(url);
    }

}
