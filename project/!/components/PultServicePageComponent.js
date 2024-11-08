class PultServicePageComponent extends PultPageComponent{
  constructor() {    
    super();
    console.log('PultServicePageComponent =>')
    this.config = {}
    this.api = new WebAPI();
    return this;
  }

  /* Выключить фичу   */ 
  featureElementRemove(){
     $('#custom-tabs-four-services-tab').remove(); /* Удалить таб */
     $('#custom-tabs-four-services').remove(); /* Удалить таб */
  }

  /* Включить фичу   */ 
  featureElementShow(){
     $(this.type 
	? '#custom-tabs-four-services-tab.'+this.type.toLowerCase()
	: '#custom-tabs-four-services-tab'
      ).removeClass('d-none'); 
     $(this.type 
	? '#custom-tabs-four-services.'+this.type.toLowerCase()
	: '#custom-tabs-four-services'
      ).removeClass('d-none'); 
  }



  feature(flag = false){
    this.config.feature = flag;    
    (!flag
	 ? this.featureElementRemove()
	 : this.featureElementShow()
     );

    console.log('this.config.feature=',this.config.feature);
    return this;
  }

  setCategoryDefault(category_id = null) {
    this.config.category_id = category_id;
    return this;
  }

  getCategoryDefault() {
    return this.config.category_id;
  }                                     


  serviceCategoriesWait(status = false) {
     $('.service-category-pult-panel').html( status ? `<img src="/main/images/loaders/loading_v1.gif">` : ``); 
   return this;
  }

  serviceListWait(status = false) {
     $('.service-pult-panel').html( status ? `<img src="/main/images/loaders/loading_v1.gif">` : ``); 
   return this;
  }


  /* Получить категории магазинов  */
   getServiceCategories() {    
    console.log('getServiceCategories =>',this.config.feature)
    if(!this.config.feature) return this;
    let o = this;
    try{
      o.serviceCategoriesWait(true);
      let webRequest = new WebRequest();
      this.list = webRequest.get('/telegram/service/categories', {}, false)
	    .then(function(data) {
	        o.list =  data;
        	console.log('Полученные данные:', o.list);  
	        o.serviceCategoriesWait(false);
		if(data.length > 0 && !o.getCategoryDefault()) { 
		   o.setCategoryDefault(data[0].category_id);
		}
	        Object.entries(o.list).forEach(([key, value]) => {
	           $('.service-category-pult-panel').append(o.categoryButton(value));
		})
		o.setServiceCategoryEvent();
		if(o.getCategoryDefault()){
   		    o.serviceCategoryLoad(o.getCategoryDefault());
		}
 	     })
	    .catch(function(error) {
        	console.error('Произошла ошибка:', error);
	    });
        } catch(e) {
      console.log('getServiceCategories.catch.error =>', e)
    }
    return this
  }

  /* Кнопка категории магазинов */
  categoryButton(value) {
    return `<div class="button-carousel-item"><button class="btn float-center btn-sm 
	` + ( this.getCategoryDefault() == value.category_id ? `btn-lightgreen` : `btn-default`) 
	  + ` btn-default service-category-btn" rel="${value.category_id}">${value.category_name} (${value.count})</button></div>`;
  }

 /* Загрузить список магазинов */
  serviceCategoryLoad(category_id){
    console.log('ServiceCategoryLoad =>')
    let o = this;
    if(!this.config.feature) return this;
    try{
      o.serviceListWait(true);
      let webRequest = new WebRequest();
      this.list = webRequest
          .get(`/telegram/service/list?category_id=${category_id}`, {}, false)
          .then(function(data) {
        console.log('Полученные данные:', data);  
        o.serviceListWait(false);
        o.getServiceCategoryList(data);
       })
	  .catch(function(error) {
        	console.error('Произошла ошибка:', error);
       });
     } catch(e) {
      console.log('ServiceCategoryLoad.catch.error =>', e)
    }
   return this;
  }


  /* Установить обработку событий чипсов категорий магазинов */
  setServiceCategoryEvent() {    
    console.log('setServiceCategoryEvent =>')
    if(!this.config.feature) return this;
    let o = this;
    try{ // Ваш код обработки событий чипсов категорий магазинов
     $('button.service-category-btn').off('click').on('click', function(el){
        console.log('click',this);
        let category_id = $(this).attr('rel');	
        $('button.service-category-btn').removeClass('btn-lightgreen').addClass('btn-default').css({color : "#000000"});
        $(this).removeClass('btn-default').addClass('btn-lightgreen').css({color : "#ffffff"});
        o.serviceCategoryLoad(category_id);
     });	
    } catch(e) {
      console.log('setServiceCategoryEvent.catch.error =>', e)
    }
    return this
  }

  /* Получить список магазинов для отражения */
  getServiceCategoryList(list = null) {    
    console.log('getServiceCategoryList =>')
    if(!this.config.feature || list == null) return this;
    let o = this;
    try{
      // Ваш код получения списка магазинов для отражения
    $('.service-pult-panel').html('');
        Object.entries(list).forEach(([key, value]) => {
           $('.service-pult-panel').append(o.serviceCard(value));	  
       })
//	$('.service-fotorama').fotorama(); // инифиализация фотогрида
    } catch(e) {
      console.log('getServiceCategoryList.catch.error =>', e)
    }
    return this
  }

  /* Вывести карточку магазина */
  serviceCard(el = null) {    
    console.log('ServiceCard =>', el)
    let s = '';
    return `	<div class="row">			    							 
 			<div class="card service-pult-panel-item-card ">			    					
				<div class="row">			    					
  				    <div class="col-4"><img class="service-pult-panel-item-card-image" src="`+(!el.card_image ? `/main/images/banners/no_photo_image.png` : el.card_image)+`"></div>
            			  <div class="col-8 w-100 ">
							<div class="w-100 service-pult-panel-item-description">
	                  				<div class="row w-100 service-pult-panel-item-title">
								<h2>${el.title}</h2>
					  				</div>`+ (el.phone || el.phone != '' ? 
									  `<div class="row service-pult-panel-item-description-short-text">
										<div class="col-1"></div>
										<div class="col-11">${el.description}</div>
						  			</div>` : ``)					  				
									+ (el.phone || el.phone != '' ? 
									  `<div class="row service-pult-panel-item-description-phone">
										<div class="col-1"><span><i class="fas fa-phone"></i></span></div>
										<div class="col-11"><span>${el.phone}</span></div>
									  </div>` : ``)
									+ (el.address || el.address != '' ? 
									  `<div class="row service-pult-panel-item-description-town">
								   	        <div class="col-1"><span><i class="fas fa-location "></i></span></div>
										<div class="col-11"><span>${el.address}</span></div> 
									  </div>` : ``) +`		  
  				 				</div>
  	      				  		  </div>	
  		   			           </div>   	
			                    </div> 
				     </div> `;
  }

  /* Вывести список магазинов */
  ServiceCategoryListRender(target = null, list = null) {    
    console.log('ServiceCategoryListRender =>', target, list)
    if(!this.config.feature || list == null) return this;
    try{
      // Ваш код вывода списка магазинов
    } catch(e) {
      console.log('ServiceCategoryListRender.catch.error =>', e)
    }
    return this
  }
}
