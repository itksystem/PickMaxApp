/*
 Получение списка разрешенных фич 
*/
class Features {
    const 
        list;
        constructor() {
           return this;
        }
    
       load(){
	 let o = this;
 	 $.ajaxSetup({ async: false });
            $.getJSON("/access/features",  function(_o) {  
                 console.log(_o.features);
       		 return o.list = _o.features;
  	    });
       	    $.ajaxSetup({ async: true });
      	    return null;
	}
        get(name){
            return this.list[name];
        }
        visible(name){
            return this.list[name] !== undefined;     // проверка на разрешение фичи
        }
 }
    