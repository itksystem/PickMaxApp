function gotoLogon() {
    window.location.href = 
	window.location.protocol + '//'+ window.location.host + '/logon';
}

function redirectToAnotherPage(newPageURL) {
  $(document).ready(function() {
    window.location.href = 
	window.location.protocol + '//'+
        window.location.host + '/telegram/shop/'+document.getElementById('shop_id').value+'/'
	+ newPageURL;
  });
}


function setTitle(service) {
  $(document).ready(function() {
    if($(".current-page[rel="+service+"]").hasClass("title-view")){
       if(document.getElementById('shop_id').value == "telegram-demo-shops-showcase") {
          if(service=='showcase')
              $('div.page_title').html('Шаблоны площадок').show();
         }  else
           $('div.page_title').html($(".current-page[rel="+service+"]").html());
       }   

      if(service=='message_sended') {
	   $('div.page_title').html('Сообщение отправлено!').show();
      }  else
      if(service=='error-page') {
	   $('div.page_title').html('Произошла ошибка!').show();
      }  else
      if(service=='basket') {
	   $('div.page_title').html('Корзина').show();
      }  else
      if(service=='profile') {
	   $('div.page_title').html('Ваш профиль').show();
      }  else
      if(service=='orders') {
	   $('div.page_title').html('Заказы').show();
      }  else
      if(service=='logistic') {
	   $('div.page_title').html('Доставка товара').show();
      }  else
      if(service=='showcase' && document.getElementById('category_id').value == "JOBS") {
	   $('div.page_title').html('Вакансии').show();
      }  else
      if(service=='showcase') {
	   $('div.page_title').html('Товары').show();
      }  else
      if(service=='messages') {
	   $('div.page_title').html('Сообщения').show();
      }  else  {
        $('div.page_title').hide();
	$(".page_title_username").hide();
      }
    }
  );
}

function setDialogUsername(service) {
  $(document).ready(function() {
      if(service=='error-page') {
        $('div.page_title_username').hide();
      }	else  
	$('div.page_title_username').show();
  });
}


function openUserDialog(){
  $(document).ready(function() {
   $('.page_title_username, .current_user').on('click', function(){
       if($(".current_user").is(':hidden')) {
	      $('.current_user').show('slow');	
		$(".current_user_firstname").html("Имя: "+$("#first_name").val());
		$(".current_user_lastname").html("Фамилия: "+$("#last_name").val());
		$(".current_user_username").html("Telegram-контакт: <a href=\"https://t.me/"+$("#username").val()+"\">@"+$("#username").val()+"</a>");
	    } else {
	      $('.current_user').hide('slow');
        }
     });
  });
}

function ShowPageTitle(title){
    console.log('ShowPageTitle');	
    $('.page_title').html(`<i class="fa fa-edit"></i>${title}` );
    $('.page_title').show();
}

function SendWebData(data){
    let api = new WebAPI();
    let webRequest = new WebRequest();
    webRequest.post(
      api.sendTelegramWebDataUserMethod(), 
      api.sendTelegramWebDataUserMethodPayload(), 
      webRequest.ASYNC)
    .then(function(data) {
       	console.log('Полученные данные:', data);  
     })
    .catch(function(error) {
        console.error('Произошла ошибка:', error);
   });
};


function isDemoShopShowcase(){
	return (document.getElementById('shop_id').value == "telegram-demo-shops-showcase")
}

