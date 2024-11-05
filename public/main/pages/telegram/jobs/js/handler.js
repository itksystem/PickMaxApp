  $(document).ready(function() {

 try {
    locationHash = location.hash.toString();
    let telegramAppChatLabs = window.Telegram.WebApp; //нужно получить объект window.Telegram.WebApp Телеграмма
    var isWebView = window.WebViewJavascriptBridge !== undefined;
    console.log("WebView "+isWebView);

    if(telegramAppChatLabs.initDataUnsafe.user !== undefined ) {
      console.log(telegramAppChatLabs.initDataUnsafe.user);
       document.getElementById("user_id").value = telegramAppChatLabs.initDataUnsafe.user.id;
       document.getElementById("first_name").value = telegramAppChatLabs.initDataUnsafe.user.first_name;
       document.getElementById("last_name").value = telegramAppChatLabs.initDataUnsafe.user.last_name;
       document.getElementById("username").value = telegramAppChatLabs.initDataUnsafe.user.username;
       $(".page_title_username").html('@'+$("#username").val());	
       SendWebData(telegramAppChatLabs.initDataUnsafe.user);
    } else {
      $.ajaxSettings.async = false;
      $.get('/main/@me', function(data){ // получаем идентификаторы
       console.log(data);
       if(data && data.telegram && data.telegram.user_id && data.telegram.shop_id) {
       	 document.getElementById("shop_id").value = (data.telegram.shop_id!== null ? data.telegram.shop_id: "");
         document.getElementById("user_id").value = (data.telegram.user_id!== null ? data.telegram.user_id: "");
         document.getElementById("first_name").value = (data.telegram.first_name!== null ? data.telegram.first_name: "");
         document.getElementById("last_name").value = (data.telegram.last_name!== null ? data.telegram.last_name: "");
         document.getElementById("username").value = (data.telegram.username);
	 console.log(document.getElementById("shop_id").value);
	 console.log(document.getElementById("user_id").value);
       	 $(".page_title_username").html('@'+$("#username").val());	
       } 
       else gotoLogon();
     });
   }
  } catch (e) {
    console.log(e);
 }

    $.ajaxSettings.async = false;
    $.get('/telegram/shop/'+document.getElementById('shop_id').value+'/basket/'+document.getElementById('user_id').value+'/count',
    function(data){
	$('.basket-counter').html(data.count);
    });

});