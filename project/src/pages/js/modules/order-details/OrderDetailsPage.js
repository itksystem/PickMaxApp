class OrderDetailsSection extends PageBuilder {
    constructor(containerId) {
        super(containerId);
        this.api = new WebAPI();
        this.common = new CommonFunctions();
    }

    /**
     * Generates the OrderDetails section module.
     */
    OrderDetailsCardContainer(orderId = null, totalQuantity = 0, totalAmount = 0) {
        const OrderDetailsContainer = document.createElement("div");
        OrderDetailsContainer.className = "card card-container";

        const OrderDetailsContainerHeader = document.createElement("div");
        OrderDetailsContainerHeader.className = "card-header";
        OrderDetailsContainerHeader.innerHTML = `<h3 class="card-title">
	  ${
		(totalQuantity !== 0)
		  ? `Ваш заказ № ${orderId}` 
		  : `Нет информации о заказе ${orderId}`                  
		}
	</h3>`;

        const OrderDetailsContainerContent = document.createElement("div");
        OrderDetailsContainerContent.className = "card-body";
        OrderDetailsContainerContent.innerHTML = `<div class="order-details-body-container"></div>`;

        OrderDetailsContainer.appendChild(OrderDetailsContainerHeader);
        OrderDetailsContainer.appendChild(OrderDetailsContainerContent);

        if (totalQuantity === 0) {
            const OrderDetailsTotalAmountContainer = document.createElement("div");
            OrderDetailsTotalAmountContainer.innerHTML = `
		<div class="order-details-empty-text text-center" style="padding: 1rem 0; font-size: 0.9rem;"> Зайдите в каталог, чтобы выбрать товары или найти нужное в поискe</div> 
		<div class="order-details-button-container"> <a href="/products/page" class="btn btn-lg btn-success w-100 create-order-btn">Перейти в каталог</a></div> 
`;

            OrderDetailsContainer.appendChild(OrderDetailsTotalAmountContainer);
        } else {
            const OrderDetailsContainerItog = document.createElement("div");
            OrderDetailsContainerItog.className = "card-itog-body-container";
            OrderDetailsContainerItog.innerHTML = `
            <div class="row">
                <div class="col-6 text-left">
                    <div class="order-details-itog-quantity-title">Всего товаров</div>
                </div>
                <div class="col-6 text-right">
                    <div class="order-details-itog-quantity-sum">${totalQuantity}</div>
                </div>
            </div>
            <div class="row">
                <div class="col-6 text-left">
                    <div class="order-details-itog-title">Итого</div>
                </div>
                <div class="col-6 text-right">
                    <div class="order-details-itog-sum">${totalAmount} ₽</div>
                </div>
            </div>`;

            const OrderDetailsContainerCreateOrderButton = document.createElement("div");
            OrderDetailsContainerCreateOrderButton.className = "card-created-order-button-container";

            // Создаем кнопку
            const createOrderButton = document.createElement("button");
            createOrderButton.className = "btn btn-lg btn-success w-100 create-order-btn";
            createOrderButton.textContent = "Вернуться к заказам";

            OrderDetailsContainerCreateOrderButton.appendChild(createOrderButton);
            OrderDetailsContainer.appendChild(OrderDetailsContainerItog);
            OrderDetailsContainer.appendChild(OrderDetailsContainerCreateOrderButton);

            // Добавляем обработчик после добавления кнопки в DOM
            this.attachCreateOrderButtonHandler(createOrderButton);
        }

        this.addModule("OrderDetails", OrderDetailsContainer);
    }

    /**
     * Attaches a click handler to the "Create Order" button.
     */
    attachCreateOrderButtonHandler(button) {
        const o = this;
        button.addEventListener("click", function () {
            console.log("Кнопка 'Создать заказ' нажата");
            window.location.href = `/orders/page`;
        });
    }
}
