/*******************************************************************/
/* Компонент управления доступа пользователя к геозонам организаци */
/* Sinyagin Dmitry rel.at 10.10.2021                               */
/*******************************************************************/
class ObjectsComponent {
   data=null;   
   userId=null;
   paginationElement='a.profile-access-objects-nav';
   changePaginationElement='.profile-object-changes-navigation';
   geo=null;
   mapObject=null;
   drawingManagerTool=null;
   objectId=null;
   config=null;
   geozones=[];
   mapPoligon=null;
   tops=[];

  constructor(userId, config) {
      let o = this;
      console.log('ObjectsComponent ', userId,  config);	  

      userId=sessionStorage.getItem('userId');
      o.user=new User(userId);
      o.userId = userId;
      o.config = config;
      o.mapPoligon = new Map('objectZoneMap'); 
      o.mapPoligon.init();
      o.load(1);
 }


  load(page=1) {
   try {
      console.log('load...');
      let  config=this.config;     
      var o = this;
      $(".loading").show();
      $.ajax({
        url: config.url+"/"+o.userId+"/"+page+"/"+o.config.limit,
        cache: false,
        method: "POST",
        dataType: "json",
        data : { 
            object_id     : $(".group-access-objects-names-filter").eq(0).val(),
            category_id   : $(".group-access-objects-category-filter").eq(0).val(),
	    blocked       : $("#access-objects-blocked-sorted").val()
          },           
        success: function(data){ 
    	 $(".loading").hide();
         let s='';
         o.data = data;
         if(data.objects != null)
          $.each(data.objects, function( key, val) {
          s+=
           ' <tr>'+
           '    <td class="text-center"><span class="d-inline-block text-truncate" title="'+((data.page*data.limit-data.limit)+key+1)+'" style="width: 40px;">'+((data.page*data.limit-data.limit)+key+1)+'</span></td>'+
           '    <td><span class="object-label-list-item d-inline-block text-truncate" title="'+val.name+'" style="cursor:pointer; width: 380px; font-weight: bold;" object-id="'+val.id+'">'+val.name+'</span>'+
	         '    </br><span class="object-label-list-item d-inline-block text-truncate" title="'+val.address+'" style="cursor:pointer; width: 380px;"  object-id="'+val.id+'">'+val.address+'</span>'+
		       '</br>Категория: <span class="object-label-list-item d-inline-block text-truncate" style="cursor:pointer; width: 250px;" object-id="'+val.id+'">'+val.category_name+'</span></td>'+
           '    <td><span style="background:none; ">'+
           '    <div class="form-group" style="margin:0 0 0 0;">'+
           '     <div class="custom-control custom-switch text-center">'+
           '        <input type="checkbox" class="custom-control-input profile-access-objects" id="access-objects-switchbox'+key+'" object-id="'+val.id+'"'
		   + ((val.access==1) ? " checked " : "")+' >'+
           '        <label class="custom-control-label" for="access-objects-switchbox'+key+'"></label>'+
           '     </div>'+
           '    </div>'+
           '   </span></td>'+
	   ' <td style="width: 1rem;" class="text-center">'+
	   ' <button type="button" class="btn btn-default btn-object-name-editor" object-id="'+val.id+'"><i class="fa fa-edit" data-original-title="Редактировать обьект"></i></button>'+
	   ' </td>'+
	   ' <td style="width: 1rem;" class="text-center">'+
	   ' <button type="button" class="btn btn-default btn-object-trasher" object-id="'+val.id+'" page="'+page+'"><i class="fa fa-trash-alt" data-original-title="Удалить запись"></i></button>'+
	   ' </td>'+
           '</tr>';
          })
          $(config.tableElement).html(s);
          $(config.paginationElementPoligon).html(o.pagination());   
          o.switchers();
	  o.trashers()
          o.saveObjectHandler();
          o.paginationHandler();

          o.loadCategorySelectElement('.group-access-objects-category-filter',function(){ o.load(); });
          o.loadObjectSelectElement('.group-access-objects-names-filter',function(){ o.load();});

          $(".group-access-objects-category-filter option[value='"+o.data.filter.category_id+"']").prop("selected",true);
         /* выделяем цветом активную страницу */
          $.each(data.pages, function( key, val) {
              $("a.profile-access-object-nav").removeClass('active');
         });    
       $('a.profile-access-objects-nav.choice[page="'+page+'"]').addClass('active');
      }});
      } catch(err) {
       console.log(err);
       $(".loading").hide();
   }
 }

  pagination() {
    var o = this;
    var pagination='<ul class="pagination pagination-sm m-0 float-right"><li class="page-item"><a class="page-link profile-access-objects-nav first" page="1"  href="#"><<</a></li>';
       $.each(o.data.pages, function( key, val) {
            pagination+='<li class="page-item"><a class="page-link profile-access-objects-nav choice" page="'+val+'" href="#">'+val+'</a></li>';
        });
    pagination+='<li class="page-item"><a class="page-link profile-access-objects-nav last" page="'+o.data.pagesCount+'" href="#">>></a></li></ul>';
   return pagination;
  }

  paginationHandler() {     
    let o=this;
      $(o.paginationElement).off('click').on('click',function(e) {
          e.preventDefault();
          o.load($(this).attr('page'));
      });
   }

  handler(el, event, callback) {
    $(el).off(event).on(event,callback);
  }


  customGeoZoneClear(zone_id){ /* Очищает на карте зону zone_id  */
    let o=this;
    console.log("customGeoZoneClear=>"+zone_id);
    o.geo.clearShape();
    o.geo.newShape=null;	
  }

  customGeoZoneView(zone_id){ /* Отражает на карте зону zone_id  */
    let o=this;
    console.log("customGeoZoneView=>"+zone_id);
    if(zone_id=='' || zone_id==null || zone_id==undefined || zone_id==NaN ) return;
    $.getJSON("/geozones/"+zone_id, function(data) {  
      if(o.geo.newShape!=null) 
         o.geo.clearShape();
         o.geo.newShape=null;	
         o.geo.setNewShapeOnMap(o.map, data.tops); 
   	});
  }

  geoZoneSwitch(){ /* Переключатель зон, при выборе  geozone-custom-polion-name*/
    let o=this;
    $("#geozone-custom-polion-name").off('change').on('change',function(e) {
      let zone_id=$('#geozone-custom-polion-name').val();
      console.log("geoZoneSwitch=>"+zone_id);
      o.customGeoZoneClear();
      if(zone_id!='' && zone_id!=null && zone_id!=undefined && zone_id!=NaN )  {
         o.customGeoZoneView(zone_id);
      }        
   });
  }

  switchers(){
   let o = this; 
    $("input.profile-access-objects[type=checkbox]").off('change').on('change',function(e) {
      $(this).val(this.checked ? "TRUE" : "FALSE");
      console.log(this.checked);
       $.ajax({
         url     : o.config.switcherUrl,
         cache   : false,
         method  : "POST",
         dataType: "json",
         data    : {"userId":o.userId,"objectId":$(this).attr("object-id"),"access": this.checked},
         success : function(response){ // если запрос успешен вызываем функцию
             console.log(response);
        },
        error: function(response){ // если запрос успешен вызываем функцию
              console.log(response);
        }
      }).done(function() {});
    });

    $("input#access-objects-blocked-sorted[type=checkbox]").off('change').on('change',function(e) {
        $(this).val(this.checked ? "TRUE" : "FALSE");
        o.load();
     });
  }

  trashers(){
    let o=this;
    $("button.btn-trasher").off('click').on('click',function() {
         alert("button.btn-trasher");
     });

     $("button.btn-object-name-editor").off('click').on('click',function() {
         o.loadObjectProp(this);
     });

     $(".group-access-objects-category-filter-clear-btn").off('click').on('click',function(e) {
         $('.group-access-objects-category-filter').prop("readonly","");
         $('.group-access-objects-category-filter').val('');
         o.load();
         o.objectId=null;
    });


     $(".geozone-input-clear-btn").off('click').on('click',function(e) {
        $('.group-access-objects-names-filter').prop("readonly","");
        $('.group-access-objects-names-filter').val('');
        $(".geozone-quote-message").html("<p>Укажите обьект для управления его настройками.</p><small>Управление обьектами</small>");
        o.load();
        o.objectId=null;
     });

     $("#change-object-close-btn-click").off('click').on('click',function(e) {
     try{
          o.mapPoligon.Map.geoObjects.removeAll();
         } catch(e) {
         console.log(e);
        }
        $(".object-list-dialog").show("fast");
        $("#object-editor-dialog").hide("fast");
        $('.xdsoft_datetimepicker[datetimepicker-owner-id="objects"]').remove(); // сборщик мусора
        $('.pac-container').remove();
     });
  } 

   objectOrganizationLoad(orgId){
         let o=this;
         console.log(o.data);
         $.getJSON("/org/getOrgs", function(_o) {  
         let e="<option value=\"\"></option>";	
         let selected='';
         $.each(_o, function(i, v) {
 	          selected=(v.organization_id==orgId) ? 'selected': '';
            e+="<option value=\""+v.organization_id+"\" "+selected+">"+v.organization_name+"</option>";
         });			
          $('#service-organization-id').html(
	        '<select class="form-control" id="object-organization-id" name="object-organization-id" ' +
	        'class="form-control" maxlength="50" placeholder="Выбрать организацию" ' +
	        'style="height: calc(1.55rem + 15px); font-size: 1rem; padding-left: 0.5rem;"> ' + e + '</select>');
   	});
  }

   objectZonesLoad(zones, geozone_id){
     let _s="<option value=\"\">...Определить автоматически..</option>";	
     let selected='';
     $.each(zones, function( key, value) {   // геозоны, в которые попадает обьект
        selected=(value.geozone_id==geozone_id) ? 'selected': '';
       _s+='<option value="'+value.geozone_id+'" '+selected+'>'+value.geozone_name+'</option>';	
     });

    $('#geozone-custom-polion-name').html(
 	    '<select class="form-control" id="geozone-custom-polion-name" name="geozone-custom-polion-name" '+
	    'class="form-control" maxlength="50" placeholder="Введите имя геозоны" '+
	    'style="height: calc(1.55rem + 15px); font-size: 1rem; padding-left: 0.5rem;">'+ _s +'</select>');
   }


  getGeoZoneType(t){
   switch(t){
    case 'GEOZONE_DEFAULT_RADIUS_TYPE': return "Окружная геозона с радиусом по умолчанию";
    case 'GEOZONE_CUSTOM_RADIUS_TYPE' : return "Окружная геозона с производным радиусом";
    case 'GEOZONE_CUSTOM_POLIGON_TYPE': return "Геозона- полигон";
    default: return t;
   }
 }

/* Формируем сущность для таблицы изменений в интерфейс */
  getObjectChangeItem(v, num, page=1){
    if(!v) return; 
    switch(v.type) {
      case 'OBJECT_CHANGE_LOCATION':  
        return '<tr change-id="'+v.id+'">'
       +'<td class="text-center" rowspan=4><span class="d-inline-block text-truncate" title="'+num+'" style="width: 40px;">'+num+'</span></td>'
	     +'<td class="text-center" style="width: 7rem;"><span type="text" class="object-change-datetimepicker" change-id="'+v.id+'" style="font-size: 14px; text-decoration: underline; color: #6eb4ff; cursor:pointer; " >'+v.date+'</span></td>'
	     +"<td>"+v.type_name+"</td>"
	     +'<td><button type="button" class="btn btn-default object-changes-del-btn"  object-id="'+v.object_id+'" change-id="'+v.id+'" page="'+page+'"><i class="fa fa-trash-alt" data-original-title="Удалить запись"></i></button></td>'
	     +'<td><button type="button" class="btn btn-default object-changes-eye-btn"  change-id="'+v.id+'"><i class="fa fa-eye" data-original-title="Просмотр"></i></button></td>'
	     +'</tr>'
	     +'<tr><td class="text-left d-none object-changes-addon" change-id="'+v.id+'">Изменения:</td><td colspan=99 class="text-left d-none object-changes-addon" change-id="'+v.id+'"></br>'+v.pre_data.address+"<br/>"+v.pre_data.latitude+","+v.pre_data.longitude+'</td></tr>'
	     +'<tr><td class="text-left d-none object-changes-addon" change-id="'+v.id+'">Инициатор:</td><td colspan=99 class="text-left d-none object-changes-addon" change-id="'+v.id+'">'+v.user_name+"</br>"+"&nbsp"+v.organization_name+"<br/>"+"</td></tr>"
	     +'<tr><td class="text-left d-none object-changes-addon" change-id="'+v.id+'">Cоздано:  </td><td colspan=99 class="text-left d-none object-changes-addon" change-id="'+v.id+'">'+v.created+'</td></tr>';
	     break;
      case 'OBJECT_CHANGE_CATEGORY':  
        return '<tr change-id="'+v.id+'">'
       +'<td class="text-center" rowspan=4><span class="d-inline-block text-truncate" title="'+num+'" style="width: 40px;">'+num+'</span></td>'
	     +'<td class="text-center" style="width: 7rem;"><span type="text" class="object-change-datetimepicker" change-id="'+v.id+'" style="font-size: 14px; text-decoration: underline; color: #6eb4ff; cursor:pointer; " >'+v.date+'</span></td>'
	     +"<td>"+v.type_name+"</td>"
	     +'<td><button type="button" class="btn btn-default object-changes-del-btn"  object-id="'+v.object_id+'" change-id="'+v.id+'" page="'+page+'"><i class="fa fa-trash-alt" data-original-title="Удалить запись"></i></button></td>'
	     +'<td><button type="button" class="btn btn-default object-changes-eye-btn"  change-id="'+v.id+'"><i class="fa fa-eye" data-original-title="Просмотр"></i></button></td>'
	     +'</tr>'
	     +'<tr><td class="text-left d-none object-changes-addon" change-id="'+v.id+'">Изменения:</td><td colspan=99 class="text-left d-none object-changes-addon" change-id="'+v.id+'"></br>'+v.pre_data.category_id+'</td></tr>'
	     +'<tr><td class="text-left d-none object-changes-addon" change-id="'+v.id+'">Инициатор:</td><td colspan=99 class="text-left d-none object-changes-addon" change-id="'+v.id+'">'+v.user_name+"</br>"+"&nbsp"+v.organization_name+"<br/>"+"</td></tr>"
	     +'<tr><td class="text-left d-none object-changes-addon" change-id="'+v.id+'">Cоздано:  </td><td colspan=99 class="text-left d-none object-changes-addon" change-id="'+v.id+'">'+v.created+'</td></tr>';
	     break;
      case 'OBJECT_CHANGE_GEOZONE_TYPE':  
        return '<tr change-id="'+v.id+'">'
       +'<td class="text-center" rowspan=4><span class="d-inline-block text-truncate" title="'+num+'" style="width: 40px;">'+num+'</span></td>'
	     +'<td class="text-center" style="width: 7rem;"><span type="text" class="object-change-datetimepicker" change-id="'+v.id+'" style="font-size: 14px; text-decoration: underline; color: #6eb4ff; cursor:pointer; " >'+v.date+'</span></td>'
	     +"<td>"+v.type_name+"</td>"
	     +'<td><button type="button" class="btn btn-default object-changes-del-btn"  object-id="'+v.object_id+'" change-id="'+v.id+'" page="'+page+'"><i class="fa fa-trash-alt" data-original-title="Удалить запись"></i></button></td>'
	     +'<td><button type="button" class="btn btn-default object-changes-eye-btn"  change-id="'+v.id+'"><i class="fa fa-eye" data-original-title="Просмотр"></i></button></td>'
	     +'</tr>'                                                                                                                                                                             
	     +'<tr><td class="text-left d-none object-changes-addon" change-id="'+v.id+'">Изменения:</td><td colspan=99 class="text-left d-none object-changes-addon" change-id="'+v.id+'"></br>'
		+"Тип геозоны: "+this.getGeoZoneType(v.pre_data.geozone_type) + "<br>"
		+((v.pre_data.geozone_type=='GEOZONE_DEFAULT_RADIUS_TYPE' || v.pre_data.geozone_type=='GEOZONE_CUSTOM_RADIUS_TYPE') ? "Радиус геозоны: "+v.pre_data.geozone_radius +"</br>" : '' ) 
		+((v.pre_data.geozone_type=='GEOZONE_CUSTOM_POLIGON_TYPE') ? "Идентификатор геозоны: "+v.pre_data.geozone_id +"</br>" : '') +'</td></tr>'
	     +'<tr><td class="text-left d-none object-changes-addon" change-id="'+v.id+'">Инициатор:</td><td colspan=99 class="text-left d-none object-changes-addon" change-id="'+v.id+'">'+v.user_name+"</br>"+"&nbsp"+v.organization_name+"<br/>"+"</td></tr>"
	     +'<tr><td class="text-left d-none object-changes-addon" change-id="'+v.id+'">Cоздано:  </td><td colspan=99 class="text-left d-none object-changes-addon" change-id="'+v.id+'">'+v.created+'</td></tr>';
	     break;
      default:

       }  
  }

// выводим пагинацию
  changePagination(data){
    var o = this;
    var pagination='<ul class="pagination pagination-sm m-0 float-right"><li class="page-item"><a class="page-link profile-changes-object-nav first" page="1"  href="#"><<</a></li>';
     $.each(data.pages, function( key, val) {
          pagination+='<li class="page-item"><a class="page-link profile-changes-object-nav choice" page="'+val+'" href="#">'+val+'</a></li>';
      });
    pagination+='<li class="page-item"><a class="page-link profile-changes-object-nav last" page="'+o.data.pagesCount+'" href="#">>></a></li></ul>';
    return pagination;
   }

 /* Загрузка изменений данных по обьекту в раздел "Изменения" */
 objectChangesLoad(object_id, page=1, limit=10){
    let o=this; 
    let e = "Нет зафиксированных изменений";
    $.getJSON("/object/changes/"+object_id+"/"+page+"/"+limit, function(_o) {  
    $('#profile-object-changes-relation-table tbody').html('');  /* Предчистка таблицы изменений, от прошлых загрузок */
     if(_o.changes != null) {
       e = '';
       $.each(_o.changes, function(i, v) {  
         e+=o.getObjectChangeItem(v, ((_o.pagination.page*_o.pagination.limit-_o.pagination.limit)+i+1),page); 
       });		                                                                                             
  $('#profile-object-changes-relation-table tbody').html(e);

/* Устанавливаем обработку смены даты изменения */
  $.datetimepicker.setLocale('ru');

  $('.object-change-timepicker').datetimepicker({
  	inline: false,
	  step:15,
	  timepicker: true,
	  datepicker: false,
	  value: 'getDate',
	  format: 'H:i',
		onGenerate:function( ct ){
             }
	});


  $('.object-change-datetimepicker').datetimepicker({
  	inline: false,
	  step:15,
	  timepicker: true,
	  value: 'getDate',
	  format: 'Y-m-d H:i',
		onGenerate:function( ct ){
             },
		onChangeDateTime:function(dp,$input){
		$input.html($input.val());	

   /*	 обновляем данные в базе	 */
    $.ajax({
		  url: "/object/changes/"+$input.attr("change-id"),
 		  cache: false,
		  method: "POST",
		  dataType: "json",
	    data: {date : $input.val()},
        success: function(o){ // если запрос успешен вызываем функцию
          console.log(o);
          if(o.resultCode==0) {
                toastr.success('Произведена смена даты изменений обьекта', 'Обьекты', {timeOut: 3000});
            } else
          toastr.error('Возникла ошибка!', 'Обьекты', {timeOut: 3000});
          
	      },
	      error: function(o){ // если запрос успешен вызываем функцию
   	      console.log(o);
          toastr.info('Ошибка при смене даты изменений обьекта', 'Обьекты', {timeOut: 3000});
    	  }
    	}).done(function() {
          $(".loading").hide();
      });
	  }
	});
 /* устанавливаем пагинацию на список изменений */
  $(o.changePaginationElement).html(o.changePagination(_o.pagination));   
	 $("a.profile-changes-object-nav").off("click").on("click",function(e) {
	    o.objectChangesLoad(object_id, $(this).attr("page"));
	 });

/*  устанавливаем обработчик на кнопку просмотра описания изменений */
   $("button.object-changes-eye-btn").off("click").on("click",function(e) {
    	console.log($(this).attr('change-id'));
       if( $('td.object-changes-addon[change-id="'+$(this).attr('change-id')+'"]').hasClass('d-none')) {
           $('td.object-changes-addon[change-id="'+$(this).attr('change-id')+'"]').removeClass('d-none');
           } else 
      $('td.object-changes-addon[change-id="'+$(this).attr('change-id')+'"]').addClass('d-none');
    });

/* устанавливаем обработчик на кнопку просмотра описания изменений */
   $("button.object-changes-del-btn").off("click").on("click",function(e) {
        let id=$(this).attr("change-id");
        let page=$(this).attr("page");
        let object_id=$(this).attr("object-id");
        $.ajax({
            url: "/object/changes/"+id,
            cache: false,
            method: "DELETE",
            dataType: "json",
            success: function(a){ // если запрос успешен вызываем функцию
             console.log(a);
             if(a.resultCode==0) {
                  toastr.success('Изменение по обьекту удалено', 'Обьекты', {timeOut: 3000});
                   } else toastr.error('Возникла ошибка!', 'Обьекты', {timeOut: 3000});
               o.objectChangesLoad(object_id, page, 10);
             },
            error: function(a){ // если запрос успешен вызываем функцию
               toastr.info('Возникла ошибка!', 'Обьекты', {timeOut: 3000});
    	     }
    	   }).done(function() {
              $(".loading").hide();
        });
      });
    }
  });
 }

 saveObjectHandler(){
  $("#change-object-name-btn-click").off("click").on("click",function(e) {
    e.preventDefault();  
    var form = $("#object-change-form");
    let data = new Object;
    let storage = new sessionStorageClass();
    $.each(form.serializeArray(), function(i,v){ data[v.name]=v.value; });
    data.worktime=storage.getObject("STORAGE_OBJECT_WORK_TIME_ARRAY");
    data.servicetime=storage.getObject("STORAGE_OBJECT_SERVICE_TIME_ARRAY");

    $(".loading").show();
	  $.ajax({
  	  url: "/object/save/"+data.object_id,
 	  cache: false,
	  method: "POST",
	  dataType: "json",
          data: data,
	  success: function(o){ // если запрос успешен вызываем функцию
       	    console.log(o);
   	    $(".loading").hide();
   	     new infoDialog().success('Сохранение данных обьекта', "Успешное сохранение данных по обьекту!" );
	   },
	    error: function(o){ // если запрос успешен вызываем функцию
     	     $(".loading").hide();
	     new infoDialog().error('Сохранение данных обьекта', "При сохранении данных по обьекту возникла ошибка!" );
	    } 
     }).done(function() {});
   });
 } 

  polyline(data){
    let polyline = new Object();
   try {
     polyline.tops  = data.tops;
     polyline.center  = data.center;
     polyline.defaultRadius = data.provider.default.geoRadius*1;
        }catch(e){
     polyline.defaultRadius = 300;
    }
    polyline.customRadius = $("#geozone-custom-radius-type").val()*1;
    return polyline;
  }

  loadObjectProp(el){
    console.log("loadObjectProp");
    let o=this;
/* удаляем временные периоды на форме */
    $("#object-change-form .object-input-servicetime-plg").remove();
    $(".object-list-dialog").hide("fast");
    $("#object-editor-dialog").show("fast");
     $.getJSON('/object/'+$(el).attr('object-id'), function(data) {
      try {
        console.log(data);
        o.geozones=data.zones;
	let guid =  generateUUID();
	console.log(guid);
	
        $('#object-id').val(data.object.id === undefined ? guid :  data.object.id);
        $('#object-search-code').val(data.object.search_code === undefined ? guid : data.object.search_code );
        $('#object-name').val(data.object.name);
        $('#object-cloud-address').val(data.object.cloud_address);
        $('#object-description').val(data.object.description);
        $('#object-serial-number').val(data.object.serial_number);
        $("#object-geozone-type-selector option[value='"+data.object.geozone_type+"']").prop("selected",true);
	$('#object-timezone').val(data.object.timezone);
	$('#object-blocked').prop('checked',(data.object.blocked==1) ? true : false);
	$('#object-change-blocked').prop('checked',(data.object.change_blocked==1) ? true : false);                 
	$('#object-address-reseach-blocked').prop('checked',(data.object.address_reseach_blocked==1) ? true : false);                 

// коррекция кривых координат
        data.object.latitude=!isNumber(data.object.latitude) ? 0 : data.object.latitude; 
        data.object.longitude=!isNumber(data.object.longitude) ? 0 : data.object.longitude;

	 console.log(data.object.id);
	if(data.object.id === undefined) {
 	  console.log(o.user.entity);
          data.object.latitude=!isNumber(o.user.entity.user.local_address.latitude)   ? 0 : o.user.entity.user.local_address.latitude; 
          data.object.longitude=!isNumber(o.user.entity.user.local_address.longitude) ? 0 : o.user.entity.user.local_address.longitude;
	} else
	console.log(o.user.entity);

// ставим курсор
        $('#object-address').val(data.object.address);
        $('#object-latitude').val(data.object.latitude);
        $('#object-longitude').val(data.object.longitude);
//
        let ya = new geoCompleteInput();
        ya.initMap(o.mapPoligon.Map);
        ya.geoComlpete('object-address');
        ya.setCenter([parseFloat($('#object-latitude').val()).toFixed(6),parseFloat($('#object-longitude').val()).toFixed(6)])
	  .setMarker([parseFloat($('#object-latitude').val()).toFixed(6),parseFloat($('#object-longitude').val()).toFixed(6)],
   	    	{ hintContent:  'Переместите маркер на точку выезда сотрудника'	 // ,balloonContent:  'Это красивая метка'
	   });

// Показываем зону обьекта       
	 let drawer= new geoDrawViewer(o.mapPoligon.Map);

	  data.center = new Object();
          data.center.latitude  = (typeof data.object.latitude==='undefined') ? null : parseFloat($('#object-latitude').val()).toFixed(6); 
          data.center.longitude = (typeof data.object.longitude==='undefined') ? null : parseFloat($('#object-longitude').val()).toFixed(6); 

// Включаем курсор
           ya.setMarkerVisible(true);             
//* Элемент управляет маркером на карте и при его переносе выполняет установку в нужные поля широты и долготы 
           ya.trigger('dragend', (e)=>{
   	      $('#object-latitude').val(parseFloat(e.getLatitude()).toFixed(6));
   	      $('#object-longitude').val(parseFloat(e.getLongitude()).toFixed(6));

	      data.center.latitude  = (typeof data.object.latitude==='undefined') ? null : parseFloat($('#object-latitude').val()).toFixed(6); 
	      data.center.longitude = (typeof data.object.longitude==='undefined') ? null : parseFloat($('#object-longitude').val()).toFixed(6); 
	      drawer.viewDrawPoligon($("#object-geozone-type-selector").val(), o.polyline(data));

            });

//  Включение компонента добавление временных диапазонов по времени работы обьекта
	  new CreateTimeArrayController({ remove : true, max_count: 5, tag : 'worktime', 
	      storage_key : "STORAGE_OBJECT_WORK_TIME_ARRAY" , target_id: "objects" }).storageClear().renderAll(data.worktime).run();      

//  Включение компонента добавление временных диапазонов по времени  обслуживания обьекта
	  new CreateTimeArrayController({ remove : true, max_count : 5, tag : 'servicetime', 
	       storage_key  : "STORAGE_OBJECT_SERVICE_TIME_ARRAY", target_id: "objects"}).storageClear().renderAll(data.servicetime).run();      

// Компонент  Связь-Организации-Группы
	 new OrgGroupRelationComponent({tag : "service", 
	      organization_id : data.object.service_organization_id, group_id : data.object.service_group_id});	

// Категория
         new selectLoader('object-category-id')
		   .loader("/object/categories", {name:'name', value:'id'}, data.object.category_id)
 	  	   .render("#object-category-id");
// Загрузка зоны
          o.objectZonesLoad(data.zones, data.object.geozone_id);

// Загрузка изменений
          o.objectChangesLoad($(el).attr('object-id'));

// Переключаетель типов геозон
	 $("#object-geozone-type-selector").off("change").on("change", function(){
 		 drawer.viewDrawPoligon(this.value, o.polyline(data));
	 });

// Активируем переключатель геозон-полигонов
     $("#geozone-custom-polion-name").off('change').on('change',function(e) {
	  $.getJSON("/geozones/"+$(this).val(), function(_data) {  
	      console.log($("#object-geozone-type-selector").val());
              data.tops = _data.tops;
	      drawer.viewDrawPoligon($("#object-geozone-type-selector").val(), o.polyline(data));
         });
      });


     $("#search-object-geocoder-location-btn").off('click').on('click',function(e) {
     $.getJSON("/object/geocoder?address="+$('#object-address').val(), function(_data) {  
 	    console.log(_data);
//	    o.geo.moveMarkerCursor(o.map, data.location);
//	    o.geo.moveCircleCursor(o.map, data.location);
	    $('#object-latitude').val(_data.location.lat);
	    $('#object-longitude').val(_data.location.lng);
	       ya
		.setCenter([parseFloat($('#object-latitude').val()).toFixed(6),parseFloat($('#object-longitude').val()).toFixed(6)])
		.setMarker([parseFloat($('#object-latitude').val()).toFixed(6),parseFloat($('#object-longitude').val()).toFixed(6)],
   		    	{ iconContent:  $('#object-search-code').val(), objectType : "OBJECT"
		   });
	       data.center.latitude  = (typeof data.object.latitude==='undefined') ? null : parseFloat($('#object-latitude').val()).toFixed(6); 
 	       data.center.longitude = (typeof data.object.longitude==='undefined') ? null : parseFloat($('#object-longitude').val()).toFixed(6); 
  	       drawer.viewDrawPoligon($("#object-geozone-type-selector").val(), o.polyline(data));
   	    }).fail(function(_data) { 
	      toastr.error("Ошибка получения данных от геокодера! "+_data.responseJSON.resultMessage, "Errors", {timeOut: 3000});
 	});
     });

// Загружаем геозону, если она выставлена по умолчанию
   if(data.object.geozone_type=="GEOZONE_CUSTOM_RADIUS_TYPE"){
        $("#geozone-custom-radius-type").val(data.object.geozone_radius*1);     	
   } 

   if(data.object.geozone_type=="GEOZONE_CUSTOM_POLIGON_TYPE"){
      $.getJSON("/geozones/"+data.object.geozone_id, function(_data) {  
          data.tops = _data.tops;
          drawer.viewDrawPoligon(data.object.geozone_type, o.polyline(data));
      });
   } else 	     
  drawer.viewDrawPoligon(data.object.geozone_type, o.polyline(data));

// Обработка RangeSlider - увеличение кругового радиуса при GEOZONE_CUSTOM_RADIUS_TYPE
         let ionRangeSliderProp = {
              min     : 0,
	      max     : 15000,
              from    : $("#geozone-custom-radius-type").val()*1,
	      type    : 'single',
	      step    : 10,
	      postfix : ' m',
	      prettify: false,
	      hasGrid : true,
              onChange: function (value) {
		         console.log('2==>',value);
		        $("#geozone-custom-radius-type").val(value.from*1);
	        	data.center.latitude  = (typeof data.object.latitude==='undefined') ? null : parseFloat($('#object-latitude').val()).toFixed(6); 
		        data.center.longitude = (typeof data.object.longitude==='undefined') ? null : parseFloat($('#object-longitude').val()).toFixed(6); 
			console.log(drawer.Circle);
    	                drawer.Circle.geometry.setRadius(value.from*1);
	        }
	    };
           $('#geozone-custom-radius-type').ionRangeSlider(ionRangeSliderProp);
         } catch(e){
          console.log(e);
      }

    });      
  }


  loadCategorySelectElement(el, callback){
    let o=this;
    let _s;	
    $.each(o.data.categories, function( key, value) {   // собираем организации
       _s+='<option value="'+value.id+'">'+value.name+'</option>';	
    });
    $(el).html('<select class="group-access-objects-category-filter form-control" style="height: 2rem;"> <option value="">-- Все категории обьектов --</option>'+_s+'</select>');
    $('select.group-access-objects-category-filter').off('change').on('change',callback);
  }


  loadObjectSelectElement(el, callback){
    let o=this;
    $('input.group-access-objects-names-filter').off('keyup').on('keyup',callback);
    $(".object-label-list-item").off('click').on('click', function(el){	
      $('.group-access-objects-names-filter').prop("readonly","true");
      $('.group-access-objects-names-filter').val($(this).html());
      o.load();
      console.log('.group-access-objects-names-filter =>'+$(this).html());
    });
  }
}

