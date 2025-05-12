const BASKET_TITLE 		= 'Ваша корзина';
const EMPTY_CART_MESSAGE 	= 'В корзине пока пусто';
const EMPTY_CART_SUBTEXT 	= 'Зайдите в каталог, чтобы выбрать товары или найти нужное в поиске';
const GO_TO_CATALOG_TEXT 	= 'Перейти в каталог';
const CHECKOUT_BUTTON_TEXT 	= 'Перейти к оформлению заказа';
const DELIVERY_TYPE_TITLE 	= 'Выберите тип доставки';
const DELIVERY_TYPE_INFO 	= 'Доставка';
const DELIVERY_SELF_INFO 	= 'Самостоятельно заберу в ПВЗ или в торговой организации';
const DELIVERY_COURIER_INFO     = 'Доставка курьером';

const POSTAMAT_ADDRESS_PROMPT 	= 'Укажите адрес постамата';
const POSTAMAT_ADDRESS_INFO 	= 'Адрес постамата';
const CDEK_ADDRESS_INFO       	= 'Адрес филиала CDEK';

const DELIVERY_ADDRESS_PROMPT 	= 'Укажите адрес доставки';
const POST_OFFICE_PROMPT      	= 'Укажите почтовое отделение';
const POST_OFFICE_INFO      	= 'Адрес почтового отделения';

const CREATE_ORDER 		= "Создать заказ";
const AUDIT_ORDER 		= "Проверить заказ";
const SEND_ORDER 		= "Отправить заказ";

const CREATING_MESSAGE 		= "Создание...";
const DELIVERY_ADDRESSES 	= "Адреса доставки";
const DELIVERY_ADDRESS_PLACEHOLDER 	= 'Введите данные для доставки - город, улицу, дом, квартиру...';
const DELIVERY_ADDITIONAL_INFO 		= 'Дополнительная информация к заказу';
const CDEK_CHOICE_ADDRESS_DESCRIPTION 	= 'Укажите адрес CDEK из списка или введите новый';
const DELIVERY_ADDRESS_INSTRUCTIONS 	= 'В разделе «Укажите адрес доставки» введите регион, город и улицу - система автоматически покажет ближайшие отделения';
const CREATE_ORDER_ERROR_PAGE 		= '/orders/create-error';
const UNDEFINED  = 'не опеределено'; 
const NO_COMMENTARY  = 'Нет дополнительной информации к заказу' ;
const AUDIT_ORDER_TITLE  = 'Дополнительная информация к заказу' ;

const RECIPIENT_NAME_INFO  = 'Получатель';
const RECIPIENT_PHONE_INFO = 'Контактный номер';
const CHANGE_LINK_INFO = 'Хочу внести изменения!'


class BasketSection extends PageBuilder {
    constructor(containerId) {
        super(containerId);
        this.api = new WebAPI();
        this.common = new CommonFunctions();
        this.deliveryType = null;
	this.addressId = null;
	this.russianPostManager = null;
	this.person = null;
	this.referenceId = null;
    }

    loadProfile(){
     try{
        this.person = new WebRequest().get(this.api?.getShopProfileMethod(), {}, true );
        }catch(error) {
	console.log('error load profile...');
     }
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
     * Generates the Basket section module.
     */
    BasketCardContainer(totalQuantity = 0, totalAmount = 0, data) {
        let o = this;
	
        this.BasketContainer 			= this.createContainer("div","card container basket");
        this.BasketDeliveryContainer 		= this.createContainer("div", "card container delivery d-none");
        this.BasketAddressContainer 		= this.createContainer("div","card container address d-none");
        this.BasketRussianPostAddressContainer	= this.createContainer("div","card container russian-postal-address d-none");
        this.BasketCommentaryContainer 		= this.createContainer("div","card container commentary d-none");
        this.BasketAuditOrderButtonContainer 	= this.createContainer("div","container audit-order-button-container d-none");
        this.BasketSendOrderButtonContainer 	= this.createContainer("div","container send-order-button-container d-none");
        this.BasketPreAuditWorksheetContainer 	= this.createContainer("div","card container pre-audit-worksheet-container d-none");

	this.BasketBodyContainer(this.BasketContainer, totalQuantity, totalAmount);//	Сами товары 

        if (totalQuantity === 0) {
	  this.BasketTotalAmount(this.BasketContainer);
        } else {
   	    this.BasketContainerItog(this.BasketContainer, totalQuantity, totalAmount);
            this.DeliveryContainer(this.BasketDeliveryContainer); // Тип доставки
            this.RussianPostAddressContainer(this.BasketRussianPostAddressContainer); //  Адрес
            this.AddressContainer(this.BasketAddressContainer); //  Адрес
            this.CommentaryContainer(this.BasketCommentaryContainer); //  Комментарий пользователя
            this.PreAuditWorksheetContainer(this.BasketPreAuditWorksheetContainer);  // проверочная ведомость
            this.AuditOrderButtonContainer(this.BasketAuditOrderButtonContainer); // Кнопка проверить заказ
            this.SendOrderButtonContainer(this.BasketSendOrderButtonContainer); // Кнопка отправить заказ
        }

        this.addModule("Basket", this.BasketContainer);
        this.addModule("BasketDelivery", this.BasketDeliveryContainer);
        this.addModule("BasketAddress", this.BasketAddressContainer);
        this.addModule("BasketRussianPostDelivery", this.BasketRussianPostAddressContainer);
        this.addModule("BasketCommentary", this.BasketCommentaryContainer);
        this.addModule("PreAuditWorksheet", this.BasketPreAuditWorksheetContainer);
        this.addModule("BasketAuditOrderButton",this.BasketAuditOrderButtonContainer);
        this.addModule("BasketSendOrderButton",this.BasketSendOrderButtonContainer);

	this.addEventListeners();
	this.loadProfile();
	this.referenceId =  this.common.uuid(); // создали идентпотентый идентификатор
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
		<div class="basket-empty-text text-center" style="padding: 1rem 0; font-size: 0.9rem;"> ${EMPTY_CART_SUBTEXT}</div> 
		<div class="basket-button-container"><a href="/products/page" class="btn btn-lg btn-success w-100 create-order-btn">${GO_TO_CATALOG_TEXT}</a>
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

  AuditOrderButtonContainer(container){
            const auditOrderButton = this.createContainer("button", "btn btn-lg btn-warning w-100 audit-order-btn d-none disabled mt-4",`${AUDIT_ORDER}`);
            container.appendChild(auditOrderButton);          
	    auditOrderButton.addEventListener("click", 
		this.auditOrderButtonOnClick.bind(this)
	    );
  }

  SendOrderButtonContainer(container){
            const sendOrderButton = this.createContainer("button", "btn btn-lg btn-success w-100 send-order-btn d-none mt-4",`${SEND_ORDER}`);
            container.appendChild(sendOrderButton);          
	    sendOrderButton.addEventListener("click", 
		this.sendOrderButtonOnClick.bind(this)
	    );
  }



// элементы 
    _deliveryContainer(){ return document.querySelector(".container.delivery") ?? null};
    _russianPostContainer(){ return document.querySelector(".container.russian-postal-address") ?? null};
    _russianPostBox(){ return document.querySelector(".russian-post-address-container") ?? null};
    _addressContainer(){ return document.querySelector(".container.address") ?? null};
    _addressBox(){ return document.querySelector(".address-container") ?? null};
    _auditOrderButtonContainer(){ return document.querySelector(".audit-order-button-container") ?? null};
    _auditOrderButton(){ return document.querySelector(".audit-order-btn") ?? null};

    _sendOrderButtonContainer(){ return document.querySelector(".send-order-button-container") ?? null};
    _sendOrderButton(){ return document.querySelector(".send-order-btn") ?? null};

    _descriptionBox(){ return document.querySelector(".delivery-description-box") ?? null};
    _commentaryBox(){ return document.querySelector(".container.commentary") ?? null};
    _commentary(){ return document.querySelector(".commentary-body-textarea-box") ?? null};
    _auditContainer(){ return document.querySelector(".container.pre-audit-worksheet-container") ?? null};
    _auditBox(){ return document.querySelector(".audit-body-container") ?? null};

    _defaultDeliveryAddressExist(){ 
	let  isDefault= this.addressId ?? null;
	return isDefault ? true : false;
    }

    _russianPostalUnitCodeExist(){
	let  isDefault= this.russianPostManager.postCode ?? null;
	return isDefault ? true : false;
    }

  OrderParameterValidator(){
   // Обработка разных типов доставки
   
    switch(this.deliveryType) {
        case "SELF_DELIVERY"  : return  true;
        case "PARCEL_LOCKER"  : return  this._defaultDeliveryAddressExist() ? true :  false;
        case "RUSSIAN_POST"   : return  this._defaultDeliveryAddressExist() && this._russianPostalUnitCodeExist() ? true :  false;
        case "COURIER_SERVICE": return  this._defaultDeliveryAddressExist() ? true :  false;
        case "CDEK": return  this._defaultDeliveryAddressExist() ? true :  false;
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
     const auditOrderButton = this._auditOrderButton();
     if(!auditOrderButton) return false;
     console.log(`UpdateSendButtonStatus=>`, this, this.OrderParameterValidator(), auditOrderButton);	
     switch(this.OrderParameterValidator()){
	case true: 
	   auditOrderButton.classList.remove('disabled');
	   break;
	default:
	   auditOrderButton.classList.add('disabled');
     }
  } 


 
  DeliveryTypeContainerOnClick(container) {
    // Получаем тип доставки
    this.deliveryType = container?.getAttribute('delivery-type');
    const description = container?.getAttribute('delivery-description');
    console.log('Selected delivery type:', this);

// распахнуть секцию с адресами
    const dropdown = document.querySelector('dropdown-section');
    dropdown?.toggle(true);
    
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
	    this._auditOrderButtonContainer(),
	    this._auditOrderButton(),
	    this._descriptionBox()
	].forEach(el => this.toggleVisibility(el, false));

// Показываем комментарий (true)
	this.toggleVisibility(this._commentaryBox(), true);

// Показываем кнопку отправки (true)
	this.toggleVisibility(this._auditOrderButtonContainer(), true);
	this.toggleVisibility(this._auditOrderButton(), true);

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

  _getDeliveryType(o=null){
	if(!o) return;
	return this.deliveryTypes?.types?.find(type => type.code == o.deliveryType ) ?? UNDEFINED;
	}
  _getPostamat(o=null){
	if(!o) return;
	return this.address?.addresses?.find(address => address.addressId == o.addressId ) ?? UNDEFINED;
	}
  _getCdek(o=null){
	if(!o) return;
	return this.address?.addresses?.find(address => address.addressId == o.addressId ) ?? UNDEFINED;
	}
  _getAddress(o=null){
	if(!o) return;
	return this.address?.addresses?.find(address => address.addressId == o.addressId ) ?? UNDEFINED;
	}
  _getCourier(o=null){
	if(!o) return;
	return this.address?.addresses?.find(address => address.addressId == o.addressId ) ?? UNDEFINED;
	}
  _getPostCode(o=null){
	if(!o) return;
	return this.russianPostManager?.postCode ?? UNDEFINED;
	}
  _getPostAddress(o=null){
	if(!o) return;
	let _postCode = this._getPostCode(o);
	return this.russianPostManager?.postAddresses?.find(address => address.postalCode == _postCode ) ?? UNDEFINED;
	}
  _getCommentary(o=null){
	if(!o) return;
	return this._commentary()?.value.trim() !== '' ? this._commentary()?.value :  NO_COMMENTARY;
	}

  PreAuditWorksheetUpdate(container){
	let o = this;
 	const _deliveryType = this._getDeliveryType(o);
 	const _postamat = this._getDeliveryType(o);
 	const _cdek = this._getCdek(o);
 	const _address = this._getAddress(o);
 	const _courier = this._getCourier(o);
	const _postCode = this._getPostCode(o);
	const _postAddress = this._getPostAddress(o);
	const _commentary = this._getCommentary(o);

	const deliveryTypeHeader = container?.querySelector('.delivery-type-audit-header-container');
	const deliveryTypeBox = container?.querySelector('.delivery-type-audit-body-container');
	if(deliveryTypeBox && deliveryTypeHeader) deliveryTypeBox.innerText = _deliveryType.name;

	const postamatHeader = container?.querySelector('.delivery-postamat-audit-header-container');
	const postamatBox = container?.querySelector('.delivery-postamat-audit-body-container');
	if(postamatBox && postamatHeader) postamatBox.innerText = _postamat.value;

	const cdekHeader = container?.querySelector('.delivery-cdek-audit-header-container');
	const cdekBox = container?.querySelector('.delivery-cdek-audit-body-container');
	if(cdekBox && cdekHeader) cdekBox.innerText = _cdek.value;

	const courierAddressHeader = container?.querySelector('.delivery-courier-audit-header-container');
	const courierAddressBox = container?.querySelector('.delivery-courier-audit-body-container');
	if(courierAddressBox && cdekHeader) courierAddressBox.innerText = _courier.value;

	const postAddressHeader = container?.querySelector('.delivery-post-unit-audit-header-container');
	const postAddressBox = container?.querySelector('.delivery-post-unit-audit-body-container');
	if(postAddressBox && postAddressHeader) postAddressBox.innerText = `${_postAddress.postalCode}, ${_postAddress.value}`;

	const addressHeader = container?.querySelector('.delivery-address-audit-header-container');
	const addressBox = container?.querySelector('.delivery-address-audit-body-container');
	if(addressBox && addressHeader) addressBox.innerText = _address.value;

	const commentaryHeader = container?.querySelector('.commentary-audit-header-container');
	const commentaryBox = container?.querySelector('.commentary-audit-body-container');
	if(commentaryBox && commentaryHeader) commentaryBox.innerText = _commentary;       

	const recipientHeader = container?.querySelector('.recipient-audit-header-container');
	const recipientBox = container?.querySelector('.recipient-audit-body-container');
	if(recipientBox && recipientHeader) recipientBox.innerText = `${this.person.profile.name} ${this.person.profile.patronymic} ${this.person.profile.surname[0]}.`;

	const recipientPhoneHeader = container?.querySelector('.recipient-phone-audit-header-container');
	const recipientPhoneBox = container?.querySelector('.recipient-phone-audit-body-container');
	if(recipientPhoneBox && recipientPhoneHeader) recipientPhoneBox.innerText = `${this.person.profile.phone}`;

	const changeLinkButton = container?.querySelector('.change-link-audit-container');

// включаем нужные пункты 	
        this.toggleVisibility(deliveryTypeHeader, true);
        this.toggleVisibility(deliveryTypeBox, true);
        this.toggleVisibility(commentaryHeader, true);
        this.toggleVisibility(commentaryBox, true);
        this.toggleVisibility(recipientHeader, true);
        this.toggleVisibility(recipientBox, true);
        this.toggleVisibility(recipientPhoneHeader, true);
        this.toggleVisibility(recipientPhoneBox, true);
        this.toggleVisibility(changeLinkButton, true);

	const deliveryActions = {
	    SELF_DELIVERY: () => {
	    },
	    PARCEL_LOCKER: () => {
	        this.toggleVisibility(postamatHeader, true);
	        this.toggleVisibility(postamatBox, true);
	    },
	    RUSSIAN_POST: () => {
	        this.toggleVisibility(postAddressHeader, true);
	        this.toggleVisibility(postAddressBox, true);
	    },
	    COURIER_SERVICE: () => {
	        this.toggleVisibility(courierAddressHeader, true);
	        this.toggleVisibility(courierAddressBox, true);
	    },
	    CDEK: () => {
	        this.toggleVisibility(cdekHeader, true);
	        this.toggleVisibility(cdekBox, true);
	    }
	};
// Выполняем действие по типу доставки
	(deliveryActions[this.deliveryType] || (() => {
	    console.warn('Unknown delivery type:', this.deliveryType);
	}))();


  }

  PreAuditWorksheetContainer(container){ // проверочная ведомость
        const preAuditWorksheetBodyContainer  =  this.createContainer("div", "audit-container")
        const preAuditWorksheetBodyContainerHeader = this.createContainer("div", "card-header", null, `<h3 class="card-title">${AUDIT_ORDER_TITLE}</h3>`);
        const preAuditWorksheetBodyContainerContent = this.createContainer("div", "card-body", null, `<div class="audit-body-container"></div>`);
	preAuditWorksheetBodyContainer.appendChild(preAuditWorksheetBodyContainerHeader)
	preAuditWorksheetBodyContainer.appendChild(preAuditWorksheetBodyContainerContent)

        const deliveryTypeChoiceHeaderContainer =  this.createContainer("div", "delivery-type-audit-header-container d-none",DELIVERY_TYPE_INFO)
        const deliveryTypeChoiceBodyContainer =  this.createContainer("div", "delivery-type-audit-body-container d-none audit-worksheet-text text-right dotted small m-2")

        const deliveryPostamatAddressChoiceHeaderContainer =  this.createContainer("div", "delivery-postamat-audit-header-container d-none",POSTAMAT_ADDRESS_INFO)
        const deliveryPostamatAddressChoiceBodyContainer =  this.createContainer("div", "delivery-postamat-audit-body-container d-none audit-worksheet-text text-right dotted small m-2")

        const deliveryCdekAddressChoiceHeaderContainer =  this.createContainer("div", "delivery-cdek-audit-header-container d-none",CDEK_ADDRESS_INFO)
        const deliveryCdekAddressChoiceBodyContainer =  this.createContainer("div", "delivery-cdek-audit-body-container d-none audit-worksheet-text text-right dotted small m-2")

        const deliveryCourierAddressChoiceHeaderContainer =  this.createContainer("div", "delivery-courier-audit-header-container d-none",DELIVERY_COURIER_INFO)
        const deliveryCourierAddressChoiceBodyContainer =  this.createContainer("div", "delivery-courier-audit-body-container d-none audit-worksheet-text text-right dotted small m-2")

        const deliveryPostUnitAddressChoiceHeaderContainer =  this.createContainer("div", "delivery-post-unit-audit-header-container d-none",POST_OFFICE_INFO)
        const deliveryPostUnitAddressChoiceBodyContainer =  this.createContainer("div", "delivery-post-unit-audit-body-container d-none audit-worksheet-text text-right dotted small m-2")

        const deliveryAddressChoiceHeaderContainer =  this.createContainer("div", "delivery-address-audit-header-container d-none",DELIVERY_ADDRESSES)
        const deliveryAddressChoiceBodyContainer =  this.createContainer("div", "delivery-address-audit-body-container d-none audit-worksheet-text text-right dotted small m-2")

        const deliveryCommentaryChoiceHeaderContainer =  this.createContainer("div", "commentary-audit-header-container d-none", DELIVERY_ADDITIONAL_INFO)
        const deliveryCommentaryChoiceBodyContainer =  this.createContainer("div", "commentary-audit-body-container d-none audit-worksheet-text text-right dotted small m-2")

        const recipientHeaderContainer =  this.createContainer("div", "recipient-audit-header-container d-none", RECIPIENT_NAME_INFO)
        const recipientBodyContainer =  this.createContainer("div", "recipient-audit-body-container d-none audit-worksheet-text text-right dotted small m-2")

        const phoneHeaderContainer =  this.createContainer("div", "recipient-phone-audit-header-container d-none", RECIPIENT_PHONE_INFO)
        const phoneBodyContainer =  this.createContainer("div", "recipient-phone-audit-body-container d-none audit-worksheet-text text-right dotted small m-2")

        const changeLinkButtonContainer =  this.createContainer("div", "btn btn-block btn-outline-dark btn-lg mt-4 change-link-audit-container d-none", CHANGE_LINK_INFO)
        changeLinkButtonContainer.addEventListener("click",                     
		this.changeLinkButtonContainerOnClick.bind(this));

	preAuditWorksheetBodyContainerContent.appendChild(recipientHeaderContainer)
	preAuditWorksheetBodyContainerContent.appendChild(recipientBodyContainer)
	preAuditWorksheetBodyContainerContent.appendChild(phoneHeaderContainer)
	preAuditWorksheetBodyContainerContent.appendChild(phoneBodyContainer)

	preAuditWorksheetBodyContainerContent.appendChild(deliveryTypeChoiceHeaderContainer)
	preAuditWorksheetBodyContainerContent.appendChild(deliveryTypeChoiceBodyContainer)
	preAuditWorksheetBodyContainerContent.appendChild(deliveryPostamatAddressChoiceHeaderContainer)
	preAuditWorksheetBodyContainerContent.appendChild(deliveryPostamatAddressChoiceBodyContainer)
	preAuditWorksheetBodyContainerContent.appendChild(deliveryCdekAddressChoiceHeaderContainer)
	preAuditWorksheetBodyContainerContent.appendChild(deliveryCdekAddressChoiceBodyContainer)
	preAuditWorksheetBodyContainerContent.appendChild(deliveryCourierAddressChoiceHeaderContainer)
	preAuditWorksheetBodyContainerContent.appendChild(deliveryCourierAddressChoiceBodyContainer)
	preAuditWorksheetBodyContainerContent.appendChild(deliveryPostUnitAddressChoiceHeaderContainer)
	preAuditWorksheetBodyContainerContent.appendChild(deliveryPostUnitAddressChoiceBodyContainer)
	preAuditWorksheetBodyContainerContent.appendChild(deliveryAddressChoiceHeaderContainer)
	preAuditWorksheetBodyContainerContent.appendChild(deliveryAddressChoiceBodyContainer)
	preAuditWorksheetBodyContainerContent.appendChild(deliveryCommentaryChoiceHeaderContainer)
	preAuditWorksheetBodyContainerContent.appendChild(deliveryCommentaryChoiceBodyContainer)

	preAuditWorksheetBodyContainerContent.appendChild(changeLinkButtonContainer)

        container.appendChild(preAuditWorksheetBodyContainer);
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
     if(eventBus)  eventBus.emit(event, o);
    }

/*  Обработка кнопок */
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

  sendOrderButtonOnClick(){
   console.log(`sendOrderButtonOnClick`,this);
   let request = new WebRequest().post(this.api.createOrderMethod(),  
	{
	  referenceId : this.referenceId,
          deliveryType : this._getDeliveryType(this),
	  postamat : this._getDeliveryType(this),
	  cdek : this._getCdek(this),
	  address : this._getAddress(this),
	  courier : this._getCourier(this),
	  postCode : this._getPostCode(this),
	  postAddress : this._getPostAddress(this),
	  commentary : this._getCommentary(this)
	}, true );
   if(!request.ok) 
     console.log(request);
  }

  auditOrderButtonOnClick(){
       console.log(`auditOrderButtonOnClick`,this);
       this.toggleVisibility(this._deliveryContainer(), false);
       this.toggleVisibility(this._russianPostContainer(), false);
       this.toggleVisibility(this._russianPostBox(), false);
       this.toggleVisibility(this._addressContainer(), false);
       this.toggleVisibility(this._addressBox(), false);
       this.toggleVisibility(this._commentaryBox(), false);
       this.toggleVisibility(this._descriptionBox(), false);
       this.toggleVisibility(this._auditContainer(), true);
       this.PreAuditWorksheetUpdate(this._auditContainer());
       this.toggleVisibility(this._auditOrderButtonContainer(), false);
       this.toggleVisibility(this._auditOrderButton(), false);
       this.toggleVisibility(this._sendOrderButtonContainer(), true);
       this.toggleVisibility(this._sendOrderButton(), true);
  }


 changeLinkButtonContainerOnClick(){
	location.reload(true);
 }

}
