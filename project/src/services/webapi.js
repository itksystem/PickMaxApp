/* eslint-disable no-unused-vars */
/* eslint-disable unicorn/no-abusive-eslint-disable */
/*******************************************************************/
/* Класс агрегации web api методов 			   */
/* Sinyagin Dmitry rel.at 18.04.2024                               */
/*******************************************************************/

/* eslint-disable */

class WebAPI {

  constructor() {    
    this.PARAM_VALIDATION_FAILED_MESSAGE = `Parameter validation failed`;
    this.AUTH_VALIDATION_FAILED_MESSAGE = `Auth validation failed`;
    this.NO_PHOTO_IMAGE_URL = `/main/images/banners/no_photo_image.png`;
    this.ErrorMessage500 = `Упс! Что то пошло не так...`;
    this.OrderErrorTitle = `Заказ`;
    this._USER_REVIEW_FILE_UPLOAD_EVENT_ = 'review-file-upload';
    this._USER_PRODUCT_MAIL_FILE_UPLOAD_EVENT_ = 'product-mail-file-upload';
    this.PROFILE_CHANGE_DIGITAL_CODE = `/profile/change-digital-code/page`;
    this.PROFILE = `/profile/page`;
    this.PRODUCTS_PAGE = `/products/page`;
    this.PIN_CODE_LOGON_PAGE = `/pincode-logon`;
    return this
  }
 
 sendFileToGalleryMethod(shop_id = null, product_id = null){
   return ((shop_id == null && product_id == null) ? null : `/telegram/shop/${shop_id}/products/${product_id}/media/url`);
 }

 sendFileToGalleryMethodPayload() {
    if (!$("#product_image_url").val())  throw (this.PARAM_VALIDATION_FAILED_MESSAGE + ' => url');
    return { url: $("#product_image_url").val(),  _auth: window.Telegram.WebApp.initData   }; }
 
 getMediaFilesForProductCardMethod(shop_id=null, product_id = null){  
    return ((shop_id == null && product_id == null) 
	? null 
	: `/telegram/shop/${shop_id}/products/${product_id}/media`); }

 getMediaFilesForProductCardMethodPayload(){ 
    return {}; }

 deleteMediaFromProductCardMethod(shop_id=null, product_id = null, media_id = null ){
    return ((shop_id == null && product_id == null && media_id == null) 
	? null 
	: `/telegram/shop/${shop_id}/products/${product_id}/media/${media_id}`);  }

 mediaFilesForProductCardCheckedMethod(shop_id=null, product_id = null, media_id = null ){
   return ((shop_id == null && product_id == null && media_id == null) 
	? null 
	: `/telegram/shop/${shop_id}/products/${product_id}/media/${media_id}/checked`);  }

 mediaFilesForProductCardCheckedMethodPayload(media_id = null ){
   return (media_id == null) ? null : {url : media_id}; }

 getMediaSearchWordListMethod(searchWord = null){
   return (searchWord == null) 
	? null 
	: `/telegram/yandex/media/${searchWord}`; }

 mediaFileSendMethod(shop_id=null, product_id = null ){
   return ((shop_id == null || product_id == null ) 
	? null 
	: `/telegram/shop/${shop_id}/products/${product_id}/photo`);  }

 mediaFileSendMethodPayload(fb = null ){  return ((fb == null) ? null : fb);  }

 userPropertiesCountrySendMethod(){ return `/telegram/user/country`;  }

 userPropertiesCountrySendMethodPayload(country = null ){  return ((country == null) ? null : { country : country, _auth: window.Telegram.WebApp.initData  });  }

 userPropertiesCitySendMethod(){ return `/telegram/user/city`;  }
 userPropertiesCitySendMethodPayload(city = null, city_fias_id = null ){  return ((city == null && city_fias_id == null) ? null : { city : city, city_fias_id : city_fias_id, _auth: window.Telegram.WebApp.initData  });  }

 getUserCityMethod() { return `/telegram/user/city`;  }
 getUserCityMethodPayload() { return {};  }



 getCountriesMethod() {return `/telegram/countries`;};
 getCitiesMethod(value) {return `/telegram/cities?query=${value}`;};                                                              
 getShopMethod(shop_id = null) {return `/telegram/shop/${shop_id}/properties`;};
 getShopBasketOrdersMethod(shop_id = null, user_id = null) {
   return `/telegram/shop/${shop_id}/basket/${user_id}/orders`;
 };

 sendBasketCreateOrderMethod(shop_id = null, user_id = null) {
   return `/telegram/shop/${shop_id}/basket/${user_id}/create-order`;
 }

 sendBasketCreateOrderMethodPayload(){
   let CurrentUserId = new User().getCurrentUserId();
   let CurrentShopId = new CurrentShop().getCurrentShopId();	          
   let user = new User(CurrentUserId).get();
   console.log(user);
   let payload = {};
   payload.shop_id    = CurrentShopId;
   payload.user_id    = CurrentUserId;
   payload.user_delivery_address = $("#user_delivery_address").val();
   payload.user_delivery_phone   = $("#user_delivery_phone").val();
   payload.user_delivery_name    = $("#user_delivery_name").val();
   payload.user_recipient_phone  = $("#user_recipient_phone").val();
   payload.user_recipient_name   = $("#user_recipient_name").val();
   payload.user_recipient_address= $("#user_recipient_address").val();
   payload.order_message = $("#order_message").val();

   return {
     shop_id    : CurrentShopId,
	   user_id    : CurrentUserId,
	   user_delivery_address : $("#user_delivery_address").val(),
	   user_delivery_phone   : $("#user_delivery_phone").val(),
	   user_delivery_name    : $("#user_delivery_name").val(),
	   user_recipient_phone  : $("#user_recipient_phone").val(),
	   user_recipient_name   : $("#user_recipient_name").val(),
	   user_recipient_address: $("#user_recipient_address").val(),
	   order_message : $("#order_message").val()
	};
   }


   sendShopCreateMethod(){ return `/telegram/shop/create`; }
   sendShopCreatePayload(template_id){
    let CurrentUserId = new User().getCurrentUserId();
    let CurrentShopId = new CurrentShop().getCurrentShopId();	          
    let user = new User(CurrentUserId).get();
    console.log(user);
	return { 
	   template_id    : template_id,
           shop_id    : CurrentShopId,
	   user_id    : CurrentUserId,
	   user_delivery_address : $("#user_delivery_address").val(),
	   user_delivery_phone   : $("#user_delivery_phone").val(),
	   user_delivery_name    : $("#user_delivery_name").val(),
           user_recipient_phone  : $("#user_recipient_phone").val(),
	   user_recipient_name   : $("#user_recipient_name").val(),
	   user_recipient_address: $("#user_recipient_address").val(),
	   order_message: $("#order_message").val()
	  }
     }
   deleteShopBasketApplicationMethod(shop_id = null, user_id = null){ return `/telegram/shop/${shop_id}/basket/${user_id}/remove`; }
   deleteShopBasketApplicationPayload(order_id){  return { order_id : order_id} }
   getCurrentShopBasketCountMethod(shop_id, user_id){ return `/telegram/shop/${shop_id}/basket/${user_id}/basket-counter`; }

   saveShopUserProfileMethod() { return `/telegram/user/profile`;  }
   saveShopUserProfileMethodPayload(params = null) {
    if(!params) throw('Нет параметров в saveShopUserProfileMethodPayload');
    let CurrentUserId = new User().getCurrentUserId();
    let CurrentShopId = new CurrentShop().getCurrentShopId();	          
    let user = new User(CurrentUserId).get();
    console.log(user);
    return { 
	          user_id 		 : params.user_id,
		  user_delivery_name 	 : params.user_delivery_name,
  		  user_delivery_phone 	 : params.user_delivery_phone,
		  user_delivery_address  : params.user_delivery_address,
		  shop_id 		 : params.shop_id,
		  shop_theme 		 : params.shop_theme,
		  shop_showcase_columns  : params.shop_showcase_columns,
	  	  shop_payment_description : params.shop_payment_description
	 };

}

  getShopCategoriesMethod(){ return `/telegram/shop/categories`;  }
  getShopCategoriesMethodPayload() { return {};  }
  getShopCategoryLoadMethod(){ return `/telegram/shop/list`;  }
  getShopCategoryLoadPayloadMethod(params){ 
	return { 
	category_id : category_id,
	page : page,
	limit : limit
    }
   }

   setProductRaiseMethod(shopId=null, cardId=null ){ return `/telegram/shop/${shopId}/products/${cardId}/raised`;  } 
   setProductRaiseMethodPayload(product_id = null){
     return  {product_id  : product_id};
   }  

   saveShopLogisticMethod(shopId=null){ return `/telegram/shop/${shopId}/logistic`} 
   saveShopLogisticMethodPayload(description){	return { description : description  }    } 
 
   getShopMessagesCountMethod(shopId = null, userId = null){ return `/telegram/shop/${shopId}/profile/${userId}/message-counter`}
   getShopMessagesCountMethodPayload(){ return {} }

   getShopOrdersListMethod(shopId = null, userId = null, status ='active'){ return `/telegram/shop/${shopId}/orders/${userId}/list?status=${status}` }
   getShopOrdersListMethodPayload(){ return {} }

   sendShopApplicationMessageMethod(shopId = null, applicationId = null){return `/telegram/shop/${shopId}/orders/${applicationId}/publish` }
   sendShopApplicationMessageMethodPayload(application_id = null, chat_id = null, message = null){
	return    { 
		  application_id  : application_id,
		  chat_id         : chat_id,
	          message         : message
	 }
   }

   getShopApplicationMethod(shop_id = null, application_id = null){return `/telegram/shop/${shop_id}/orders/${application_id}` }
//   getShopOrderMethodPayload(){ return {} }

   saveShopGalleryPhotoMethod(shopId){ return `/telegram/shop/${shopId}/gallery/photo`}
   saveShopGalleryPhotoMethodPayload(fd = null){ return fd;}

   deleteShopGalleryPhotoMethod(shop_id = null, photo_id = null){ return `/telegram/shop/${shop_id}/gallery/photo/${photo_id}` }
   deleteShopGalleryPhotoMethodPayload(){ return {} }

  //
   getGalleryMediaLoadMethod(storageName = null, tag = null) { return `/telegram/shop/${storageName}/gallery/${tag}/` }
   getGalleryMediaLoadMethodPayload(){ return {} }
  // аналог 
   sendGalleryMediaLoadMethod(shop_id = null) {  return `/telegram/shop/${shop_id}/card/gallery/photo` }
   sendGalleryMediaLoadMethodPayload(){ return {} }

   sendShopAboutInformationMethod(shop_id = null ){ return `/telegram/shop/${shop_id}/about`; }
   sendShopAboutInformationMethodPayload(){ return {} }

   sendTelegramWebDataUserMethod(){ return `/telegram/shop/webdata`; }
   sendTelegramWebDataUserMethodPayload(){ return {} } 



   getShopProductInfoMethod(shop_id=null, product_id=null){ return `/telegram/shop/${shop_id}/products/${product_id}`; }
   getShopProductInfoPayload(){ return {} } 

   getShopProductMyLikeMethod(shop_id=null, product_id=null){ return `/telegram/shop/${shop_id}/products/${product_id}/mylike`; }
   getShopProductMyLikePayload(){ return {} } 

   setShopProductLikeMethod(shop_id=null, product_id=null){ return `/telegram/shop/${shop_id}/products/${product_id}/like`; }
   setShopProductLikePayload(){ return {} } 

   setShopProductBlockingMethod(shop_id=null, product_id=null){ return `/telegram/shop/${shop_id}/products/${product_id}/block`; }
   setShopProductBlockingPayload(){ return {} } 

   setShopProductDeleteMethod(shop_id=null, product_id=null){ return `/telegram/shop/${shop_id}/products/${product_id}`; }
   setShopProductDeletePayload(){ return {} } 

   addShopProductToBasketMethod(shop_id=null){ return `/telegram/shop/${shop_id}/basket`; }
   addShopProductToBasketPayload(product_id = null){ return { product_id : product_id }} 

   sendShopProductCreateMethod(shop_id=null, product_id=null){ return `/telegram/shop/${shop_id}/products/${product_id}` }
   sendShopProductCreatePayload(props){
	 return { 
		  card_image  : props.card_image,
		  title       : props.title,
	          price       : props.price,
	          image_transition  : props.image_transition,
	          image_loop  : props.image_loop, 
	          description : props.description
		 }
   }
/* запрос товаров */
   getShopProductsMethod(){  return `/api/bff/warehouse/v1/products` }
   getShopProductsPayload(productId){ return {} }

/* Добавление товара в корзину */
   addToBasketMethod(){  return `/api/bff/warehouse/v1/basket/product-add` }
   addToBasketMethodPayload(productId, quantity){  return  { productId: productId, quantity: quantity } }
/* Удaление товара в корзине */
   removeFromBasketMethod(){  return `/api/bff/warehouse/v1/basket/product-remove` }
   removeFromBasketMethodPayload(productId, quantity){  return { productId: productId, quantity: quantity } }
   removeItemBasketMethod(){  return `/api/bff/warehouse/v1/basket/item` }

/**/
   removeOrderItemMethod(){  return `/api/bff/orders/v1/order/product-remove` }

/* */
   setProductLikeMethod(productId=null){
     return `/api/bff/reco/v1/like/${(productId) ? productId : ''}` 
 }

/* Получить продукт */
   getShopProductDetailsMethod(productId){  return `/api/bff/warehouse/v1/products/${productId}` }

/* Получить почту по продукту */
   getShopProductMailsMethod(productId){  return `/api/bff/warehouse/v1/products/${productId}` }


/* Список товаров в корзине пользователя */
   getShopBasketMethod(){  return `/api/bff/warehouse/v1/basket` }
/* Создать заказ */
   createOrderMethod(){  return `/api/bff/orders/v1/order/create` }
/* Отменить заказ */
   declineOrderMethod(){  return `/api/bff/orders/v1/order/decline` }
/* Установка типа доставки */
   setOrderDeliveryMethod(){  return `/api/bff/delivery/v1/select` }
/* Установка типа доставки */
   setOrderDetailsMethod(orderId){  return `/api/bff/warehouse/v1/order/${orderId}/details` }
/* Отправка запроса на оплату  */
   sendPaymentMethod(){  return `/api/bff/payment/v1/create` }
   sendPaymentMethodPayload(order){  return order; }
/* Список заказов */
   getShopOrdersMethod(){  return `/api/bff/orders/v1/orders` }
   getShopOrdersMethodPayload(status = null){
    if(!status) status = 'NEW';
       return { status : status } 
}

/* Получиение детализации заказа */
   getShopOrderDetailsMethod(orderId=null){  return `/api/bff/warehouse/v1/order/${orderId}/details` }

   getShopOrderMethod(orderId=null){  return `/api/bff/orders/v1/order/${orderId}`}


/* Профиль */
   profilePictureMethod(){ return `/api/bff/client/v1/profile-image`}

   getShopProfileMethod(){ return `/api/bff/client/v1/profile` }
   saveShopProfileMethod(){ return `/api/bff/client/v1/profile` }
   closeSessionMethod(){ return `/api/bff/client/v1/logout` }

   getProductReviewCardMethod(productId) { return `/reviews/${productId}/page`; }
   getProductMailsCardMethod(productId) { return `/products/${productId}/mails/page`; }

/* Отзывы */
   getReviewsMethod(productId){ return `/api/bff/reco/v1/review/${productId}`}
   getReviewMethod(productId){ return `/api/bff/reco/v1/review/${productId}/my/review`}
   setReviewMethod(productId=null){ return `/api/bff/reco/v1/review/${productId}`}
   setReviewMethodPayload(review=null){ return {review}}

/* Почта */
   getProductMailMethod(productId=null){ return `/api/bff/mail/v1/product/${productId}`}
   getProductMailPersonalMethod(productId=null,userId=null){ return `/api/bff/mail/v1/product/${productId}?id=${userId}`}

   sendProductMailMethod(productId=null){ return `/api/bff/mail/v1/product/${productId}`}
   sendProductMailPayload(message=null){ return {message}}

/* Установка rating */
   setRatingMethod(productId=null){  return `/api/bff/reco/v1/rating/${productId}`}
   reviewFilesUploadMethod(productId=null){return `/api/bff/reco/v1/review/${productId}/upload`}

/* Удалить фото из комментария */
   deleteReviewMediaMethod(fileId=null){  
	return `/api/bff/reco/v1/review/media/${fileId}`}
/* Коды верификации */
   checkVerificationCodeMethod(){
	return `/api/bff/verification/v1/checkCode`}

/* Получение платежных инструментов */
   getPaymentInstrumentsMethod(){
	return `/api/bff/payment/v1/instruments`}

   getPaymentCardsMethod(){
	return `/api/bff/payment/v1/cards`}

   setDefaultPaymentCardMethod(){             // Изменение - установка по умолчанию
	return `/api/bff/payment/v1/card` // PATCH
   }

   addPaymentCardMethod(){              // Добавление карты
	return `/api/bff/payment/v1/card`  // POST
   }

   deletePaymentCardMethod(cardId){    // удаление карты DELETE
	return `/api/bff/payment/v1/card`
   }

/* Почтовая доставка  */

   getDeliveryRussianPostalUnitsMethod(){
    return `/api/bff/delivery/v1/russian-postal-units`;
   }

   addDeliveryRussianPostalUnitMethod(){
    return `/api/bff/delivery/v1/russian-postal-unit`;
   }

   deleteDeliveryRussianPostalUnitMethod(){
    return `/api/bff/delivery/v1/russian-postal-unit`;
   }

   setDefaultDeliveryRussianPostalUnitMethod(){
    return `/api/bff/delivery/v1/russian-postal-unit`;
   }

/* Адреса доставки  */

   getDeliveryTypesMethod(){
    return `/api/bff/delivery/v1/delivery-types`;
   }


   getDeliveryAddressesMethod(){
    return `/api/bff/delivery/v1/addresses`;
   }

   setDefaultDeliveryAddressMethod(){
    return `/api/bff/delivery/v1/address`;
   }

   deleteDeliveryAddressMethod(){
    return `/api/bff/delivery/v1/address`;
   }

   addDeliveryAddressMethod(){
     return `/api/bff/delivery/v1/address`;
  }

   checkPhoneMethod(){
     return `/api/bff/client/v1/phone-check`;
  }

   savePhoneMethod(){
     return `/api/bff/client/v1/phone`;
  }

   checkEmailMethod(){
     return `/api/bff/client/v1/email-check`;
  }

   saveEmailMethod(){
     return `/api/bff/client/v1/email`;
  }


/* */
   getSubscriptionsMethod(){
     return `/api/bff/client/v1/subscriptions`;
   }
   updateSubscriptionMethod(){
     return `/api/bff/client/v1/subscription`;
   }
   deleteSubscriptionMethod(SubscribeId){
     return `/api/bff/client/v1/subscriptions/${SubscribeId}`;
   }

   getMeMethod() { return `/@me`; }
   getMeMethodPayload() { return {};  }


   getTelegramMeMethod() { return `/@telegram`; }
   getTelegramMeMethodPayload() { return {};  }

  
// регионы пользователя
   getClientRegionsMethod() { return `/api/bff/client/v1/regions`; }
   sendClientRegionMethod() { return `/api/bff/client/v1/region`; }
   deleteClientRegionMethod() { return `/api/bff/client/v1/region`; }
   getClientAddressMethod() { return `/api/bff/client/v1/suggest/address`}

// Второй фактор
    getSecurityQuestionsMethod() { return `/api/bff/confirmation/v1/security-questions`; }

//  Получить признак что установлен параметр
    getIsSecurityQuestionActiveMethod() { return `/api/bff/confirmation/v1/security-question-status`; }
    getIsPINCodeActiveMethod() { return `/api/bff/auth/v1/pin-code-status`; }

// получить контрольный вопрос
    getSecurityQuestionMethod() { return `/api/bff/confirmation/v1/security-question`; }

// выполнить действие с проверкой, 
// DISABLE_SECURITY_QUESTION - отключить контрольный вопрос
// CHECK_ANSWER_ON_SECURITY_QUESTION - проверить ответ на контрольный вопрос
    sendSecurityAnswerMethod() { return `/api/bff/confirmation/v1/security-question-answer`; }

// установить контрольный вопрос, POST
    setSecurityQuestionMethod() { return `/api/bff/confirmation/v1/security-question`; }

// установить PIN-код
    pinCodeEnableMethod(){ return    `/api/bff/auth/v1/pin-code-enable`; }

//удалить PIN-код
    pinCodeDisableMethod(){ return `/api/bff/auth/v1/pin-code-disable`; }

// вход по пиин-коду
    pinCodeLogonMethod(){ return `/api/bff/auth/v1/pin-code-logon`; }


// Получить от сервиса подтверждения id запроса на смену второго фактора
//    getActiveSecurityQuestionRequestIdExists() { return `/api/bff/confirmation/v1/request/security-question`; }

//  создание запроса на работу с контрольными вопросами
//    createSecurityQuestionRequestIdMethod() {return `/api/bff/confirmation/v1/request`; }


// ****************************  Сервис подтверждения  ********************************
// отправка кода для проверки
   checkConfirmationCodeMethod() { return `/api/bff/confirmation/v1/check-code`; }
   checkConfirmationCodeMethodPayload( code, requestId ) { return { code, requestId } }

// отправить запрос на доставку кода по указанному каналу confirmationType = email || phone
   deliveryConfirmationCodeRequestMethod() { return `/api/bff/confirmation/v1/send-code-request`; }
   deliveryConfirmationCodeRequestMethodPayload( confirmationType ) { return { confirmationType } }

//   Запросить создание нового активного запроса на подтверждение request{requestType=security-question || pin-code }, отменив старые
   createConfirmationRequestMethod() { return `/api/bff/confirmation/v1/request`; }
   createConfirmationRequestMethodPayload(requestType) { return { requestType } }

//  Получить активный запрос request{requestType = security-question || pin-code }
   getConfirmationActiveRequestMethod() { return `/api/bff/confirmation/v1/request`; }
   getConfirmationActiveRequestMethodPayload(requestType) { return { requestType } }


    
/* станицы */
   LOGON_URL(){ return `/logon` }
  
   getShopProductMethod(shop_id=null, product_id = null){ return `/telegram/shop/${shop_id}/products/${product_id}/page`}
   getShopProductPayloadMethod(){ return {} }


   setShopOrderActionMethod(shop_id=null, application_id = null){ return `/telegram/shop/${shop_id}/orders/${application_id}/execute`}
   setShopOrderActionPayload(props){ return {
          applicationId: props.applicationId,
          comment: props.comment,
          status: props.status
	}
    }
}

