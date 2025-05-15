class OrderItem {
    constructor(containerClass, item) {
        // Найти контейнер с указанным классом
        const container = document.querySelector(`.${containerClass}`);
        if (!container) {
            throw new Error(`Container with class '${containerClass}' not found.`);
        }
        this.api = new WebAPI();
        this.common = new CommonFunctions(); 
                                                                        

        // Создать элемент контейнера для товара
        const orderItemContainer = document.createElement("div");
        orderItemContainer.className = "order-item";

        // Создать тело элемента с содержимым
        const orderItemBody = document.createElement("div");
        orderItemBody.className = "order-card-body";
        let createdAt = new DatetimeValidator();
        // Заполнить содержимое карточки
        orderItemBody.innerHTML = `
	<section class="page-padding block-space">
	      <div class="row">		
	   	<div class="col text-left basket-card-title">		
		      <small>${createdAt.formatToCustom(item.createdAt)}</small>
	        </div>
                <div class="col text-right basket-card-title">
		     ${this.common.ORDER_STATUS[item.status].description}
                </div>
               </div>
	      <div class="row" style=" padding:1rem 0 0 0;">		
	  	  <div class="col-6 text-start basket-card-title">
			<a href="/orders/${item.orderId}/page" style="font-size: 0.76rem;"> 
			     ${item?.items[0]?.mediaFiles[0]?.mediaKey ? `<img class="order-card-image" src="${item?.items[0]?.mediaFiles[0]?.mediaKey}"></img>` : ``}
			</a>		
        	  </div>
	  	  <div class="col-6 text-start basket-card-title">
	  	      <div class="row">		
		        <div class="text-left basket-card-title">Заказ № ${item.orderId}</div>
	              </div>
	  	      <div class="row">		
	  		  <div class="col-12 col-xs-6 col-sm-4 col-md-2">
		  		  <div class="order-details-card-quantity">
 	 			    ${item.itemsCount} шт.
				 </div>
			  </div>
		          <div class="col-12  col-xs-6 col-sm-4 col-md-2">
		  		  <div class="order-details-card-price">
  				    ${item.totalAmount} ₽
				  </div>
			  </div>
		          <div class="col-12  col-xs-6 col-sm-4 col-md-2">
		  		  <div class="basket-card-title">
				       <a href="/orders/${item.orderId}/page" style="font-size: 0.76rem;"> Перейти к заказу </a>		
				  </div>
			  </div>
	              </div>
        	  </div>
              </div>
	</section>
   `;

        // Вставить тело в контейнер товара
        orderItemContainer.appendChild(orderItemBody);

        // Добавить контейнер товара в основной контейнер
        container.appendChild(orderItemContainer);
    }
}
