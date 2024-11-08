$(document).ready(function() {
    let shop = new CurrentShop(shopId).setCurrentShopId(shopId);
        shop.setCurrentShopId(shopId);
    let user = new CurrentUser();
    $(".shop_logistic_description").html(shop.getLogistic());
    if(shop.getOwnerId() == user.getUserId()){		
	  $('div.logistic_editor').append(`<button class="btn btn-menu-2 btn-default  logistic_editor_btn float-right" 
		   onclick="redirectToAnotherPage('logistic/editor/page')"><i class="fa fa-edit"></i> Edit</button>
 	    </button>`);
     }
});
