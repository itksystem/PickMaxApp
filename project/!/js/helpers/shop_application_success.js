/* eslint-disable */

document.addEventListener('DOMContentLoaded', function() {

function getApplicationItemOutput(o){	
	$.each(o.order, function( k, v) {
		$(`div.card_info[rel="${o.application_id}"]`).append(
			`<div class="row order">
			    <div class="col-1">${k+1}</div>
			    <div class="col-6">${v.title}</div>
			    <div class="col-2">${v.price}${v.currency_type}</div>
			    <div class="col-2"><a href="${v.card_image}" data-lightbox="image-${k+1}"><img class="order_product_image" src="${v.card_image}"></a></div>
			  </div>			  
			`).addClass('filled');
    });
}

function applicationCardOutput(title, applicationId){
	return `
	  <div class="row" style="border-bottom: 1px solid #ededed; padding-left: 0.4rem;"><h2>${title}</h2></div>
	  <div class="card_info" rel="${applicationId}"></div>
	`
}

function getBuyerInformation(o){
 return  `<div class="row order" style="border-bottom: 1px solid #ededed;"><h2>Данные заказчика</h2></div>
 <div class="row order"><div class="col"><i class="fa fa-user"></i>&nbsp;&nbsp;Заказчик:</div><div class="col">${o.buyer_name}</div></div>
  <div class="row order"><div class="col"><i class="fa fa-phone"></i>&nbsp;&nbsp;Телефон заказчика:</div><div class="col">${o.buyer_phone}</div></div>
  <div class="row order"><div class="col"><i class="fa fa-map"></i>&nbsp;&nbsp;Адрес заказчика:</div><div class="col">${o.buyer_address}</div></div>`
}

function getRecipientInformation(o){
	return  `
	<div class="row order" style="border-bottom: 1px solid #ededed;"><h2>Данные получателя</h2></div>
	<div class="row order"><div class="col"><i class="fa fa-user"></i>&nbsp;&nbsp;Получатель:</div><div class="col">${o.recipient_name}</div></div>
	<div class="row order"><div class="col"><i class="fa fa-phone"></i>&nbsp;&nbsp;Телефон получателя:</div><div class="col">${o.recipient_phone}</div></div>
	<div class="row order"><div class="col"><i class="fa fa-map"></i>&nbsp;&nbsp;Адрес доставки:</div><div class="col">${o.recipient_address}</div></div>`
}

function getPaymentInformation(o){
	return `
	<div class="row order" style="border-bottom: 1px solid #ededed;"><h2>Порядок оплаты заказа</h2></div>
	<div class="row order"><div class="col">${o.payment_description}</div></div>`
}

function applicationCreateSuccessMessage(){
	return `<div class="shop_application_success_title" style="border-left: 5px solid #c65252;padding: 0 0.4rem; font-size: 0.9rem; margin: 0 0 1rem 0;">
	<small>Спасибо за ваш заказ!<br> 
			 С вами свяжется сотрудник магазина для подтверждения доставки товара.<br>
			 Обратите внимание, что мы не принимаем платежи за товары. Мы рекомендуем оплачивать заказ только после его получения и проверки качества.<br>
			 Все данные о вашем заказе будут отправлены в ваш аккаунт Telegram.<br>
			 Если у вас возникнут вопросы, пожалуйста, обращайтесь в нашу службу поддержки. Мы всегда готовы помочь!<br> </small> 
	</div>		 
 `
}

function shopCreateSuccessMessage(){
	return `<small> Вы создали свою площадку в телеграм.<br>
	На ваш аккаунт поступит сообщение от нашего бота с инструкцией и данными для настройки вашей площадки.<br>
	По всем вопросам вы можете обратиться в нашу службу поддержки. </small> `
}

function getApplicationComments(o){
	return  `<div class="row order" style="border-bottom: 1px solid #ededed;"><h2>Комментарий к заказу</h2></div>
	<div class="row order"><div class="col">`+o.order_message+`</div></div>
	<div class="row order" style="border-bottom: 1px solid #ededed;"></div>`
}

function createApplicationShortButtonOutput(title){
	return `  
	   <button class="btn w-100 btn-lg btn-green basket_item_status_create_application" onclick="redirectToAnotherPage('promo/page')">${title} <i class="fa-sharp fa-solid fa-thumbs-up"></i></button>`
}

  let api= new WebAPI();
  let webRequest = new WebRequest();
  let user = new CurrentUser();
  let applicationId = $("#application_id").val();

		  try {
			let data = webRequest.get(api.getShopApplicationMethod(shopId, applicationId), {}, webRequest.SYNC);	
			console.log(data);
			if(data.order.length > 0) {
				$(`div.pagecard[rel="${applicationId}"]`).append( applicationCardOutput(`Состав заказа`, applicationId));
				getApplicationItemOutput(data);
				$('.page_title_addons').append(createApplicationShortButtonOutput(` Понятно `))  
				$('.page_title').append(`Сформирован заказ № ${data.number}`).show();
				$(`div.card_info[rel="${applicationId}"]`).append(
					getBuyerInformation(data) +(!isDemoShopShowcase() 
					? getRecipientInformation(data) + (!isDemoShopShowcase() ? applicationCreateSuccessMessage(): shopCreateSuccessMessage())
					: getApplicationComments(data))
				 );			
			} 
		  } catch (error) {
			 console.error(error);
   }
});
