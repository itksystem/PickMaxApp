
$(document).ready(function() {
    $.get('/telegram/shop/'+document.getElementById('shop_id').value+'/basket/'+document.getElementById('user_id').value,
    function(data){
       let page = "<ul>";
	let prop = {};
        prop.target = ".shop_orders_list";
	prop.list = [];
        $.each(data.basket, function( key, val) {
 	  console.log(val);
	  prop.list.push({
			id : val.order_id,
 			order : 
			 [
			   { name : val.title, class_name : "basket_item_date" },
			   { name : val.count+'</br>шт.', class_name : "basket_item_count" },
			   { name : val.sum+' &#x20bd;', class_name : "basket_item_sum" },
			   { name : `<img class="basket_product_image" src="${val.card_image}">`, class_name : "order_product_image" }			 ]
		    }
		);	 
	});
        let list = new ListComponent(prop);
	list.render();
/*	
        $('.basket_item_status_create_application').on('click', function(){
	    $.ajax({
		url : '/telegram/shop/'+document.getElementById('shop_id').value+'/basket/create-order',
		type : "POST",
		data : 
		{ 
		  shop_id    : $("#shop_id").val(),
	          user_id    : $("#user_id").val(),
		  _auth : window.Telegram.WebApp.initData
		 },
		 success : function( data ) {
			 console.log(data);
		         redirectToAnotherPage('application_success/'+data.order);
		    },
		  error : function( data ) {
			 console.log(data);
		         redirectToAnotherPage('application_failed');
    	           }
              });
         });
*/

      });
  });

