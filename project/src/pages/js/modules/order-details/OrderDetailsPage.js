
class OrderDetailsSection extends PageBuilder {
    // Текстовые константы
    static TEXTS = {
        ORDER_TITLE: (orderId, hasItems) => 
            hasItems ? `Ваш заказ № ${orderId}` : `Нет информации о заказе ${orderId}`,
        EMPTY_ORDER_MESSAGE: 'Зайдите в каталог, чтобы выбрать товары или найти нужное в поиске',
        GO_TO_CATALOG: 'Перейти в каталог',
        TOTAL_ITEMS: 'Всего товаров',
        TOTAL_AMOUNT: 'Итого',
        CURRENCY: '₽',
        CANCEL_ORDER: 'Отменить',
        PAY_ORDER: 'Оплатить',
        BACK_TO_ORDERS: 'Вернуться к заказам',
        CONFIRM_CANCEL_TITLE: 'Вы уверены? Заказ будет отменен полностью.',
        CONFIRM_YES: 'Да, отменить',
        CONFIRM_NO: 'Нет, оставить',
	ORDER_DECLINE_ERROR_MSG :'Не удалось отменить заказ. Попробуйте позже...',
	ORDER_MSG: 'Заказ'
    };

    constructor(containerId) {
        super(containerId);
        this.api = new WebAPI();
        this.common = new CommonFunctions();
    }

    createContainer(element = null, classes = null, textContent = null, innerHTML = null) {
        if (!element) return null;
        
        const container = document.createElement(element);
        if (classes) container.className = classes;
        if (textContent) container.textContent = textContent;
        if (innerHTML) container.innerHTML = innerHTML;
        
        return container;
    }

    OrderDetailsCardContainer(order = null, totalQuantity = 0, totalAmount = 0) {
        if (!order?.orderId) return;

        this.order = order;
        this.totalQuantity = totalQuantity;
        this.totalAmount = totalAmount;
        const hasItems = totalQuantity !== 0;
        const updateAt = new DatetimeValidator();

        // Создаем основную карточку
        const card = this.createCard(
            order, 
            hasItems, 
            updateAt.formatToCustom(order?.updatedAt)
        );

        if (hasItems) {
            this.addOrderTotalInfo(card);
        } else {
            this.addEmptyOrderMessage(card);
        }
        if (hasItems) 
          this.addOrderActions(card, order.status);
        this.addModule("OrderDetails", card);
        this.setupEventHandlers();    
    }

    createCard(order, hasItems, formattedDate) {
        const card = this.createContainer("div", "card container");
        
        // Заголовок карточки
        const header = this.createContainer(
            "div",
            "card-header",
            null,
            `<h3 class="card-title">
                ${OrderDetailsSection.TEXTS.ORDER_TITLE(order.orderId, hasItems)}
            </h3>`
        );

        // Статус заказа
        const statusContent = this.createStatusContent(order, formattedDate);
        
        // Тело карточки
        const body = this.createContainer(
            "div",
            "card-body",
            null,
            '<div class="order-details-body-container"></div>'
        );

        card.appendChild(header);
        if (hasItems) card.appendChild(statusContent);
        card.appendChild(body);
        return card;
    }

    createStatusContent(order, formattedDate) {
        const statusRow = this.createContainer("div", "row");

        const dateCol = this.createContainer(
            "div",
            "col text-left basket-card-title",
            null,
            `<small>${formattedDate}</small>`
        );

        const statusCol = this.createContainer(
            "div",
            `col text-right basket-card-title text-center status-${order?.status.toLowerCase()}`,
            null,
            this.common?.ORDER_STATUS[order?.status]?.description ?? ''
        );

        statusRow.appendChild(dateCol);
        statusRow.appendChild(statusCol);

        return statusRow;
    }

    addEmptyOrderMessage(card) {
        const emptyMessage = this.createContainer(
            "div",
            null,
            null,
            `
            <div class="order-details-empty-text text-center" style="padding: 1rem 0; font-size: 0.9rem;">
                ${OrderDetailsSection.TEXTS.EMPTY_ORDER_MESSAGE}
            </div> 
            <div class="order-details-button-container">
                <a href="/products/page" class="btn btn-lg btn-success w-100 goto-orders-btn">
                    ${OrderDetailsSection.TEXTS.GO_TO_CATALOG}
                </a>
            </div>`
        );

        card.appendChild(emptyMessage);
    }

    addOrderTotalInfo(card) {
        const totalInfo = this.createContainer(
            "div",
            "card-itog-body-container",
            null,
            `
            <div class="row">
                <div class="col-6 text-left">
                    <div class="order-details-itog-quantity-title">${OrderDetailsSection.TEXTS.TOTAL_ITEMS}</div>
                </div>
                <div class="col-6 text-right">
                    <div class="order-details-itog-quantity-sum">${this.totalQuantity}</div>
                </div>
            </div>
            <div class="row">
                <div class="col-6 text-left">
                    <div class="order-details-itog-title">${OrderDetailsSection.TEXTS.TOTAL_AMOUNT}</div>
                </div>
                <div class="col-6 text-right">
                    <div class="order-details-itog-sum">${this.totalAmount} ${OrderDetailsSection.TEXTS.CURRENCY}</div>
                </div>
            </div>`
        );

        card.appendChild(totalInfo);
    }

    addOrderActions(card, orderStatus) {
        // Контейнер подтверждения отмены
        const confirmContainer = this.createConfirmContainer();
        card.appendChild(confirmContainer);

        // Основные кнопки действий
        const buttonsContainer = this.createButtonsContainer(orderStatus);
        card.appendChild(buttonsContainer);
    }

    createConfirmContainer() {
        const container = this.createContainer(
            "div",
            "row w-100 description-button-container d-none"
        );

        const textContainer = this.createContainer(
            "div",
            "row w-100 text-center text-description-button-container",
            null,
            `<div class="col-12">${OrderDetailsSection.TEXTS.CONFIRM_CANCEL_TITLE}</div>`
        );

        const buttonsRow = this.createContainer("div", "row w-100 decline-button-container d-none");
        const yesButtonCol = this.createContainer("div", "col-6");
        const noButtonCol = this.createContainer("div", "col-6");

        const yesButton = this.createContainer(
            "button",
            "btn btn-block btn-outline-dark btn-lg mt-4 confirm-decline-btn d-block",
            OrderDetailsSection.TEXTS.CONFIRM_YES
        );

        const noButton = this.createContainer(
            "button",
            "btn btn-lg btn-success w-100 no-confirm-decline-btn mt-4",
            OrderDetailsSection.TEXTS.CONFIRM_NO
        );

        yesButtonCol.appendChild(yesButton);
        noButtonCol.appendChild(noButton);
        buttonsRow.appendChild(yesButtonCol);
        buttonsRow.appendChild(noButtonCol);

        container.appendChild(textContainer);
        container.appendChild(buttonsRow);

        return container;
    }

    createButtonsContainer(orderStatus) {
        const container = this.createContainer(
            "div",
            "row w-100 card-created-order-button-container"
        );

        if (orderStatus === 'NEW') {
            const cancelCol = this.createContainer("div", "col-6");
            const payCol = this.createContainer("div", "col-6");

            const cancelButton = this.createContainer(
                "button",
                "btn btn-block btn-outline-dark btn-lg mt-4 decline-order-btn d-block",
                OrderDetailsSection.TEXTS.CANCEL_ORDER
            );

            const payButton = this.createContainer(
                "button",
                "btn btn-lg btn-success w-100 create-order-btn mt-4",
                OrderDetailsSection.TEXTS.PAY_ORDER
            );

            cancelCol.appendChild(cancelButton);
            payCol.appendChild(payButton);
            container.appendChild(cancelCol);
            container.appendChild(payCol);
        } else {
            const backCol = this.createContainer("div", "col");
            const backButton = this.createContainer(
                "button",
                "btn btn-lg btn-success w-100 goto-orders-btn mt-4",
                OrderDetailsSection.TEXTS.BACK_TO_ORDERS
            );
            backCol.appendChild(backButton);
            container.appendChild(backCol);
        }

        return container;
    }

    setupEventHandlers() {
        // Добавляем небольшую задержку для гарантированного наличия элементов в DOM
        setTimeout(() => {
            const container = this.container || document.querySelector(`#${this.containerId}`);
            
            if (!container) {
                console.error('Container not found');
                return;
            }

            const payButton = container.querySelector("button.create-order-btn");
            const backButton = container.querySelector("button.goto-orders-btn");
            const cancelButton = container.querySelector("button.decline-order-btn");
            const confirmYesButton = container.querySelector("button.confirm-decline-btn");
            const confirmNoButton = container.querySelector("button.no-confirm-decline-btn");

            console.log('Found buttons:', { 
		container,
                payButton, 
                backButton, 
                cancelButton, 
                confirmYesButton, 
                confirmNoButton 
            });

            // Назначаем обработчики с bind для сохранения контекста
            payButton?.addEventListener("click", () => this.payOrder());
            backButton?.addEventListener("click", () => this.goToOrders());
            cancelButton?.addEventListener("click", () => this.showCancelConfirmation());
            confirmYesButton?.addEventListener("click", () => this.confirmCancel());
            confirmNoButton?.addEventListener("click", () => this.hideCancelConfirmation());
        }, 50);
    }


    toggleElementVisibility(selector, show) {
        const element = this.container.querySelector(selector);
        if (!element) return;
        
        element.classList.toggle("d-none", !show);
    }

    showCancelConfirmation() {
	console.log(`showCancelConfirmation`)
        this.toggleElementVisibility(".description-button-container", true);
        this.toggleElementVisibility(".card-created-order-button-container", false);
        this.toggleElementVisibility(".decline-button-container", true);
    }

    hideCancelConfirmation() {
	console.log(`hideCancelConfirmation`)
        this.toggleElementVisibility(".description-button-container", false);
        this.toggleElementVisibility(".card-created-order-button-container", true);
        this.toggleElementVisibility(".decline-button-container", false);
    }

    confirmCancel() {
	console.log(`confirmCancel`)
        this.hideCancelConfirmation();
        try{
          let result = new WebRequest().post(this.api?.declineOrderMethod(), { orderId : this.order.orderId }, true );
	  if(!result || !result.status) throw(OrderDetailsSection.TEXTS.ORDER_DECLINE_ERROR_MSG)
          location.reload(true);
        }catch(error) {
	console.log('error load profile...');
        toastr.error(error, OrderDetailsSection.TEXTS.ORDER_MSG, { timeOut: 3000 });
      }
    }

    payOrder() {
	console.log(`payOrder`)
        window.location.href = `/orders/payment/${this.order.orderId}`;
    }

    goToOrders() {
	console.log(`goToOrders`)
        window.location.href = `/orders/page`;
    }
}