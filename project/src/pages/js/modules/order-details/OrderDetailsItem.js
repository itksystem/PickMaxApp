class OrderDetailsItem {

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

    constructor(containerClass, orderId, orderStatus, item) {
        // Найти контейнер с указанным классом
        const container = document.querySelector(`.${containerClass}`);
        if (!container) {
            throw new Error(`Container with class '${containerClass}' not found.`);
        }
	console.log(item);
        this.api = new WebAPI();
        this.productId =  item?.productId || null;
        this.orderId =  orderId || null;
        this.orderStatus =  orderStatus || null;
 
        // Создать элемент контейнера для товара
	const OrderDetailsItemContainer =  this.createContainer("div","order-details-item");
        const OrderDetailsItemBody =  this.createContainer("div","card-body",null, `
            <div class="row">        
                <div class="col-5 col-sm-3 col-md-2">
                    <img class="image" src="${item?.mediaFiles.length > 0
			? item?.mediaFiles[0]?.mediaKey 
			: 'default-image.png'}" alt="${item?.productName}">
                </div>        
                <div class="col-7 col-sm-9 col-md-10">        
                    <div class="row">
                        <div class="col-12 col-sm-12 col-md-4">
                            <div class="order-details-card-title">${item?.productName || 'Product Name'}</div>
                        </div>
                        <div class="col-12 col-xs-6 col-sm-4 col-md-2">
                            <div class="order-details-card-quantity">${item?.quantity || 0} шт.</div>
                        </div>
                        <div class="col-12 col-xs-6 col-sm-1 col-md-1"></div>
                        <div class="col-12 col-sm-2 col-md-2">
                            <div class="order-details-card-price">
                                ${(item?.quantity || 0) * (item?.price || 0)} ₽
                            </div>
                        </div>
                        <div class="col-12 col-sm-1 col-md-1"></div>
                        <div class="col-12">
			${
			   this.orderStatus == 'NEW'
  			  ? `<delete-confirm><i slot="trigger" class="fa-solid fa-trash-alt basket-card-trash-hotkey"></i></delete-confirm>`
			  : ``
			}	                


                        </div>
                    </div>
                </div>       
            </div>
          <div class="w-100" id="remove-tooltip-${item?.productId}"><div>
`);

        // Вставить тело в контейнер товара
        OrderDetailsItemContainer.appendChild(OrderDetailsItemBody);

        // Добавить контейнер товара в основной контейнер
        container.appendChild(OrderDetailsItemContainer);
	if(this.orderStatus == 'NEW')
	this.setupDeleteHandler(OrderDetailsItemContainer)
    }


    setupDeleteHandler(container) {
      const el = container.querySelector(`delete-confirm`);
      el.addEventListener('delete-confirmed', (e) => this.removeButtonOnClick(e));
   }

    removeButtonOnClick(e) {
        const rel = e.currentTarget.getAttribute("rel");
	console.log(e, this.productId, this.orderId)
	this.declineItem(e.currentTarget, this.orderId, this.productId)
        e.currentTarget.reset();
    }

  async declineItem(el, orderId, productId) {
    try {
      const response = new WebRequest().post(this.api.removeOrderItemMethod(),{orderId, productId}, true );
      if (!response.status || !response.status)
	 throw new Error('Failed to remove item');
      el.remove();
      if (toastr) {
        toastr.success('Товар удален из заказа', 'Заказ', { 
          timeOut: 3000 
        });
      }
     location.reload(true);
    } catch (error) {
      console.error('Ошибка при удалении товара из заказа:', error);
      if (toastr) {
        toastr.error('Ошибка при удалении из заказа', 'Заказ', { 
          timeOut: 3000 
        });
      }
      el.reset();
    }
  }

}
