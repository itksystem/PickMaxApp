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

     OrdersCardContainer(totalQuantity = 0, totalAmount = 0){
        const OrdersContainer = document.createElement("div");
        OrdersContainer.className = "card card-container";

        const OrdersContainerHeader = document.createElement("div");
        OrdersContainerHeader.className = "card-header";
        OrdersContainerHeader.innerHTML = `
	      ${
		(totalQuantity !== 0)
		  ? "<h3 class=\"card-title\">Ваши заказы</h3>" 
		  : "<h3 class=\"card-title\">У вас пока нет заказов</h3>"
		}`;

        const OrdersContainerContent = document.createElement("div");
        OrdersContainerContent.className = "order-card-body";
        OrdersContainerContent.innerHTML = `<div class="orders-body-container"></div>`;
        OrdersContainer.appendChild(OrdersContainerHeader);


        if(totalQuantity == 0 )  {
           const OrdersTotalAmountContainer = document.createElement("div");
            OrdersTotalAmountContainer.innerHTML = `<div class="order-empty-text text-center">Зайдите в каталог, чтобы выбрать товары или найти нужное в поискe</div>`;
            OrdersContainer.appendChild(OrdersTotalAmountContainer);
           const BackToShowCaseContainer = document.createElement("div");
            BackToShowCaseContainer.innerHTML = `<div class="basket-button-container"> <a href="/products/page" class="btn btn-lg btn-success w-100 create-order-btn">Перейти в каталог</a></div> `;
            OrdersContainer.appendChild(BackToShowCaseContainer);
          } else {

        const OrdersContainerItog = document.createElement("div");
        OrdersContainerItog.className = "card-itog-body-container";

        OrdersContainer.appendChild(OrdersContainerItog);
        OrdersContainer.appendChild(OrdersContainerContent);
       }
       this.addModule("Orders", OrdersContainer);
      }

      OrdersItem(containerClass, item){
        const container = document.querySelector(`.${containerClass}`); 
        const OrdersItemContainer = document.createElement("div");
        OrdersItemContainer.className = "orders-item";
        const OrdersItemBody = document.createElement("div");
        OrdersItemBody.className = "order-card-body";
	OrdersItemBody.innerHTML = `
			<div class="row">		
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
			</div>`;
        OrdersItemContainer.appendChild(OrdersItemBody);
        this.addModule("OrdersItem", OrdersItemContainer);
	container.appendChild(OrdersItemContainer);
}



}