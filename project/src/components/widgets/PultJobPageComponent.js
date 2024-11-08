class PultJobPageComponent extends PultPageComponent {
  constructor() {    
    super();
    console.log('PultJobPageComponent =>')
    this.config = {}
    this.type = null;
    this.api = new WebAPI();
    return this;
  }

  /* Выключить фичу   */ 
  featureElementRemove(){
     $(this.type 
	? '#custom-tabs-four-jobs-tab.'+this.type.toLowerCase()
	: '#custom-tabs-four-jobs-tab'
      ).remove(); /* Удалить таб */
     $(this.type 
	? '#custom-tabs-four-jobs.'+this.type.toLowerCase()
	: '#custom-tabs-four-jobs'
      ).remove(); /* Удалить таб */
  }

  /* Включить фичу   */ 
  featureElementShow(){
     $(this.type 
	? '#custom-tabs-four-jobs-tab.'+this.type.toLowerCase()
	: '#custom-tabs-four-jobs-tab'
      ).removeClass('d-none'); 
     $(this.type 
	? '#custom-tabs-four-jobs.'+this.type.toLowerCase()
	: '#custom-tabs-four-jobs'
      ).removeClass('d-none'); 
  }



  /* фичетогл   */ 
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


  jobCategoriesWait(status = false) {
     $('.job-category-pult-panel.'+this.type.toLowerCase()).html( status ? `<img src="/main/images/loaders/loading_v1.gif">` : ``); 
   return this;
  }

  jobListWait(status = false) {
     $('.job-pult-panel.'+this.type.toLowerCase()).html( status ? `<img src="/main/images/loaders/loading_v1.gif">` : ``); 
   return this;
  }


  /* Получить категории магазинов  */
   getJobCategories( type = null) {    
    console.log('getJobCategories =>',this.config.feature)
    if(!this.config.feature) return this;
    this.type = type;
    let o = this;
    try{
      o.jobCategoriesWait(true);
      let webRequest = new WebRequest();
      this.list = webRequest.get('/telegram/job/categories?type='+o.type, {}, false)
	    .then(function(data) {
	        o.list =  data;
        	console.log('Полученные данные:', o.list);  
	        o.jobCategoriesWait(false);
		if(data.length > 0 && !o.getCategoryDefault()) { 
		   o.setCategoryDefault(data[0].category_id);
		}
	        Object.entries(o.list).forEach(([key, value]) => {
	           $('.job-category-pult-panel.'+o.type.toLowerCase()).append(o.categoryButton(value));
		})
		o.setJobCategoryEvent();
		if(o.getCategoryDefault()){
   		    o.jobCategoryLoad(o.getCategoryDefault());
		}
 	     })
	    .catch(function(error) {
        	console.error('Произошла ошибка:', error);
	    });
        } catch(e) {
      console.log('getJobCategories.catch.error =>', e)
    }
    return this
  }

  /* Кнопка категории магазинов */
  categoryButton(value) {
    return `<div class="button-carousel-item"><button class="btn float-center btn-sm 
	` + ( this.getCategoryDefault() == value.category_id ? `btn-lightgreen` : `btn-default`) 
	  + ` btn-default job-category-btn" rel="${value.category_id}">${value.category_name} (${value.count})</button></div>`;
  }

 /* Загрузить список магазинов */
  jobCategoryLoad(category_id){
    console.log('JobCategoryLoad =>')
    let o = this;
    if(!this.config.feature) return this;
    try{
      o.jobListWait(true);
      let webRequest = new WebRequest();
      this.list = webRequest
          .get(`/telegram/job/list?category_id=${category_id}`, {}, false)
          .then(function(data) {
        console.log('Полученные данные:', data);  
        o.jobListWait(false);
        o.getJobCategoryList(data);
       })
	  .catch(function(error) {
        	console.error('Произошла ошибка:', error);
       });
     } catch(e) {
      console.log('JobCategoryLoad.catch.error =>', e)
    }
   return this;
  }

  /* Установить обработку событий чипсов категорий магазинов */
  setJobCategoryEvent() {    
    console.log('setJobCategoryEvent =>')
    if(!this.config.feature) return this;
    let o = this;
    try{ // Ваш код обработки событий чипсов категорий магазинов
     $('button.job-category-btn').off('click').on('click', function(el){
        console.log('click',this);
        let category_id = $(this).attr('rel');	
        $('button.job-category-btn').removeClass('btn-lightgreen').addClass('btn-default').css({color : "#000000"});
        $(this).removeClass('btn-default').addClass('btn-lightgreen').css({color : "#ffffff"});
        o.jobCategoryLoad(category_id);
     });	
    } catch(e) {
      console.log('setJobCategoryEvent.catch.error =>', e)
    }
    return this
  }

  /* Получить список магазинов для отражения */
  getJobCategoryList(list = null) {    
    console.log('getJobCategoryList =>')
    if(!this.config.feature || list == null) return this;
    let o = this;
    try{
      // Ваш код получения списка магазинов для отражения
    $('.job-pult-panel').html('');
        Object.entries(list).forEach(([key, value]) => {
           $('.job-pult-panel.'+o.type.toLowerCase()).append(o.jobCard(value));	  
           $('.job-fotorama').fotorama(); // инифиализация фотогрида
       })
    } catch(e) {
      console.log('getJobCategoryList.catch.error =>', e)
    }
    return this
  }

  /* Вывести карточку магазина */
  jobCard(el = null) {    
    console.log('jobCard =>', el)
        let s = '';
   if(el.media_files) 
        Object.entries(el.media_files).forEach(([key, value]) => {
           s+= `<img src="${value}" >`;
       })
    console.log(s);
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
		<div class="w-100 shop-pult-panel-item-description">
	             <div class="row w-100 shop-pult-panel-item-title">
			<h2>${el.title}</h2>
	   	     </div>
	  <div class="row shop-pult-panel-item-description-short-text">
            <div class="col-1"></div>
	    </div>`
	+ (el.phone || el.phone != '' ? 
	  `<div class="row shop-pult-panel-item-description-phone">
		<div class="col-1"><span><i class="fas fa-phone"></i></span></div>
		<div class="col-11"><span>${el.phone}</span></div>
	  </div>` : ``)
	+ (el.address || el.address != '' ? 
	  `<div class="row shop-pult-panel-item-description-town">
   	        <div class="col-1"><span><i class="fas fa-location "></i></span></div>
		<div class="col-11"><span>${el.address}</span></div> 
	  </div>` : ``) +
  	`</div>
      </div>	
    </div>   			
  	    </div>
          </div>
        </div>
`
  }

  /* Вывести список магазинов */
  JobCategoryListRender(target = null, list = null) {    
    console.log('JobCategoryListRender =>', target, list)
    if(!this.config.feature || list == null) return this;
    try{
      // Ваш код вывода списка магазинов
    } catch(e) {
      console.log('JobCategoryListRender.catch.error =>', e)
    }
    return this
  }
}
