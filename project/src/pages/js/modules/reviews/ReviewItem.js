class ReviewItem extends PageBuilder {
    constructor(containerClass, review) {
	 super(containerClass); // Передаём containerClass в родительский конструктор
        // Найти контейнер с указанным классом
        const container = document.querySelector(`.${containerClass}`);
        if (!container) {
            throw new Error(`Container with class '${containerClass}' not found.`);
        }

        // Создать элемент контейнера для товара
        const ReviewItemContainer = document.createElement("div");
        ReviewItemContainer.className = "review-item";

        // Создать тело элемента с содержимым
        const ReviewItemBody = document.createElement("div");
        ReviewItemBody.className = "card-item-body";

        let createdAt = new DatetimeValidator();
        // Заполнить содержимое карточки
        ReviewItemBody.innerHTML = `
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
                <div class="review-box__date">${createdAt.formatToCustom(review.created) || this.getCurrentTime()}</div>
              </div>
              <div class="col-9">
                <div class="review-box__text">${review. comment || 'Без комментария'}</div>
              </div>
            </div>
            <div class="row">
              <div class="col-3 down-avatar-header">		
              </div>
              <div class="col-9">
		      ${(review.mediaFiles || []).map(img => `<img src="${img.url}" class="review-box__bottom-drawer-click review-box__thumbnail_image">`).join('')}
		   <bottom-drawer reviews-id="${review.id}" >
		      <h3 class="card-title">Фотографии</h3>
                      ${(review.mediaFiles || []).map(img => `<img src="${img.url}" >`).join('')}
		  </bottom-drawer>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', '/src/components/ui/bottom-drawer/css/bottom-drawer.css');
        ReviewItemContainer.appendChild(link);

        // Вставить тело в контейнер товара
        ReviewItemContainer.appendChild(ReviewItemBody);
        // Добавить контейнер товара в основной контейнер
        container.appendChild(ReviewItemContainer);
	const drawers = document.querySelectorAll('.review-box__bottom-drawer-click');
	drawers.forEach(drawer => {
	    drawer.addEventListener('click', () => this.openDrawer());
	});
    }

    attachEvents() {
        this.drawer.addEventListener('click', () => this.openDrawer());
    }
 
    openDrawer() {
      const drawer = document.querySelector(`bottom-drawer`);
      if (drawer) drawer.open();
    }

}


