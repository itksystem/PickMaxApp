/* eslint-disable no-unused-vars */
/* eslint-disable unicorn/no-abusive-eslint-disable */
/*******************************************************************/
/* Компонент управления медиафайлами клиента			   */
/* Sinyagin Dmitry rel.at 28.03.2024                               */
/*
 config.target - элемент в который проводится рендеринг компонента
 config.list[] - список
 config.list[].id - идентификатор элемента в списке
 config.list[].name - наименование атрибута списка
 config.list[].class_name - наименование класса атрибута
*/

/*******************************************************************/

/* eslint-disable */

class ShopCardMediaGallery {
  constructor() {    
    console.log('ShopImageGallery =>')
    this.config = {}
    this.config.list = []    
    this.config.ya_list = []    
    this.config.mediaFilesSearchFeature = false;    
    this.config.searchWordElementInput = null;
    this.config.searchWordElementInputValue = null;

    this.api = new WebAPI();
    console.log(this.api);
    return this
  }

  render(target = null ) {    
    console.log('render =>', target)
    try{
      if(!target) throw('Rendering tardet not initialize...');
       const o = this;
/*  Инициализация */
    this.config.target = target
    this.config.targetPlacement = `${this.config.target}-gallery-box`
    this.config.targetMediaFilesSearchGallery = (`${this.config.target}-search-media-gallery-box`).replace(/^\./, '')
    this.config.targetMediaFilesSearchButton = (`${this.config.target}-search-mediafiles-button-box`).replace(/^\./, '')
    this.config.targetMediaFilesSearchChoiceButton = (`${this.config.target}-search-mediafiles-choice-button-box`).replace(/^\./, '')
    this.config.targetMediaFilesSearchSidebar = (`${this.config.target}-sidebar-box`).replace(/^\./, '')
    this.config.targetMediaFilesSearchSidebarBody = (`${this.config.target}-sidebar-box-body`).replace(/^\./, '')
    this.config.targetMediaFilesSearchSidebarTitle = 'Подобрать фото';
    this.config.targetMediaFilesSearchSidebarButton = 'добавить';
    this.config.mediaFilesSearchButton = (`${this.config.target}-search-mediafiles-button`).replace(/^\./, '')
    this.config.uploadButton = (`${this.config.target}-upload-button`).replace(/^\./, '')
    this.config.uploadButtonTitle = 'Загрузить фото'
    this.config.loading = (`${this.config.target}-loading-img`).replace(/^\./, '')
    this.config.photoImage = (`${this.config.target}-photo-image`).replace(/^\./, '')
    this.config.errorMessage=(`${this.config.target}-error`).replace(/^\./, '')
    this.config.loadingImage=`/main/images/loaders/loading_v7.gif`;
    this.config.NoPhotoImage="/main/images/banners/no_photo_image.png";
    this.config.defaultPhotoImageUrl = null;
    this.config.sidebarOpened = false;
    this.config.handleImageUploadFailureMessage = 'Произошла ошибка при добавлении фотографии!'
    this.config.handleImageUploadSuccessMessage = 'Фотография добавлена к карточке товара!'
    this.config.toastImageUploadTitle = 'Фотография'
    this.config.toastError = 'Ошибка!'
    this.config.limitProductCardGalleryMediaCount = 5;
    this.config.limitProductCardGalleryMediaCountErrorMessage = 'Нельзя более 5 фотографий на товар!';

    this.config.mediaFilesSearchLoadMessageError = 'Нет возможности получить подборку фотографий';
    this.config.errorMessageCode0 = 'Ошибка загрузки'
    this.config.errorMessageCode401 = 'Ошибка 401. Необходима авторизация'
    this.config.errorMessageCode402 = 'Ошибка 402. Ошибка процесса. '
    this.config.errorMessageCode403 = 'Ошибка 403. Ошибка доступа.'
    this.config.errorMessageCode404 = 'Ошибка 404. Ресурс отсутствует.'
    this.config.errorMessageCode413 = 'Ошибка 413. Слишком большой файл. Разрешено размер не более 1МБ.'
    this.config.errorMessageCode500 = 'Ошибка 500. Internal Server Error.'
    this.config.errorParserMessageCode = 'Ошибка обработки данных в ответе с сервера.'
    this.config.errorMessageTimeoutCode = 'Время загрузки истекло. Возможно проблема со связью.'
    this.config.errorMessageAbortCode = 'Запрос отправки изображения оборвался.'
    this.config.errorMessageUnknowCode = 'Непредвиденная ошибка.'
    this.config.setImageDrawableMessage = 'Установлено новое главное изображение.'
    this.config.setImageDrawableErrorMessage = 'Ошибка установки изображения.'
    this.config.deleteImageErrorMessage = 'Ошибка при удалении!'
    this.config.deleteImageMessage = 'Изображение удалено.'

/* --------------------------- */
    this.clear(); // очистка компонента
    this.getMediaFilesList(); // загрузка фото
    this.init(); // инициализация компонента
    this.mediaRefresh(); // обновление медиаполигона
    this.deleteCardEventInit()  // установить события
    this.setMediaMainEventInit()
    this.uploadButtonClick()        
    this.mediaFilesSearchButtonOnClick()
   } catch(e) {
      console.log('render.catch.error =>', e)
    }
    return this
  }

  isNotObject(value) {
       return typeof value !== 'object' || value === null;
  }

  setShopId(shopId = null){ this.config.shopId = shopId; return this;}
  getShopId(){ return this.config.shopId;}

  setProductId(productId = null ){ this.config.productId=productId; return this;}
  getProductId(){return this.config.productId; }

// сохранить идентификатор элемента строки для поиска
  setMediaSearchWordInputElement(el = null ){ this.config.searchWordElementInput = el; return this;}

// получить идентификатор элемента строки для поиска
  getMediaSearchWordInputElement(){return this.config.searchWordElementInput; }

// Получить последнее значение выполненной поисковой строки 
  setSavedSearchValue(el = null ){ this.config.savedSearchValue = el; return this;}

// Получить последнее значение выполненной поисковой строки 
  getSavedSearchValue(){ ; return this.config.savedSearchValue;}

// получить значение поисковой строки 
  getMediaSearchWordInputElementValue(){return $(this.config.searchWordElementInput).val();}
 
  mediaRefresh(){
     const o = this;
     $.each(o.config.list, (key, val) => {
           $(o.config.targetPlacement).append(o.getPhotoCard(val))
     })
     o.displayDefaultPage(o.getDefaultPhoto(o.config.list, 'checked', 1))
    return this;
  }

  deleteCardEventInit() {
  try {
    const o = this;
     $('.media-tumb-delete-icon').off('click').on('click', function() {
      console.log('deleteCardEventInit');
      let webRequest = new WebRequest();
      let request = webRequest.delete(
	o.api.deleteMediaFromProductCardMethod($('#shop_id').val(), $("#product_id").val(), $(this).attr('rel')),
	{},
	webRequest.ASYNC)
            .then(function (data) {
                o.clear().render(o.config.target).success(o.config.deleteImageMessage);
              })
             .catch(function (error) {
                o.clear().render(o.config.target).error(o.config.deleteImageErrorMessage);
               });

      });
    } catch (e) {
      console.log('deleteCardEventInit', e);
   }
   return this;
 }

 setMediaMainEventInit(){
  try {
   let o = this;
   $('.media-fix-main-image-icon').off('click').on('click', function() {
     let el = this;
     const rel = $(this).attr('rel');
     console.log('setMediaMainEventInit');       	
     $(`.${o.config.errorMessage}`).removeClass('image_load_success').removeClass('image_load_error').html('').show();

     let webRequest = new WebRequest();
     let request = webRequest.post(
	o.api.mediaFilesForProductCardCheckedMethod($('#shop_id').val(), $("#product_id").val(), $(this).attr('rel')),
	o.api.mediaFilesForProductCardCheckedMethodPayload($(this).attr('url')),
	webRequest.ASYNC)
            .then(function (data) {
                $('i.media-fix-main-image.fa-solid').removeClass('fa-solid').addClass('fa-regular'); 		
	        $(`i[rel="${rel}"]`).addClass('fa-solid'); 		
		o.displayDefaultPage({url : $(el).attr('url')}) 
	        $(`.${o.config.errorMessage}`).addClass('image_load_success').removeClass('image_load_error').html(o.config.setImageDrawableMessage).show();
              })
             .catch(function (error) {
                console.error(error);
                 $(`.${o.config.errorMessage}`).removeClass('image_load_success').addClass('image_load_error').html(o.config.setImageDrawableErrorMessage).show();
	         toastr.error(o.config.toastError, o.config.toastImageUploadTitle, { timeOut: 5000 });
               });
       });
   } catch (e) {
    console.log('setMediaMainEventInit', e);
   }
   return this;
}


  activeEditor(active_Editor){
     console.log('activeEditor =>',active_Editor);	
     this.config.activeEditor = active_Editor;               
     return this;
  }

  init(){
   $(this.config.target).append(`
    <div class="row">
      <div class="card w-100">
	  <div class="row" style="padding: 1rem;">
	     <div class="col-8 w-100">
	        <div class="shop_promo_page_btns w-100"> 
		      <form id="fileupload" name="fileupload">  	  	   
			<button class="btn btn-lg btn-red profile-image-change">
			  <i class="fas fa-image"></i>
			  <input type="file" name="files[]" accept=".jpg, .jpeg, .png" class="${this.config.uploadButton}" multiple style="opacity: 0; width: 100%; position: absolute; left: 0; top: 0;">
			  ${this.config.uploadButtonTitle}
			</button>
		      </form>
	        </div>		
              </div>
	     <div class="col-4 mx-auto d-flex justify-content-end ${this.config.targetMediaFilesSearchButton}">
	     </div>	
 	   </div>
	  <div class="row" style="padding: 1rem;">
	    <div class="col ${this.config.targetPlacement.replace(/^\./, "")}"></div> 
	 </div> 
      </div>		
      </div>
   </div>
  <div class="row">
  <div class="col w-100">
	      <div class="row">
		       <div class="col w-100" ><h2>Изображение по умолчанию</h2></div> 
	       </div>
               <div class="row">
		        <div class="col profile-photo-load-poligon">
			   <a href="#" class="card-image-thumbnail" >
		               <img class="${this.config.photoImage} elevation-2 img-circle-5" src="${this.config.NoPhotoImage}" >
			   </a>
		    </div>
              </div>
        </div>
 </div>
 <div class="row input-group">
    <div class="col">
        <div class="${this.config.errorMessage}"></div>
   </div>
 </div>
  `);
    if(this.config.mediaFilesSearchFeature) {
        this.mediaFilesSearchButtonRender(`.${this.config.targetMediaFilesSearchButton}`)
        this.enableMediaFilesSearchButton() 
    } else 
     this.disableMediaFilesSearchButton()		

   return this;
 }

  getPhotoCard(val){
  console.log('getPhotoCard =>', val);	
  let checked = (val.checked == 0 ? 'fa-regular': 'fa-solid')
  return `
         <div class="media-card media-tumb float-left" rel="${val.id}">
	   <div class="media-tumb-delete-icon" rel="${val.id}">
		<i class="fa-solid fa-circle-xmark"></i>
	   </div>
           <div class="row">
		<img src="${val.url}" class="media-tumb">
  	   </div>
           <div class="row mx-auto">
              <button class="btn btn-lg text-center media-fix-main-image-icon" rel="${val.id}" style="padding: 0 0.3rem;"  url="${val.url}" >
	           <i class="${checked} fa-star media-fix-main-image" rel="${val.id}"></i>
             </button>
          </div>
       </div>`;
  }

  clear() {
   console.log('clear =>');	 
   $(this.config.target).empty(); // Очистка содержимого целевого элемента
   $(`.${this.config.errorMessage}`).empty(); // Очистка элементов с классом errorMessage
   this.config.list.length = 0; // Очистка массива list
   return this;
  }

 getDefaultPhoto(arr, parameter, value) {
   let result = arr.find(obj => obj[parameter] === value);
   console.log('getDefaultPhoto = > ', result);
   return result || {url : this.config.NoPhotoImage};
 }

 getGalleryPhotoCount() {
   console.log('getGalleryPhotoCount = > ', this.config.list.length);
   return this.config.list.length;
 }


 displayDefaultPage(img = null) {
   if(!img) img = {url : this.config.NoPhotoImage};
   console.log('displayDefaultPage => ', img);
   $(`.${this.config.photoImage}`).attr('src', img.url).removeClass('card-photo-image-loading').addClass('card-photo-image');   
   this.config.defaultPhotoImageUrl = img.url;
   $('#product_image_url').val(this.config.defaultPhotoImageUrl)
   return this;
 }

/* Включить фичу подбора картинок  */ 
  setMediaFilesFeature( flag = false){
     this.config.mediaFilesSearchFeature = flag;    
     console.log('mediaFilesSearchFeature=',this.config.mediaFilesSearchFeature);
     return this;
  }

/* Рендерим вывод */
  getMediaFilesSearchRenderRefresh( ){
     console.log('getMediaFilesSearchRenderRefresh');
     if(!this.config.mediaFilesSearchFeature) return this;
     $(`.${this.config.targetMediaFilesSearchGallery}`).empty(); // очищаем элемент вывода
     return this;
  }

  enableMediaFilesSearchButton(){
     console.log('enableMediaFilesSearchButton');
     if(!this.config.mediaFilesSearchFeature) return this;
     $(`.${this.config.mediaFilesSearchButton}`).show(); // очищаем элемент вывода
     return this;
  }

  disableMediaFilesSearchButton(){
     console.log('disableMediaFilesSearchButton');
     if(!this.config.mediaFilesSearchFeature) return this;
     $(`.${this.config.mediaFilesSearchButton}`).hide(); // очищаем элемент вывода
     return this;
  }

  mediaFilesSearchButtonRender(target){
     console.log('mediaFilesSearchButtonRender');
     if(!this.config.mediaFilesSearchFeature) return this;
     $(target).html(`<button class="btn btn-lg btn-red text-center ${this.config.mediaFilesSearchButton}"><i class="fa-solid fa-icons"></i></button>`);
     return this;
  }

  mediaFilesSearchCard(val){
     if(!this.config.mediaFilesSearchFeature || !val) return '';
     let checked = (val.checked == 0 ? 'fa-regular': 'fa-solid')
     return `
         <div class="sidebar-media-card media-tumb float-left" rel="${val.id}">
           <div class="row">
          	<img src="${val.url}" class="sidebar-media-tumb">
  	        </div>
           <div class="row">
             <div class="col-md-8 mx-auto d-flex justify-content-center">
              <button class="btn btn-sm btn-green  ${this.config.targetMediaFilesSearchChoiceButton} sidebar-add-gallery-button" rel="${val.id}" style="padding: 0.3rem 1rem;"  url="${val.url}" >
	           <i class="fa-solid fa-circle-plus"></i> ${this.config.targetMediaFilesSearchSidebarButton}
             </button>
            </div>
          </div>
       </div>`;
 }

  mediaFilesSearchListOutputRender(target){
    console.log('mediaFilesSearchListOutputRender');
    let o = this;
     if(!o.config.mediaFilesSearchFeature) return this;
      $(target).empty();
        $.each(o.config.ya_list, (key, val) => {
          $(target).append(o.mediaFilesSearchCard(val))
     })
    o.mediaFilesSearchCloserButtonOnClick();
    o.mediaFilesChoiceOnClick();
   return this;
  }

  mediaFilesSearchSidebarExist(){
     return ($(this.config.targetMediaFilesSearchSidebar).length === 0)
  } 

  mediaFilesSearchSidebarRender(){
    console.log('mediaFilesSearchSidebarRender =>',this.config.targetMediaFilesSearchSidebar);
    if(!this.config.mediaFilesSearchFeature) return this;
    let o = this;
       $(this.config.target).append(`
          <div class="${this.config.targetMediaFilesSearchSidebar} float-left sidebar-box-style" >
	          <div class="row sidebar-box-title-style">
	            <div class="col-10 w-100 ${this.config.targetMediaFilesSearchSidebar}-title sidebar-box-title-style">${this.config.targetMediaFilesSearchSidebarTitle}</div>
	           <div class="col-2 w-100 sidebar-box-title-closer-style">
	        	  <button class="${this.config.targetMediaFilesSearchSidebar}-title-close-button"><i class="fa-solid fa-xmark"></i></button>
	          </div>
  	     </div>
            <div class="row">
	        <div class="col-sm w-100 ${this.config.targetMediaFilesSearchSidebarBody}"></div>
  	    </div>
      </div>`);
    return this;
  }

  mediaFilesSearchCloserButtonOnClick(){
     let o = this;
      $(document).on('click', function(event){        // Проверяем, был ли клик вне области кнопки, при открытом сайдбаре
         if( o.config.sidebarOpened &&  !$(event.target).closest('.'+o.config.targetMediaFilesSearchSidebarBody).length) {           // Если да, выполните нужные действия
            console.log('Sidebar close =>', event.target);       	
            $('.'+o.config.targetMediaFilesSearchSidebar).hide("slide", { direction: "right" }, 500);
            o.config.sidebarOpened = false;
       	    event.stopPropagation();
        } 
     });
    return this;
  }


  mediaFilesSearchButtonOnClick(){
    console.log('mediaFilesSearchButtonOnClick =>', this.config.mediaFilesSearchFeature, this.getMediaSearchWordInputElementValue());
    if(!this.config.mediaFilesSearchFeature ) return this;
    let o = this;
    o.mediaFilesSearchSidebarRender();
     $(`.${this.config.targetMediaFilesSearchButton} `).off('click').on('click', async function(event) {
         event.stopPropagation();      
         if(!o.getMediaSearchWordInputElementValue()) { 
	        toastr.info('Для подбора фотографий укажите название товара',  'Галерея', {timeOut: 5000});		   
	 } else {
         if((o.getMediaSearchWordInputElementValue() !=  o.getSavedSearchValue()) ||  o.config.ya_list.length == 0) {
                 await o.getYandexMediaFilesList(o.getMediaSearchWordInputElementValue())	    
                 o.setSavedSearchValue(o.getMediaSearchWordInputElementValue());
             } else {
            console.log('Фотографии уже загружены');
          }     
         o.mediaFilesSearchListOutputRender('.'+o.config.targetMediaFilesSearchSidebarBody);
         $('.'+o.config.targetMediaFilesSearchSidebar).show("slide", { direction: "right" }, 500);
         o.config.sidebarOpened = true;
       }
     });
    return this;
  }


 async mediaFilesChoiceOnClick(){    
    if(!this.config.mediaFilesSearchFeature ) return this;
    let o = this;
     $(`.${o.config.targetMediaFilesSearchChoiceButton}`).off('click').on('click', async function(event) {              
      console.log('mediaFilesChoiceOnClick =>');
    if(o.getGalleryPhotoCount() < o.config.limitProductCardGalleryMediaCount ) {
        event.stopPropagation();                       
        try{
          o.displayDefaultPage({url : $(this).attr('url')})        

         let webRequest = new WebRequest();
         let request = webRequest.post(
 	     o.api.sendFileToGalleryMethod($("#shop_id").val(), $("#product_id").val()),
  	     o.api.sendFileToGalleryMethodPayload(),
	       webRequest.ASYNC)
                .then(function (data) {
                   o.clear().render(o.config.target).success('Изображение загружено!');
                 })
                .catch(function (error) {
                   toastr.error(data.responseJSON.error_message, 'Фотография', { timeOut: 5000 });
                });
           }catch(e){
         console.log('mediaFilesChoiceOnClick.catch.error =>',e);
        }        
      } else
        toastr.error(o.config.limitProductCardGalleryMediaCountErrorMessage, o.config.toastImageUploadTitle, {timeOut: 5000});		
   });	          
    return this;
  }

 
 async getYandexMediaFilesList(searchWord){
   console.log('getYandexMediaFilesList =>', searchWord);	
   let o = this;
   if(!o.config.mediaFilesSearchFeature || !searchWord) return this;
   try{
      let webRequest = new WebRequest();
      let data = webRequest.get(o.api.getMediaSearchWordListMethod(searchWord), {},  webRequest.SYNC )
         console.log(data);	
         if(o.isNotObject(data)) throw(o.config.mediaFilesSearchLoadMessageError);
          o.config.ya_list=[];
	  $.each(data, async function( key, val) {
	    o.config.ya_list.push({id  : val.file_id, url :  val.url , checked :  val.checked});	 
	  });

         } catch (e) {
       toastr.error(e, o.config.toastImageUploadTitle, {timeOut: 5000});
     }
    return this;
  }

/* выводим картинки */
  getMediaFilesList(){
  try{
  console.log('getMediaFilesList =>');	
    if(!this.getShopId()) throw('getShopId not initialize..')
    if(!this.getProductId()) throw('getProductId not initialize..')
    let o = this;
    let webRequest = new WebRequest();
    let data = webRequest.get(
	    o.api.getMediaFilesForProductCardMethod(o.getShopId(),o.getProductId()), 
	    o.api.getMediaFilesForProductCardMethodPayload(),
	    webRequest.SYNC )
            console.log(data);	
	    $.each(data, async function( key, val) {
	        o.config.list.push({id  : val.file_id, url :  val.url , checked :  val.checked});	 
  	    }); 
	  } catch (e) {
          console.log('getMediaFilesList.catch.error =>', e);
        }
    return this;
  }


  error(msg){
     $(`.${this.config.errorMessage}`).removeClass('image_load_success').addClass('image_load_error').html(msg).show();
     toastr.error(msg, this.config.toastImageUploadTitle, {timeOut: 5000});
     return this;
  }

  success(msg){
     $(`.${this.config.errorMessage}`).removeClass('image_load_error').addClass('image_load_success').html(msg).show()
     toastr.success(msg, this.config.toastImageUploadTitle, {timeOut: 5000});
     return this;
  }

 errorMessage(error, message){
   $("#product_image_error").html((error == false ? '' : message));	
   toastr[error ? 'error' : 'success'](
	  error ?  this.config.handleImageUploadFailureMessage : this.config.handleImageUploadSuccessMessage, this.config.toastImageUploadTitle,  { timeOut: 5000 });
  return this;
 }
 
 mainImageUpdate(data){
   const o = this;
   $(".card-image-thumbnail[data-lightbox='card-image-"+$("#product_id").val()+"']").attr("href", (data.status=='ok' ?  data.url : `${o.config.NoPhotoImage}`));	
   $(`.${o.config.photoImage}`).attr("src",  (data.status=='ok' ?  data.url : `${o.config.NoPhotoImage}`));	
  return this;
 }

 getErrorMessage(jqXHR = null) {
  const errorMessages = {
    0: this.config.errorMessageCode0,
    401: this.config.errorMessageCode401,
    402: this.config.errorMessageCode402,
    403: this.config.errorMessageCode403,
    404: this.config.errorMessageCode404,
    413: this.config.errorMessageCode413,
    500: this.config.errorMessageCode500,
    parsererror: this.config.errorParserMessageCode,
    timeout: this.config.errorMessageTimeoutCode,
    abort: this.config.errorMessageAbortCode,
  };

  if (jqXHR == null || jqXHR.status === undefined) {
    return this.config.errorMessageUnknowCode;
  }

  const status = jqXHR.status;
  let errorMessage = errorMessages[status] || this.config.errorMessageUnknowCode;

  if (jqXHR.status && jqXHR.text) {
    errorMessage = jqXHR.text;
  }
  return errorMessage;
}



 uploadButtonClick() {
   try {
    const o = this;
    $(`.${this.config.uploadButton}`).off('change').on('change', function() {
      const $input = $(this);
      const fd = new FormData();
      fd.append('img', $input.prop('files')[0]);
      $(`.${o.config.photoImage}`).attr("src", `${o.config.loadingImage}`).addClass(`${o.config.loading}`).removeClass(`elevation-2`);
       let webRequest = new WebRequest();
       let request = webRequest.uploadFile(
		o.api.mediaFileSendMethod($("#shop_id").val(), $("#product_id").val()),
		o.api.mediaFileSendMethodPayload(fd),
		webRequest.SYNC)
            .then(function(data) {
		 console.log(data);
	          if (data.status === 'ok') {
	            $(`.${o.config.photoImage}`).addClass(`elevation-2`).attr("src", data.url);
	            o.clear().render(o.config.target).success('Изображение загружено!');
        	  } else {
	            o.mainImageUpdate({status: 'error', error_message: 0}).error(o.getErrorMessage({status: 0}, 0));
	          }
	     })
	    .catch(function(error) {
               console.log(error);
	       o.mainImageUpdate({status: 'error', error_message: o.getErrorMessage(error)}).error(o.getErrorMessage(error));
            });                                                      

    });
  } catch (e) {
    console.log('uploadClickEvent =>', e);
  }
}}


