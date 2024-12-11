// Derived class for rendering a Basket section
class BasketSection extends PageBuilder {
    constructor(containerId) {
        super(containerId);
    }

    /** 
     * Generates the Basket section module.
     */

     BasketCardContainer(totalQuantity = 0, totalAmount = 0){
        const BasketContainer = document.createElement("div");
        BasketContainer.className = "card card-container";

        const BasketContainerHeader = document.createElement("div");
        BasketContainerHeader.className = "card-header";
        BasketContainerHeader.innerHTML = `<h3 class="card-title">Ваша корзина</h3>`;

        const BasketContainerContent = document.createElement("div");
        BasketContainerContent.className = "card-body";
        BasketContainerContent.innerHTML = `<div class="basket-body-container"></div>`;

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
			<div class="basket-itog-sum">${totalAmount}</div>
		  </div>
		</div>
`;

        const BasketContainerCreateOrderButton = document.createElement("div");
        BasketContainerCreateOrderButton.className = "card-created-order-button-container";
        BasketContainerCreateOrderButton.innerHTML = `<button class="btn btn-lg btn-success w-100">Создать заказ</button>`;

        BasketContainer.appendChild(BasketContainerHeader);
        BasketContainer.appendChild(BasketContainerContent);
        BasketContainer.appendChild(BasketContainerItog);
        BasketContainer.appendChild(BasketContainerCreateOrderButton);
        if(totalQuantity == 0 )  {
           const BasketTotalAmountContainer = document.createElement("div");
            BasketTotalAmountContainer.innerHTML = `<h2 class="header-title">В корзине нет товаров </h2>`;
            BasketContainer.appendChild(BasketTotalAmountContainer);
          }
       this.addModule("Basket", BasketContainer);
      }

      BasketItem(containerClass, item){
        const container = document.querySelector(`.${containerClass}`);

        const BasketItemContainer = document.createElement("div");
        BasketItemContainer.className = "basket-item";
        const BasketItemBody = document.createElement("div");
        BasketItemBody.className = "card-body";
	BasketItemBody.innerHTML = `
			<div class="row">		
   	        	    <div class="col-5 col-sm-3 col-md-2"><img class="image" src="${item?.mediaFiles[0]?.mediaKey}"></div>		
	  	                <div class="col-7 col-sm-9 col-md-10">		
			 	   <div class="row">
				    <div class="col-12 col-sm-12 col-md-4"><div class="basket-card-title">${item?.productName}</div></div>	
		     	   	    <div class="col-12 col-xs-6 col-sm-4 col-md-2"><basket-button class="button-add-to-basket" basket-skin="white" basket-count="${item?.quantity}"></basket-button></div>
	     		   	    <div class="col-12 col-xs-6 col-sm-1 col-md-1"></div>
		     	   	    <div class="col-12 col-sm-2 col-md-2"><div class="basket-card-price">${item?.quantity * item?.price} ₽</div>
			           </div>

	     		   	    <div class="col-12 col-sm-1 col-md-1" ></div>
		     	   	    <div class="col-4 col-sm-2 col-md-1"><i class="fa-regular fa-heart basket-card-heart-hotkey"></i></div>
		     	   	    <div class="col-8 col-sm-1 col-md-1"><i class="fa-solid fa-trash-alt basket-card-trash-hotkey"></i></div>
			         </div>
                            </div>					   	
			</div>`;
        BasketItemContainer.appendChild(BasketItemBody);
        this.addModule("BasketItem", BasketItemContainer);
	container.appendChild(BasketItemContainer);
}



}