class BasketSection extends PageBuilder {
    constructor(containerId) {
        super(containerId);
        this.api = new WebAPI();
        this.common = new CommonFunctions();
    }

    /**
     * Generates the Basket section module.
     */
    BasketCardContainer(totalQuantity = 0, totalAmount = 0) {
        const BasketContainer = document.createElement("div");
        BasketContainer.className = "card card-container";

        const BasketContainerHeader = document.createElement("div");
        BasketContainerHeader.className = "card-header";
        BasketContainerHeader.innerHTML = `<h3 class="card-title">
	  ${
		(totalQuantity !== 0)
		  ? "Ваша корзина" 
		  : "В корзине пока пусто"                  
		}
	</h3>`;

        const BasketContainerContent = document.createElement("div");
        BasketContainerContent.className = "card-body";
        BasketContainerContent.innerHTML = `<div class="basket-body-container"></div>`;

        BasketContainer.appendChild(BasketContainerHeader);
        BasketContainer.appendChild(BasketContainerContent);

        if (totalQuantity === 0) {
            const BasketTotalAmountContainer = document.createElement("div");
            BasketTotalAmountContainer.innerHTML = `
		<div class="basket-empty-text text-center" style="padding: 1rem 0; font-size: 0.9rem;"> Зайдите в каталог, чтобы выбрать товары или найти нужное в поискe</div> 
		<div class="basket-button-container"> <a href="/products/page" class="btn btn-lg btn-success w-100 create-order-btn">Перейти в каталог</a></div> 
`;

            BasketContainer.appendChild(BasketTotalAmountContainer);
        } else {
            const BasketContainerItog = document.createElement("div");
            BasketContainerItog.className = "card-itog-body-container";
            BasketContainerItog.innerHTML = `
            <div class="row">
                <div class="col-6 text-left">
                    <div class="basket-itog-quantity-title">Всего товаров</div>
                </div>
                <div class="col-6 text-right">
                    <div class="basket-itog-quantity-sum">${totalQuantity}</div>
                </div>
            </div>
            <div class="row">
                <div class="col-6 text-left">
                    <div class="basket-itog-title">Итого</div>
                </div>
                <div class="col-6 text-right">
                    <div class="basket-itog-sum">${totalAmount} ₽</div>
                </div>
            </div>`;

            const BasketContainerCreateOrderButton = document.createElement("div");
            BasketContainerCreateOrderButton.className = "card-created-order-button-container";

            // Создаем кнопку
            const createOrderButton = document.createElement("button");
            createOrderButton.className = "btn btn-lg btn-success w-100 create-order-btn";
            createOrderButton.textContent = "Создать заказ";

            BasketContainerCreateOrderButton.appendChild(createOrderButton);
            BasketContainer.appendChild(BasketContainerItog);
            BasketContainer.appendChild(BasketContainerCreateOrderButton);

            // Добавляем обработчик после добавления кнопки в DOM
            this.attachCreateOrderButtonHandler(createOrderButton);
        }

        this.addModule("Basket", BasketContainer);
    }

    /**
     * Attaches a click handler to the "Create Order" button.
     */
    attachCreateOrderButtonHandler(button) {
        const o = this;

        button.addEventListener("click", function () {
            console.log("Кнопка 'Создать заказ' нажата");

            // Блокируем кнопку
            button.disabled = true;
            button.textContent = "Создание...";

            const webRequest = new WebRequest();
            o.referenceId = o.common.uuid();

            webRequest
                .post(o.api.createOrderMethod(), { referenceId: o.referenceId }, false)
                .then((data) => {
                    console.log("Заказ успешно создан:", data);

                    const order = new OrderDto(data.order);
                    if (!order) throw new Error("Object order is null");

                    order.saveToLocalStorage(o.referenceId);

                    window.location.href = `/orders/delivery/${o.referenceId}`;
                })
                .catch((error) => {
                    console.error("Ошибка при создании заказа:", error);

                    if (error.status === 409) {
                        window.location.href = "/orders/payment/availability-error";
                    } else {
                        window.location.href = "/orders/create-error";
                    }
                })
                .finally(() => {
                    // Разблокируем кнопку независимо от результата
                    button.disabled = false;
                    button.textContent = "Создать заказ";
                });
        });
    }
}