$(document).ready(function() {
    ShowPageTitle("Редактирование информации");
    let api = new WebAPI();
    let webRequest = new WebRequest();
    let user = new CurrentUser();

    $.ajaxSettings.async = false;
    let list = new ShopImageGallery()
	.activeEditor('.about-images-gallery-insert-btn')
	.galleryLoad(shopId, 'gallery')
	.render('.about-images-gallery');   

      $('#shop_phone').inputmask('+7 (999) 999-99-99', {
        oncomplete: function() {
          // Вызывается, когда ввод завершен (маска полностью заполнена)
          const phoneNumber = $(this).val();
          console.log('Введенный номер телефона:', phoneNumber);
          // Дополнительные действия при завершении ввода
        },
        onincomplete: function() {
          // Вызывается, когда ввод не завершен (маска не полностью заполнена)
          console.log('Номер телефона не полностью введен');
          // Дополнительные действия при неполном вводе
        },
        oncleared: function() {
          // Вызывается, когда поле ввода очищается
          console.log('Поле ввода очищено');
          // Дополнительные действия при очистке поля
        }
      });


    $(".page_title_addons").addClass('col-6').html(`<button class="w-100 btn btn-lg btn-success shop-about-editor-save-btn">Сохранить&nbsp;<i class="fas fa-save"></i></button>`).show();	
    $(".main").append(`<button class="w-100 btn btn-lg btn-success shop-about-editor-save-btn">Сохранить&nbsp;<i class="fas fa-save"></i></button>`);	
    $('.shop-about-editor-save-btn').on('click', function(){

    let request = webRequest.post(api.sendShopAboutInformationMethod(shopId), 
		{ 
		  shop_name  		: $("#shop_name").val(),
		  shop_address 		: $("#shop_full_address").val(),
		  shop_latitude 	: $("#shop_latitude").val(),
		  shop_longitude	: $("#shop_longitude").val(),
		  shop_phone 		: $("#shop_phone").val(),
		  shop_description 	: tinymce.activeEditor.getContent()
		 }, 
	      webRequest.ASYNC)
             .then(function(data) {
               console.log(data);
               redirectToAnotherPage('about/page');
	     })
	    .catch(function(error) {
               console.log(error);
	       redirectToAnotherPage('error');
            });
      });



    $('#photofile').on('change', function(){
	   var $input = $("#photofile");
	   var fd = new FormData;
	   fd.append('img', $input.prop('files')[0]);
           let request = webRequest.uploadFile(api.sendGalleryMediaLoadMethod(shopId), fd, true)
            .then(function(data) {
               console.log(data);
		  if(data.status =='ok') {
		    list.clear()
	 	    .galleryLoad(shopId, 'gallery').render('.about-images-gallery').success('Изображение загружено');   
		} else {
		    list.error('Произошла ошибка при добавлении фотографии!')
	        }
	     })
	    .catch(function(error) {
               console.log(error);
  	           list.error(
  	            list.getImageLoadStatusResultMessage(jqXHR)
		     ? list.getImageLoadStatusResultMessage(jqXHR)
		     : list.getImageLoadExceptionMessage(exception)
		   )
            });
      
      });

  upFile = new uploadFile();
  upFile.render('.product_card__image');
 });
