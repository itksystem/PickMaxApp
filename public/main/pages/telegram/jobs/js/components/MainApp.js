class MainApp {
   constructor() {
    this.config = {
      feature: true,
      console: true
    };
      this.logger(`MainApp.constructor`);
      this.api = new WebAPI();
      this.page = 1; // Номер текущей страницы
      this.limit = 10; // Количество товаров для загрузки за раз
      this.loading = false; // Флаг, чтобы предотвратить повторную загрузку данных   
      return this;
   }

  pageTitle(title){
    this.logger(`pageTitle`);
    $('.page_title').html(`<i class="fa fa-edit"></i>${title}` );
    $('.page_title').show();
    return this;
  }

  pageTitleAddons(title){
    this.logger(`pageTitle`);
    $('.page_title').html(`<i class="fa fa-edit"></i>${title}` );
    $('.page_title').show();
    return this;
  }


  page(){
    this.logger(`page`);
    return this;
  } 

  goto(url){
    redirectToAnotherPage(url)
    return this;
  } 

  setUser(user){
    this.user = user;
    return this;
  } 


  onPageClick(selector, url){
    let o = this;
    $(selector).on('click', function(){
       	  o.goto(url);
    });

    return this;
  } 

  messageCountBadge(shopId = null, user = null, visible = false){
   try{
      if(!visible || !shopId || !user) return this; 
      let webRequest = new WebRequest();
      let request = webRequest.get(this.api.getShopMessagesCountMethod(shopId, user.getUserId()), {}, false)
	    .then(function(data) {
		if(data.count > 0){
		      $('#mail_counter').addClass('badge-success');
	  	      $('.profile-messages-plg').html(`Количество писем в списке заказов - `+ data.count + ` шт.` );
	             } else {	
		       $('.profile-messages-plg').html(`У вас нет писем в списке заказов`);                                                        
		       $('#mail_counter').hide();
		   }
	      $('#mail_counter').attr('counter',data.count);
	      $('#mail_counter').html(data.count);
 	     })
	    .catch(function(error) {
		this.logger('messageCountBadge ошибка =>', error);
	    });
        } catch(e) {
      this.logger('messageCountBadge.js.catch =>', e);
    }
    return this; 
  }

  initializeProductCard (shopId = null, product_id = null){
   try{
      if(!shopId || !product_id) return this; 
      let o = this;
      let webRequest = new WebRequest();
      let request = webRequest.get(
	    this.api.getShopProductInfoMethod(shopId, product_id), {}, false)
	    .then(function(data) {
		$('div.product_card__description').html(data.description);
		if(data.owner_id == o.user.getUserId()){		
		$('div.card_editor').append(
		`<button class="btn btn-menu-2 btn-default" onclick="redirectToAnotherPage('products/${product_id}/editor/page')">
		   <i class="fa fa-edit"></i>&nbsp;Изменить</button>`);
		 $('div.card_editor').append(
		   (data.blocked)
	             ? `<button class="float-left btn btn-menu-2 btn-default card_editor_unblocking_btn"><i class="fa fa-eye"></i>&nbsp;Активен</button>`
	 	     : `<button class="float-left btn btn-menu-2 btn-default card_editor_blocking_btn"><i class="fa fa-eye-slash"></i>&nbsp;Скрыть</button>`
		  );
		 $('div.card_editor').append(
	 	     `<button class="float-left btn btn-menu-2 btn-default card_editor_delete_btn"><i class="fa fa-trash"></i>&nbsp;Удалить</button>`
		  );
		 o.setProductCardDeleteEventButton(shopId, product_id);
		 o.setProductCardBlockingEventButton(shopId, product_id);
	        }
 	     })
	    .catch(function(error) {
		o.logger('initializeProductCard.Произошла ошибка =>', error);
	    });
        } catch(e) {
      o.logger('initializeProductCard.catch =>', e);
    }
    return this; 
  }

  getProductCardMyLike (shopId = null, product_id = null){
   try{
      if(!shopId || !product_id) return this; 
      let webRequest = new WebRequest();
      let request = webRequest.get(
	    this.api.getShopProductMyLikeMethod(shopId, product_id), {}, false)
	    .then(function(data) {
		if(data.like == 1) {
                    $('.product_card_like_btn').removeClass('fa-regular').addClass('fa-solid');//.css('color', 'red');
		} else {
                    $('.product_card_like_btn').removeClass('fa-solid').addClass('fa-regular');//.css('color', 'black');
		}
 	     })
	    .catch(function(error) {
		this.logger('getProductCardMyLike.Произошла ошибка =>', error);
	    });
        } catch(e) {
      this.logger('getProductCardMyLike.catch =>', e);
    }
    return this; 
  }


 setProductCardLikeEventButton (shopId = null, product_id = null){
   try{
    let o = this;
    $('.product_card_like_btn').on('click', function(){
      if(!shopId || !product_id) return this; 
      let webRequest = new WebRequest();
      let request = webRequest.post(
	    o.api.setShopProductLikeMethod(shopId, product_id), 
		{
		  like  : $('.product_card_like_btn').hasClass('fa-regular')
		}, webRequest.ASYNC)
	    .then(function(data) {
		if(data.like == 1) {
                    $('.product_card_like_btn').removeClass('fa-regular').addClass('fa-solid');//.css('color', 'red');
		} else {
                    $('.product_card_like_btn').removeClass('fa-solid').addClass('fa-regular');//.css('color', 'black');
		}
 	     })
	    .catch(function(error) {
		this.logger('setProductCardLikeEventButton.Произошла ошибка =>', error);
	    });
       });
     } catch(e) {
      this.logger('setProductCardLikeEventButton.catch =>', e);
    }
    return this; 
 }

 setProductCardDeleteEventButton (shopId = null, product_id = null){
   try{
    let o = this;
    if(!shopId || !product_id) return this; 
    $('button.card_editor_delete_btn').on('click', function(){
     let webRequest = new WebRequest();
      let request = webRequest.delete(
	    o.api.setShopProductDeleteMethod(shopId, product_id), {}, webRequest.ASYNC)
	    .then(function(data) {
		   toastr.info('Карточка удалена!', 'Товар', {timeOut: 5000});
	           redirectToAnotherPage(`products/page`);
 	     })
	    .catch(function(error) {
		o.logger('setProductCardDeleteEventButton.Произошла ошибка =>', error);
		redirectToAnotherPage('error'); 
	    });
       });
     } catch(e) {
      this.logger('setProductCardDeleteEventButton.catch =>', e);
    }
    return this; 
 }

 setProductCardBlockingEventButton (shopId = null, product_id = null){
   try{
    let o = this;
    if(!shopId || !product_id) return this; 
    $('button.card_editor_unblocking_btn, button.card_editor_blocking_btn').on('click', function(){
      let blocking = $(this).hasClass("card_editor_blocking_btn");
      let webRequest = new WebRequest();
      let request = webRequest.post(
	    o.api.setShopProductBlockingMethod(shopId, product_id), { blocking : blocking }, webRequest.ASYNC)
	    .then(function(data) {
		   toastr.info((blocking ? 'Карточка скрыта!' : 'Карточка открыта!'), 'Товар', {timeOut: 5000});
  	           redirectToAnotherPage(`products/${product_id}/page`);
 	     })
	    .catch(function(error) {
		o.logger('setProductCardBlockingEventButton.Произошла ошибка =>', error);
		redirectToAnotherPage('error'); 
	    });
       });
     } catch(e) {
      this.logger('setProductCardBlockingEventButton.catch =>', e);
    }
    return this; 
 }


 addProductToBasketEventButton(shopId = null, product_id = null){
   try{
    let o = this;
    if(!shopId) return this; 
    $('button.card-order-btn').on('click', function(){
      let blocking = $(this).hasClass("card_editor_blocking_btn");
      let webRequest = new WebRequest();
      let request = webRequest.post(
	    o.api.addShopProductToBasketMethod(shopId),
   	    o.api.addShopProductToBasketPayload(product_id),
  	     webRequest.ASYNC)
	    .then(function(data) {
		o.logger('addProductToBasketEventButton. =>', data);
	        redirectToAnotherPage(`basket/page`);
 	     })
	    .catch(function(error) {
		o.logger('addProductToBasketEventButton.Произошла ошибка =>', error);
		toastr.info('Ой! Что-то пошло не так...', 'Заказ', {timeOut: 5000});
	    });
       });
     } catch(e) {
      this.logger('addProductToBasketEventButton.catch =>', e);
    }
    return this; 
 }


  addShowCaseReturnEventButton(product_id = null){
   if(product_id) 
      $('button.pred-showcase-btn').on('click', function(){
 		redirectToAnotherPage(`products/page?#${product_id}`); 
      });
   return this;
  }


  shopCardMediaGalleryOutput(shopId = null, productId = null){
   try{
     const shopCardMediaGallery = new ShopCardMediaGallery();
     const shopCardMediaGalleryСontext = this; // Сохраняем контекст класса
     shopCardMediaGallery
	.setMediaFilesFeature(true)
        .setShopId(shopId)
	.setProductId(productId)
	.setMediaSearchWordInputElement('#title')
	.render('.card-media-component');
     } catch(e) {
      this.logger('shopCardMediaGalleryOutput.catch =>', e);
    }
    return this; 
  }

 setProductCardDescription(description){
   if(description)
      $('#description').html(description);
   return this;
 }

 getProductCardDescription(){
   return tinymce.activeEditor.getContent()
 }

 setProductCardImage(image){
   $('#product_image_url').html((image  == '') || image == undefined ? this.api.NO_PHOTO_IMAGE_URL : image);
   return this;
 }

 getProductCardImage(){  
   return ($("#product_image_url").val() == '' ? this.api.NO_PHOTO_IMAGE_URL : $("#product_image_url").val());
 }

 setProductCardTitle(title){  
   $('#title').html(title);
   return this;
 }


 getProductCardTitle(){  
   return $('#title').val();
 }

 setProductCardPrice(price){  
   $('#price').html(price);
   return this;
 }

 getProductCardPrice(){  
   return $('#price').val();
 }

 setProductCardImageTransitionFlag(){
   return this;
 }

 getProductCardImageTransitionFlag(){
   return $('input[name="image-view-transition-type"]:checked').val();
 }

 getProductCardImageLoopFlag(){
   return $('input[name="image-view-transition-loop"]').is(':checked');
 }

 productCardEventButtonDisabled(disabled = false){
    $('.card-editor-save-btn').prop('disabled', disabled)
 }

 saveProductCardEventButton(product_id){
    let o = this;
   window.onload = function() {
    $(".page_title_addons,.card-editor-save-btn-contaner").html(
	`<button class="w-100 btn btn-lg btn-success card-editor-save-btn">Сохранить&nbsp;
	     <i class="fas fa-save"></i>
	</button>`).show();	
    o.productCardEventButtonDisabled((o.getProductCardTitle().trim() === '' || o.getProductCardPrice().trim()  === ''))

    $('#title, #price').on('change blur keyup', function(){
 	 o.productCardEventButtonDisabled((o.getProductCardTitle().trim() === '' || o.getProductCardPrice().trim()  === ''))
     });

    $('button.card-editor-save-btn').on('click', function(){
      let webRequest = new WebRequest();
             webRequest.post(
		o.api.sendShopProductCreateMethod(shopId, product_id), 
		o.api.sendShopProductCreatePayload(
			{ 
			  card_image  	    : o.getProductCardImage(),
			  title             : o.getProductCardTitle(),
		          price       	    : o.getProductCardPrice(),
		          image_transition  : o.getProductCardImageTransitionFlag(),
		          image_loop        : o.getProductCardImageLoopFlag(), 
		          description 	    : o.getProductCardDescription()
			 }
		), webRequest.ASYNC)
                        .then(function (data) {
                         console.log(data);
                          toastr.info('Карточка сохранена!', 'Товар', {timeOut: 5000});
 			  redirectToAnotherPage(`products/${data.product_id}/page`);
                        })
                        .catch(function (error) {
                         console.error(error);
                         toastr.info('Ой! Что то пошло не так...', 'Товар', {timeOut: 5000});
		      //   redirectToAnotherPage('error');
              })
      });
   }
   return this;
 }


 showCasePhotoFilesOutput(media_files) {
   let output ='';
   media_files.forEach(file => {
      	  output+=`<img src="${file.url}" rel="${file.file_id}" class="showcase-card-btn" data-checked="${file.checked}">` 
   })		  	        
  return output;
 }

 showCaseCardOutput(product){
   let o = this;
   return `
        <product-card
	    product-id ="${product.product_id}"
	    status = "${product.active_status}"
            href="${o.api.getShopProductMethod(shopId, product.product_id)}"
            image-src="${product.media_files[0].url}"
            image-alt="${product.title}"
            brand="${product.brand}"
            name="${product.title}"
            current-price="${product.price}"
            old-price="${product.old_price}"
            currency-type="${product.currency_type}"
            aria-label="${product.title}"
        </product-card>
`
/*
`

<div id="${product.product_id}" class="shop_card" product-id="${product.product_id}>  <!-- Верхняя часть -->
 <div class="row">
   <div class="col">
    <div class="ribbon-wrapper ribbon-lg product-item-${product.active_status}">
      <div class="ribbon bg-danger">
	${product.active_status == "active" ? "Активен" : "Блокирован"}	 
      </div>
    </div>
  </div>
 </div>

<!-- Изображение-ссылка товара -->
 <div class="row">
    <div class="col" showcase-card-btn" >
      <div class="shop_showcase_card__top showcase-card-btn" >
	${(product.is_owner == true 
	? `<div class="card-thumbtack text-center" rel="${product.product_id}">  <i class="fa-solid fa-thumbtack"></i> </div>`
	: ``)}	
      <a href="${o.api.getShopProductMethod(shopId, product.product_id)}">
         <div class="fotorama" 
	        data-transition="${product.image_transition}"
	        data-arrows="false"
	${(product.is_owner == true 
	? ` data-loop="true" data-autoplay="true" `
	: ` data-loop="false" data-autoplay="false" `)}	
            data-click="false"
 	    data-width="100%" data-ratio="165/140">
   	     ${o.showCasePhotoFilesOutput(product.media_files)}
	  </div>
        </a>	
      </div>
    </div>
 </div>


 <div class="row h-10">
   <div class="col">
    <div class="shop_card__bottom"> <!-- Нижняя часть -->
      <!-- Цены на товар (с учетом скидки и без)-->
      <div class="shop_card__prices">
	${(product.is_owner == true 
	? `<div shopid="${product.shop_id}" class="shop_card__price shop_card__price--common" style="font-size:1rem;">от ${product.price}&nbsp;${product.currency_type}/мес.</div> `
	: `<div shopid="${product.shop_id}" class="shop_card__price shop_card__price--common">${product.price}&nbsp;${product.currency_type}</div> `)}	
      </div>
    </div>
   </div>
 </div>

 <div class="row">
   <div class="col">
      <div class="shop_card__title">
 	 <!-- Ссылка-название товара -->
         <span class="shop_card__title text-container showcase-card-btn" rel="${product.product_id}">${product.title}</span>
      </div>                                          
  </div>
 </div>
 <div class="row">
   <div class="col">
      <div class="shop_card__btn">
    <!-- Кнопка добавить в корзину -->
    <button class="btn w-100 btn-lg btn-card-add showcase-card-btn" rel="${product.product_id}" >Выбрать <i class="fas fa-cart-plus fa-sm mr-1"></i></button>
  </div>
  </div>
 </div>
 
</div>`
*/
  }
  
 productRaisedButtonOutput(shopId = null){
   if(!shopId) return this; 
   let o = this;
   $('div.card-thumbtack').on('click', function(){        
         let webRequest = new WebRequest();
         let request = webRequest.post(
	         o.api.setProductRaiseMethod(shopId, $(this).attr('rel')), 
   	         o.api.setProductRaiseMethodPayload($("#product_id").val())
 	       , true)
            .then(function(data) {
  	       	 console.log('Полученные данные:', data);  
		 redirectToAnotherPage('products/page');
	     })
	    .catch(function(error) {
       	        console.error('Произошла ошибка:', error);
		redirectToAnotherPage('products/page');
        	  });
	    });
   return this;
 }

  gotoCardEventButton(){
    $('button.showcase-card-btn, span.showcase-card-btn').on('click', function(){
        redirectToAnotherPage(`products/${$(this).attr('rel')}/page`);
    });
   return this;
  }  

  showCaseOwnerPanelOutput (shop, user){
       if(shop.getOwnerId() == user.getUserId()){		
	  $('div.card_editor').append(
	  ` <button class="btn btn-menu-2 btn-default card_item_active_show_btn float-left" 
		   onclick="redirectToAnotherPage('products/page?active=true')"><i class="fa fa-eye"></i> Активные</button>
 	    </button>
            <button class="btn btn-menu-2 btn-default card_item_noactive_show_btn float-left" 
		   onclick="redirectToAnotherPage('products/page?active=false')"><i class="fa fa-eye-slash"></i> Скрытые</button>
 	    </button>
 	    <button class="btn btn-menu-2 btn-default card_item_editor_image_btn float-right" 
		   onclick="redirectToAnotherPage('products/0/editor/page')"><i class="fa fa-plus"></i> Добавить</button>
 	    </button>	
	`);
     }
  }


 showCaseOutput(shopId = null) {
    try {
        if (!shopId) return this;
        let o = this;
        let webRequest = new WebRequest();
        let shop = new CurrentShop(shopId).setCurrentShopId(shopId);
        let user = new CurrentUser();
        const urlParams = new URLSearchParams(window.location.search); // Получаем текущий URL
        const active = urlParams.get('active'); // Извлекаем значение параметра 'active'

        // Функция загрузки товаров с пагинацией
        function loadProducts(page) {
            if (o.loading) return; // Предотвращаем повторную загрузку
            o.loading = true;
            
            let request = webRequest.get(
                o.api.getShopProductsMethod(shopId, (active == "false" ? false : true), o.page, o.limit), 
                {}, 
                false
            )
            .then(function(data) {
                data.forEach(product => {
                    $("div.product-card-container").append(o.showCaseCardOutput(product)).show();
                });
                
                o.productRaisedButtonOutput(shopId); // вывод кнопок поднятия карточек
                o.gotoCardEventButton(); // инициализация кнопок карточек
                o.showCaseOwnerPanelOutput(shop, user); // вывод панели владельца с кнопками
                $('.fotorama').fotorama(); // переинициализация картинок
                
                o.loading = false; // Сбрасываем флаг загрузки
            })
            .catch(function(error) {
                console.error('initializeProductCard.Произошла ошибка =>', error);
                o.loading = false; // Сбрасываем флаг загрузки при ошибке
            });
        }

        // Изначально загружаем первую порцию товаров
        loadProducts(o.page);

        // Обработчик прокрутки страницы для догрузки товаров
        $(window).on('scroll', function() {
            if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
                console.log(o.page);
                o.page++; // Увеличиваем номер страницы
                loadProducts(o.page); // Загружаем следующую порцию товаров
            }
        });

    } catch (e) {
        console.error('initializeProductCard.catch =>', e);
    }
    return this;
}

   StatusButtonOrdersMenuView(active = false, status = null){
   if(active){		
    $('#orders-tabs-active-tab')
	.prop({"area-selected" : `{status === 'active'}`})
	.addClass((status === 'active' ? 'active' : ''))	
	.removeClass((status !== 'active' ? 'active' : ''))	
	.on('click', function(){      	
   	 redirectToAnotherPage('orders/page?status=active');
    });
    $('#orders-tabs-done-tab')
	.prop({"area-selected" : `{status === 'done'}`})
	.addClass((status === 'done' ? 'active' : ''))	
	.removeClass((status !== 'done' ? 'active' : ''))	
	.on('click', function(){
   	 redirectToAnotherPage('orders/page?status=done');
    });                                              
    $('#orders-tabs-rejected-tab')
	.prop({"area-selected" : `{status === 'rejected'}`})
	.addClass((status === 'rejected' ? 'active' : ''))	
	.removeClass((status !== 'rejected' ? 'active' : ''))	
	.on('click', function(){
   	 redirectToAnotherPage('orders/page?status=rejected');
    });

     }

    return this; 
  }

  getOrdersPageTitleBySearchKey(searchCode){
     switch(searchCode){
	case 'done' : return 'Завершенные заказы' ;
	case 'rejected' : return 'Отмененные заказы';
	default : return 'Активные заказы';
     }	
  }


  logger(method, ...args) {
    if (this.config.console) {
      console.log(`MainApp.${!method ? '' : method}`, ...args);
    }
    return this;
  }



}

