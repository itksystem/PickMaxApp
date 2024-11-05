$(document).ready(function() {
    ShowPageTitle("Редактирование главной страницы");
    $.ajaxSettings.async = false;
    let list = new ShopImageGallery()
	.activeEditor('.about-images-gallery-insert-btn')  // переработать, метод предназначен для добавления картинки с классом в элемент, неоднозначен
	.galleryLoad(document.getElementById('shop_id').value, 'gallery')
	.render('.about-images-gallery');   

    $(".page_title_addons").addClass('col-6').html(`<button class="w-100 btn btn-lg btn-success shop-promo-editor-save-btn">Сохранить&nbsp;<i class="fas fa-save"></i></button>`).show();	
    $('.shop-promo-editor-save-btn').on('click', function(){
     $.ajax({
	url : '/telegram/shop/'+$("#shop_id").val()+'/cardImage',
	type : "POST",
	data : 
		{ 
		   card_image  	: $('.shop_card_image').attr('src'),
		  _auth : window.Telegram.WebApp.initData
		 },
		 success : function( data ) {
		       console.log(data);
	               redirectToAnotherPage('promo');
		    },
		  error : function( data ) {
		       console.log(data);
		       redirectToAnotherPage('error');
    	           }
           });
      });



    $('#photofile').on('change', function(){
	   var $input = $("#photofile");
	   var fd = new FormData;
	   fd.append('img', $input.prop('files')[0]);
	   $.ajax({
	        url: '/telegram/shop/'+$("#shop_id").val()+'/gallery/photo',
	        data: fd,
	        processData: false,
	        contentType: false,
	        type: 'POST',
	        success: function (data) {
		  if(data.status=='ok') {
		    list.clear()
			.galleryLoad(document.getElementById('shop_id').value, 'gallery')
			.render('.about-images-gallery')
			.success('Изображение загружено');   
		   } else {
		      list.error('Произошла ошибка при добавлении фотографии!')
		  }	
	        },
		error: function (jqXHR, exception) {
  	           list.error(
			list.getImageLoadStatusResultMessage(jqXHR)
			   ? list.getImageLoadStatusResultMessage(jqXHR)
			   : list.getImageLoadExceptionMessage(exception)
			)
	        }
	    });
      });
 });
