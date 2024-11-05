class loadingComponent {
     constructor() {
     console.log('Start loadingComponent creating...');
     if(!this.exist()) {
          this.create();  /* проверяем на наличие создаем при необходимости */
      }
    }

   exist(){
     return ($(".loading").length) ? true : false;
   }

   create() {
        console.log('loadingComponent create...');
	$("body").append(
	'<div class="loading" style="display: none; z-index: 3000; width: auto; position: fixed; left: 50%; top: 50%; height: auto;">'+
	'   <div>'+
	'       <h4 class="display-4" style="font: 1em sans-serif;'+
	'         background-color: #e3e1e1;'+
	'         width: 150px;'+
	'         height: 40px;'+
	'         text-align: center;'+
	'         vertical-align: middle;'+
	'         padding: 12px 2px 2px 2px;'+
	'         margin: 2px 2px 2px 2px;'+
	'         color: #000;'+
	'         border-radius: 5px;'+
	'         border: 1px solid #cac1c1;">Загрузка данных <i class="fa fa-sync fa-spin"></i>'+
	'       </h4>'+
	'     </div>'+
	'  </div>'
	);

   }

   remove(){
     $(".loading").remove();		
   }

   show(){
     $(".loading").show();		
   }

   hide(){
     $(".loading").hide();		
   }
 }

