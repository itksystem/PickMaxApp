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
	<section class="page-padding block-space ">
	      <div class="row">		
	                <div class="col-6 float-start">		
			   <span style="font-size: 1rem">Заказ № ${item.orderId}</span>		   
	                </div>
	                <div class="col-6 text-right">
			  <span class="${this.common.ORDER_STATUS[item.status].class}" style="padding:0.3rem;"> ${this.common.ORDER_STATUS[item.status].description}</span>		
	                </div>
              </div>
	      <div class="row">		
	                <div class="col-6  float-start" >		
			   <span style="font-size: 0.8rem"><small>${createdAt.formatToCustom(item.createdAt)}</small></span>		   
        	        </div>
	                <div class="col-2  d-flex align-items-center float-start">
			  <span style="font-size: 1rem"> ${item.itemsCount}</span>		
        	        </div>
	                <div class="col-4  d-flex align-items-center float-start" >
			  <span style="font-size: 1rem"> ${item.totalAmount}</span>		
        	        </div>
               </div>
	      <div class="row">		
	                <div class="col-12 text-end" style=" padding:1rem 0 0 0;">
			  <a href="#" style="font-size: 0.7rem;"> Перейти к заказу </a>		
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
