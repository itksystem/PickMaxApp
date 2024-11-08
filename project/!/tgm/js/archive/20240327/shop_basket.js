$(document).ready(function() {
    console.log('shop_basket.js load...');
    $.ajax({
	type : "POST",
	url : '/telegram/shop/'+document.getElementById('shop_id').value+"/basket/"+document.getElementById('user_id').value+'/orders',
        data : {       
  	     _auth : window.Telegram.WebApp.initData,
	     _auth_user : window.Telegram.WebApp.initDataUnsafe
	},	
	success:		
    function(data){
       console.log(data.user);
       $("#user_delivery_name").val(data.user.user_delivery_name);
       $("#user_delivery_phone").val(data.user.user_delivery_phone);
       $("#user_delivery_address").val(data.user.address);
       $("#user_recipient_name").val(data.user.user_delivery_name);
       $("#user_recipient_phone").val(data.user.user_delivery_phone);
       $("#user_recipient_address").val(data.user.address);
       $('.create_orders_dlg').hide();
       let template_id = null;

    if(data.basket.length > 0) {
       let page = "<ul>";
	let prop = {};
        prop.target = ".shop_orders_list";
	prop.list = [];
	sum = 0;
        $.each(data.basket, function( key, val) {
          sum+=val.sum;
	  template_id= val.product_id;
	  prop.list.push({
			id : val.order_id,
 			order : 
			 [
			   { name : val.title, class_name : " col-sm-4 basket_item_date" },
			   { name : val.count+'</br>шт.', class_name : "col-sm-2 basket_item_count" },
			   { name : val.sum+' &#x20bd;', class_name : "col-sm-2 basket_item_sum" },
			   { name : `<img class="basket_product_image" src="${val.card_image}">`, class_name : "col-sm-2 order_product_image text-center" },
			   { name : '<i class="fa fa-trash"></i> </br> Удалить', class_name : "col-sm-2 text-center basket_product_remove_btn"}
			 ]                                                                  
		  }
		);	 
	});

        let list = new ListComponent(prop);
	list.render();
	$('.shop_orders_list').append(
	     `<div class="row">
		<div class="col title_orders_summ"><h2>Сумма заказа</h2></div>
		<div class="col orders_sum"><h2>${sum} руб.</h2></div>
              </div>
  	      <div class="pred-order-dialog">
	          <div class="row text-center">
             	    <div class="col"><button class="btn btn-lg w-100 btn-green basket_item_status_pred_create_application">`
                    +(!isDemoShopShowcase() ? ` Отправить заказ в магазин ` : ` Создать магазин `) 
		    +`<i class="fas fa-cart-plus fa-sm mr-1"></i></button></div>
 	          </div>`
		 +(!isDemoShopShowcase() ?
	          `<div class="row text-center"><div class="col w-100" style="padding:1rem;">или</div>  </div>
	          <div class="row text-center">
	    	     <div class="col"><button class="btn btn-lg w-100 basket_item_status_next_shopping"><i class="fa fa-plus"></i> Продолжить выбор товаров </button></div>
    	          </div>` : `
		   <div class="row"  style="padding-top: 1rem;">
		      <div class="col w-100 text-left" ><h2>Дополнительная информация</h2></div> 
		   </div>
  	    	   <div class="shop_orders_agreement">После нажатия кнопки <b>"Создать магазин"</b> наш бот пришлет вам учетные данные для управления магазином и дальнейшие инструкции.</br></br>
		   Так же сообщаем, что отправить вы можете не более одного заказа на создание магазинов в день.
		   </div>
		 `)
		 +`</div>
        `);

        $('.basket_item_status_next_shopping').on('click', function(){
   	      redirectToAnotherPage('showcase');
         });

        $('.basket_product_remove_btn').on('click', function(){
	    let order_id = $(this).attr('rel');
	    $.ajax({
		url : '/telegram/shop/'+$("#shop_id").val()+'/basket/'+$("#user_id").val()+'/remove',
		type : "DELETE",
		data : 
		{ 
		  order_id    : order_id,
 		  _auth : window.Telegram.WebApp.initData
		 },
		 success : function( data ) {
			 console.log(data);
			 toastr.info('Товар удален из корзины!', 'Товар', {timeOut: 5000});
			 redirectToAnotherPage('basket/'+$("#user_id").val());
		    },
		  error : function( data ) {
			 console.log(data);
			 toastr.error('Ошибка удаления товара из корзины!', 'Товар', {timeOut: 5000});
    	           }
              });
         });

        $('.basket_item_status_pred_create_application').on('click', function(){
            $('.pred-order-dialog').hide();
            $('.create_orders_dlg').show();
    	    $('.shop_basket_footer').append(
  		  ` <div class="row"><div class="col w-100">
		      <center><button class="btn w-100 btn-lg btn-green basket_item_status_create_application">`
                    +(!isDemoShopShowcase() ? ` Отправить заказ в магазин ` : ` Создать магазин `) 
		    +`<i class="fas fa-cart-plus fa-sm mr-1"></i></button></center> </div></div>`);
 
        let posY = $('.create_orders_dlg').offset().top;
        $('html,body').scrollTop(posY);  // переместили пользователя к кнопке


        $('.basket_item_status_create_application').on('click', function(){
	(!isDemoShopShowcase() 
   	  ?
	    $.ajax({
		url : '/telegram/shop/basket/application',
		type : "POST",
		data : 
		{ 
		  shop_id    : $("#shop_id").val(),
	          user_id    : $("#user_id").val(),
		  user_delivery_address : $("#user_delivery_address").val(),
		  user_delivery_phone   : $("#user_delivery_phone").val(),
                  user_delivery_name    : $("#user_delivery_name").val(),

		  user_recipient_phone  : $("#user_recipient_phone").val(),
		  user_recipient_name   : $("#user_recipient_name").val(),
		  user_recipient_address: $("#user_recipient_address").val(),
		  order_message: $("#order_message").val(),
 		  _auth : window.Telegram.WebApp.initData
		 },
		 success : function( data ) {
			 console.log(data);
		         redirectToAnotherPage('application_success/'+data.order+'/'+data.application_id);
		    },
		  error : function( data ) {
			 console.log(data);
		         redirectToAnotherPage('application_failed');
    	           }
              })
	 :
	    $.ajax({
		url : '/telegram/shop/create',
		type : "POST",
		data : 
		{ 
		  template_id    : template_id,
 		  _auth          : window.Telegram.WebApp.initData
		 },
		 success : function( data ) {
			 console.log(data);
//		         redirectToAnotherPage('application_success/'+data.order+'/'+data.application_id);
		    },
		  error : function( data ) {
			 console.log(data);
//		         redirectToAnotherPage('application_failed');
    	           }

         })
       );
     });
   });

      } else 
	   $('div.shop_orders_list').append(`<div class="text-center">Нет заказов в корзине</div>`);
	 } ,
	  error : function(error){
	         console.log(error);
		$('div.shop_orders_list').append(`<div class="text-center">Ошибка: `+error.responseJSON.error_message+`</div>`);
	}
      });

/* Отключаем в карточке заказа упоминание о другом пользователе  */
      (!isDemoShopShowcase() ? $('.other_user_delivery').show() : $('.other_user_delivery').hide() )

});
