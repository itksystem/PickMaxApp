// Derived class for rendering a Orders section
class OrdersSection extends PageBuilder {
    constructor(containerId) {
        super(containerId);
        this.api = new WebAPI();
        this.common = new CommonFunctions(); 
    }

    /** 
     * Generates the Orders section module.
     */

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

     OrdersCardContainer(totalQuantity = 0, totalAmount = 0){
	let o = this;
        const OrdersContainer = this.createContainer("div", "card container card-container")
        const OrdersContainerHeader = this.createContainer("div", "card-header", null, `
	      ${
		(totalQuantity !== 0)
		  ? "<h3 class=\"card-title\">Ваши заказы</h3>" 
		  : "<h3 class=\"card-title\">У вас пока нет заказов</h3>"
		}`)
        const OrdersContainerContent = this.createContainer("div", "order-card-body", null, `<div class="orders-body-container"></div>`)
        OrdersContainer.appendChild(OrdersContainerHeader);

        if(totalQuantity == 0 )  {
           const OrdersTotalAmountContainer = this.createContainer("div", null, null, `<div class="order-empty-text text-center">Зайдите в каталог, чтобы выбрать товары или найти нужное в поискe</div>`)
            OrdersContainer.appendChild(OrdersTotalAmountContainer);
           const BackToShowCaseContainer = this.createContainer("div", null, null, `<div class="basket-button-container"> <a href="/products/page" class="btn btn-lg btn-success w-100 create-order-btn">Перейти в каталог</a></div> `)
            OrdersContainer.appendChild(BackToShowCaseContainer);
          } else {

        const OrderStatusSelectorContainer = this.createContainer("div", "order-status-selector-container")

        const OrderNewSelectorContainer      = this.createContainer("button", "w-auto btn btn-block btn-outline-primary m-1","Новый")
        OrderNewSelectorContainer.setAttribute('attribute-status','NEW');
        const OrderCreateSelectorContainer   = this.createContainer("button", "w-auto btn btn-block btn-outline-primary m-1","Принят")
        OrderCreateSelectorContainer.setAttribute('attribute-status','CREATED');
        const OrderDeliverySelectorContainer = this.createContainer("button", "w-auto btn btn-block btn-outline-primary m-1","В доставке")
        OrderDeliverySelectorContainer.setAttribute('attribute-status','DELIVERY');
        const OrderExecuteSelectorContainer  = this.createContainer("button", "w-auto btn btn-block btn-outline-primary m-1","Исполнен")
        OrderExecuteSelectorContainer.setAttribute('attribute-status','EXECUTED');
        const OrderFailedSelectorContainer   = this.createContainer("button", "w-auto btn btn-block btn-outline-primary m-1","Отменен")
        OrderFailedSelectorContainer.setAttribute('attribute-status','DECLINE');

	OrderNewSelectorContainer.addEventListener("click", this.getOrdersButtonOnClick.bind(this));
	OrderCreateSelectorContainer.addEventListener("click", this.getOrdersButtonOnClick.bind(this));
	OrderDeliverySelectorContainer.addEventListener("click", this.getOrdersButtonOnClick.bind(this));
	OrderExecuteSelectorContainer.addEventListener("click", this.getOrdersButtonOnClick.bind(this));
	OrderFailedSelectorContainer.addEventListener("click", this.getOrdersButtonOnClick.bind(this));

        OrderStatusSelectorContainer.appendChild(OrderNewSelectorContainer);
        OrderStatusSelectorContainer.appendChild(OrderCreateSelectorContainer);
        OrderStatusSelectorContainer.appendChild(OrderDeliverySelectorContainer);
        OrderStatusSelectorContainer.appendChild(OrderExecuteSelectorContainer);
        OrderStatusSelectorContainer.appendChild(OrderFailedSelectorContainer);

        OrdersContainer.appendChild(OrderStatusSelectorContainer); 
        OrdersContainer.appendChild(OrdersContainerContent);
       }
       this.addModule("Orders", OrdersContainer);
      }

     _getOrdersBodyContainer(){ 
	return document.querySelector(".orders-body-container") ?? null
      }	

      getOrdersButtonOnClick(event){
	 let o = this;
	 let el = event.target.closest('[attribute-status]')
	 let status = el.getAttribute('attribute-status');
	 console.log(status)	 
	 let request = new WebRequest().get(o.api.getShopOrdersMethod(), o.api.getShopOrdersMethodPayload(status), false )
	     .then(function(data) {
		    let container = o._getOrdersBodyContainer();
		    container.innerText='';
	            if(data?.orders?.length != 0) {
	              data?.orders?.forEach(item => {
	 		new OrderItem("orders-body-container", item);
	             });
	          } else {
		container.innerHTML = `<div class="alert m-4 f-2 text-center"><div style="font-size: 0.8rem; color: #4f4f4f;">Нет заказов в данном статусе</div></div>`;
   	       }
	     })                                
	     .catch(function(error) {
	       console.log('showOrdersPage.Произошла ошибка =>', error);
	     });

      }	

      OrdersItem(containerClass, item){
        const container = document.querySelector(`.${containerClass}`); 
        const OrdersItemContainer = this.createContainer("div", "orders-item")
        const OrdersItemBody = this.createContainer("div", "order-card-body", null,
	 `<div class="row">		
   	      <div class="col-5 col-sm-3 col-md-2"><img class="image" src="${item?.mediaFiles[0]?.mediaKey}"></div>		
	         <div class="col-7 col-sm-9 col-md-10">		
		   <div class="row">
		    <div class="col-12 col-sm-12 col-md-4"><div class="orders-card-title">${item?.productName}</div></div>	
		    <div class="col-12 col-xs-6 col-sm-4 col-md-2"><orders-button class="button-add-to-Orders" orders-skin="white" orders-count="${item?.quantity}"></orders-button></div>
	     	    <div class="col-12 col-xs-6 col-sm-1 col-md-1"></div>
		    <div class="col-12 col-sm-2 col-md-2"><div class="orders-card-price">${item?.quantity * item?.price} ₽</div>
		   </div>
                 <div class="col-12 col-sm-1 col-md-1" ></div>
		   <div class="col-4 col-sm-2 col-md-1"><i class="fa-regular fa-heart orders-card-heart-hotkey"></i></div>
		   <div class="col-8 col-sm-1 col-md-1"><i class="fa-solid fa-trash-alt orders-card-trash-hotkey"></i></div>
		 </div>
               </div>					   	
	</div>`);

        OrdersItemContainer.appendChild(OrdersItemBody);
        this.addModule("OrdersItem", OrdersItemContainer);
	container.appendChild(OrdersItemContainer);
}



}