const CDEK_CHOICE_ADDRESS_DESCRIPTION =  'Выберите адрес CDEK из списка или введите новый';
const DELIVERY_ADDITIONAL_INFO = 'Дополнительная информация для службы доставки';
const DELIVERY_ADDRESS_INSTRUCTIONS = 
  'В разделе «Укажите адрес доставки» введите регион, город и улицу - система автоматически покажет ближайшие отделения';
const BASKET_TITLE = 'Ваша корзина';
const EMPTY_CART_MESSAGE = 'В корзине пока пусто';
const EMPTY_CART_SUBTEXT = 'Зайдите в каталог, чтобы выбрать товары или найти нужное в поиске';
const GO_TO_CATALOG_TEXT = 'Перейти в каталог';
const CHECKOUT_BUTTON_TEXT = 'Перейти к оформлению заказа';
const SEND_ORDER = "Отправить заказ";
const DELIVERY_TYPE_TITLE = 'Выберите тип доставки';
const POSTAMAT_ADDRESS_PROMPT = 'Укажите адрес постамата';
const DELIVERY_ADDRESS_PROMPT = 'Укажите адрес доставки';
const POST_OFFICE_PROMPT = 'Укажите почтовое отделение';
const CREATE_ORDER = "Создать заказ";
const DELIVERY_ADDRESS_PLACEHOLDER = 'Введите данные для доставки - город, улицу, дом, квартиру...';
const CREATING_MESSAGE = "Создание...";
const DELIVERY_ADDRESSES = "Адреса доставки";


class BasketSection extends PageBuilder {
    constructor(containerId) {
        super(containerId);
        this.api = new WebAPI();
        this.common = new CommonFunctions();
        this.deliveryType = null;
	this.addressId = null;
	this.russianPostManager = null;
    }


    createContainer( element = null, elementClass = null, textContent = null, innerHTML = null){
	if(!element) return;
        const _container = document.createElement(element);
	if(elementClass) 
        _container.className = elementClass;
	if(textContent) 
	_container.textContent = textContent;
	if(innerHTML) 
	_container.innerHTML = innerHTML;
	return _container;
    }

    /**
     * Generates the Basket section module.
     */
    BasketCardContainer(totalQuantity = 0, totalAmount = 0, data) {
        let o = this;
	
        this.BasketContainer 			= this.createContainer("div","container basket");
        this.BasketDeliveryContainer 		= this.createContainer("div", "container delivery d-none");
        this.BasketAddressContainer 		= this.createContainer("div","container address d-none");
        this.BasketRussianPostAddressContainer	= this.createContainer("div","container russian-postal-address d-none");
        this.BasketCommentaryContainer 		= this.createContainer("div","container commentary d-none");
        this.BasketSendOrderButtonContainer 	= this.createContainer("div","container send-order-button-container d-none");

	this.BasketBodyContainer(this.BasketContainer, totalQuantity, totalAmount);//	Сами товары 

        if (totalQuantity === 0) {
	  this.BasketTotalAmount(this.BasketContainer);
        } else {
   	    this.BasketContainerItog(this.BasketContainer, totalQuantity, totalAmount);
            this.DeliveryContainer(this.BasketDeliveryContainer); // Тип доставки
            this.RussianPostAddressContainer(this.BasketRussianPostAddressContainer); //  Адрес
            this.AddressContainer(this.BasketAddressContainer); //  Адрес
            this.CommentaryContainer(this.BasketCommentaryContainer); //  Комментарий пользователя
            this.SendOrderButtonContainer(this.BasketSendOrderButtonContainer); // Кнопка отправить заказ
        }
        this.addModule("Basket", this.BasketContainer);
        this.addModule("BasketDelivery", this.BasketDeliveryContainer);
        this.addModule("BasketAddress", this.BasketAddressContainer);
        this.addModule("BasketRussianPostDelivery", this.BasketRussianPostAddressContainer);
        this.addModule("BasketCommentary", this.BasketCommentaryContainer);
        this.addModule("BasketSendOrderButton",this.BasketSendOrderButtonContainer);

	this.addEventListeners();
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
           let amountElement   = document.querySelector(".basket-itog-sum");
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
        const BasketContainerHeader = this.createContainer("div", "card-header", null, 
	 `<h3 class="card-title">${(totalQuantity !== 0)  ? BASKET_TITLE  : EMPTY_CART_MESSAGE }</h3>`);
        const BasketContainerContent = this.createContainer("div", "card-body", null, `<div class="basket-body-container"></div>`);
        container.appendChild(BasketContainerHeader);
        container.appendChild(BasketContainerContent);
  }

  BasketTotalAmount(container){
        const BasketTotalAmountContainer = document.createElement("div");
         BasketTotalAmountContainer.innerHTML = `
		<div class="basket-empty-text text-center" style="padding: 1rem 0; font-size: 0.9rem;"> 
			${EMPTY_CART_SUBTEXT} 
		</div> 
		<div class="basket-button-container"> 
		<a href="/products/page" class="btn btn-lg btn-success w-100 create-order-btn">${GO_TO_CATALOG_TEXT}</a>
	   </div> `;
         container.appendChild(BasketTotalAmountContainer);
  }

  BasketContainerItog(container, totalQuantity, totalAmount){
            const BasketContainerItog =  this.createContainer("div", "card-itog-body-container", null,  `
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
            </div>`);

            const BasketContainerCreateOrderButton = this.createContainer("div","card-created-order-button-container");
            const createOrderButton = this.createContainer("button",
		"btn btn-lg btn-success w-100 create-order-btn",
		`${CHECKOUT_BUTTON_TEXT}`);// Создаем кнопку
            BasketContainerCreateOrderButton.appendChild(createOrderButton);

            container.appendChild(BasketContainerItog);          
            container.appendChild(BasketContainerCreateOrderButton);
	    this.attachDeliveryOrderButtonHandler(createOrderButton);

  }

  SendOrderButtonContainer(container){
            const sendOrderButton = this.createContainer("button", "btn btn-lg btn-success w-100 send-order-btn d-none  disabled mt-4",`${SEND_ORDER}`);
            container.appendChild(sendOrderButton);          
	    sendOrderButton.addEventListener("click", this.sendOrderButtonOnClick.bind(this));
  }


// элементы 
    _russianPostContainer(){ return document.querySelector(".container.russian-postal-address") ?? null};
    _russianPostBox(){	    return document.querySelector(".russian-post-address-container") ?? null};
    _addressContainer(){     return document.querySelector(".container.address") ?? null};
    _addressBox(){	    return document.querySelector(".address-container") ?? null};
    _sendOrderButtonContainer(){
			return document.querySelector(".send-order-button-container") ?? null};
    _sendOrderButton(){	return document.querySelector(".send-order-btn") ?? null};
    _descriptionBox(){	return document.querySelector(".delivery-description-box") ?? null};
    _commentaryBox(){ 	return document.querySelector(".container.commentary") ?? null};
    _getDefaltDeliveryAddress(){ 
	let  isDefault= this.addressId ?? null;
	return isDefault ? true : false;
    }

  OrderParameterValidator(){
   // Обработка разных типов доставки
   
    switch(this.deliveryType) {
        case "SELF_DELIVERY"  : return  true;
        case "PARCEL_LOCKER"  : return  this._getDefaltDeliveryAddress() ? true :  false;
        case "RUSSIAN_POST"   : return  this._getDefaltDeliveryAddress() ? true :  false;
        case "COURIER_SERVICE": return  this._getDefaltDeliveryAddress() ? true :  false;
        case "CDEK": return  this._getDefaltDeliveryAddress() ? true :  false;
    }
    return false;
  }
  

  DeliveryTypeContainer(containerClass, extClass = '', text = '', decription = '', onClick = null ) {
        const 	_aContainerContent = this.createContainer("div", `w-50 ${containerClass}`);
	      	_aContainerContent.setAttribute('delivery-type', containerClass);
        	_aContainerContent.setAttribute('delivery-description', decription);

        const aContainerContent = this.createContainer("div","delivery-type-btn btn btn-block btn-light btn-lg w-100 m-1");
	const deliverySelfTypeContainerContent = this.createContainer("i", extClass);
	const deliverySelfTextContainerContent = this.createContainer("div", 'delivery-type-btn-title',text);

	aContainerContent.appendChild(deliverySelfTypeContainerContent);
	aContainerContent.appendChild(deliverySelfTextContainerContent);
	_aContainerContent.appendChild(aContainerContent);

	if(onClick)
	    _aContainerContent.addEventListener("click", ()=>onClick(_aContainerContent));
	return _aContainerContent;
  }

  getDeliveryTypes(){
    let types =  new WebRequest().get(this.api.getDeliveryTypesMethod(), {}, true)
    return (!types ? null : types)
  }

  DeliveryContainer(container) {
	this.deliveryTypes = this.getDeliveryTypes();
        const deliveryContainer = this.createContainer("div","delivery-container d-none");
        const deliveryContainerHeader = this.createContainer("div","card-header",null,`<h3 class="card-title">${DELIVERY_TYPE_TITLE}</h3>`);
        const deliveryContainerContent = this.createContainer("div", "card-body");
        const deliveryBodyContainerContent = this.createContainer("div", "deliveryBodyContainerContent");

        deliveryContainerContent.appendChild(deliveryBodyContainerContent);
        deliveryContainer.appendChild(deliveryContainerHeader);
        deliveryContainer.appendChild(deliveryContainerContent);

        const deliveryHotKeyContainer = this.createContainer("div","row pb-4");
        this.deliveryTypes.types.forEach((delivery, index) => {
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
        const deliveryDescriptionBoxContainer = this.createContainer("div","delivery-description-box d-none");
        deliveryContainer.appendChild(deliveryDescriptionBoxContainer);
        container.appendChild(deliveryContainer);
   }


   toggleVisibility(element, show){
    if (!element) return;
    element.classList.add(   !show ? 'd-none' : 'd-block');
    element.classList.remove(!show ? 'd-block': 'd-none');
   };


  UpdateSendButtonStatus(){ 
     const sendOrderButton = this._sendOrderButton();
     if(!sendOrderButton) return false;
     console.log(`UpdateSendButtonStatus=>`, this,this.OrderParameterValidator(),sendOrderButton);	
     switch(this.OrderParameterValidator()){
	case true: 
	   sendOrderButton.classList.remove('disabled');
	   break;
	default:
	   sendOrderButton.classList.add('disabled');
     }
  } 


 
  DeliveryTypeContainerOnClick(container) {
    // Получаем тип доставки
    this.deliveryType = container?.getAttribute('delivery-type');
    const description = container?.getAttribute('delivery-description');
    console.log('Selected delivery type:', this);
    
// заголовок для адресной секции
    this._descriptionBox().innerText = description;
   
// Удаляем класс selected у всех элементов доставки
      document.querySelectorAll('.delivery-type-btn.selected').forEach(el => {el.classList.remove('selected')});

// Добавляем класс selected к выбранному элементу
       container.querySelector('.delivery-type-btn').classList.add('selected');

// Скрываем несколько элементов (false)
	[
	    this._russianPostContainer(),
	    this._russianPostBox(),
	    this._addressContainer(),
	    this._addressBox(),
	    this._sendOrderButtonContainer(),
	    this._sendOrderButton(),
	    this._descriptionBox()
	].forEach(el => this.toggleVisibility(el, false));

// Показываем комментарий (true)
	this.toggleVisibility(this._commentaryBox(), true);

// Показываем кнопку отправки (true)
	this.toggleVisibility(this._sendOrderButtonContainer(), true);
	this.toggleVisibility(this._sendOrderButton(), true);

// Маппинг типов доставки на их действия
	const deliveryActions = {
	    SELF_DELIVERY: () => {
	        this.toggleVisibility(this._descriptionBox(), true);
	    },
	    PARCEL_LOCKER: () => {
	        this._showAddress(POSTAMAT_ADDRESS_PROMPT);
	    },
	    RUSSIAN_POST: () => {
	        this._showAddress();
	        this.toggleVisibility(this._russianPostContainer(), true);
	        this.toggleVisibility(this._russianPostBox(), true);
	    },
	    COURIER_SERVICE: () => {
	        this._showAddress();
	    },
	    CDEK: () => {
	        this._showAddress(CDEK_CHOICE_ADDRESS_DESCRIPTION); 
	    }
	};
        this.address.update();
// Выполняем действие по типу доставки
	(deliveryActions[this.deliveryType] || (() => {
	    console.warn('Unknown delivery type:', this.deliveryType);
	}))();
 }

  _showAddress(headerText=null){
     const addressContainerHeader = this._addressContainer()?.querySelector("h3.card-title");
     addressContainerHeader.innerHTML = DELIVERY_ADDRESS_PROMPT;

     this.toggleVisibility(this._addressContainer(), true);
     this.toggleVisibility(this._addressBox(), true);
     this.toggleVisibility(this._descriptionBox(), true);
     if (headerText) addressContainerHeader.innerHTML = headerText;
   };


// комментарий пользователя
 CommentaryContainer(container) {
        const commentaryContainer = this.createContainer("div", "commentary-container");
        const commentaryContainerHeader = this.createContainer("div", "card-header", null, `<h3 class="card-title">${DELIVERY_ADDITIONAL_INFO}</h3>`);
        const commentaryContainerContent = this.createContainer("div", "card-body", null, `<div class="commentary-body-container"></div>`);
        const commentaryTextAreaContainerContent = this.createContainer("div", "w-100 pt-2", null, `<textarea class="commentary-body-textarea-box p-2" rows=5 placeholder="Добавьте ваш комментарий"></textarea>`);
        commentaryContainer.appendChild(commentaryContainerHeader);
        commentaryContainer.appendChild(commentaryContainerContent);
        commentaryContainer.appendChild(commentaryTextAreaContainerContent);
	container.appendChild(commentaryContainer);
 }
 
  refreshAddressContainer(container){
        const addressCardContainer   = document.querySelector(".addresses-card-container");
  }


 AddressContainer(container) {
        const addressContainer = this.createContainer("div", "address-container d-none");
        const addressContainerHeader = this.createContainer("div", "card-header", null, `<h3 class="card-title">${DELIVERY_ADDRESS_PROMPT}</h3>`);
        const addressContainerContent = this.createContainer("div", "card-body", null, `<div class="address-body-container"></div>`);
        addressContainer.appendChild(addressContainerHeader);
        addressContainer.appendChild(addressContainerContent);

        this.address =  new AddressManager(this, true);
	addressContainer.appendChild(this.address.createAddressesSection());
	container.appendChild(addressContainer);
    }

 RussianPostAddressContainer(container) {
        const RussianPostAddressContainer = this.createContainer("div","russian-post-address-container d-none");
        const RussianPostAddressContainerHeader = this.createContainer("div", "card-header", null, `<h3 class="card-title">${POST_OFFICE_PROMPT}</h3>`);
        const RussianPostAddressContainerContent = this.createContainer("div", "card-body", null,  `<div class="russian-post-address-body-container"></div>`);

        const RussianPostAddressContainerDecription = this.createContainer("div", "delivery-description-box",
	 DELIVERY_ADDRESS_INSTRUCTIONS 
	);

	this.russianPostManager = new RussianPostManager();
         RussianPostAddressContainer.appendChild(RussianPostAddressContainerHeader);
    	 RussianPostAddressContainer.appendChild(RussianPostAddressContainerDecription);
    	 RussianPostAddressContainer.appendChild(RussianPostAddressContainerContent);
         RussianPostAddressContainer.appendChild(this?.russianPostManager?.createRussianPostalUnitsSection());
  	 container.appendChild(RussianPostAddressContainer);
    }


/************************************ Обработка шины событий  ************************************/
  addEventListeners() {
    if (typeof eventBus === 'undefined') {
        console.error('eventBus undefined');
        return;
    }

    const eventHandlers = {    // Define event handlers in a more maintainable way
        [EVENT_SET_DEFAULT_DELIVERY_ADDRESS]: (message) => {
            console.log(EVENT_SET_DEFAULT_DELIVERY_ADDRESS, message);
            this.addressId = message?.addressId || null;
	    let query = message.value ? message.value : null;
	    let latlng = message?.o?.latitude && message?.o?.longitude 
		? { lat : message?.o?.latitude, lon: message?.o?.longitude, radius_meters: 1000 }
		: null;			
	    console.log(query, latlng);
            this.russianPostManager.update(query, latlng);
            this.UpdateSendButtonStatus();
        },
        [EVENT_BASKET_ITEM_UPDATE]: (message) => {
            console.log(EVENT_BASKET_ITEM_UPDATE, message);
            this.basketUpdate(message);
            this.UpdateSendButtonStatus();
        },
        [EVENT_RELOAD_ADDRESS_DIALOG]: (message) => {
            console.log(EVENT_RELOAD_ADDRESS_DIALOG, message);
            this.addressId = message ? message.addressId : null;
	    let query = message.value ? message.value : null;
	    let latlng = message?.o?.latitude && message?.o?.longitude 
		? { lat : message?.o?.latitude, lon: message?.o?.longitude, radius_meters: 1000 }
		: null;			
	    console.log(query, latlng);
            this.russianPostManager.update(query, latlng);
            this.UpdateSendButtonStatus();
        },
        [EVENT_POSTAL_UNIT_UPDATE]: (message) => {
            console.log(EVENT_POSTAL_UNIT_UPDATE, message);
            this.russianPostManager = message ? this.russianPostManager : null;
	    this.russianPostManager.postCode = message.postCode;
            this.UpdateSendButtonStatus();
        }
    };
    
    Object.entries(eventHandlers).forEach(([event, handler]) => { // Register all event handlers
        eventBus?.on(event, handler.bind(this));
    });

    let o = this;    // Initialize autocomplete if element exists
    const initAutocomplete = () => {
        const autocomplete = this.BasketAddressContainer?.querySelector('#address');
        if (!autocomplete) return;
        autocomplete
            .setUrl(`${o.api.getClientAddressMethod()}?query=`)
            .setPlaceholder(DELIVERY_ADDRESS_PLACEHOLDER)
            .onRequest(() => console.log('Request sended...'))
            .onLoad((response) => {
                if (!response.data || response.data.length === 0) {
                    autocomplete.hideItemsBlock();
                } else {
                    response.data.forEach(item => {
                        autocomplete.dropDownListItemDraw(item, item.fiasId, item.value);
                    });
                }
            })
            .onSelect((item) => console.log('Выбран элемент', item));
    };

    initAutocomplete();
}


    sendEvent(event, o){
      console.log(`eventBus.${event}`,o);
	if(eventBus)    
	  eventBus.emit(event, o);
    }

/*  Обработка кнопок */
/*  Attaches a click handler to the "Create Order" button. */
  attachCreateOrderButtonHandler(button) {
    const o = this;
    button.addEventListener("click", function () {  // Блокируем кнопку
     o.referenceId = o.common.uuid();
     button.disabled = true;
     button.textContent = CREATING_MESSAGE;
     new WebRequest()
       .post(o.api.createOrderMethod(), { referenceId: o.referenceId }, false)
       .then((data) => {
        const order = new OrderDto(data.order);
        if (!order) throw new Error("Object order is null");
          order.saveToLocalStorage(o.referenceId);
           window.location.href = `/orders/delivery/${o.referenceId}`;
           }).catch((error) => {
             if (error.status === 409) {
                window.location.href = "/orders/payment/availability-error";
              } else {
                window.location.href = "/orders/create-error";
              }
           }).finally(() => {
             // Разблокируем кнопку независимо от результата
             button.disabled = false;
             button.textContent = CREATE_ORDER;
           });
        });
    }

   attachDeliveryOrderButtonHandler(button){
      button.addEventListener("click", function () {  // Блокируем кнопку
        button.classList.add('d-none');
        button.textContent = CREATING_MESSAGE;
        const deliveryContainer = document.querySelector(".container.delivery");
	if (deliveryContainer) deliveryContainer.classList.remove('d-none');

        const deliveryBox = document.querySelector(".delivery-container");
	if (deliveryBox) deliveryBox.classList.remove('d-none');
      });
    }    

    attachAddressOrderButtonHandler(button){
      button.addEventListener("click", function () {        
        button.disabled = true; // Блокируем кнопку
        button.textContent = CREATING_MESSAGE;

        const addressContainer = this.createContainer("div", "card card-container");
        const addressContainerHeader = this.createContainer("div", "card-header", null, `<h3 class="card-title">${DELIVERY_ADDRESSES}</h3>`);
        const addressContainerContent = this.createContainer("div", "card-body", null, `<div class="address-body-container"></div>`);

        addressContainer.appendChild(addressContainerHeader);
        addressContainer.appendChild(addressContainerContent);

        button.disabled = false;
        button.textContent = SEND_ORDER;
      });
    }    

   getRussianPostalUnitRequestHandler() {
       const webRequest = new WebRequest();
        webRequest
        .post(o.api.createOrderMethod(), { referenceId: o.referenceId }, false)
        .then((data) => {
        const order = new OrderDto(data.order);
        if (!order) throw new Error("Object order is null");
          order.saveToLocalStorage(o.referenceId);
              window.location.href = `/orders/delivery/${o.referenceId}`;
                })
                .catch((error) => {
                    console.error(error);
                    if (error.status === 409) {
                        window.location.href = "/orders/payment/availability-error";
                    } else {
                        window.location.href = "/orders/create-error";
                    }
                })
                .finally(() => {
                    // Разблокируем кнопку независимо от результата
                    button.disabled = false;
                    button.textContent = CREATE_ORDER;
         });
  }

  sendOrderButtonOnClick(){
            console.log(this);
  }

}
