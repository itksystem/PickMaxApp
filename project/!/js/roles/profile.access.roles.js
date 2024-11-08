/*******************************************************************/
/* Компонент управления доступа пользователя к ролям в организации */
/* Sinyagin Dmitry rel.at 10.10.2021                               */
/*******************************************************************/

class RolesComponent {
   data;   
   userId;
   paginationElement='a.profile-access-roles-nav';
   
    
  constructor(userId, config) {
      this.userId = userId;
      this.config = config;
      this.addButton = this.buttonInit();
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
            role_id   : $(".group-access-roles-names-filter option:selected").eq(0).val()
          },           
        success: function(data){ 
          let s;
          o.data = data;
 	  console.log(data);
          $.each(data.roles, function( key, val) {
 	  console.log(val.access);
          s+=
           ' <tr>'+
           '    <td>'+((data.page*data.limit-data.limit)+key+1)+'</td>'+
           '    <td>'+val.role_name+'</td>'
           + ( service_extension  ?
           '    <td><span style="background:none; ">'+
           '    <div class="form-group" style="margin:0 0 0 0;">'+
           '     <div class="custom-control custom-switch">'+
           '        <input type="checkbox" class="custom-control-input profile-access-roles" id="access-roles-switchbox'+key+'" role-id="'+val.role_id+'"'
		   + ((val.access==1) ? " checked " : "0 ")+' >'+
           '        <label class="custom-control-label" for="access-roles-switchbox'+key+'"></label>'+
           '     </div>'+
           '    </div>'+
           '   </span></td>'
           : '') 
           + ( service_extension  ?  '	<td style="width: 1rem;" class="text-center"> <button type="button" class="btn btn-default btn-roles-name-editor" role-id="'+val.role_id+'"><i class="fa fa-edit" data-original-title="Редактировать запись"></i></button> </td>' : '') 
           + '	<td style="width: 1rem;" class="sm-col-2 text-center align-middle"> <button type="button" class="btn btn-default btn-roles-name-trasher" role-id="'+val.role_id+'"><i class="fa fa-trash-alt" data-original-title="Удалить запись"></i></button> </td>'
           + ' </tr>';
          })
          console.log(config);
          $(config.tableElement).html(s);
          $(config.paginationElementPoligon).html(o.pagination());   
          o.switchers();
          o.paginationHandler();

          o.loadrolesSelectElement('.group-access-roles-names-filter',function(){
	      o.load();
  	  });
	  o. delButtonInit();

          $(".group-access-roles-names-filter option[value='"+o.data.filter.role_id+"']").prop("selected",true);
         /* выделяем цветом активную страницу */
         $.each(data.pages, function( key, val) {
             $("a.profile-access-role-nav").removeClass('active');
         });    
       $('a.profile-access-roles-nav.choice[page="'+page+'"]').addClass('active');
        /* Инициализация переключателей */
       
      }});
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

 delButtonInit(){
    let o = this;
    $('.btn-roles-name-trasher').off('click').on('click', function(e){
    let role_id = $(this).attr('role-id');
    let role_name = o.data.roles.filter(item => item.role_id == role_id)[0].role_name;
    new ModalDialog('modal-role-delete')
     .Prop({size : "middle" , draggable : true })
     .Header('Удалить роль?', {backgroundColor: '#343a40', color: '#aaaaae'})
	   .Body('<div style="font-size: 1rem;line-height: 1.4;"><div class="row"><div class="col-sm-3">'
            +'<img src="/main/images/trash.png" style="width:4rem; margin: 0.4rem; margin-left: 3rem;"></div>'    
            +'<div class="col-sm"><span style="font-size: 1.1rem;"><span>Вы хотите удалить роль?<br>'
   	    +'<b>'+ role_name+'</b>'
	    +'</span></div></div></div>')
	   .Footer({ "ok": "Да", "close": "Нет"})
	   .Handler(()=>{
	 	      $("#modal-role-delete-dialog").remove();
		      $(".modal-backdrop").remove();
		      $(".loading").show();
			  $.ajax({
			    url: '/roles/'+$(this).attr('role-id'),
			    cache: false,
			    method: "DELETE",
			    dataType: "json",
			    success: function(response){ // если запрос успешен вызываем функцию
				if(response.resultCode == 0) {
		 	   	    o.addButtonReloadPage('success', 'Удаление роли', "Роль успешно удалена!" );
				}  else 
				o.addButtonReloadPage('error', 'Удаление роли', "Возникла ошибка при удалении роли!" );  		     
			    },
			    error: function(response){ // если запрос успешен вызываем функцию
				o.addButtonReloadPage('error', 'Удаление роли', "Возникла ошибка при удалении роли!" );  		     }
	  	        }).done(function() {
	   	      $(".loading").hide();
	         });

	     }).create().show();
   });
 }

 buttonInit(){
    let o = this;
    return new inputDialog2(
          {
            onclick:     ".new-role-add-btn",
            target:      ".new-role-add-element",   
            elementName: "new-role-add-name",
            type:"text",
            title:"Добавить новую роль",
   	    placeholder:"Введите имя новой роли",
            buttonName:'<i class="fa fa-edit" data-original-title="Редактировать запись"></i>Добавить роль'
          },   function(e){
   	      $(".loading").show();
		  $.ajax({
		    url: '/roles/add',
		    cache: false,
		    method: "POST",
		    dataType: "json",
		    data: { "role_name" : e[0].value },
		    success: function(response){ // если запрос успешен вызываем функцию
			if(response.resultCode == 0) {
					o.addButtonReloadPage('success', 'Добавление новой роли ', "Роль успешно добавлена!" );
				} else 
			o.addButtonReloadPage('error', 'Добавление новой роли', "Возникла ошибка при добавлении роли!" );  		     
		    },
		    error: function(response){ // если запрос успешен вызываем функцию
			o.addButtonReloadPage('error', 'Добавление новой роли', "Возникла ошибка при добавлении роли!" );  		     }
  	        }).done(function() {
   	      $(".loading").hide();
          });
    });
 }



   pagination() {
    var o = this;
    var pagination='<ul class="pagination pagination-sm m-0 float-right">'
          +'<li class="page-item"><a class="page-link profile-access-roles-nav first" page="1"  href="#"><<</a></li>';
       $.each(o.data.pages, function( key, val) {
         pagination+='<li class="page-item"><a class="page-link profile-access-roles-nav choice" page="'+val+'" href="#">'+val+'</a></li>';
        });
      pagination+='<li class="page-item"><a class="page-link profile-access-roles-nav last" page="'+o.data.pagesCount+'" href="#">>></a></li>'
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
    $("input.profile-access-roles[type=checkbox]").on('change',function(e) {
      let checked= $(this).prop('checked');
      $('input.profile-access-roles[type=checkbox]').prop('checked', false);
      $(this).prop('checked', checked);
       $.ajax({
         url: o.config.switcherUrl,
         cache: false,
         method: "POST",
         dataType: "json",
         data: {"userId":o.userId,"role_id":$(this).attr("role-id"),"access": this.checked},
         success: function(response){ // если запрос успешен вызываем функцию
                     console.log(response);
        },
        error: function(response){ // если запрос успешен вызываем функцию
              console.log(response);
        }
      }).done(function() {});
    });
  }


  loadrolesSelectElement(el, callback){
    let o=this;
    let _s=
    '<select class="group-access-roles-names-filter form-control" style="height: 2rem;"> <option value="">-- Все роли --</option>';	
    $.each(o.data.roles, function( key, value) {   // собираем организации
       _s+='<option value="'+value.role_id+'">'+value.role_name+'</option>';	
    });
    $(el).html(_s+'</select>');
    $('select.group-access-roles-names-filter').off('change').on('change',callback);
  }
}
