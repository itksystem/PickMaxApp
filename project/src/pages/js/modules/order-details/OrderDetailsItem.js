class OrderDetailsItem {
    constructor(containerClass, item) {
        // Найти контейнер с указанным классом
        const container = document.querySelector(`.${containerClass}`);
        if (!container) {
            throw new Error(`Container with class '${containerClass}' not found.`);
        }

        // Создать элемент контейнера для товара
        const OrderDetailsItemContainer = document.createElement("div");
        OrderDetailsItemContainer.className = "order-details-item";

        // Создать тело элемента с содержимым
        const OrderDetailsItemBody = document.createElement("div");
        OrderDetailsItemBody.className = "card-body";

        // Заполнить содержимое карточки
        OrderDetailsItemBody.innerHTML = `
            <div class="row">        
                <div class="col-5 col-sm-3 col-md-2">
                    <img class="image" src="${item?.mediaFiles[0]?.mediaKey || 'default-image.png'}" alt="${item?.productName}">
                </div>        
                <div class="col-7 col-sm-9 col-md-10">        
                    <div class="row">
                        <div class="col-12 col-sm-12 col-md-4">
                            <div class="order-details-card-title">${item?.productName || 'Product Name'}</div>
                        </div>
                        <div class="col-12 col-xs-6 col-sm-4 col-md-2">
                            <div class="order-details-card-quantity">${item?.quantity || 0} шт.</div>
                        </div>
                        <div class="col-12 col-xs-6 col-sm-1 col-md-1"></div>
                        <div class="col-12 col-sm-2 col-md-2">
                            <div class="order-details-card-price">
                                ${(item?.quantity || 0) * (item?.price || 0)} ₽
                            </div>
                        </div>
                        <div class="col-12 col-sm-1 col-md-1"></div>
                        <div class="col-4 col-sm-2 col-md-1">
                            <i class="fa-regular fa-heart order-details-card-heart-hotkey"></i>
                        </div>
                    </div>
                </div>                                             
            </div>`;

        // Вставить тело в контейнер товара
        OrderDetailsItemContainer.appendChild(OrderDetailsItemBody);

        // Добавить контейнер товара в основной контейнер
        container.appendChild(OrderDetailsItemContainer);
    }
}
