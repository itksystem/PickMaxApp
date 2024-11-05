/*  Получение данные из селекторов с пользовательского интерфейса

 */

class Selectors{
     storage    = null;
     storageTag = "Selectors";
     el = null;

     constructor(el) {
      console.log('Start '+this.storageTag+' creating...');
      this.el = el;
      return this;	
    }

   get() {
       return this;
   }

   value() {
       console.log(t.selectedIndex);
       if(t.selectedIndex==-1) return;
       var x=t.selectedIndex; var y=t.options; return y[x].value;
       return this;
   }

   remove(){
    try{
       }catch(e){
         console.log(e);
    }
   }

   show(){
    try{
       }catch(e){
         console.log(e);
    }
   }

   hide(){
    try{
       }catch(e){
         console.log(e);
    }
   }
 }
