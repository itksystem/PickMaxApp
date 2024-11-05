$(document).ready(function() {
    $.get('/telegram/shop/'+document.getElementById('shop_id').value+'/properties',
	  function(data){
	    if(data.owner_id == $("#user_id").val()){		
	       $('div.shop_promo_page').prepend(
   	        `<div class="row"> 
		    <div class="col"> 
			<button class="btn btn-menu-2 btn-default float-left" 
		         onclick="location.replace('/logon')">
		         <i class="fa fa-edit"></i> Выход
		      </button>
		    </div>		
		    <div class="col"> 
			<button class="btn btn-menu-2 btn-default shop_promo_editor_image_btn float-right" 
		         onclick="redirectToAnotherPage('promo/edit')">
		         <i class="fa fa-edit"></i> Edit
		      </button>
		    </div>		
   	         </div>		
		   `);
	        }
       });
 });
