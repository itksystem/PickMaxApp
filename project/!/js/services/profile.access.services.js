/*******************************************************************/
/* Компонент управления доступа пользователя к группам организации */
/* Sinyagin Dmitry rel.at 10.10.2021                               */
/*******************************************************************/

class ServicesComponent {
   data;   
   userId;
   paginationElement='a.profile-access-services-nav';
   
    
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
            service_id   : $(".group-access-services-names-filter option:selected").eq(0).val()
          },           
        success: function(data){ 
          let s;
          o.data = data;
 	  console.log(data);
          $.each(data.services, function( key, val) {
          s+=
           ' <tr>'+
           '    <td style="text-align: center; ">'+((data.page*data.limit-data.limit)+key+1)+'</td>'+
           '    <td>'+(val.service_name != null ? val.service_name : '' )+'</td>'+
           '    <td>'+(val.method !== null ? val.method : '' )+'</td>'+
           '    <td>'+(val.url !== null ? val.url : '' )+'</td>'+
           '    <td>'+(val.tag !== null ? val.tag : '' )+'</td>'+
           ( service_extension  ?
           '    <td><span style="background:none; ">'+
           '    <div class="form-group" style="margin:0 0 0 0;">'+
           '     <div class="custom-control custom-switch">'+
           '        <input type="checkbox" class="custom-control-input profile-access-services" id="access-services-switchbox'+key+'" service-id="'+val.service_id+'"'
		   + ((val.access==1) ? " checked " : "0 ")+' >'+
           '        <label class="custom-control-label" for="access-services-switchbox'+key+'"></label>'+
           '     </div>'+
           '    </div>'+
           '   </span></td>'
           : '')
           + ( service_extension  ? '	<td style="width: 1rem;" class="text-center"> <button type="button" class="btn btn-default btn-services-name-editor" service-id="'+val.service_id+'"><i class="fa fa-edit" data-original-title="Редактировать запись"></i></button> </td>' : '') 
	   + '<td style="width: 1rem;" class="sm-col-2 text-center align-middle"> <button type="button" class="btn btn-default btn-services-name-trasher" service-id="'+val.service_id+'"><i class="fa fa-trash-alt" data-original-title="Удалить запись"></i></button> </td>'
           + ' </tr>';
          })
          console.log(config);
          $(config.tableElement).html(s);
          $(config.paginationElementPoligon).html(o.pagination());   
          o.switchers();
          o.paginationHandler();
          o.delButtonInit();
          o.loadServicesSelectElement('.group-access-services-names-filter',function(){
	      o.load();
  	  });

          $(".group-access-services-names-filter option[value='"+o.data.filter.service_id+"']").prop("selected",true);

	if(!o.addButton.initialization) {
         o.addButton.init(()=>{

  	    });
   	 o.addButton.initialization = true;
	}

         /* выделяем цветом активную страницу */
         $.each(data.pages, function( key, val) {
             $("a.profile-access-service-nav").removeClass('active');
         });    
       $('a.profile-access-services-nav.choice[page="'+page+'"]').addClass('active');
        /* Инициализация переключателей */
       
      }});
  }


 delButtonInit(){
    let o = this;
    $('.btn-services-name-trasher').off('click').on('click', function(e){
    let service_id = $(this).attr('service-id');
    let service_name = o.data.services.filter(item => item.service_id == service_id)[0].service_name;
        new ModalDialog('modal-services-delete')
           .Prop({size : "middle" , draggable : true })
	   .Header('Удалить роль?', {backgroundColor: '#343a40', color: '#aaaaae'})
	   .Body('<div style="font-size: 1rem;line-height: 1.4;"><div class="row"><div class="col-sm-3">'
	       +'<img src="/main/images/trash.png" style="width:4rem; margin: 0.4rem; margin-left: 3rem;"></div>'    
	       +'<div class="col-sm"><span style="font-size: 1.1rem;"><span>Вы хотите удалить сервис?<br><b>'+ service_name+'</b>'
	       +'</span></div></div></div>')
	   .Footer({ "ok": "Да", "close": "Нет"})
	   .Handler(()=>{
	 	      $("#modal-services-delete-dialog").remove();
		      $(".modal-backdrop").remove();
		      $(".loading").show();
			  $.ajax({
			    url: '/services/'+$(this).attr('service-id'),
			    cache: false,
			    method: "DELETE",
			    dataType: "json",
			    success: function(response){ // если запрос успешен вызываем функцию
				if(response.resultCode == 0) {
		 	   	    o.addButtonReloadPage('success', 'Удаление сервиса', "Сервис успешно удалена!" );
				}  else 
				o.addButtonReloadPage('error', 'Удаление сервиса', "Возникла ошибка при удалении сервиса!" );  		     
			    },
			    error: function(response){ // если запрос успешен вызываем функцию
				o.addButtonReloadPage('error', 'Удаление сервиса', "Возникла ошибка при удалении сервиса!" );  		     }
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
            onclick:     ".new-service-add-btn",
            target:      ".new-service-add-element",   
            elementName: "new-service-add-name",
            type:"text",
            title:"Добавить новую группу",
   	    placeholder:"Введите имя новой группы",
            buttonName:'<i class="fa fa-edit" data-original-title="Редактировать запись"></i>Добавить сервис'
          },   function(e){
	          console.log(e);
		  $(".loading").show();
		  $.ajax({
		    url: '/services/add',
		    cache: false,
		    method: "POST",
		    dataType: "json",
		    data: {
			"service_name"    : e[0].value,
			"service_url"     : e[1].value,
			"service_tag"     : e[2].value,
			"service_tooltip" : e[3].value
		    },
		    success: function(response){ // если запрос успешен вызываем функцию
  	  	    if(response.resultCode == 0) {
			o.addButtonReloadPage('success','Добавление сервиса','Сервис успешно добавлен'); 
                      } else 
			o.addButtonReloadPage('error','Добавление сервиса','При добавлении сервиса возникла ошибка!');  		     
		    },
		    error: function(response){ // если запрос успешен вызываем функцию
			o.addButtonReloadPage('error','Добавление сервиса','При добавлении сервиса возникла ошибка!');  		     
		     } 
  	        }).done(function() {
   	      this.hide();
          });
    })
	.add({
	     index :  3,
	     type: 'text',
	     placeholder: 'Укажите описание сервиса'
 	})
	.add({
	     index :  2,
	     type: 'text',
	     placeholder: 'Тэг сервиса ( пример, article)'
 	})
	.add({
	     index :  1,
	     type: 'text',
	     placeholder: 'Ссылка на раздел (пример, /article)'
 	})
	.add({
	     index :  0,
	     type: 'text',
	     placeholder: 'Укажите наименование сервиса'
 	})
	.init(()=>{
		console.log(this);
	});
 }


  pagination() {
    var o = this;
    var pagination='<ul class="pagination pagination-sm m-0 float-right">'
          +'<li class="page-item"><a class="page-link profile-access-services-nav first" page="1"  href="#"><<</a></li>';
       $.each(o.data.pages, function( key, val) {
         pagination+='<li class="page-item"><a class="page-link profile-access-services-nav choice" page="'+val+'" href="#">'+val+'</a></li>';
        });
      pagination+='<li class="page-item"><a class="page-link profile-access-services-nav last" page="'+o.data.pagesCount+'" href="#">>></a></li>'
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

   handler(el, event, callback) {
    $(el).on(event,callback);
  }

  switchers(){
   let o = this; 
    $("input.profile-access-services[type=checkbox]").on('change',function(e) {
      $(this).val(this.checked ? "TRUE" : "FALSE");
      console.log(this.checked);
       $.ajax({
        url: o.config.switcherUrl,
        cache: false,
        method: "POST",
        dataType: "json",
        data: {"userId":o.userId,"serviceId":$(this).attr("service-id"),"access": this.checked},
        success: function(response){ // если запрос успешен вызываем функцию
                     console.log(response);
        },
        error: function(response){ // если запрос успешен вызываем функцию
              console.log(response);
        }
      }).done(function() {});
    });
  }


  loadServicesSelectElement(el, callback){
    let o=this;
    let _s=
    '<select class="group-access-services-names-filter form-control" style="height: 2rem;"> <option value="">-- Все сервисы --</option>';	
    $.each(o.data.services, function( key, value) {   // собираем организации
       _s+='<option value="'+value.service_id+'">'+value.service_name+'</option>';	
    });
    $(el).html(_s+'</select>');
    $('select.group-access-services-names-filter').off('change').on('change',callback);
  }


}