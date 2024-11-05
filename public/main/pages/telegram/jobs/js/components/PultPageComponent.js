
class PultPageComponent {
  constructor() {    
    console.log('PultPageComponent =>')
    return this;
  }

  /* Установить обработку событий на переключение вкладок */
  setTabClickEvent(selector, callback = null) {    
    console.log('setTabClickEvent =>')
    if(!callback ) return this;
    let o = this;
    try{ 
     $(selector).off('click').on('click', function(el){
	if($(`${selector}.loaded`).length > 0) return this; // если помечено что страницу предварительно заполнили данными
        console.log('setTabClickEvent => click')
	callback(o);
	$(selector).addClass('loaded'); // пометили что страницу предварительно заполнили данными
     });	
    } catch(e) {
      console.log('setTabClickEvent.catch.error =>', e)
    }
    return this
  }

 getDefaultCategoryId(arr) {
    let max = -1;
    let category_id = null;
        arr.forEach(item => {  // Проверяем, если поле selected равно 1
	  console.log(item, item.selected, (item.selected == 1));
	    if (item.selected == 1)     
        	 category_id = item.category_id;     
        });
       if(!category_id) 	
          arr.forEach(item => {  
   		 if (item.count  > max) // Проверяем, если поле count >= max
        	 category_id = item.category_id;     
        });
     return category_id;     
   }
}




  

