/*******************************************************************/
/* Компонент управления доступа пользователя к группам организации */
/* Sinyagin Dmitry rel.at 10.10.2021                               */
/*******************************************************************/

class FunctionsComponent {
   data;   
   userId;
   paginationElement='a.profile-access-function-nav';
   
    
  constructor(userId, config) {
      this.userId = userId;
      this.config = config;
      this.addButton = this.buttonInit();
      this.addButton.initialization = false;
      this.load(1);
  }
   load(page=1) {
      let  config=this.config;     
      var o = this;
      var service_extension = document.location.href.includes('/profile')  || document.location.href.includes('/servicecalls');
      $.ajax({
        url: config.url+"/"+o.userId+"/"+page+"/"+o.config.limit,
        cache: false,
        method: "POST",
        dataType: "json",
        data : { 
            service_id   : $(".function-access-service-names-filter option:selected").eq(0).val(),
            function_id  : $(".function-access-function-names-filter option:selected").eq(0).val()
          },           
        success: function(data){ 
          let s='';
          o.data = data;
          console.log(data);
          if(data.functions!=null)
            if(data.functions.length>0)
           $.each(data.functions, function( key, val) {
 	  console.log(val.access);
          s+=
           '  <tr>'+
           '    <td>'+((data.page*data.limit-data.limit)+key+1)+'</td>'+
           '    <td>'+val.service_name+'</td>'+
           '    <td>'+val.function_name+'</td>'+
           '    </div>'+
           '   </td>'
           + ( service_extension  ?
           '  <td><span style="background:none; ">'+
           '	   <div class="form-function" style="margin:0 0 0 0;">'+
           '     <div class="custom-control custom-switch">'+
           '        <input type="checkbox" class="custom-control-input profile-access-function" id="access-function-switchbox'+key+'" function-id="'+val.function_id+'"'
		+ ((val.access==1) ? " checked " : "0 ")+' >'+
           '        <label class="custom-control-label" for="access-function-switchbox'+key+'"></label>'+
           '     </div>'+
           '    </div>'+
           '   </span></td>'
           : '')
           + ( service_extension  ?'	<td style="width: 1rem;" class="text-center"> <button type="button" class="btn btn-default btn-functions-name-editor" function-id="'+val.function_id+'"><i class="fa fa-edit" data-original-title="Редактировать запись"></i></button> </td>' : '')
           + '<td style="width: 1rem;" class="sm-col-2 text-center align-middle"> <button type="button" class="btn btn-default btn-functions-name-trasher" function-id="'+val.function_id+'"><i class="fa fa-trash-alt" data-original-title="Удалить запись"></i></button> </td>'+

           '  </tr>';
          })
          console.log(config);
          $(config.tableElement).html(s);
          $(config.paginationElementPoligon).html(o.pagination());   
          o.switchers();
          o.paginationHandler();
	  o.delButtonInit();
          o.loadServiceSelectElement('.function-access-service-names-filter',
            function(){ 
              var serviceId=this.options[this.selectedIndex].value;
              o.load();
              if(serviceId != '') {
                $.getJSON("/services/functions/"+serviceId, function( data ) {  
                   var e='<option value="">-- Все функции -- </option>';
                        $.each(data, function(i, v) {
                         e+="<option value=\""+v.id+"\">"+v.name+"</option>";
                     });			
                     $('select.function-access-function-names-filter').html("<select id=\"function_id\" name=\"function_id\">"+e+"</select>");
                     $('select.function-access-function-names-filter').off('change').on('change',
                     function(){ o.load() }
                  );
                o.load();
             });
            } else {
              $('select.function-access-function-names-filter').html('<select id=\"function_id\" name=\"function_id\"><option value="">-- Все функции -- </option></select>');
            }
         });
         $(".function-access-service-names-filter option[value='"+o.data.filter.service_id+"']").prop("selected",true);

	if(!o.addButton.initialization) {
         o.addButton.init(()=>{
	     o.loadServiceSelectAddElement('.input-multi-element-component-value[index=0]',  ()=>{});
  	    });
          o.addButton.initialization = true;
	}

         /* выделяем цветом активную страницу */
         $.each(data.pages, function( key, val) {
             $("a.profile-access-function-nav").removeClass('active');
         });    
       $('a.profile-access-function-nav.choice[page="'+page+'"]').addClass('active');
        /* Инициализация переключателей */
       
      }});
  }

 delButtonInit(){
    let o = this;
    $('.btn-functions-name-trasher').off('click').on('click', function(e){
    let function_id = $(this).attr('function-id');
    let function_name = o.data.functions.filter(item => item.function_id == function_id)[0].function_name;
    new ModalDialog('modal-functions-delete')
     .Prop({size : "middle" , draggable : true })
     .Header('Удалить роль?', {backgroundColor: '#343a40', color: '#aaaaae'})
     .Body('<div style="font-size: 1rem;line-height: 1.4;"><div class="row"><div class="col-sm-3">'
        +'<img src="/main/images/trash.png" style="width:4rem; margin: 0.4rem; margin-left: 3rem;"></div>'    
        +'<div class="col-sm"><span style="font-size: 1.1rem;"><span>Вы хотите удалить функцию?<br>'
        +'<b>'+ function_name+'</b>'
        +'</span></div></div></div>')
     .Footer({ "ok": "Да", "close": "Нет"})
     .Handler(()=>{
 	      $("#modal-functions-delete-dialog").remove();
	      $(".modal-backdrop").remove();
	      $(".loading").show();
		  $.ajax({
		    url: '/functions/'+$(this).attr('function-id'),
		    cache: false,
		    method: "DELETE",
		    dataType: "json",
		    success: function(response){ // если запрос успешен вызываем функцию
			if(response.resultCode == 0) {
	 	   	    o.addButtonReloadPage('success', 'Удаление функции', "Функция успешно удалена!" );
			}  else 
			o.addButtonReloadPage('error', 'Удаление функции', "Возникла ошибка при удалении функции!" );  		     
		    },
		    error: function(response){ // если запрос успешен вызываем функцию
			o.addButtonReloadPage('error', 'Удаление функции', "Возникла ошибка при удалении функции!" );  		     }
  	        }).done(function() {
   	      $(".loading").hide();
         });

     }).create().show();
   });
 }


 addButtonReloadPage(result, title, description){
   let o = this;
   $(".loading").hide();
   switch(result) {
    case 'success' : {
        new infoDialog().success(title, description); break;    }
    case 'error' : {
        new infoDialog().error(title, description ); break;  }
    }
   o.load();
 }

 buttonInit(){
    let o = this;
    return new inputMultiDialog(
          {
            onclick:     ".new-function-add-btn",
            target:      ".new-function-add-element",   
            elementName: "new-function-add-name",
            type:"text",
            title:"Добавить новую функцию",
   	    placeholder:"Введите имя новой функции",
            buttonName:'<i class="fa fa-edit" data-original-title="Редактировать запись"></i>Добавить функцию'
          },   function(e){
	          console.log(e);
		  $(".loading").show();
		  $.ajax({
		    url: '/functions/add',
		    cache: false,
		    method: "POST",
		    dataType: "json",
		    data: {
			"service_id": e[0].value, 
			"function_name" : e[1].value, 
			"function_tag": e[2].value 
		     },
		    success: function(response){ // если запрос успешен вызываем функцию
  	  	    if(response.resultCode == 0) {
			o.addButtonReloadPage('success','Добавление функции','Функция успешно добавлена'); 
                      } else 
			o.addButtonReloadPage('error','Добавление функции','При добавлении функции возникла ошибка!');  		     
		    },
		    error: function(response){ // если запрос успешен вызываем функцию
			o.addButtonReloadPage('error','Добавление функции','При добавлении функции возникла ошибка!');  		     
		     } 
  	        }).done(function() {
   	      this.hide();
          });
    })
	.add({
	     index :  2,
	     type: 'text',
	     placeholder: 'Тэг функции...'
 	})
	.add({
	     index :  1,
	     type: 'text',
	     placeholder: 'Описание функции...'
 	})
	.add({
	     index :  0,
	     type: 'select',
	     placeholder: 'Укажите раздел использования функции...'
 	})
	.init(()=>{
		console.log(this);
	});
 }





   pagination() {
    var o = this;
    var pagination='<ul class="pagination pagination-sm m-0 float-right">'
          +'<li class="page-item"><a class="page-link profile-access-function-nav first" page="1"  href="#"><<</a></li>';
       $.each(o.data.pages, function( key, val) {
         pagination+='<li class="page-item"><a class="page-link profile-access-function-nav choice" page="'+val+'" href="#">'+val+'</a></li>';
        });
      pagination+='<li class="page-item"><a class="page-link profile-access-function-nav last" page="'+o.data.pagesCount+'" href="#">>></a></li>'
        +'</ul>';
     return pagination;
  }

   paginationHandler() {     
    let o=this;
      $(o.paginationElement).on('click',function(e) {
          e.preventDefault();
          o.load($(this).attr('page'));
      });
   }

   loadServiceSelectElement(el, callback){
    let o=this;
    let _s=
    '<select class="function-access-service-names-filter form-control" style="height: 2rem;"> <option value="">-- Все сервисы --</option>';	
   if(o.data.services.length > 0) 
      $.each(o.data.services, function( key, value) {   // собираем организации
       _s+='<option value="'+value.id+'">'+value.name+'</option>';	
    });
    $(el).html(_s+'</select>');
    $('select.function-access-service-names-filter').off('change').on('change',callback);
   }


   loadServiceSelectAddElement(el, callback){
    let o=this;
    let _s=
    '<select class="add-group-access-org-names-filter form-control" style="height: 2rem;"> <option value="">-- Все организации --</option>';	
   if(o.data.services.length > 0) 
    $.each(o.data.services, function( key, value) {   // собираем организации
       _s+='<option value="'+value.id+'">'+value.name+'</option>';	
    });
    $(el).html(_s+'</select>');
    $('select.add-group-access-org-names-filter').off('change').on('change',callback);
   }

   
   handler(el, event, callback) {
    $(el).on(event,callback);
  }

  switchers(){
   let o = this; 
    $("input.profile-access-function[type=checkbox]").on('change',function(e) {
      $(this).val(this.checked ? "TRUE" : "FALSE");
      console.log(this.checked);
       $.ajax({
         url: o.config.switcherUrl,
         cache: false,
        method: "POST",
        dataType: "json",
           data: {"userId":o.userId,"function_id":$(this).attr("function-id"),"access": this.checked},
        success: function(response){ // если запрос успешен вызываем функцию
                     console.log(response);
        },
        error: function(response){ // если запрос успешен вызываем функцию
              console.log(response);
        }
      }).done(function() {});
    });
  }

}
