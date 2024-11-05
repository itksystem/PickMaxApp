/*******************************************************************/
/* Компонент управления доступа пользователя к группам организации */
/* Sinyagin Dmitry rel.at 10.10.2021                               */
/*******************************************************************/

class GroupsComponent {
   data;   
   userId;
   paginationElement='a.profile-access-group-nav';
   org_id='';  
   group_id='';
    
  constructor(userId, config) {
      this.userId = userId;
      this.config = config;
      this.addButton = this.addComponetInitialization();
      this.addButton.initialization = false;
      this.load(1);

 }

   load(page=1) {
      let config=this.config;     
      var o = this;
      var service_extension = document.location.href.includes('/profile') || document.location.href.includes('/servicecalls');
      console.log(service_extension);
      $.ajax({
        url: config.url+"/"+o.userId+"/"+page+"/"+o.config.limit,
        cache: false,
        method: "POST",
        dataType: "json",
        data : { org   : o.org_id, group : o.group_id  },           
        success: function(data){ 
          let s='';
          o.data = data;
	  if(data.groups != null)
          $.each(data.groups, function( key, val) {
        	  s+=
	           '  <tr>'+
	           '    <td>'+((data.page*data.limit-data.limit)+key+1)+'</td>'+
	           '    <td>'+val.organization_name+'</td>'+
	           '    <td>'+val.group_name+'</td>'+
	           '    </div>'+
	           '   </td>'
             + ( service_extension  ?
	           '  <td><span style="background:none; ">'+
	           '	   <div class="form-group" style="margin:0 0 0 0;">'+
	           '     <div class="custom-control custom-switch">'+
	           '        <input type="checkbox" class="custom-control-input profile-access-group" id="access-group-switchbox'+key+'" group-id="'+val.group_id+'"'
			            + ((val.access==1) ? " checked " : "0 ")+' >'+
	           '        <label class="custom-control-label" for="access-group-switchbox'+key+'"></label>'+
	           '     </div>'+
	           '    </div>'+
	           '   </span></td>'
             : '' )
  		        + ( service_extension  ? '	<td style="width: 1rem;" class="text-center"> <button type="button" class="btn btn-default btn-group-name-editor" group-id="'+val.group_id+'"><i class="fa fa-edit" data-original-title="Редактировать запись"></i></button> </td>' : '' ) 
              + '	<td style="width: 1rem;" class="sm-col-2 text-center align-middle"> <button type="button" class="btn btn-default btn-group-name-trasher" group-id="'+val.group_id+'"><i class="fa fa-trash-alt" data-original-title="Удалить запись"></i></button> </td>' 
	           '  </tr>';
          })
          $(config.tableElement).html(s);
          o.VisualComponentsInitalization(page);	  
      }});
  }

   VisualComponentsInitalization(page=1) {
     let o = this;
     this.accessSwitcherComp().Pagination().deleteBtn()
	.organizationLoader(	 
 	 function(){
           o.org_id=$(".group-access-org-names-filter option:selected").eq(0).val();
           o.group_id =''; 	
    	   o.load();
        }).groupLoader(
 	     function(){
	        o.group_id=$(".group-access-group-names-filter option:selected").eq(0).val(); 	
                if(o.group_id != '') {
    	          let _o = o._data.filter(item => item.group_id == o.group_id);
	   	   if(_o.length > 0) {
		       o.org_id =_o[0].organization_id;
		       $(".group-access-org-names-filter option[value='"+o.org_id+"']").prop("selected",true);
          	    }
	       }
	   o.load();
        })
	.paginationPage(page);
	if(!o.addButton.initialization) { // Инициализация блока "Добавить"
            o.addButton.init(()=>{
         	     o.organizationAddComponentLoader('.input-multi-element-component-value[index=0]', ()=>{});
   	    });
     	    o.addButton.initialization = true;
	}
   }

   organizationLoader(callback){
    let o = this;
       let _s='<select class="group-access-org-names-filter form-control " style="height: 2rem;" > <option value="">-- Все организации --</option>';	
          $.each(this.data.organizations, function( key, value) {   // собираем организации
            _s+="<option value=\""+value.organization_id+"\" "+((value.organization_id==o.org_id) ? "selected" : "") +">"+value.organization_name+"</option>";
          });
        $('.group-access-org-names-filter').html(_s+'</select>');
     $('select.group-access-org-names-filter').off('change').on('change',callback);
    return this;
   }


   groupLoader(callback){
     let o = this;
     o._data=null;
     $.getJSON("/org/getGroups/"+(o.org_id == undefined ? '' : o.org_id) ,
      function(data) {  
         var e='<option value="">-- Все группы -- </option>';
              $.each(data, function(i, v) {
                  e+="<option value=\""+v.group_id+"\" "+((v.group_id==o.group_id) ? "selected" : "") +">"+v.group_name+"</option>";
              });			
	o._data = data;
        $('select.group-access-group-names-filter').html("<select id=\"group_id\" name=\"group_id\" >"+e+"</select>");
        $('select.group-access-group-names-filter').off('change').on('change',callback);	
      })
    return this;
   }

   organizationAddComponentLoader(el, callback){
    let _s='<select class="add-group-access-org-names-filter form-control " style="height: 2rem;"> <option value="">-- Все организации --</option>';	
    $.each(this.data.organizations, function( key, value) {   // собираем организации
       _s+='<option value="'+value.organization_id+'">'+value.organization_name+'</option>';	
    });
    $(el).html(_s+'</select>');
    $('select.add-group-access-org-names-filter').off('change').on('change',callback);
   }
   

 deleteBtn(){
    let o = this;
    $('.btn-group-name-trasher').off('click').on('click', function(e){
    let group_id = $(this).attr('group-id');
    let group_name = o.data.groups.filter(item => item.group_id == group_id)[0].group_name;
    console.log(group_name);
    new ModalDialog('modal-group-list-edit')
     .Prop({size : "middle" , draggable : true })
     .Header('Удалить группу?', {backgroundColor: '#343a40', color: '#aaaaae'})
     .Body('<div style="font-size: 1rem;line-height: 1.4;"><div class="row"><div class="col-sm-3">'
          +'<img src="/main/images/trash.png" style="width:4rem; margin: 0.4rem; margin-left: 3rem;"></div>'    
          +'<div class="col-sm"><span style="font-size: 1.1rem;"><span>Вы хотите удалить группу?<br>'
          +'<b>'+ group_name+'</b>'
          +'</span></div></div></div>')
	   .Footer({ "ok": "Да", "close": "Нет"})
	   .Handler(()=>{
 	     $("#modal-group-list-edit-dialog").remove();
	     $(".modal-backdrop").remove();
   	     $(".loading").show();
	     $.ajax({
		       url: '/groups/'+$(this).attr('group-id'),
		       cache: false,
		       method: "DELETE",
		       dataType: "json",
		       success: function(response){ // если запрос успешен вызываем функцию
		        	if(response.resultCode == 0) {
	   	   	        o.ResultDlg('success', 'Удаление группы', "Группа успешно удалена!" );
				        }  else 
 			            o.ResultDlg('error', 'Удаление группы', "Возникла ошибка при удалении группы!" );  		     
			      },
			     error: function(response){ // если запрос успешен вызываем функцию
	   		          o.ResultDlg('error', 'Удаление группы', "Возникла ошибка при удалении группы!" );  		     }
           }).done(function() {
	       $(".loading").hide();
	     });
     }).create().show();
   });
  return this;
 }


 ResultDlg(result, title, description){
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

 addComponetInitialization(){
    let o = this;
    return new inputMultiDialog(
          {
            onclick:     ".new-group-add-btn",
            target:      ".new-group-add-element",   
            elementName: "new-group-add-name",
            type:"text",
            title:"Добавить новую группу",
   	    placeholder:"Введите имя новой группы",
            buttonName:'<i class="fa fa-edit" data-original-title="Редактировать запись"></i>Добавить группу'
          },   function(e){
	          console.log(e);
		  $(".loading").show();
		  $.ajax({
		    url: '/groups/add',
		    cache: false,
		    method: "POST",
		    dataType: "json",
		    data: {"org_id": e[0].value, "group_name" : e[1].value },
		    success: function(response){ // если запрос успешен вызываем функцию
  	  	    if(response.resultCode == 0) {
			o.ResultDlg('success','Добавление группы','Группа успешно добавлена'); 
                      } else 
			o.ResultDlg('error','Добавление группы','При добавлении группы возникла ошибка!');  		     
		    },
		    error: function(response){ // если запрос успешен вызываем функцию
			o.ResultDlg('error','Добавление группы','При добавлении группы возникла ошибка!');  		     
		     } 
  	        }).done(function() {
   	      this.hide();
          });
    }).add({
	     index :  1,
	     type: 'text',
	     placeholder: 'Наименование группы'
   }).add({
	     index :  0,
	     type: 'select',
	     placeholder: 'Укажите подразделение'
   }).init(()=>{
 	     console.log(this);
   });
 }

   paginationPage(page){
      var o = this;
      $.each(o.data.pages, function( key, val) {
          $("a.profile-access-group-nav").removeClass('active');
      });    
      $('a.profile-access-group-nav.choice[page="'+page+'"]').addClass('active');
   }

   outPaginatioPlg() {
    var o = this;
    var pagination='<ul class="pagination pagination-sm m-0 float-right"><li class="page-item"><a class="page-link profile-access-group-nav first" page="1"  href="#"><<</a></li>';
     $.each(o.data.pages, function( key, val) {
         pagination+='<li class="page-item"><a class="page-link profile-access-group-nav choice" page="'+val+'" href="#">'+val+'</a></li>';
     });
     pagination+='<li class="page-item"><a class="page-link profile-access-group-nav last" page="'+o.data.pagesCount+'" href="#">>></a></li></ul>';
     return pagination;
  }

   Pagination() {     
    let o=this;
    $(o.config.paginationElementPoligon).html(o.outPaginatioPlg());   
    $(o.paginationElement).off('click').on('click',function(e) { e.preventDefault();  o.load($(this).attr('page')); });
    return this;
   }


  accessSwitcherComp(){
   let o = this; 
    $("input.profile-access-group[type=checkbox]").on('change',function(e) {
      $(this).val(this.checked ? "TRUE" : "FALSE");
      console.log(this.checked);
       $.ajax({
         url: o.config.switcherUrl,
         cache: false,
        method: "POST",
        dataType: "json",
           data: {"userId":o.userId,"groupId":$(this).attr("group-id"),"access": this.checked},
        success: function(response){ // если запрос успешен вызываем функцию
                     console.log(response);
        },
        error: function(response){ // если запрос успешен вызываем функцию
              console.log(response);
        }
      }).done(function() {});
    });
   return this;
 }
}

console.log('GroupsComponent load...');