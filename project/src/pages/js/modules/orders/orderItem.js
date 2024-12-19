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
	<section class="page-padding block-space card1 ">
	      <div class="row">		
                <div class="col-12 text-left">
		     <span class="${this.common.ORDER_STATUS[item.status].class}" style="padding:0.2rem;font-size: 0.76rem;">${this.common.ORDER_STATUS[item.status].description}</span>		
                </div>
               </div>
	      <div class="row" style=" padding:1rem 0 0 0;">		
			 <div class="col-4  col-sm-3 col-md-3 text-left" >		
			      <div class="row">		
	        		<div class="col-12 col-sm-6 text-left">
				     <span style="font-size: 0.76rem">№ ${item.orderId}</span>		   
			         </div>
		         	 <div class="col-12 col-sm-6 text-left">		
				      <span style="font-size: 0.76rem"><small>${createdAt.formatToCustom(item.createdAt)}</small></span>		   
        			 </div>
			         </div>
		               </div>
	        	       <div class="col-2 col-sm-2 col-md-1 text-start">
				     <span style="font-size: 0.76rem">${item.itemsCount} шт.</span>		
        		        </div>
		                <div class="col-3 col-sm-2 col-md-1  text-start" >
				     <span style="font-size: 0.76rem">${item.totalAmount} ₽</span>		
        		        </div>
               			<div class="col-3  col-sm-4 col-md-4 text-end">
					  <a href="/orders/${item.orderId}/page" style="font-size: 0.76rem;"> Перейти к заказу </a>		
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
