/* Всплывающий диалог для ввода данных */
class inputDialog{
     el=null;     // название dom-элемента 
     url=null;
     type=null;
     title=null;
     placeholder=null;
     buttonName=null;
     callback=null;
     target=null;

   constructor(e=null, callback) {
      console.log('Start inputDialog creating...');
       if(!e) {
	 console.log('Params is empty');
         return; 
       }
	  this.target=e.target;      // Идентификатор кнопки на которую вешаем вызов компонета
	  this.el=e.elementName;     // 
	  this.type=e.type;
	  this.title=e.title;
	  this.placeholder=e.placeholder;
	  this.buttonName=e.buttonName;
	  this.callback=callback;

       console.log(e);
       if(!this.exist()) {
             this.create();  /* проверяем на наличие создаем при необходимости */
	     this.listner();	
       }
    }

   exist(){
     return ($("#"+this.el).length) ? true : false;
   }


  create() {
	$(this.target).after(''
	+'<div id="'+this.el+'" class="card card-primary input-element-component" style="overflow: hidden; display: none;">'
	+' <div class="card-header">'
	+'    <h4 class="card-title">'+this.title+'</h4>'
	+'	<button type="button" class="input-element-component-close-btn close" for="'+this.el+'">'
	+'	   <span aria-hidden="true" style="color:#ffffff;">×</span>'
	+'	</button>'
	+'   </div>'
	+'   <div class="card-body">'
	+'	<div class="row">'
	+'	    <div class="col-sm">'
	+'		<div class="form-group">'
	+'  	  	   <input type="'+this.type+'" class="form-control" id="'+this.el+'" placeholder="'+this.placeholder+'" style="font-size: 1.2rem;  height: 2.4rem;">'
	+'		</div>'
	+'	    </div>'
	+'          <div>'
	+'         <div><button type="submit" class="btn btn-lg btn-primary input-element-component-add-btn" for=".add-input-geozone-component">'+this.buttonName+'</button></div>'
	+'      </div>'
	+'    </div>'
	+'  </div>'
	+'</div>');
   }

   remove(){
     $("#"+this.el).remove();		
   }

   show(){
     $("#"+this.el).show('slow');		
   }

   hide(){
     $("#"+this.el).hide('slow');		
   }

   listner(){ // слушаем клики и обновляем sessionStorage
   let o = this;
      $("#"+o.el+" .input-element-component-close-btn").on( "click", function(e){
	  console.log(this);	
	  e.preventDefault();  	
   	  o.hide();
     });
      $("#"+o.el+" .input-element-component-add-btn").on( "click", ()=>{
 	    o.callback($("#"+o.el+'.form-control').val());
	    o.hide();
     });

/* 
       $(document).mouseup(function (e) { // закрыть если клик вне области
	    var container = $("#"+o.el);
	    if (container.has(e.target).length === 0){
	        container.hide('slow');
	    }
	});
*/
    }
 }
