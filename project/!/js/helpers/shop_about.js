$(document).ready(function() {
    ymaps.ready(init);
    let shop = new CurrentShop(shopId).setCurrentShopId(shopId);
        shop.setCurrentShopId(shopId);
    let user = new CurrentUser();
    function init(){
        // Создание карты.
        var myMap = new ymaps.Map("map", {
            center: [document.getElementById('latitude').value, document.getElementById('longitude').value],
            zoom: 18
        });
        var myPlacemark = new ymaps.Placemark([document.getElementById('latitude').value, document.getElementById('longitude').value], {
           hintContent: document.getElementById('shop_title').value, // Всплывающая подсказка при наведении
           balloonContent: document.getElementById('shop_title').value // Содержание маркера
        });
       myMap.geoObjects.add(myPlacemark);
    }
       $(".shop_description").html(shop.getDescription());
       if(shop.getOwnerId() == user.getUserId()){		
        $('div.shop_about_page').prepend(
		   `<div class="shop_about_page_btns w-100"> 
   	        	<div class="row"> 
			    <div class="col"> 
				<button class="btn btn-menu-2 btn-default float-left" onclick="location.replace('/logon')">
		        	   <i class="fa fa-edit"></i> Выход </button>
			    </div>		
			    <div class="col"> 
				<button class="btn btn-menu-2 btn-default shop_about_editor_image_btn float-right" 
			         onclick="redirectToAnotherPage('about/editor/page')">
		        	 <i class="fa fa-edit"></i> Edit
			      </button>
			    </div>		
  	   	        </div>		
	 	    </div>		
		   `);
  	        }
      (shop.getPhone() == '') ?  $('.shop-contact-phone').hide() : $(".shop-contact-phone").show();
 });
