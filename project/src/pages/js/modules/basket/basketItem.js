class BasketItem {
    constructor(containerClass, item) {
        // Найти контейнер с указанным классом
        const container = document.querySelector(`.${containerClass}`);
        if (!container) {
            throw new Error(`Container with class '${containerClass}' not found.`);
        }

        // Создать элемент контейнера для товара
        const basketItemContainer = document.createElement("div");
        basketItemContainer.className = "basket-item";

        // Создать тело элемента с содержимым
        const basketItemBody = document.createElement("div");
        basketItemBody.className = "card-body";

        // Заполнить содержимое карточки
        basketItemBody.innerHTML = `
            <div class="row">        
                <div class="col-5 col-sm-3 col-md-2">
                    <img class="image" src="${item?.mediaFiles[0]?.mediaKey || 'default-image.png'}" alt="${item?.productName}">
                </div>        
                <div class="col-7 col-sm-9 col-md-10">        
                    <div class="row">
                        <div class="col-12 col-sm-12 col-md-4">
                            <div class="basket-card-title">${item?.productName || 'Product Name'}</div>
                        </div>
                        <div class="col-12 col-xs-6 col-sm-4 col-md-2">
                            <basket-button 
                                class="button-add-to-basket" 
			        product-id = "${item?.productId}"
                                basket-skin="white" 
                                basket-count="${item?.quantity || 0}">
                            </basket-button>
                        </div>
                        <div class="col-12 col-xs-6 col-sm-1 col-md-1"></div>
                        <div class="col-12 col-sm-2 col-md-2">
                            <div class="basket-card-price" for="${item?.productId}">
                                ${(item?.quantity || 0) * (item?.price || 0)} ₽
                            </div>
                        </div>
                        <div class="col-12 col-sm-1 col-md-1"></div>
                        <div class="col-4 col-sm-2 col-md-1">
                            <i class="fa-regular fa-heart basket-card-heart-hotkey"></i>
                        </div>
                        <div class="col-8 col-sm-1 col-md-1">
                            <i class="fa-solid fa-trash-alt basket-card-trash-hotkey"></i>
                        </div>
                    </div>
                </div>                                             
            </div>`;

        // Вставить тело в контейнер товара
        basketItemContainer.appendChild(basketItemBody);

        // Добавить контейнер товара в основной контейнер
        container.appendChild(basketItemContainer);
    }
}
