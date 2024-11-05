class PultShopPageComponent extends PultPageComponent{
  constructor() {    
    super();
    console.log('PultShopPageComponent =>')
    this.config = {}
    this.setCurrentPage(0);
    this.setPageLimit(5);
    this.setLoadButtonSelector('button.shop-loader-btn');
    this.api = new WebAPI();
    return this;
  }


  /* Выключить фичу   */ 
  featureElementRemove(){
     $('#custom-tabs-four-shops-tab').remove(); /* Удалить таб */
     $('#custom-tabs-four-shops').remove(); /* Удалить таб */
  }

  /* Включить фичу   */ 
  featureElementShow(){
     $(this.type 
	? '#custom-tabs-four-shops-tab.'+this.type.toLowerCase()
	: '#custom-tabs-four-shops-tab'
      ).removeClass('d-none'); 
     $(this.type 
	? '#custom-tabs-four-shops.'+this.type.toLowerCase()
	: '#custom-tabs-four-shops'
      ).removeClass('d-none'); 
  }


  /* Включить фичу   */ 
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


  setCurrentPage(page = 0) {
    this.config.page = page;
    return this;
  }

  getCurrentPage() {
    console.log('getCurrentPage' ,this.config.page);
    return this.config.page;
  }

  setPageLimit(pageLimit = 1) {
    console.log('setPageLimit' ,pageLimit);
    this.config.pageLimit = pageLimit;
    return this;
  }

  getPageLimit() {
    console.log('getPageLimit' ,this.config.pageLimit);
    return this.config.pageLimit;
  }

  setPageCount(count = 0) {
    console.log('setPageCount' ,count);
    this.config.pageCount = count;
    return this
  }

  getPageCount() {
    console.log('getPageCount' ,this.config.pageCount);
    return this.config.pageCount;
  }

  setLoadButtonSelector(selector){
    console.log('setLoadButtonSelector' ,selector);
    this.config.loadButtonSelector = selector;
    return this;
  }

  getLoadButtonSelector(){
    console.log('getLoadButtonSelector' ,this.config.loadButtonSelector);
    return this.config.loadButtonSelector;
  }

  loadButtonClickEvent(){
    let o = this;
     $(o.getLoadButtonSelector()).off('click').on('click', function(el){
	 console.log('loadButtonClickEvent');
         o.shopCategoryLoad(o.getCategoryDefault());
     });
    return this;
  }

   enableLoadButton(){
    let o = this;
    console.log('enableLoadButton');
     $(o.getLoadButtonSelector()).removeClass('d-none').addClass('d-block');
     o.loadButtonClickEvent();
    return this;
  }


  disableLoadButton(){
    let o = this;
    console.log('disableLoadButton');
     $(o.getLoadButtonSelector()).removeClass('d-block').addClass('d-none');
    return this;
  }


  shopCategoriesWait(status = false) {
    console.log('shopCategoriesWait =>', status);
     $('.shop-category-pult-panel').html( status ? `<img src="/main/images/loaders/loading_v1.gif">` : ``); 
     return this;
  }
  
  shopListWait(status = false) {
    console.log('shopListWait =>', status);
     return this;
  }


  /* Получить категории магазинов  */
   getShopCategories() {    
    console.log('getShopCategories =>',this.config.feature)
    if(!this.config.feature) return this;
    let o = this;
    try{
      o.shopCategoriesWait(true);
      let webRequest = new WebRequest();
      this.list = webRequest.get(
	    o.api.getShopCategoriesMethod(), 
	    o.api.getShopCategoriesMethodPayload(),  false)
	    .then(function(data) {
	        o.list =  data;
        	console.log('Полученные данные:', o.list);  
	        o.shopCategoriesWait(false);
 	        o.setCategoryDefault(o.getDefaultCategoryId(o.list));

	        Object.entries(o.list).forEach(([key, value]) => {
	           $('.shop-category-pult-panel').append(o.categoryButton(value));
		})

		o.setShopCategoryEvent();
   		o.shopCategoryLoad(o.getCategoryDefault());
 	     })
	    .catch(function(error) {
        	console.error('Произошла ошибка:', error);
	    });
        } catch(e) {
      console.log('getShopCategories.catch.error =>', e)
    }
    return this
  }

  /* Кнопка категории магазинов */
  categoryButton(value) {
    return `<div class="button-carousel-item"><button class="btn float-center btn-sm 
	` + ( this.getCategoryDefault() == value.category_id ? `btn-lightgreen` : `btn-default`) 
	  + ` btn-default shop-category-btn" rel="${value.category_id}">${value.category_name} (${value.count})</button></div>`;
  }

 /* Загрузить список магазинов */
  shopCategoryLoad(category_id){
    console.log('shopCategoryLoad =>')
    let o = this;
    if(!this.config.feature) return this;
    try{
      o.shopListWait(true);
      let webRequest = new WebRequest();
      this.list = webRequest
          .get( o.api.getShopCategoryLoadMethod(),  
	     {
		category_id : category_id,
		page : o.getCurrentPage(),
		limit : o.getPageLimit()
	     },  false)
          .then(function(data) {
            o.shopListWait(false);
            o.shopCategoryListRender(data.items);
            o.setPageCount(data.items.length);

            if(o.getPageCount() >= o.getPageLimit() && data ) {
                 o.setCurrentPage(o.getCurrentPage()+1);
		 o.enableLoadButton();
            } 
		else o.disableLoadButton();
       })
	   .catch(function(error) {
        	console.error('Произошла ошибка:', error);
       });
     } catch(e) {
       console.log('shopCategoryLoad.catch.error =>', e)
    }
   return this;
  }

  /* Установить обработку событий чипсов категорий магазинов */
  setShopCategoryEvent() {    
    console.log('setShopCategoryEvent =>')
    if(!this.config.feature) return this;
    let o = this;
    try{ // Ваш код обработки событий чипсов категорий магазинов
     $('button.shop-category-btn').off('click').on('click', function(el){
        console.log('click',this);
        let category_id = $(this).attr('rel');	
        $('button.shop-category-btn').removeClass('btn-lightgreen').addClass('btn-default').css({color : "#000000"});
        $(this).removeClass('btn-default').addClass('btn-lightgreen').css({color : "#ffffff"});
        o.setCurrentPage(0);
        o.clearPage();
        o.shopCategoryLoad(category_id);
     });	
    } catch(e) {
      console.log('setShopCategoryEvent.catch.error =>', e)
    }
    return this
  }

  clearPage(){
    $('.shop-pult-panel').html('');
  }
 

  /* Получить список магазинов для отражения */
  shopCategoryListRender(list = null) {    
    console.log('shopCategoryListRender =>')
    if(!this.config.feature || list == null) return this;
    let o = this;
    try{
      // Ваш код получения списка магазинов для отражения
        Object.entries(list).forEach(([key, value]) => {
           $('.shop-pult-panel').append(o.shopCard(value));	  
       })
	$('.fotorama').fotorama(); // инифиализация фотогрида
    } catch(e) {
      console.log('shopCategoryListRender.catch.error =>', e)
    }
    return this
  }

  /* Вывести карточку магазина */
  shopCard(el = null) {    
    console.log('shopCard =>', el)
    let s = '';
     Object.entries(el.media_files).forEach(([key, value]) => {
        s+= `<img src="${value}" >`;
    })
    return `
     <div class="row">
        <div class="col w-100">
           <div class="card shop-pult-panel-item-card">
		 <div class="row">
    			<div class="col w-100">
       				<div class="fotorama" 
				        data-transition="crossfade"
				        data-arrows="true"
					data-loop="true"
					data-autoplay="false" 
					data-fit="cover" >${s}</div>
	    		</div>
		 </div>
	<div class="row">			    					
           <div class="col w-100">
		<div class="w-100 shop-pult-panel-item-description text-left">
	             <div class="row w-100 shop-pult-panel-item-title">
			<h2>${el.title}</h2>
	   	     </div>
	  <div class="row shop-pult-panel-item-description-short-text text-left">
            <div class="col-1"></div>
	    </div>`
	+ (el.phone || el.phone != '' ? 
	  `<div class="row shop-pult-panel-item-description-phone text-left">
		<div class="col-1"><span><i class="fas fa-phone"></i></span></div>
		<div class="col-11"><span>${el.phone}</span></div>
	  </div>` : ``)
	+ (el.address || el.address != '' ? 
	  `<div class="row shop-pult-panel-item-description-town text-left">
   	        <div class="col-1"><span><i class="fas fa-location "></i></span></div>
		<div class="col-11"><span>${el.address}</span></div> 
	  </div>` : ``) +
  	`</div>
      </div>	
    </div>   			
   <div class="row">
      <div class="col">
         <div class="shop_card__btn"><!-- Кнопка зайти в магазин -->					          
           <button class="btn w-100 btn-lg btn-card-add showcase-card-btn" rel="${el.shop_id}">
		 <a href="${el.url}" >Зайти в магазин <i class="fas fa-cart-plus fa-sm mr-1"></i></a>
		</button>
         </div>
     </div>
  </div>				
  	    </div>
          </div>
        </div>
`
  }

}
