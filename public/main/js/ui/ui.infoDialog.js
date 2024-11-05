/*
  Компонент отражения модального окна
  Синягин Д.В. 
  05-02-2022
*/
class infoDialog{
     storage    = null;
     storageTag = "infoDialog";
     el=null;     // название dom-элемента 
     header=null;
     body=null;
     footer=null;
     frame=null;  // каркас окна 

     icon = {
	"success" : "fa-check",
	"info" : "fa-info",
	"error" : "fa-exclamation-triangle",
	"underConstruction" : "/main/images/underconstruction.png"
     }	
     backgroundColorHeader = {
	"success" : "#009843",
	"info" : "#6c757d",
	"error" : "#ff1a1a",
	"underConstruction" : "#009843"
     }	

     

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
    if(this.exist()) return this;
    $('.infoDialog').next('.modal-backdrop').remove();	 // убираем засветку фона
    $('.infoDialog').remove(); // если элемент существует - удаляем его из DOM полюбому
    $('.xdsoft_datetimepicker[datetimepicker-owner-id="infoDialog"]').remove(); // удаляем компоненты datetimepicker, владелец которого модальное окно
    $('#'+this.el+'-ok-btn-click').off('click');

    $("body").append(
	'<div class="modal fade '+this.el+' infoDialog" id="'+this.el+'-dialog" aria-labelledby="'+this.el+'-dialog-label" aria-hidden="true" role="dialog">'
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

   if(this.prop.draggable)  $('.infoDialog').draggable();
   $('#'+this.el+'-ok-btn-click').off('click').on('click', this.callback);
   $('.infoDialog').on('hidden.bs.modal', function (e) {
       console.log('hidden.bs.modal');
       $('.xdsoft_datetimepicker[datetimepicker-owner-id="infoDialog"]').remove(); // сборщик мусора
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
     this.prop.size=(prop.size==undefined) ? 'modal-lg' :
   	  (prop.size=='small')  ? 'modal-sm' :
   	  (prop.size=='middle') ? 'modal-lg' :
   	  (prop.size=='middle-500') ? 'modal-sm2' :
   	  (prop.size=='extra')  ? 'modal-xl' : 'modal-lg';
     return this;
   }

   show(){
     var dialog = new bootstrap.Modal(document.getElementById(this.el+'-dialog'), {backdrop: 'static', keyboard: false });
     dialog.show();	
     $('.infoDialog').next('.modal-backdrop').attr('source',this.el+'-dialog');
     console.log('modal-backdrop',this.el+'-dialog');
     return this;
   }

   hide(){
     var dialog = new bootstrap.Modal(document.getElementById(this.el+'-dialog'), {backdrop: 'static', keyboard: false });
     dialog.hide();	
     $("#"+this.el+"-dialog").remove();
     $("#"+this.el+"-dialog").remove();

   }

   info(caption, text) {
    if(this.exist()) return this;
     this.createDlg('info',caption, text);
     return this;
   }

   modal(size, caption, text) {
    if(this.exist()) return this;
     this.modalDlg(size, caption, text);
     return this;
   }


   success(caption, text) {
    if(this.exist()) return this;
     this.createDlg('success',caption, text);
     return this;
   }

   error(caption, text) {
    if(this.exist()) return this;
     this.createDlg('error', caption, text);
     return this;
   }

   underConstruction(caption, text) {
    if(this.exist()) return this;
     this.createDlg('underConstruction', caption, text);
     return this;
   }


  createDlg(state, caption, text){
    if(this.exist()) return this;
       this.el="info";
       this.Prop({size : "middle" , draggable : false })
       .Header(caption,{backgroundColor: this.backgroundColorHeader[state], color: '#ffffff'})
       .Body( '<div style="font-size: 1rem;line-height: 1.4;">'
	       +'<div class="row w-110 text-center">'
	       +'<div class="col-sm-2"><h1><i class="icon fas '+this.icon[state]+'" style="color:'+this.backgroundColorHeader[state]+';"></i></h1></div>'    
	       +'<div class="col-sm text-left"><span style="font-size: 1rem;">'
	       + text
	       +'</span></div></div></div>'
	  )
	 .Footer({"close": "OK"})
	 .create()
         .show();
    }

  modalDlg(size, caption, text){
    if(this.exist()) return this;
       this.Prop({size : size , draggable : true })
       .Header(caption,{backgroundColor: this.backgroundColorHeader['info'], color: '#ffffff'})
       .Body( '<div style="font-size: 1rem;line-height: 1.4;">'
	       +'<div class="row w-110 text-center">'
	       +'<div class="col-sm text-left"><span style="font-size: 1.3rem;">'
	       + text
	       +'</span></div></div></div>'
	  )
	 .Footer({"close": "OK"})
	 .create()
         .show();
    }


 }
 

