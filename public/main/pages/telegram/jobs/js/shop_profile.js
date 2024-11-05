$(document).ready(function() {
    let shop = new CurrentShop(shopId);
    let api = new WebAPI();
    let user = new CurrentUser();
    shop.setCurrentShopId(shopId);
    $('div.page_title_addons').append(`<div class="profile_save_btn">Сохранить</div>`);
    $('div.profile_save_btn').on('click', function(){
    let webRequest = new WebRequest();
    let req = webRequest.post(
         api.saveShopUserProfileMethod(), 
         api.saveShopUserProfileMethodPayload({ 
	          user_id 		: user.getUserId(),
		  user_delivery_name 	: $("#user_delivery_name").val(),
  		  user_delivery_phone 	: $("#user_delivery_phone").val(),
		  user_delivery_address : $("#user_delivery_address").val(),
		  shop_id 		: shop.getCurrentShopId(),
		  shop_theme 		: $('input[name=theme]:checked').val(),
		  shop_showcase_columns  : $('input[name=showcase_columns]:checked').val(),
	  	  shop_payment_description : (tinymce.activeEditor != null ? tinymce.activeEditor.getContent() : null),
		  _auth : window.Telegram.WebApp.initData
		 }),
	    true)		
           .then(function(data) {
	       console.log(data);
               redirectToAnotherPage('profile/save/success');
	     })
	    .catch(function(error) {
	       console.log(data);
	       redirectToAnotherPage('error');
        });
      });
   });

