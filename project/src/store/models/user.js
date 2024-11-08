/*  Пользователь. (с) Синягин Д.В. 19.02.2022  */
class User {
     storage = null;
     storageTag = "UserProperties";

    constructor(userId=null) {
     console.log('User class init');
     if(userId==null)
      userId=sessionStorage.getItem('userId');
     if(userId==null) return null;
     let o = this;	
     try {
         $.ajax({
          url: '/user/'+userId,
          success: function (data) {
            Object.entries(data).forEach(([key, value]) => {
	           o[key]=value;
	        })
	      },
	      async: false
     });
        } catch(e){
	        console.log(e);
	        return null;	
  	}
    }


 /* сохраняем параметры обьекта в локальном хранилище */
   storage(){
       this.storage = new sessionStorageClass(); 
       this.storage.setObject(this.storageTag,this);
       console.log(this.storage.setObject(this.storageTag));
   }

  get(key){
   return this[key];
  }

   set(key, value){
    this[key]=value;
  }

 }

