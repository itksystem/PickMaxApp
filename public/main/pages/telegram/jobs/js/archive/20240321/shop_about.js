$(document).ready(function() {
    ymaps.ready(init);
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

    $.get('/telegram/shop/'+document.getElementById('shop_id').value+'/properties',
	  function(data){
  	    $(".shop_description").html(data.description);
	    if(data.owner_id == $("#user_id").val()){		
	       $('div.shop_about_page').prepend(
		   `<div class="shop_about_page_btns w-100"> 
			<button class="btn btn-menu-2 btn-default shop_about_editor_image_btn float-right" 
		         onclick="redirectToAnotherPage('about/edit')">
		         <i class="fa fa-edit"></i> Edit
		      </button>
		    </div>		
		   `);
  	        }
           if(data.phone == ''){
		console.log(data.phone);
                $('.shop_phone').hide();
     	   } else {
    	    $(".shop_phone").show()
   	}

       });
/*
    var isWebView = window.WebViewJavascriptBridge !== undefined;
    console.log("WebView "+isWebView);
	$(".shop_phone_title").show()
    if(isWebView) {       
	$(".shop_phone_title").show()
     } else $(".shop_phone").show();
     */
 });
