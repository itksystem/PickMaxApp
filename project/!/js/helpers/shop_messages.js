$(document).ready(function() {

function getMessageOwnerName(message = null){
     return ( shop.getOwnerId() == message.chat_id ? message.shop_title :  message.user_delivery_name );
}

function isNewMessageBadge(message){
     return (message.status !== 'read') 
	? `<div class="row"><div class="col-sm-1"><span id="message_counter" class="badge-menu badge-success badge-status-${message.status}" style="top: -0.8rem;">новое</span></div></div>` :``;
}

function messageOutput(message){
 return `<div class="row message" message-id = "${message.uid}">
     <div class="card message">${isNewMessageBadge(message)}<div class="row border-bottom">
	  <div class="col-sm-8 message shop-title text-left">${getMessageOwnerName(message)}</div>
	    <div class="col-sm-4 message date text-left">${message.created}</div>
          </div>
          <div class="row">
	     <div class="col-sm message text">${message.message}</div>
          </div>
    </div>
</div>
`;
}

function messageInputDialog(applicationId){
return `<div class="row">
	  <div class="col w-100 text-left" ><h2>Введите сообщение</h2></div> 
</div>
<div class="row">
    <div class="row input-group">
      <div class="logistic_editor_textarea w-100" >
        <div class="col" >
           <textarea id="message" rows=3 placeholder="Введите сообщение" class="form-control " ></textarea>
	</div>
      </div>
    </div>
</div>
<div class="row">
    <div class="col application_messages_btn" rel="${applicationId}" style="margin-top: 1rem;"><i class="fas fa-envelope"></i> Отправить сообщение </div>
</div>`;
}

     let api = new WebAPI();
     let webRequest = new WebRequest();
     let user = new CurrentUser();
     let shop = new CurrentShop(shopId);
     shop.setCurrentShopId(shopId);
     let applicationId = document.getElementById('application_id').value;

    $.get(`/telegram/shop/${shopId}/orders/${applicationId}/messages`,
    function(data){
	if(data.messages.length == 0) 
          $('div.shop_messages_list').append(`<div class="text-center justify-content-center no-messages">У вас нет сообщений</div>`);
   	  $.each(data.messages, ( k, v) => {  $('div.shop_messages_list').append(messageOutput(v)); });
          $('div.shop_messages_list').append(messageInputDialog(applicationId));
	
 	  $(`div.application_messages_btn[rel="${applicationId}"]`).on('click', function(){
	    try{
	      let request = webRequest.post(
		     api.sendShopApplicationMessageMethod(shopId, applicationId ),
	 	     api.sendShopApplicationMessageMethodPayload(applicationId, user.getUserId(), $('#message').val()),
		     webRequest.SYNC )
 	          .then(function(data) {
        	      console.log(data);
		      redirectToAnotherPage((data.result == 'OK') ? 'message_sended' : 'application_failed');
	 	  })
		 .catch(function(error) {
	              console.error('Произошла ошибка:', error);
	           //   redirectToAnotherPage('application_failed');
		      toastr.error('Возникла ошибка при отправке сообщения!', 'Товар', { timeOut: 5000 });
		  });

	        } catch(e) {
	        console.log('shop_messages.js.catch =>', e)
		toastr.error('Возникла ошибка при отправке сообщения!', 'Товар', { timeOut: 5000 });
	      }
         });
     });
 });

