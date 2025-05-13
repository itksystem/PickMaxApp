class OrderDetailsSection extends PageBuilder {
    constructor(containerId) {
        super(containerId);
        this.api = new WebAPI();
        this.common = new CommonFunctions();
    }


    createContainer( element = null, elementClass = null, textContent = null, innerHTML = null){
	if(!element) return;
        const _container = document.createElement(element);
	if(elementClass) 
        _container.className = `${elementClass}`;
	if(textContent) 
	_container.textContent = textContent;
	if(innerHTML) 
	_container.innerHTML = innerHTML;
	return _container;
    }

    /**
     * Generates the OrderDetails section module.
     */
    OrderDetailsCardContainer(order = null, totalQuantity = 0, totalAmount = 0) {
	if(!order && !order?.orderId) return;
        let updateAt = new DatetimeValidator();
	this.order = order;
        const OrderDetailsContainer = this.createContainer("div","card container");
        const OrderDetailsContainerHeader = this.createContainer("div","card-header", null, `<h3 class="card-title">
	  ${
		(totalQuantity !== 0)
		  ? `Ваш заказ № ${order.orderId}` 
		  : `Нет информации о заказе ${order.orderId}`                  
		}
	</h3>`);;

        const OrderStatusDetailsContainerContent = this.createContainer("div","row", null, `
	      <div class="row">		
	   	<div class="col text-left basket-card-title">		
		      <small>${updateAt.formatToCustom(order?.updatedAt)}</small>
		 </div>
	         <div class="col text-right basket-card-title text-center status-${order?.status.toLowerCase()}">
		     ${this?.common?.ORDER_STATUS[order?.status]?.description ?? ``}
        	 </div>
               </div>
	`);
        const OrderDetailsContainerContent = this.createContainer("div", "card-body", null, `<div class="order-details-body-container"></div>`);
        OrderDetailsContainer.appendChild(OrderDetailsContainerHeader);
        OrderDetailsContainer.appendChild(OrderStatusDetailsContainerContent);
        OrderDetailsContainer.appendChild(OrderDetailsContainerContent);

        if (totalQuantity === 0) {
            const OrderDetailsTotalAmountContainer = this.createContainer("div", null, null, `
		<div class="order-details-empty-text text-center" style="padding: 1rem 0; font-size: 0.9rem;"> Зайдите в каталог, чтобы выбрать товары или найти нужное в поискe</div> 
		<div class="order-details-button-container"> <a href="/products/page" class="btn btn-lg btn-success w-100 create-order-btn">Перейти в каталог</a></div> 
	`);

        OrderDetailsContainer.appendChild(OrderDetailsTotalAmountContainer);
        } else {
            const OrderDetailsContainerItog = this.createContainer("div", "card-itog-body-container", null, `
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
            </div>`);

            const ButtonDescriptionContainer = this.createContainer("div", "row w-100 card description-button-container d-none");  	    
            const ButtonDescriptionTextContainer = this.createContainer("div", "row w-100 text-center text-description-button-container", null,       
		 '<div class="col-12">Вы уверены? Заказ будет отменен полностью.</div>');  	    

            const OrderDetailsButtonsContainer = this.createContainer("div", "row w-100 card-created-order-button-container");
            const OrderDetailsButtonsRow1Container = this.createContainer("div", "col-6");
            const OrderDetailsButtonsRow2Container = this.createContainer("div", "col-6");
            const OrderDetailsButtonsRow3Container = this.createContainer("div", "col");

            const DeclineOrderButton 	= this.createContainer("button", "btn btn-block btn-outline-dark btn-lg mt-4 change-link-audit-container d-block", "Отменить заказ");
            const PayOrderButton 	= this.createContainer("button",  "btn btn-lg btn-success w-100 create-order-btn mt-4 ", "Оплатить заказ");
            const GotoOrdersButton 	= this.createContainer("button",  "btn btn-lg btn-success w-100 create-order-btn mt-4 ", "Вернуться к заказам");

            const DeclineButtonsContainer = this.createContainer("div", "row w-100 decline-button-container d-none");
            const DeclineButtonsRow1Container = this.createContainer("div", "col-6");
            const DeclineButtonsRow2Container = this.createContainer("div", "col-6");
            const DeclineOrderButtonYes = this.createContainer("button", "btn btn-block btn-outline-dark btn-lg mt-4 confirm-decline-button-container d-block", "Да, отменить");
            const DeclineOrderButtonNo = this.createContainer("button",  "btn btn-lg btn-success w-100 no-confirm-decline-button-container  mt-4 ", "Нет, оставить");

            DeclineButtonsRow1Container.appendChild(DeclineOrderButtonYes);
            DeclineButtonsRow2Container.appendChild(DeclineOrderButtonNo);

	    DeclineButtonsContainer.appendChild(DeclineButtonsRow1Container);
	    DeclineButtonsContainer.appendChild(DeclineButtonsRow2Container);


 	    ButtonDescriptionContainer.appendChild(ButtonDescriptionTextContainer);
            ButtonDescriptionContainer.appendChild(DeclineButtonsContainer);

            OrderDetailsButtonsRow1Container.appendChild(DeclineOrderButton);
            OrderDetailsButtonsRow2Container.appendChild(PayOrderButton);
	    OrderDetailsButtonsRow3Container.appendChild(GotoOrdersButton);

            if (order.status == 'NEW') {
               OrderDetailsButtonsContainer.appendChild(OrderDetailsButtonsRow1Container);
               OrderDetailsButtonsContainer.appendChild(OrderDetailsButtonsRow2Container);
	    } else 
            OrderDetailsButtonsContainer.appendChild(OrderDetailsButtonsRow3Container);

            OrderDetailsContainer.appendChild(OrderDetailsContainerItog);
	    OrderDetailsContainer.appendChild(ButtonDescriptionContainer);
            OrderDetailsContainer.appendChild(OrderDetailsButtonsContainer);
//            OrderDetailsContainer.appendChild(DeclineButtonsContainer);

            // Добавляем обработчик после добавления кнопки в DOM
  	    PayOrderButton.addEventListener("click", this.PayOrderButtonOnClick.bind(this) );
  	    GotoOrdersButton.addEventListener("click", this.GotoOrdersButtonOnClick.bind(this));
  	    DeclineOrderButton.addEventListener("click", this.DeclineOrderButtonOnClick.bind(this));

  	    DeclineOrderButtonYes.addEventListener("click", this.DeclineOrderButtonYesOnClick.bind(this));
  	    DeclineOrderButtonNo.addEventListener("click", this.DeclineOrderButtonNoOnClick.bind(this));
        }

        this.addModule("OrderDetails", OrderDetailsContainer);
    }

    _buttonDescriptionContainer(){ return document.querySelector(".description-button-container") ?? null};
    _payOrderButton(){ return document.querySelector(".create-order-btn") ?? null};
    _orderButtonsContainer(){ return document.querySelector(".card-created-order-button-container") ?? null};
    _declineOrderButtonsContainer(){ return document.querySelector(".decline-button-container") ?? null};
    _declineOrderConfirmButton(){ return document.querySelector(".confirm-decline-button-container") ?? null};
    _declineOrderNoConfirmButton(){ return document.querySelector(".no-confirm-decline-button-container") ?? null};


    toggleVisibility(element, show){
     if (!element) return;
     if(!show) {
       element.classList.add('d-none');
      } else 
     element.classList.remove('d-none');
    };


    DeclineOrderButtonYesOnClick(){
       this.toggleVisibility(this._buttonDescriptionContainer(), false)
       this.toggleVisibility(this._orderButtonsContainer(), false)
       this.toggleVisibility(this._declineOrderButtonsContainer(), false)
       location.reload(true);
    }

    DeclineOrderButtonNoOnClick(){
       this.toggleVisibility(this._buttonDescriptionContainer(), false)
       this.toggleVisibility(this._orderButtonsContainer(), true)
       this.toggleVisibility(this._declineOrderButtonsContainer(), false)
    }


    /** Attaches a click handler to the "Create Order" button.    */
    PayOrderButtonOnClick() {
        const o = this;
        console.log("PayOrderButtonOnClick");
        window.location.href = `/orders/payment/${this.order.orderId}`; //перешли на доставку`;
    }

    DeclineOrderButtonOnClick() {
       const o = this;
       let description = this._buttonDescriptionContainer()
       this.toggleVisibility(description, true)
       this.toggleVisibility(this._orderButtonsContainer(), false)
       this.toggleVisibility(this._declineOrderButtonsContainer(), true)
       console.log("DeclineOrderButtonOnClick");
    }


    /** Attaches a click handler to the "Goto Orders" button.    */
    GotoOrdersButtonOnClick() {
       console.log("GotoOrdersButtonOnClick");
       window.location.href = `/orders/page`;

    }

}
