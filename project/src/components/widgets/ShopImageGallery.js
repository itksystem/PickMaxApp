/*******************************************************************/
/* Компонент управления изображениями клиента			   */
/* Sinyagin Dmitry rel.at 10.12.2021                               */
/* 
 config.target - элемент в который проводится рендеринг компонента
 config.list[] - список
 config.list[].id - идентификатор элемента в списке
 config.list[].name - наименование атрибута списка
 config.list[].class_name - наименование класса атрибута
*/

/*******************************************************************/

class ShopImageGallery {
  config;   
    
  constructor() {
      console.log('ShopImageGallery =>');	
      this.config = {};
      this.config.list = [];
      this.api = new WebAPI();
      return this;
  }

  render(target) {
     console.log('render =>'+target);	
     this.config.target = target;
     let o = this;
     console.log(o.config.list);
     if(o.config.list.length > 0) {
       $.each(o.config.list, function( key, val) {
         $(o.config.target).append(o.addCard(val));
       }) 
      } else
      o.error(`Нет изображений в галерее`, false);

      if(this.config.activeEditor !== undefined ) {
      this.activeEditor(this.config.activeEditor);
         $(this.config.activeEditor).on('click', function(){
	   let url = '<img src="'+$(this).attr("url")+'">';
     if(tinymce.activeEditor !== null ) {	
  	   tinymce.activeEditor.insertContent(url);       
	}  else
         $('.shop_card_image').attr('src',$(this).attr("url"));
       });
     }
    this.deleteCardEventInit();
    return this;
  }

  deleteCardEventInit(){
    let o = this;
    $('.image-gallery-tumb-delete-icon').on('click', function(){
      let photo_id = $(this).attr('rel');
      let webRequest = new WebRequest();
      webRequest.delete(
         o.api.deleteShopGalleryPhotoMethod(shopId, photo_id),
         o.api.deleteShopGalleryPhotoMethodPayload(), webRequest.ASYNC)
          .then(function (data) {
	    o.clear()			
 	    .galleryLoad(document.getElementById('shop_id').value, 'gallery')
	    .render('.about-images-gallery')
	    .success('Изображение удалено.');   
          })
          .catch(function (error) {
	     o.clear()			
  	     .galleryLoad(document.getElementById('shop_id').value, 'gallery')
	     .render('.about-images-gallery')
	     .error('Ошибка при удалении!');   
          })
    });
    return this;
  }

  activeEditor(active_Editor){
     console.log('activeEditor =>'+active_Editor);	
     if(active_Editor != undefined)	
	     this.config.activeEditor = active_Editor;               
     return this;
  }

  addCard(val){
   console.log('addCard =>' + this.config.target);	
   return    $(this.config.target).append(`<div class="card image-gallery-tumb float-left" rel="${val.id}">
	   <div class="image-gallery-tumb-delete-icon" rel="${val.id}">x</div>
           <div class="row"><img src="${val.url}" class="image-gallery-tumb"></div>
           <div class="row mx-auto"><button 
		class="btn btn-green btn-sm text-center about-images-gallery-insert-btn"
		style="padding: 0 0.3rem;"  url="${val.url}" >Вставить</button></div></div>`);
  }

  clear(){
    console.log('clear =>');	
    $(this.config.target).html('');
    $(this.config.target+'-error').html('');
    this.config.list=[];
    return this;
  }

  galleryLoad(storageName, tag){
    console.log('galleryLoad =>',storageName);	
    let o = this;
    let webRequest = new WebRequest();
    let data = webRequest.get(
         o.api.getGalleryMediaLoadMethod(storageName, tag),
         o.api.getGalleryMediaLoadMethodPayload(), 
	 webRequest.SYNC);
        if(data.length > 0){
  	  data.forEach(val => {
	    o.config.list.push({
	        id: val.file_id,
	        url: val.url
	    });
	});
       } 
    return this;
  }

  error(msg, toastFlag = true){
     $(this.config.target+'-error').removeClass('image_load_success');
     $(this.config.target+'-error').html(msg);
     $(this.config.target+'-error').addClass('image_load_error');
     $(this.config.target+'-error').show();
     if(toastFlag)
       toastr.error(msg, 'Фотография', {timeOut: 5000});
    return this;
  }

  success(msg, toastFlag = true){
     $(this.config.target+'-error').removeClass('image_load_error');
     $(this.config.target+'-error').html(msg);
     $(this.config.target+'-error').addClass('image_load_success');
     $(this.config.target+'-error').show();
     if(toastFlag)
       toastr.success(msg, 'Фотография', {timeOut: 5000});
    return this;
  }
 
 getImageLoadStatusResultMessage(jqXHR){
  let error_message = null;
    if (jqXHR.status === 0) {
	error_message = 'Ошибка загрузки';
    } else if (jqXHR.status == 404) {
	error_message = 'Requested page not found (404).';
   } else  if (jqXHR.status == 413) {
	error_message = 'Ошибка 413. Слишком большой файл. Разрешено размер не более 1МБ.';
   } else if (jqXHR.status == 500) {
	error_message = 'Internal Server Error (500).';
   }
  return error_message;
 } 

 getImageLoadExceptionMessage(exception){
  let error_message = null;
    if (exception === 'parsererror') {
        error_message = 'Requested JSON parse failed.';
     } else if (exception === 'timeout') {
       error_message = 'Время загрузки истекло. Возможно проблема со связью.';
    } else if (exception === 'abort') {
       error_message = 'Запрос отправки изображения оборвался.';
    } else {
     error_message = 'Непредвиденная ошибка. ';
   }
  return error_message;
 } 

     
}


