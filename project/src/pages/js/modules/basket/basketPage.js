
class BasketSection extends PageBuilder {
    constructor(containerId) {
        super(containerId);
        this.api = new WebAPI();
        this.common = new CommonFunctions();
        this.deliveryType = null;
        this.address = null;
    }

    /**
     * Generates the Basket section module.
     */
    BasketCardContainer(totalQuantity = 0, totalAmount = 0, data) {
        let o = this;
        const BasketContainer = document.createElement("div");
        BasketContainer.className = "container basket";

        const BasketDeliveryContainer = document.createElement("div");
        BasketDeliveryContainer.className = "container delivery d-none";

        const BasketAddressContainer = document.createElement("div");
        BasketAddressContainer.className = "container address d-none";

        const BasketRussianPostAddressContainer = document.createElement("div");
        BasketRussianPostAddressContainer.className = "container russian-postal-address d-none";

        const BasketSendOrderButtonContainer = document.createElement("div");
        BasketSendOrderButtonContainer.className = "container send-order-button-container d-none";


//	Сами товары 
	this.BasketBodyContainer(BasketContainer, totalQuantity, totalAmount);

        if (totalQuantity === 0) {
	  this.BasketTotalAmount(BasketContainer);
        } else {
   	    this.BasketContainerItog(BasketContainer, totalQuantity, totalAmount);
            this.DeliveryContainer(BasketDeliveryContainer); // Тип доставки
            this.AddressContainer(BasketAddressContainer); //  Адрес
            this.RussianPostAddressContainer(BasketRussianPostAddressContainer); //  Адрес
            this.SendOrderButtonContainer(BasketSendOrderButtonContainer); // Кнопка отправить заказ

  	    eventBus.on("basketItemUpdated", (_message) => { // Подписчик: реагирует на событие
		o.basketUpdate(_message);
	   });	    
        }
        this.addModule("Basket", BasketContainer);
        this.addModule("BasketDelivery", BasketDeliveryContainer);
        this.addModule("BasketRussianPostDelivery", BasketRussianPostAddressContainer);
        this.addModule("BasketAddress", BasketAddressContainer);
        this.addModule("BasketSendOrderButton",BasketSendOrderButtonContainer);
    }


/* Обновление данных корзины */
 basketUpdate(message) {
  let o = this;
  let webRequest = new WebRequest();
  let request = webRequest.get(o.api.getShopBasketMethod(),  {}, false )
     .then(function(data) {
           console.log(data)
	   if(data.basket.length == 0) 
	   window.location.href = window.location.pathname;
           o.totalQuantity = data?.basket?.reduce((quantity, item) => quantity + item.quantity, 0);
           o.totalAmount = data?.totalAmount;
      // Динамически обновляем значения в DOM
           let quantityElement = document.querySelector(".basket-itog-quantity-sum");
           let amountElement = document.querySelector(".basket-itog-sum");
           if (quantityElement) quantityElement.textContent = o.totalQuantity;
           if (amountElement) amountElement.textContent = `${o.totalAmount} ₽`;

   	// Находим все элементы с классом .basket-card-price
   	    const priceElements = document.querySelectorAll('.basket-card-price');

 	 // Перебираем найденные элементы и выводим их содержимое
	     priceElements.forEach((priceElement, index) => {
               priceElement.textContent = ``;
	    });

	  // обновляем записи

   	     data.basket.forEach(item => {
              o.updateBasketPrice(item.productId, `${item.quantity*item.price} ₽`); 
            });


        })                                
     .catch(function(error) {
       console.log('showBasketOutput.Произошла ошибка =>', error);
     });
    return this;
 }

/**
 * Обновляет значение цены в компоненте basket-button
 * @param {string} productId - Идентификатор продукта (значение атрибута product-id).
 * @param {string} amount - Новая сумма для отображения (например, "950 ₽").
 */
  updateBasketPrice(productId, amount) {
    // Находим элемент с классом basket-card-price внутри компонента
     const priceElement = document.querySelector(`.basket-card-price[for="${productId}"]`);
     if (priceElement) {
    // Обновляем значение внутри элемента
       priceElement.textContent = amount;
     } else {
       console.error('Элемент .basket-card-price не найден внутри компонента basket-button');
    }    
 }

  BasketBodyContainer(container, totalQuantity, totalAmount){
        const BasketContainerHeader = document.createElement("div");
        BasketContainerHeader.className = "card-header";
        BasketContainerHeader.innerHTML = `<h3 class="card-title">
	  ${
		(totalQuantity !== 0)
		  ? "Ваша корзина" 
		  : "В корзине пока пусто"                  
		}
	</h3>`;

        const BasketContainerContent = document.createElement("div");
        BasketContainerContent.className = "card-body";
        BasketContainerContent.innerHTML = `<div class="basket-body-container"></div>`;

        container.appendChild(BasketContainerHeader);
        container.appendChild(BasketContainerContent);
  }

  BasketTotalAmount(container){
        const BasketTotalAmountContainer = document.createElement("div");
         BasketTotalAmountContainer.innerHTML = `
		<div class="basket-empty-text text-center" style="padding: 1rem 0; font-size: 0.9rem;"> Зайдите в каталог, чтобы выбрать товары или найти нужное в поискe</div> 
		<div class="basket-button-container"> <a href="/products/page" class="btn btn-lg btn-success w-100 create-order-btn">Перейти в каталог</a></div> `;
         container.appendChild(BasketTotalAmountContainer);
  }

  BasketContainerItog(container, totalQuantity, totalAmount){
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
                    <div class="basket-itog-sum">${totalAmount} ₽</div>
                </div>
            </div>
`;


            const BasketContainerCreateOrderButton = document.createElement("div");
            BasketContainerCreateOrderButton.className = "card-created-order-button-container";

            // Создаем кнопку
            const createOrderButton = document.createElement("button");
            createOrderButton.className = "btn btn-lg btn-success w-100 create-order-btn";
            createOrderButton.textContent = "Перейти к оформлению заказа";

            BasketContainerCreateOrderButton.appendChild(createOrderButton);

            const BasketContainerOrderZigZag = document.createElement("div");
            BasketContainerOrderZigZag.className = "zig-zag";

            container.appendChild(BasketContainerItog);          
            container.appendChild(BasketContainerCreateOrderButton);
	    this.attachDeliveryOrderButtonHandler(createOrderButton);

  }

  CheckBottomLineContainer(){
            const BasketCheckContainer = document.createElement("div");
            BasketCheckContainer.className = "check-bottom w-100";
            const BasketCheckLineContainer = document.createElement("div");
            BasketCheckLineContainer.className = "zig-zag ";
// 	    BasketCheckContainer.appendChild(BasketCheckLineContainer);
	    return BasketCheckContainer;
  }

  SendOrderButtonContainer(container){
            const sendOrderButton = document.createElement("button");
            sendOrderButton.className = "btn btn-lg btn-success w-100 send-order-btn d-none  mt-4";
            sendOrderButton.textContent = "Отправить заказ";
            container.appendChild(sendOrderButton);          
  }

  DeliveryTypeContainer(containerClass, extClass = '', text = '', decription = '', onClick = null ) {
        const _aContainerContent = document.createElement("div");
        _aContainerContent.className = `w-50 ${containerClass}`;
        _aContainerContent.setAttribute('delivery-type', containerClass);
        _aContainerContent.setAttribute('delivery-description', decription);

        const aContainerContent = document.createElement("div");
        aContainerContent.className = "delivery-type-btn btn btn-block btn-light btn-lg w-100 m-1";

	const deliverySelfTypeContainerContent = document.createElement("i");
	deliverySelfTypeContainerContent.className = extClass;

	const deliverySelfTextContainerContent = document.createElement("span");
	deliverySelfTextContainerContent.style.fontFamily = "Roboto Condensed";
	deliverySelfTextContainerContent.style.fontSize = "0.8rem";
	deliverySelfTextContainerContent.style.fontWeight = "400";
	deliverySelfTextContainerContent.style.paddingLeft = "0.5rem";
	deliverySelfTextContainerContent.innerText = text;

	aContainerContent.appendChild(deliverySelfTypeContainerContent);
	aContainerContent.appendChild(deliverySelfTextContainerContent);
	_aContainerContent.appendChild(aContainerContent);

	if(onClick)
	    _aContainerContent.addEventListener("click", ()=>onClick(_aContainerContent));
	return _aContainerContent;
  }

  getDeliveryTypes(){
    let webRequest = new WebRequest();
    let types =  webRequest.get(this.api.getDeliveryTypesMethod(), {}, true)
    console.log(types);	
    return (!types ? null : types)
  }

  DeliveryContainer(container) {
	this.deliveryTypes = this.getDeliveryTypes();
        const deliveryContainer = document.createElement("div");
        deliveryContainer.className = "delivery-container d-none";

        const deliveryContainerHeader = document.createElement("div");
        deliveryContainerHeader.className = "card-header";
        deliveryContainerHeader.innerHTML = `<h3 class="card-title">Выберите тип доставки</h3>`;

        const deliveryContainerContent = document.createElement("div");
        deliveryContainerContent.className = "card-body";

        const deliveryBodyContainerContent = document.createElement("div");
        deliveryBodyContainerContent.className = "deliveryBodyContainerContent";
        deliveryContainerContent.appendChild(deliveryBodyContainerContent);

        deliveryContainer.appendChild(deliveryContainerHeader);
        deliveryContainer.appendChild(deliveryContainerContent);

        const deliveryHotKeyContainer = document.createElement("div");
        deliveryHotKeyContainer.className = "row pb-4";                                     

	     this.deliveryTypes.types.forEach((delivery, index) => {
		console.log(delivery)
		deliveryHotKeyContainer.appendChild(
 	  	  this.DeliveryTypeContainer(
		    delivery.code, 
		    `${delivery.logo} fa-solid`, 
		    delivery.name, 
		    delivery.description, 
 		    this.DeliveryTypeContainerOnClick.bind(this)),
		);
	    });


        deliveryContainer.appendChild(deliveryHotKeyContainer);

        const deliveryDescriptionBoxContainer = document.createElement("div");
        deliveryDescriptionBoxContainer.className = "delivery-description-box";
        deliveryContainer.appendChild(deliveryDescriptionBoxContainer);


        container.appendChild(deliveryContainer);
   }


   toggleVisibility(element, show){
    if (!element) return;
    if(!show) {
      element.classList.add('d-none');
      element.classList.remove('d-block');
      } else {
      element.classList.remove('d-none');
      element.classList.add('d-block');
    } 	
   };


  DeliveryTypeContainerOnClick(container) {
    // Получаем тип доставки
    this.deliveryType = container.getAttribute('delivery-type');
    const description = container.getAttribute('delivery-description');

    console.log('Selected delivery type:', this.deliveryType, container);
    
    // Находим элементы DOM

    const russianPostContainer 	= document.querySelector(".container.russian-postal-address");
    const russianPostBox	= document.querySelector(".russian-post-address-container");
    const addressContainer 	= document.querySelector(".container.address");
    const addressBox 		= document.querySelector(".address-container");
    const sendOrderButtonContainer = document.querySelector(".send-order-button-container");
    const sendOrderButton 	= document.querySelector(".send-order-btn");
    const descriptionBox 	= document.querySelector(".delivery-description-box");
    if(descriptionBox) descriptionBox.innerText = description;
    
    // Удаляем класс selected у всех элементов доставки
    document.querySelectorAll('.delivery-type-btn.selected').forEach(el => {
        el.classList.remove('selected');
    });
    

    // Добавляем класс selected к выбранному элементу
    container.querySelector('.delivery-type-btn').classList.add('selected');

// Скрываем все элементы
	this.toggleVisibility(russianPostContainer, false);
	this.toggleVisibility(russianPostBox, false);
	this.toggleVisibility(addressContainer, false);
	this.toggleVisibility(addressBox, false);
	this.toggleVisibility(sendOrderButtonContainer, false);
	this.toggleVisibility(sendOrderButton, false);
    
    // Обработка разных типов доставки
    switch(this.deliveryType) {
        case "SELF_DELIVERY":
        case "PARCEL_LOCKER":
	    this.toggleVisibility(sendOrderButtonContainer, true);
	    this.toggleVisibility(sendOrderButton, true);
            break;
        case "RUSSIAN_POST":
	    this.toggleVisibility(russianPostContainer, true);
	    this.toggleVisibility(russianPostBox, true);
	    this.toggleVisibility(sendOrderButtonContainer, true);
	    this.toggleVisibility(sendOrderButton, true);
            break;
        case "COURIER_SERVICE":
        case "CDEK":
    	    this.toggleVisibility(addressContainer, true);
	    this.toggleVisibility(addressBox, true);            
	    this.toggleVisibility(sendOrderButtonContainer, true);
	    this.toggleVisibility(sendOrderButton, true);
   	    break;
            
        default:
            console.warn('Unknown delivery type:', this.deliveryType);
    }
 }


 AddressContainer(container) {
        const addressContainer = document.createElement("div");
        addressContainer.className = "address-container d-none";

        const addressContainerHeader = document.createElement("div");
        addressContainerHeader.className = "card-header";
        addressContainerHeader.innerHTML = `<h3 class="card-title">Укажите адрес доставки</h3>`;

        const addressContainerContent = document.createElement("div");
        addressContainerContent.className = "card-body";
        addressContainerContent.innerHTML = `<div class="address-body-container"></div>`;

        addressContainer.appendChild(addressContainerHeader);
        addressContainer.appendChild(addressContainerContent);
        let address =  new AddressManager(this);
	addressContainer.appendChild(address.createAddressesSection());
	container.appendChild(addressContainer);

// подключить обработчик
	const autocomplete = container.querySelector('#address');
		 autocomplete
		        .setUrl('/api/bff/client/v1/suggest/address?query=') // Установите URL для поиска
			.setPlaceholder('Введите данные для доставки - город, улицу, дом, квартиру...')
		        .onRequest(() => {
			   console.log('Запрос к API отправлен');
		        })
		        .onLoad((response) => {
		            console.log('Данные загружены', response);
		            if(!response.data) { 
				autocomplete.hideItemsBlock() 
			     } else {
		              (response?.data?.length == 0)
			        ? autocomplete.hideItemsBlock()
		                : response.data.forEach(item => {
		                   autocomplete.dropDownListItemDraw(item, item.fiasId, item.value);
		           });
			  }	
		        })
	        .onSelect((item) => {
              console.log('Выбран элемент', item);
            });
    }


 RussianPostAddressContainer(container) {
        const addressContainer = document.createElement("div");
        addressContainer.className = "russian-post-address-container d-none";

        const addressContainerHeader = document.createElement("div");
        addressContainerHeader.className = "card-header";
        addressContainerHeader.innerHTML = `<h3 class="card-title">Укажите адрес доставки, мы подберем ближайшее отделение</h3>`;

        const addressContainerContent = document.createElement("div");
        addressContainerContent.className = "card-body";
        addressContainerContent.innerHTML = `<div class="russian-post-address-body-container"></div>`;

        addressContainer.appendChild(addressContainerHeader);
        addressContainer.appendChild(addressContainerContent);
        let address =  new AddressManager(this);
	addressContainer.appendChild(address.createAddressesSection());
	container.appendChild(addressContainer);

// подключить обработчик
	const autocomplete = container.querySelector('#address');
		 autocomplete
		        .setUrl('http://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/postal_unit') // Установите URL для поиска
			.setPlaceholder('Введите данные для доставки - город, улицу, дом, квартиру...')
		        .onRequest(() => {
			   console.log('Запрос к API отправлен');
		        })
		        .onLoad((response) => {
		            console.log('Данные загружены', response);
		            if(!response.data) { 
				autocomplete.hideItemsBlock() 
			     } else {
		              (response?.data?.length == 0)
			        ? autocomplete.hideItemsBlock()
		                : response.data.forEach(item => {
		                   autocomplete.dropDownListItemDraw(item, item.fiasId, item.value);
		           });
			  }	
		        })
	        .onSelect((item) => {
              console.log('Выбран элемент', item);
            });
    }

/**
* Attaches a click handler to the "Create Order" button.
*/
  attachCreateOrderButtonHandler(button) {
    const o = this;

    button.addEventListener("click", function () {
     // Блокируем кнопку
     button.disabled = true;
     button.textContent = "Создание...";

     const webRequest = new WebRequest();
     o.referenceId = o.common.uuid();

     webRequest
       .post(o.api.createOrderMethod(), { referenceId: o.referenceId }, false)
       .then((data) => {
        console.log("Заказ успешно создан:", data);
        const order = new OrderDto(data.order);
        if (!order) throw new Error("Object order is null");
          order.saveToLocalStorage(o.referenceId);
              window.location.href = `/orders/delivery/${o.referenceId}`;
                })
                .catch((error) => {
                    console.error("Ошибка при создании заказа:", error);

                    if (error.status === 409) {
                        window.location.href = "/orders/payment/availability-error";
                    } else {
                        window.location.href = "/orders/create-error";
                    }
                })
                .finally(() => {
                    // Разблокируем кнопку независимо от результата
                    button.disabled = false;
                    button.textContent = "Создать заказ";
                });
        });
    }

    attachDeliveryOrderButtonHandler(button){
      button.addEventListener("click", function () {
        // Блокируем кнопку
        button.classList.add('d-none');
        button.textContent = "Создание...";
        const deliveryContainer = document.querySelector(".container.delivery");
	 if (deliveryContainer) 
        	deliveryContainer.classList.remove('d-none');

        const deliveryBox = document.querySelector(".delivery-container");
	 if (deliveryBox) 
        	deliveryBox.classList.remove('d-none');
      });
    }    

    attachAddressOrderButtonHandler(button){
      button.addEventListener("click", function () {
        // Блокируем кнопку
        button.disabled = true;
        button.textContent = "Создание...";

        let o = this;
        const addressContainer = document.createElement("div");
        addressContainer.className = "card card-container";

        const addressContainerHeader = document.createElement("div");
        addressContainerHeader.className = "card-header";
        addressContainerHeader.innerHTML = `<h3 class="card-title">Адреса доставки</h3>`;

        const addressContainerContent = document.createElement("div");
        addressContainerContent.className = "card-body";
        addressContainerContent.innerHTML = `<div class="address-body-container"></div>`;

        addressContainer.appendChild(addressContainerHeader);
        addressContainer.appendChild(addressContainerContent);

        button.disabled = false;
        button.textContent = "Отправить заказ";
      });
    }    


}
