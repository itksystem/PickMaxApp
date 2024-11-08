/* Текущий telegram-пользователь. */
/* eslint-disable */
class CurrentUser extends User{
  constructor() {
  super();
  let context = this;
  //  console.log('CurrentTgUser initialization....');
    let api = new WebAPI();
    let telegramAppChatLabs = window.Telegram.WebApp; //нужно получить объект window.Telegram.WebApp Телеграмма
    let webRequest = new WebRequest();
    let data = webRequest.get(api.getMeMethod(), {}, true)
  //       console.log('CurrentTgUser get data....');
           context.setUserId   ((telegramAppChatLabs.initDataUnsafe.user !== undefined) ? telegramAppChatLabs.initDataUnsafe.user.id         : data.telegram.user_id); 
           context.setFirstName((telegramAppChatLabs.initDataUnsafe.user !== undefined) ? telegramAppChatLabs.initDataUnsafe.user.first_name : data.telegram.first_name); 
           context.setLastName ((telegramAppChatLabs.initDataUnsafe.user !== undefined) ? telegramAppChatLabs.initDataUnsafe.user.last_name  : data.telegram.last_name); 
           context.setUserName ((telegramAppChatLabs.initDataUnsafe.user !== undefined) ? telegramAppChatLabs.initDataUnsafe.user.username   : data.telegram.username); 
           if(data && data.telegram) {
            context.setShopId(data.telegram.shop_id); 
            context.setSessionId(data.sessionID); 
           }
           if(data.city_fias_id !== undefined) 
	         context.setCityFiasId(data.city_fias_id);
       	   if(data.city !== undefined) 
	         context.setCity(data.city);    
       	   if(data.delivery !== undefined) {
		context.setDeliveryName((data.delivery.name !== undefined) ? data.delivery.name : null);    
 	        context.setDeliveryAddress((data.delivery.address !== undefined) ? data.delivery.address : null);    
 	        context.setDeliveryPhone((data.delivery.phone !== undefined) ? data.delivery.phone : null);    
	   }
           context.save(); 
           context.saveCurrentUserId((telegramAppChatLabs.initDataUnsafe.user !== undefined) ? telegramAppChatLabs.initDataUnsafe.user.id      : data.telegram.user_id);
//	   console.log(context);
           if(telegramAppChatLabs.initDataUnsafe.user !== undefined) 
               SendWebData(telegramAppChatLabs.initDataUnsafe.user);
  //           console.log('CurrentTgUser finish....');
     return context;
   } 
}

