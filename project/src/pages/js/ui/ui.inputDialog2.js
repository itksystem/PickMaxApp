/* Раскрывающийся диалог для ввода данных 
   Успользуется для регистрации значения в таблице данных с передаче в метод
   регистрируемого параметра
*/
class inputDialog2{
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
	+'  	  	   <input type="'+this.type+'" class="form-control input-element-component2-value" index=0 placeholder="'+this.placeholder+'" style="font-size: 1.2rem;  height: 2.4rem;">'
	+'	    </div>'
	+'	    <div class="col-sm-3">'
	+'  	  	   <button type="submit" class="btn btn-lg btn-primary input-element-component-add-btn d-flex" for=".add-input-group-component">'+this.buttonName+'</button>'
	+'	    </div>'
	+'    </div>'
	+'  </div>'
	+'<hr>'
	+'</div>');
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
	console.log($('.input-element-component2-value[index=0]').val());
	    let values = $('.input-element-component2-value').map(function (idx, ele) {
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
