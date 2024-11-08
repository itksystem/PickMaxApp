/* Раскрывающийся диалог для ввода большого количества данных 
   Успользуется для регистрации значения в таблице данных с передаче в метод
   регистрируемого параметра
*/
class inputMultiDialog{
     el=null;     // название dom-элемента 
     url=null;
     type=null;
     title=null;
     placeholder=null;
     buttonName=null;
     callback=null;
     target=null;
     onclick=null;


  constructor(e=null, callback) {
      console.log('Start inputDialog creating...');
       if(!e) {
	 console.log('Params is empty');
         return; 
       }
	   this.target=e.target;      // Идентификатор кнопки на которую вешаем вызов компонета
	   this.el=e.elementName;     // 
       if(!this.exist()) {
	   this.type=e.type;
	   this.title=e.title;
	   this.placeholder=e.placeholder;
	   this.buttonName=e.buttonName;
	   this.callback=callback;
	   this.onclick=e.onclick;
	   this.onclick_old_value =  $(e.onclick).html();
	   console.log(this.onclick_old_value);
	   this.create();  /* проверяем на наличие создаем при необходимости */
	   this.listner();	
	  } else {
          console.log('Element already present');
       }
    }

   exist(){
     return ($("#"+this.el).length) ? true : false;
   }


  create() {
	$(this.target).html(''
	+'<div id="'+this.el+'" class="input-element-component2 " style="overflow: hidden; display: none; padding: 0.7rem 0 0 1rem;">'
	+'   <div class="input-dialog2">'
	+'	<div class="row">'
	+'	    <div class="col-sm-6">'
	+'  	  	   <div class="input-multi-element-component"></div>'
	+'	    </div>'
	+'	    <div class="col-sm-3">'
	+'  	  	   <button type="submit" class="btn btn-lg btn-primary input-element-component-add-btn d-flex" for=".add-input-group-component">'+this.buttonName+'</button>'
	+'	    </div>'
	+'    </div>'
	+'  </div>'
	+'<hr>'
	+'</div>');
   }
 
  add(el){
    switch(el.type) {
     case 'number':
     case 'text' :{
	$(this.target+' .input-multi-element-component').after(
 	   '<div class="row"><input type="'+el.type+'" class="form-control input-multi-element-component-value" index='+el.index
	   +' placeholder="'+el.placeholder+'" style="font-size: 0.8rem;  height: 2.4rem;"></div>'
	);
	break;
      }	
     case 'select' :{
	$(this.target+' .input-multi-element-component').after(
 	   '<div class="row"><select class="form-control input-multi-element-component-value" index='+el.index
	   +' placeholder="'+el.placeholder+'" style="font-size: 0.8rem;  height: 2.4rem;"></select>'
	);
      break;
     }	
   }	
     return this;
   }

  init(callback) {
     callback();
     return this;     	
  }

   remove(){
     $("#"+this.el).remove();		
   }

   show(){
     console.log($("#"+this.el).is(":visible"));
     if($("#"+this.el).is(":visible")) {
	this.hide();
      } else {	
          $("#"+this.el).show(100);	
          $(this.onclick).html('<i class="fas p-1 fa-plus"></i>Закрыть');
          $(this.onclick).addClass('close-btn');
      }  
   }

   hide(){
     $("#"+this.el).slideUp(100);
     $(this.onclick).html(this.onclick_old_value);
     $(this.onclick).removeClass('close-btn');
   }

   listner(){ // слушаем клики и обновляем sessionStorage
      let o = this;
      $("#"+o.el+" .input-element-component-add-btn").on( "click", function() {
	    let values = $('.input-multi-element-component-value').map(function (idx, ele) {
		console.log(idx, ele);
      		return { index: $(ele).attr('index'), value: $(ele).val() } 
	     }).get();
 	    o.callback(values);
      });

    $(this.onclick).off('click').on('click', function(e){
	  e.preventDefault();  	
          if($(this).hasClass('close-btn')){
		o.hide();
          } else 
		o.show();
	});

    }
 }
