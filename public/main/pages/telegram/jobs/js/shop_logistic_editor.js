$(document).ready(function() {
    let api = new WebAPI();
    let shop = new CurrentShop(shopId).setCurrentShopId(shopId);
    shop.setCurrentShopId(shopId);

    let user = new CurrentUser();
    let webRequest = new WebRequest();

    ShowPageTitle("Редактирование информации о доставке");

	    $.ajaxSettings.async = false;
	    let list = new ShopImageGallery()
		.activeEditor('.about-images-gallery-insert-btn')
		.galleryLoad(document.getElementById('shop_id').value, 'gallery')
		.render('.about-images-gallery');   


    $('#photofile').on('change', function(){
	   var $input = $("#photofile");
	   var fd = new FormData;
	   fd.append('img', $input.prop('files')[0]);

            let request = webRequest.uploadFile(
//	     api.saveShopGalleryPhotoMethod(shopId), api.saveShopGalleryPhotoMethodPayload(fd), true)
	     api.mediaFileSendMethod(shopId,'gallery'), api.saveShopGalleryPhotoMethodPayload(fd), true)
            .then(function(data) {
   	     if(!data) throw('Response format error');	
		  if(data.status=='ok') {
		      list.clear().galleryLoad(shopId, 'gallery').render('.about-images-gallery').success('Изображение загружено');   
		   } else {
		      list.error(data.error_message)
		  }	
	     })
	    .catch(function(error) {
       	       console.error('Произошла ошибка:', error);
 	       list.error(
 		  list.getImageLoadStatusResultMessage(error)
		     ? list.getImageLoadStatusResultMessage(error)
		     : list.getImageLoadExceptionMessage(error)
      	        )
            });
        });


  	    $("#shop_logistic_description").val(shop.getLogistic());
	    $('button.logistic-editor-save-btn').on('click', function(){

            let request = webRequest.post(
	             api.saveShopLogisticMethod(shopId), 
         	     api.saveShopLogisticMethodPayload(tinymce.activeEditor.getContent()), true)
            .then(function(data) {
                  console.log(data);
                  if(data.shop_id == undefined) throw('Ошибка при получени данных');
 		  redirectToAnotherPage('logistic/page');
	     })
	    .catch(function(error) {
       	       console.error('Произошла ошибка:', error);
	       redirectToAnotherPage('error');
          });
      });
});
