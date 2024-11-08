/*  Локальный пользователь. (с) Синягин Д.В. 01.01.2023  */
class Me{
     storage    = null;
     storageTag = "@me";
     callback = null;

     constructor() {
       console.log('local user class init');
       let o = this;	
       return this;
    }

  initialization(callback){
     this.callback=callback;
     return this;	
   }

   get(){
       let o = this;	
       $.getJSON("/main/@me", function(data) {  
        o.sessionID =data.sessionId;
        o.userId =data.userId;
        console.log(o);
        o.storage = new sessionStorageClass(); 
        o.storage.setObject(o.storageTag, o);
	if(o.callback) o.callback();
        return this;
      });
     return this;
   }
 }

