/*
  Компонент поиска
  { el : '', 
   }
*/

class SearchInputDialogComponent{
     storage    = null;
     storageTag = "UserSearchComponent";

     constructor(prop) {
      console.log('Start '+this.storageTag+' creating...');
      this.prop = prop;
      if(this.exist()) return this;
      this.create();
      this.listner();	
    }

   exist(){
       return ($(this.prop.el).length) ? true : false;
   }


  execute(callback){
    this.callback=callback;
  }

  create() {
   this.html=
     '<div class="d-flex w-100 active-block-checked-poligon" style="padding:10px;">'
     +'<input id="'+this.prop.el+'" type="text" class="d-flex w-100" style="margin-right: 0.3rem;border-radius: 4px;font-size: 1.3rem;padding-left: 0.7rem;" placeholder="Найти пользователя...">'
     +'<button id="'+this.prop.el+'-button" type="button" href="/users/add" class="ml-auto p-2 btn float-right btn-outline-primary add-user"><i class="fa fa-search align-middle" style="'
     +'height: 1.1rem;  width: 3rem;  font-size: 1.2rem;"></i></button></div>';
    return this;
   }
   
   listner(){
   let o = this;
     $(document).off('click','#'+this.prop.el+'-button').on('click','#'+this.prop.el+'-button', function(){
       o.callback($('#'+o.prop.el).val());
     });
    return this;
   }

   render(el){
     $(el).html(this.html);	
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


