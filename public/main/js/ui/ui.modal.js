/*
  Компонент отражения модального окна
  Синягин Д.В. 
  05-02-2022
*/
class ModalDialog{
     storage    = null;
     storageTag = "modal";
     el=null;     // название dom-элемента 
     header=null;
     body=null;
     footer=null;
     frame=null;  // каркас окна 
     

   constructor(el) {
    if(!el) return;
    this.el=el;
    console.log('Start Modal creating...');
   }

  exist(){
     return ($("."+this.el).length) ? true : false;
  }



  Header(header=null, prop=null){
   if(header==null) return this;
   let backgroundColor=(!prop) ? 'none' : prop.backgroundColor;
   let color =(!prop) ? '#000000' : prop.color;
   this.header =' <div class="modal-header" style="background-color: '+backgroundColor+'; color: '+color+';">'
		    +'<h4 class="modal-title">'+header+'</h4>'
		    +'  <button type="button" class="close" data-dismiss="modal" aria-label="Close">'
		    +'    <span aria-hidden="true" style="color:#000000;">×</span>'
		    +'  </button>'
	   	    +'</div>';
     return this;
  }

  Body(body=null){
    if(!body) return this;
    this.body='<div style="font-size: 1rem;line-height: 1.4;">'+body+'</div>';
    return this;
  }

  bodyLoader(p=null){
    if(!p) return this;
    if(!p.url) return this;
    let o = this;	
     	$(".loading").show();
	$.ajax({
	  url: p.url,
 	  cache: false,
	  async: false,
	  method: "GET",
	  dataType: "text",
	  success: function(_o){ // если запрос успешен вызываем функцию
	      $(".loading").hide();
	      $('div.'+o.el+' div.modal-body').html(_o);
	      return this;
	  }
	}).done(
	   function() {
   	   return this;
	 }
        );
    return this;
  }


  Footer(prop=null){
    if(!prop) return this;
     try{
        this.footer=(prop.ok) ? '<button type="button" class="btn btn-lg btn-primary" id="'+this.el+'-ok-btn-click" >'+prop.ok+'</button>' : '';
	this.footer+=(prop.close) ? '<button type="button" class="btn btn-lg btn-default garbage-clear" id="'+this.el+'-close-btn-click" data-dismiss="modal">'+prop.close+'</button>' : '';
        } catch(error) {
       console.log(error);
     }
   return this;
  }

  create(){
    $('.modal').remove(); // если элемент существует - удаляем его из DOM полюбому
    $('.xdsoft_datetimepicker[datetimepicker-owner-id="modal"]').remove(); // удаляем компоненты datetimepicker, владелец которого модальное окно

    $("body").append(
	'<div class="modal fade '+this.el+' " tabindex="-1" id="'+this.el+'-dialog" aria-labelledby="'+this.el+'-dialog-label" aria-hidden="true" role="dialog">'
	+'     <div class="modal-dialog '+this.prop.size+' modal-dialog-centered" >'
	+'         <div class="modal-content">'
	+ (this.header!=null ? this.header : '')
	+'         <div class="modal-body">'
        + (this.body!==null ? this.body: '' )
	+'         </div>'
	+ (this.footer!=null ? '         <div class="modal-footer">' : '')
        + (this.footer!=null ? this.footer : '')
	+ (this.footer!=null ?'        </div>' : '')
	+'   </div>'
	+' </div>'
	+'</div>'
    );
   if(this.prop.draggable)  $('.modal-dialog').draggable();
   $('#'+this.el+'-ok-btn-click').off('click').on('click', this.callback);
   $('#'+this.el+'-dialog').on('hidden.bs.modal', function (e) {
       console.log('hidden.bs.modal');
       $('.xdsoft_datetimepicker[datetimepicker-owner-id="modal"]').remove(); // сборщик мусора
       $('.pac-container').remove();
       $(this).remove();
   })
   return this;
  }

   Handler(callback){
    this.callback=callback;
    return this;
   }

   Prop(prop=null){
     this.prop=prop;
     switch(prop.size){
   	  case 'small': { this.prop.size= 'modal-sm'; break; } 
   	  case 'middle': { this.prop.size= 'modal-lg'; break; } 
   	  case 'middle-500': { this.prop.size= 'modal-sm2'; break; } 
   	  case 'extra':  { this.prop.size='modal-xl'; break; } 
   	  case 'super':  { this.prop.size='modal-xxl'; break; } 
   	  default : 
		   this.prop.size='modal-lg';
     }
     return this;
   }

   show(){
     var dialog = new bootstrap.Modal(document.getElementById(this.el+'-dialog'), {backdrop: 'static', keyboard: false });
     dialog.show();	
     return this;
   }

   hide(){
     var dialog = new bootstrap.Modal(document.getElementById(this.el+'-dialog'), {backdrop: 'static', keyboard: false });
     dialog.hide();	
     $("#"+this.el+"-dialog").remove();
   }
 }
 

