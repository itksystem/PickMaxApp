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

   getMeMethod() { return `/main/@me`;  }
   getMeMethodPayload() { return {};  }

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
   getShopOrderMethodPayload(){ return {} }

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

   getShopProductsMethod(shop_id=null, active = true ){  return `/telegram/shop/${shop_id}/products?active=${active}` }
   getShopProductsPayload(a){ return {}}
  
   getShopProductMethod(shop_id=null, product_id = null){ return `/telegram/shop/${shop_id}/products/${product_id}/page`}
   getShopProductPayloadMethod(){ return {} }

   getShopOrderMethod(shop_id=null, application_id = null){ return `/telegram/shop/${shop_id}/orders/${application_id}`; }

   setShopOrderActionMethod(shop_id=null, application_id = null){ return `/telegram/shop/${shop_id}/orders/${application_id}/execute`}
   setShopOrderActionPayload(props){ return {
          applicationId: props.applicationId,
          comment: props.comment,
          status: props.status
	}
    }
}
