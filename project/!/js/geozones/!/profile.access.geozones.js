/*******************************************************************/
/* Компонент управления доступа пользователя к геозонам организаци */
/* Sinyagin Dmitry rel.at 10.10.2021                               */
/*******************************************************************/

// class gznAccessGridComponent {
class GeozonesComponent{
   data=null;   
   userId=null;
   paginationElement='a.profile-access-geozones-nav';
   geo=null;
   mapGeoZone=null;
   drawingManagerTool=null;
   geoZoneId=null;
   map=null;
   mapPoligon = null;
   drawer = null;

  constructor(userId, config) {
      let o = this;
      userId=(userId  == undefined) ? sessionStorage.getItem('userId') : userId;
      o.user=new User(userId);
      o.userId = userId;
      o.config = config;
      o.mapPoligon = new Map('mapGeoZone'); 
      o.mapPoligon.init();
// Показываем зону обьекта       
      o.drawer= new geoDrawEditor(o.mapPoligon.Map);

      o.load(1);
  }


  load(page=1) {
      console.log('load...');
      let  config=this.config;     
      var o = this;
      $.ajax({
        url: config.url+"/"+o.userId+"/"+page+"/"+o.config.limit,
        cache: false,
        method: "POST",
        dataType: "json",
        data : { 
            geozone_id   : $(".group-access-geozones-names-filter").eq(0).val()
          },           
        success: function(data){ 
          let s='';
          o.data = data;
          console.log(data);
         if(data.geozones != null)
          $.each(data.geozones, function( key, val) {
       	  console.log(val.access);
          s+=
           ' <tr>'+
           '    <td class="text-center">'+((data.page*data.limit-data.limit)+key+1)+'</td>'+
           '    <td><span class="geozone-label-list-item d-inline-block text-truncate" style="cursor:pointer; width: 280px;" geozone-id="'+val.id+'">'+val.name+'</span></td>'+
           '    <td><span style="background:none; ">'+
           '    <div class="form-group" style="margin:0 0 0 0;">'+
           '     <div class="custom-control custom-switch text-center">'+
           '        <input type="checkbox" class="custom-control-input profile-access-geozones" id="access-geozones-switchbox'+key+'" geozone-id="'+val.id+'"'
		   + ((val.access==1) ? " checked " : "")+' >'+
           '        <label class="custom-control-label" for="access-geozones-switchbox'+key+'"></label>'+
           '     </div>'+
           '    </div>'+
           '   </span></td>'+
	   ' <td style="width: 1rem;" class="text-center">'+
	   ' <button type="button" class="btn btn-default btn-name-editor" data-toggle="modal" data-target="#modal-change-geozone-name-dialog" geozone-id="'+val.id+'"><i class="fa fa-edit" data-original-title="Редактировать название"></i></button>'+
	   ' </td>'+
	   ' <td style="width: 1rem;" class="text-center">'+
	   ' <button type="button" class="btn btn-default btn-trasher" geozone-id="'+val.id+'"><i class="fa fa-trash-alt" data-original-title="Удалить запись"></i></button>'+
	   ' </td>'+
           '</tr>';
          })

          console.log(config);
          $(config.tableElement).html(s);
          $(config.paginationElementPoligon).html(o.pagination());   


// Обработка клиека по геозоне в списке   
         $(".geozone-label-list-item").off('click').on('click',function(e) {
	   $('.group-access-geozones-names-filter').prop("readonly","true");
            $(".map-geozone-edit-btn").css('background-color','').val('FALSE');
 	      o.geoZoneId=$(this).attr("geozone-id");		
              o.drawer.map.geoObjects.remove(o.drawer.Polygon);  // удаляем коллекцию обьектов	
	      $.getJSON("/geozones/"+o.geoZoneId, function(data) {  
	         o.mapPoligon.Map.setCenter([data.centerMap.lat*1,data.centerMap.lng*1],12); // установить карту в центр
	         o.drawer.viewDrawPoligon("GEOZONE_CUSTOM_POLIGON_TYPE", data);  // нарисовать полигон из data.tops
             });
	    $('.group-access-geozones-names-filter').val($(this).html());	// в инпут фильтра поставить имя геозоны
	   o.load();								// пересобрать список
          });

// Побдор геозоны с клавиатуры
     $('input.group-access-geozones-names-filter').off('keyup').on('keyup',function(){ 
   	  o.load();
      });

// Очистка фильтра с введенным названием геозоны  
     $(".geozone-input-clear-btn").off('click').on('click',function(e) {
	$('.group-access-geozones-names-filter').prop("readonly","");
	$('.group-access-geozones-names-filter').val('');
	$(".geozone-quote-message").html("<p>Выберите геозону из списка для ее отражения и управления на карте.</p><small>Управление геозонами</small>");
         o.drawer.Polygon.editor.stopEditing();		    // включить редактор 	
         $(".map-geozone-edit-btn").css('background-color','').val('FALSE');
         o.drawer.map.geoObjects.remove(o.drawer.Polygon);  // удаляем коллекцию обьектов	
  	 o.load();
	 o.geoZoneId=null;
  });
	  o.geoZoneEditorDlg(o.geoZoneId!=null);
	  o.mapGeoZoneClearBtnClick();
    o.mapGeoZoneEditBtnClick();
	  o.mapGeoZoneSaveBtnClick();
    o.paginationHandler();
         /* выделяем цветом активную страницу */
         $.each(data.pages, function( key, val) {
             $("a.profile-access-geozone-nav").removeClass('active');
         });    
       $('a.profile-access-geozones-nav.choice[page="'+page+'"]').addClass('active');
        /* Инициализация переключателей */
      }});
   }

   pagination() {
    var o = this;
    var pagination='<ul class="pagination pagination-sm m-0 float-right">'
          +'<li class="page-item"><a class="page-link profile-access-geozones-nav first" page="1"  href="#"><<</a></li>';
       $.each(o.data.pages, function( key, val) {
         pagination+='<li class="page-item"><a class="page-link profile-access-geozones-nav choice" page="'+val+'" href="#">'+val+'</a></li>';
        });
      pagination+='<li class="page-item"><a class="page-link profile-access-geozones-nav last" page="'+o.data.pagesCount+'" href="#">>></a></li>'
        +'</ul>';
     return pagination;
  }

  paginationHandler() {     
    let o=this;
      $(o.paginationElement).off('click').on('click',function(e) {
          e.preventDefault();
          o.load($(this).attr('page'));
      });
   }
/*
  handler(el, event, callback) {
    $(el).off(event).on(event,callback);
  }
  */
/*
  switchers(){
   let o = this; 
    $("input.profile-access-geozones[type=checkbox]").off('change').on('change',function(e) {
      $(this).val(this.checked ? "TRUE" : "FALSE");
      console.log(this.checked);
       $.ajax({
         url: o.config.switcherUrl,
         cache: false,
         method: "POST",
         dataType: "json",
         data: {"userId":o.userId,"geozoneId":$(this).attr("geozone-id"),"access": this.checked},
         success: function(response){ // если запрос успешен вызываем функцию
             console.log(response);
        },
        error: function(response){ // если запрос успешен вызываем функцию
              console.log(response);
        }
      }).done(function() {});
    });
  }
*/

  mapGeoZoneDeleteBtnClick(e){
   let o=this;
   $(".loading").show();
     $.ajax({
       url: "/geozones/"+$(e).attr('geozone-id'), cache: false, method: "DELETE", dataType: "json", 
       success: function(response){
         if(response.resultCode!='1') {
 	        toastr.success('Геозона удалена', 'Геозоны', {timeOut: 3000});
  	      $(".loading").hide();
	      o.load();	
   	    } else {
  	 toastr.error('Ошибка при удалении геозоны!', 'Геозоны', {timeOut: 3000});
       	$(".loading").hide();
        }
     },
       error: function(response){
  	 toastr.error('Ошибка при удалении геозоны!', 'Геозоны', {timeOut: 3000});
       	$(".loading").hide();
     }
     }).done(function() {
        });
  }

  
/*
  trashers(){
    let o=this;
    $("button.btn-trasher").off('click').on('click',function() {
         o.mapGeoZoneDeleteBtnClick(this);
     });

     $("button.btn-name-editor").off('click').on('click',function() {
       let name=$('.geozone-label-list-item[geozone-id="'+$(this).attr("geozone-id")+'"]').eq(0).text();
       let zoneId=$(this).attr("geozone-id");
       $("#change-geozone-name").val(name);
       $("#change-geozone-id").val(zoneId);
     });

     $(".geozone-input-clear-btn").off('click').on('click',function(e) {
       $('.group-access-geozones-names-filter').prop("readonly","");
       $('.group-access-geozones-names-filter').val('');
       $(".geozone-quote-message").html("<p>Выберите геозону из списка для ее отражения и управления на карте.</p><small>Управление геозонами</small>");
       o.load();
       o.geoZoneEditorDlg(false);
       o.geoZoneId=null;
     });
  } 
*/
/*
  loadGeoZonesSelectElement(el, callback){
    let o=this;
    $('input.group-access-geozones-names-filter').off('keyup').on('keyup',callback);
    $(".geozone-label-list-item").off('click').on('click', function(el){	
      $('.group-access-geozones-names-filter').prop("readonly","true");
      o.map = o.mapGeozoneReload(o, $(this).attr('geozone-id'));
      $('.group-access-geozones-names-filter').val($(this).html());
      o.load();
      console.log('.group-access-geozones-names-filter =>'+$(this).html());
    });
  }
*/
  
  mapGeoZoneSaveBtnClick(){
   let o=this;
   $(".map-geozone-save-btn").off('click').on('click', function(el){	
    console.log(o.geoZoneId);
    console.log(o.drawer.Polygon.geometry.getCoordinates()[0]);
    console.log(o.drawer.getCoorditatesString(o.drawer.Polygon.geometry.getCoordinates()[0]));

    if(o.drawer.Polygon.geometry.getCoordinates()[0].length == 0){
         toastr.error('Геозона обьекта не определена' ,'Геозоны' ,	{timeOut: 3000});
       } else 
      $(".loading").show();
	     $.ajax({
	       url: "/geozones/poligon", 
   	       cache: false,
	       method: "POST",
               dataType: "json",
	       data: {
			"zoneId" : o.geoZoneId,
			"points": o.drawer.getCoorditatesString(o.drawer.Polygon.geometry.getCoordinates()[0])
		},
	       success: function(response){ // если запрос успешен вызываем функцию
		      toastr.success('Сохранение данных геозоны успешно', 'Геозоны', {timeOut: 3000});
		      $(".loading").hide();
	        },
	        error: function(response){ // если запрос успешен вызываем функцию
		      toastr.error('Ошибка при сохранении данных геозоны!', 'Геозоны', {timeOut: 3000});
              	     $(".loading").hide();
	        }
	}).done(function() {});
     });

  }
 

  mapGeoZoneEditBtnClick(){
    let o=this;
    $(".map-geozone-edit-btn").off('click').on('click', function(el){	
      $(this).val(this.value == 'TRUE' ? 'FALSE' : 'TRUE');
       console.log(o.drawer.Polygon);
  	if(this.value=='TRUE') {
            toastr.info('Включен рeжим редактирования геозоны.', 'Геозоны', {timeOut: 3000});
            if(o.drawer.Polygon==null){	   	
                  o.drawer.createPolygon();
	    } else  o.drawer.startEditing();		 // включить редактор 	
   	    $(this).css('background-color','rgb(207 204 204)');
	  } else {
            toastr.info('Выключен рeжим редактирования геозоны.', 'Геозоны', {timeOut: 3000});
 	    o.drawer.stopEditing();			 // включить редактор 	
    	    $(this).css('background-color','');
        }	
     });
  }

  mapGeoZoneClearBtnClick(){
    let o=this;
    $(".map-geozone-clear-btn").off('click').on('click', function(el){	
       $(".map-geozone-edit-btn").css('background-color','').val('FALSE');
       o.drawer.Polygon.editor.stopEditing();	 // включить редактор 	
       o.drawer.removePolygon(); 		 // удаляем коллекцию обьектов	
    });
  }


  geoZoneEditorDlg(visible=false){
     let o = this;
     if(visible) {
        $(".map-geozone-edit-btn,.map-geozone-clear-btn,.map-geozone-save-btn").removeClass('d-none');
        } else {
         $(".map-geozone-edit-btn,.map-geozone-clear-btn,.map-geozone-save-btn,.map-geozone-save-btn").addClass('d-none');
       }	
       $(".geozone-quote-message").html(
         visible 
  	    ? "<p>Выбирая элементы управления вы можете редактировать, сохранить или сбросить текущие параметры геозоны.</p><small>Управление геозонами</small>"
	    : "<p>Выберите геозону из списка для ее отражения и управления на карте.</p><small>Управление геозонами</small>" 
	);
/*       toastr.info(
         visible ? 'Включен режим редактирования геозоны.': 'Выключен режим редактирования геозоны.' ,
        'Геозоны' ,
	{timeOut: 3000}
      );
*/
  }

  /*

  getLatLngGeoZoneDefault(data){
      return new google.maps.LatLng(
	(typeof data.centerMap.lat == 'undefined') ? $("#latitude").val()  : data.centerMap.lat,
	(typeof data.centerMap.lng == 'undefined') ? $("#longitude").val() : data.centerMap.lng
     );
  }
*/
/*
  mapGeozoneReload(o, zoneId){
       $(".loading").show();
       $.ajax({
         url: o.config.getGeoZone+'/'+zoneId,
         cache: false,
         method: "GET",
         dataType: "json",
         success: function(data){ 
         o.geo = new geoLib();
         o.geoZoneId = zoneId;
	 o.geoZoneEditorDlg(o.geoZoneId!=null ? true : false );
	 console.log(data);
         o.mapGeoZone = o.geo.mapGeozoneReload({
             mapElementName : "mapGeoZone",
             tops : data.tops,
             coder : "google",
	            geoParams : {	
	            center: o.getLatLngGeoZoneDefault(data),
        	    zoom: 30,
	            zoomControl: true,
	            zoomControlOptions: {
	            position: google.maps.ControlPosition.LEFT_CENTER
	          },
	            styles: [],
	            mapTypeIds:[ google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.ROADMAP,  google.maps.MapTypeId.TERRAIN],
	            scaleControl: true,
	            streetViewControl: true,
	            streetViewControlOptions: {   position: google.maps.ControlPosition.LEFT_TOP   }
	          }
          }
       );

// Позиционируем карту с учетом краев видимого полигона 
   if(typeof data.centerMap.MinLat !== 'undefined') {
       var sw = new google.maps.LatLng(data.centerMap.MinLat,data.centerMap.MinLng);
       var ne = new google.maps.LatLng(data.centerMap.MaxLat,data.centerMap.MaxLng);
       var bounds = new google.maps.LatLngBounds();
           bounds.extend(sw);
           bounds.extend(ne);
           console.log("fitBounds sw=>"+data.centerMap.MinLat+","+data.centerMap.MinLng);
           console.log("fitBounds ne=>"+data.centerMap.MaxLat+","+data.centerMap.MaxLng);
           o.mapGeoZone.fitBounds(bounds);
          } else 
	 o.mapGeoZone.setZoom(7);
       },
        error: function(response){ // если запрос успешен вызываем функцию
  		    toastr.error('Ошибка загрузки геозоны', 'Не смогли загрузить геозону с сайта', {timeOut: 3000});
	  	    $(".loading").hide();
        }
      }).done(function() {
	      $(".loading").hide();
    });
    
  }*/
}

   

