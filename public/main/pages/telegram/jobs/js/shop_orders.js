document.addEventListener('DOMContentLoaded', function() {

 function getOrderArray(orders) { // Подготовка списка заказов для загрузки в ListComponent
    let prop = {};
    prop.target = ".shop_orders_list";
    prop.list = [];
    $.each(orders, function( key, val) {
      prop.list.push({
	id : val.application_id,
	title_class : "order_title",
	order : 
	 [
	   { name : (val.messages_count > 0 ? `<i class="fas fa-envelope"></i>` : `<i class="fa-solid fa-chevron-right"></i>`), class_name : "mail" },
	   { name : 'Заказ № '+val.order_number+'</br>'+val.order_date, class_name : "order_item_date" },
	   { name : val.count+'</br>шт.', class_name : "order_item_count" },
	   { name : val.sum+' &#x20bd;', class_name : "order_item_sum" },
	   { name : val.status_name, class_name : "btn btn-block btn-primary btn-lg order_item_status_"+val.status.toLowerCase()}
 	   ]
	  }
 	);	 
    });
  return prop;
 }

/* Отражение списка заказа */
 function getOrderViewCardAppend(order, val_id) {
    const card = $('div.card[rel="' + val_id + '"]');
    card.append(`<div class="card_info" rel="${val_id}"></div>`);
    order.forEach((item, index) => {
     $('div.card_info[rel="' + val_id + '"]').append(`
            <div class="row order">
                <div class="col-1">${index + 1}</div>
                <div class="col-6">${item.title}</div>
                <div class="col-2">${item.price}${item.currency_type}</div>
                <div class="col-2">
                    <a href="${item.card_image}" data-lightbox="image-${index + 1}">
                        <img class="order_product_image" src="${item.card_image}">
                    </a>
                </div>
            </div>
        `);
    });
    card.addClass('filled');
 }



/* Отражение списка заказа */
 function orderPropsView(order, val_id) {
 $('div.card_info[rel="' + val_id + '"]').append(`
    <div class="row order" style="border-bottom: 1px solid #ededed;">
        <h2>Данные заказчика</h2>
    </div>
    <div class="row order">
        <div class="col"><i class="fa fa-user"></i>&nbsp;&nbsp;Заказчик:</div>
        <div class="col">${order.buyer_name}</div>
    </div>
    <div class="row order">
        <div class="col"><i class="fa fa-phone"></i>&nbsp;&nbsp;Телефон заказчика:</div>
        <div class="col">${order.buyer_phone}</div>
    </div>
    <div class="row order">
        <div class="col"><i class="fa fa-map"></i>&nbsp;&nbsp;Адрес заказчика:</div>
        <div class="col">${order.buyer_address}</div>
    </div>
    <div class="row order" style="border-bottom: 1px solid #ededed;">
        <h2>Данные получателя</h2>
    </div>
    <div class="row order">
        <div class="col"><i class="fa fa-user"></i>&nbsp;&nbsp;Получатель:</div>
        <div class="col">${order.recipient_name}</div>
    </div>
    <div class="row order">
        <div class="col"><i class="fa fa-phone"></i>&nbsp;&nbsp;Телефон получателя:</div>
        <div class="col">${order.recipient_phone}</div>
    </div>
    <div class="row order">
        <div class="col"><i class="fa fa-map"></i>&nbsp;&nbsp;Адрес доставки:</div>
        <div class="col">${order.recipient_address}</div>
    </div>
    <div class="row order" style="border-bottom: 1px solid #ededed;">
        <h2>Комментарий к доставке</h2>
    </div>
    <div class="row order">
        <div class="col">${order.order_message}</div>
    </div>
    <div class="row order" style="border-bottom: 1px solid #ededed;"></div>
    <div class="row order">
	${(user.getUserId() == shop.getOwnerId()) ? `<div class="col application_execute_btn" rel="${val_id}">Управление заказом</div>` : ''}        
        <div class="col application_messages_btn" rel="${val_id}">
            <i class="fas fa-envelope"></i>
            <span id="message_counter" class="badge-menu badge-success badge-status_${order.new_messages_count}">${order.new_messages_count}</span>
            <span style="margin-left: 0.7rem;">Сообщения</span>
        </div>
    </div>
 `);
}

//  установить обработку на кнопку "Управление заказом" владельцу магазина
 function setExecuteButtonClickEvent(val_id = null){
      if(user.getUserId() == shop.getOwnerId()) {  
          $('div.application_execute_btn[rel="'+val_id+'"]').on('click', function(){
            redirectToAnotherPage('application_execute/'+$(this).attr('rel'));
      });
   }
 }

//  установить обработку на кнопку "Сообщения" 

 function setMessagesButtonClickEvent(val_id = null){
      $('div.application_messages_btn[rel="'+val_id+'"]').on('click', function(){
            redirectToAnotherPage('messages/'+$(this).attr('rel'));
      });
 }


/* Установка обработчика события на открытие записи */
 function setClickEvent(order){
       $(".row.order_title").on('click', function(){
        let val_id = $(this).attr('rel');
        if(!$('div.card[rel="'+val_id+'"]').hasClass('filled')){
            let request = getOrderRequest(val_id);
            console.log(request.order);
	    if(request.order.length > 0) {	
	        getOrderViewCardAppend(request.order, val_id);
	          if(user.getUserId() == shop.getOwnerId()) {
                       orderPropsView(request, val_id);
		       setExecuteButtonClickEvent(val_id);
		       setMessagesButtonClickEvent(val_id);
               }
	   }
       } else {
	 $('div.card_info[rel="'+val_id+'"]').remove();
         $('div.card[rel="'+val_id+'"]').removeClass('filled');  	    
     }	
    });
 }

/* Получить данные заказа */
function getOrderRequest(applicationId = null){                  
      return webRequest.get(api.getShopOrderMethod(shopId, applicationId), {}, webRequest.SYNC);
}



     let api = new WebAPI();
     let webRequest = new WebRequest();
     let user = new CurrentUser();
     let shop = new CurrentShop(shopId);
     shop.setCurrentShopId(shopId);

     console.log(mainApplication);

     const urlParams = new URLSearchParams(window.location.search); // Получаем текущий URL
     const status = urlParams.get('status'); // Извлекаем значение параметра 'active'
     mainApplication
	.StatusButtonOrdersMenuView(true, status)
	.pageTitle(mainApplication.getOrdersPageTitleBySearchKey(status));
    const header = document.querySelector('top-header');
    console.log(header);
    header.searchPlaceholder = 'Введите номер заказа для поиска';
 
    try{
      let request = webRequest.get(
	 api.getShopOrdersListMethod(shopId, user.getUserId(), (status==null ? 'active' : status)),
 	 api.getShopOrdersListMethodPayload(),
	 false )
        .then(function(data) {
              console.log(data);
              if(data.orders.length == 0){ 
         	 $('div.shop_orders_list').append(`<div class="text-center">Нет заказов в таком статусе</div>`);
  	       } else {	
	        let list = new ListComponent(getOrderArray(data.orders));	 
                list.render(); // вывели список 
	        setClickEvent(); // установили обрботчик на клик
	      }
 	  })
	 .catch(function(error) {
               console.error('Произошла ошибка:', error);
	  });

        } catch(e) {
        console.log('shop_orders.js.catch =>', e)
      }
 });
