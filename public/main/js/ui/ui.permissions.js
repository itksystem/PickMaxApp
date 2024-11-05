/*
 Получение списка разрешений
*/
class Permissions {
    const 
        list;
        constructor() {
           return this;
        }
    
       load(){
	 let o = this;
 	 $.ajaxSetup({ async: false });
            $.getJSON("/access/permissions",  function(_o) {  
       		o.list = _o.permissions;
		return o;
  	    });
       	    $.ajaxSetup({ async: true });
      	    return null;
	}
        get(name){
            return this.list[name];
        }
        access(name){
         return this.list[name] !== undefined;     // проверка на разрешение фичи
     }
 }
    