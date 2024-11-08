/*
 Route - класс описатель последовательности маршрута по обьектам
*/
class RouteTrip{
     storage = null;
     storageTag = "RouteTrip";
     trackInfoPoligon = false;
     route = null;

    constructor() {
    let o = this;
      try {
       console.log('Start '+this.storageTag+' execute...');
       } catch(e) {	 o.throwError(e); }
     return this;
    }


   throwError( e ){
    let o = this;
      console.log(o.storageTag, e);
      o.loadingWidget(false);
   }

  dlgOutput(e) {
    try {
        let iconContentDataToggle =''
          +"<b>Идентификатор запроса:</b> "+e.call_id+'</br>'
          +"<b>Внешний идентификатор запроса:</b> "+e.ext_call_id+'</br>'
          +"<b>Статус:</b> "+e.status+'</br>'
          +"<b>Время закрытия запроса:</b> "+e.finishdate+'</br>'
          +"<b>Время присутствия:</b> "+e.triptime+'</br>' 
          +"<b>Внешний код обьекта:</b> "+e.object_search_code+'</br>'
          +"<b>Идентификатор обьекта:</b> "+e.object_id+'</br>'
          +"<b>Адрес обьекта в системе:</b> "+e.object_address+'</br>'
          +"<b>Широта,долгота</b> "+e.latitude+','+e.longitude+'</br>'
          +"<b>Временная зона:</b> "+e.timezone+'</br>'
          +"<b>Адрес обьекта в запросе заказчика:</b> "+e.ext_object_address+'</br>';

	switch(e.trip) {
	    case 1: {
	       new infoDialog().success('Запрос № ' + e.call_id + ' с заездом сотрудника', iconContentDataToggle );
	       break;	
	      }	
 	    default:{
	       new infoDialog().info('Запрос № ' + e.call_id + ' без присутствия сотрудника', iconContentDataToggle );
	     }
	}
       } catch(e) { o.throwError(e); }
      return this;
    } 


    objectArrayMapOutput(map,points) { 
     let o = this;
      try {
        points.forEach(function(e) {
            let objectClass='track-map-waypoint-with-out-trip-icon-content';
            let iconContent= '<span class="'+objectClass+'" rel="'+e.call_id+'">'+e.call_id+'</span>';
	    let object = new ymaps.GeoObject({
            geometry: {
                type: "Point", coordinates: [e.latitude, e.longitude]
            },
            properties: {
                iconContent: iconContent, objectType: 'servicecall', hintContent: "Без поездки", call_id: e.call_id
             }
           }, { preset: 'islands#blackStretchyIcon',  visible : true,  draggable: false	      }
           );	
	    object.events.add('click', function (event) {
	       points.forEach(function(e) {
	          if(event.get('target').properties.get('call_id')==e.call_id) {
		     o.dlgOutput(e);
	         }	
	       });
	     });
       map.geoObjects.add(object);
      });
       } catch(e) { o.throwError(e); }
   }   

  showCalls(map){
   let o = this;
   try{
    map.geoObjects.each((obj) => { // each - перебирает объекты коллекции
      if(obj.properties._data.objectType == 'servicecall' ){
	      let visible = obj.options.get("visible");
  	    obj.options.set("visible", ( visible == true ? false : true));
      }	
      if(typeof obj.options._options.objectType != undefined && obj.options._options.objectType == 'ROUTE') {
	      if( obj._pointsDragController._wayPointsManager._subEntities[0].view.options._options.objectType== 'servicecall') 
	          obj._pointsDragController._wayPointsManager._subEntities.forEach(function(e) {
       let visible = e.view.options.get("visible");
        		e.view.options.set("visible", ( visible == true ? false : true));	 
	      });	
       }
     })
   } catch(e) { o.throwError(e); }
     return this;
  }


  showRoute(map, p = null){
    let o = this;
    try {
     if(o.route.visible) { // маршрут есть на карте - удаляем
        this.route.hide();
          } else if (p) {    // маршрута нет на карте - строим
         this.route.show();
       }	
   } catch(e) { o.throwError(e); }
   return this;

  }

// показывает и скрывает сохраненный трек
  showSavedRoute(map){
   let o = this;
   try {
      map.geoObjects.each((obj) => { // each - перебирает объекты коллекции
        if(obj.properties._data.objectType == 'SAVED_ROUTE' )  {
	  let visible = obj.options.get("visible");
  	  obj.options.set("visible", ( visible == true ? false : true))
	}
      });
    } catch(e) { o.throwError(e); }
   return this;
  }

//  скрывает сохраненный трек и удаляет его с хранилища
  clearSavedRoute(map, user_id, date){
   let o = this;
     try {
       let globalMessage = new  globalMessages();
        $.ajax({ url: "/trip/steps/"+user_id+"/"+date,  type: 'DELETE',  dataType: 'json',
           async: true,
	         beforeSend: function(_o) {
	            o.loadingWidget(true);
	         },
           success: function(_o) {
                  o.loadingWidget(false);
	          map.geoObjects.each((obj) => { // each - перебирает объекты коллекции
	            if(obj.properties._data.objectType == 'SAVED_ROUTE' )  {
		            let visible = obj.options.get("visible");
  		          obj.options.set("visible", ( visible == true ? false : true));
		          }
	        });
               new infoDialog().success(globalMessage.get(globalMessage.glob.TRASH_SAVED_TRACK_INFO_MESSAGE_TITLE),
		           globalMessage.get(globalMessage.glob.TRASH_SAVED_TRACK_INFO_MESSAGE));
		           o._savedTrackMessage(false); 
             },
           error: function(o) {
           new infoDialog().error(globalMessage.get(globalMessage.glob.TRASH_SAVED_TRACK_INFO_MESSAGE_TITLE),
      	       globalMessage.get(globalMessage.glob.TRASH_SAVED_TRACK_INFO_ERROR_MESSAGE));
               o.loadingWidget(false);
          }});
       } catch(e) { o.throwError(e); }
   return this;
  }


  showGeoPoint(map){
   let o = this;
    try {
      map.geoObjects.each((obj) => { // each - перебирает объекты коллекции
        if(obj.properties._data.objectType == 'GEOPOINT' || obj.options._options.objectType == 'ARROW')  {
	  let visible = obj.options.get("visible");
  	  obj.options.set("visible", ( visible == true ? false : true))
	}
      });
   } catch(e) { o.throwError(e); }
   return this;
  }


// Получение точки маршрута по его типу
  getPoint( _points = null, _index = 0, _type = null ) {
   let o = this;
   try {
      if(!_points) return;
       let i = 0;
       let result = _points.filter(item => item.waypoint_type == _type);
       return result[_index];
     } catch(e) { o.throwError(e); }
   return null;
 }

 getTripLastDayWaypoint(map,points) { // переместить на точку завершения маршрута прошлого дня
   let o = this;
   try {
    if(points.length > 0) {	
      let v = this.getPoint(points, 0, 'TRIP_LAST_DAY');
      if(v) {
	 map.setCenter([v.latitude,v.longitude],15); 
	} else {
   	     map.setCenter(	[
		points[0].latitude,
		points[0].longitude
	    ], 15 ); 
	}
     } 
   } catch(e) { o.throwError(e); }
  return this;
 }
                             
 getStartTripWaypoint(map,points) { // переместить на точку начала маршрута 
   let o = this;
   try{
    if(points.length > 0) {	
      let v = this.getPoint(points, 0, 'TRIP_START');
      if(v) {
	 map.setCenter([v.latitude,v.longitude],15); 
	} else {
	  map.setCenter([ points[0].latitude, points[0].longitude ], 15 ); 
	}
     } 
   } catch(e) { o.throwError(e); }
  return this;
 }

 getFinishTripWaypoint(map,points) { // переместить на точку завершения маршрута 
   let o = this;
   try{
    if(points.length > 0) {	
      let v = this.getPoint(points, 0, 'TRIP_FINISH');
      if(v) {
	 map.setCenter([v.latitude,v.longitude],15); 
	} else {
   	     map.setCenter([ points[points.length-1].latitude, points[points.length-1].longitude ], 15 ); 
	}
     } 
   } catch(e) { o.throwError(e); }
  return this;
 }

 getTripControlFlag(flag) {
   let o = this;
   try{
     points.forEach(function(e) {
	if(e == flag) return true;
     });
   } catch(e) { o.throwError(e); }
  return false;
 }

// Перегрузить трек с применением новых параметров o.properites.trip_params
  routeReload() {
   let o = this;
   try{
        o.route.hide();
        o.getWaypointsArrayUpdate(o.properites.trip_params);
        o.properites.points = o.points;
        o.createRoute(o.properites)	
   } catch(e) { o.throwError(e); }
   return this;
 }


  tripParametersChange(flag) {
    let o = this;
    let flagChange = false;
    try{
     switch(flag) {
           case 'LAST_DAY_TRIP_REJECTED' : {  // исключить доезд с прошлого дня	
		     o.properites.trip_params.LAST_DAY_TRIP_REJECTED = (o.properites.trip_params.LAST_DAY_TRIP_REJECTED == true ?  false :  true );
		     flagChange =  true;
		     break;
           }
           case 'START_TRIP_REJECTED'    : {  // исключить выезд с сервисной площадки
		     o.properites.trip_params.START_TRIP_REJECTED = (o.properites.trip_params.START_TRIP_REJECTED == true ?  false :  true );
 		     flagChange = true;
		break;
           }
           case 'FINISH_TRIP_REJECTED'    : { // исключить возврат на сервисную площадку
		    o.properites.trip_params.FINISH_TRIP_REJECTED = (o.properites.trip_params.FINISH_TRIP_REJECTED == true ?  false :  true );
		    flagChange =  true;
		    break;
           }
        }
        if(flagChange) o.routeReload();
      } catch(e) { o.throwError(e); }
    return false;
  }

  loadingWidget( b = false) { 
    switch(b) {
       case true  : { $(".loading").show(); break;}
       case false : { $(".loading").hide(); break;}
    }
  }

  _getWaypoints(user_id, _date) {
    let points = [];
    let o = this;
    try{
        $.ajax({ cache: false, method: "GET", dataType: "json",
	   beforeSend: function(_o) {
	     o.loadingWidget(true);
	   },
          url: '/trip/waypoints/'+user_id+'/'+_date,
              success: function(_o) {
	          _o.waypoints.forEach(function(e) {
 		 if(e.trip == 1 && e.latitude != null && e.longitude != null && e.triptime != null) {
		         points.push(e);
	  	     } 
	        });
  	        o.loadingWidget(false);
  	     },
              error: function(_o) {
  	        o.loadingWidget(false);
	   },
           async: false
      });
    } catch(e) { o.throwError(e); }
   return points;
  }


  getDistanceTrackId() {
   let o = this;
   let distance = 0;
   try{
     o.getRoutePaths().legs.forEach(function(e) { distance+=e.length; });	
     } catch(e) { o.throwError(e); }
    return distance;
  }

  getDurationTrackId() {
   let o = this;
   let duration = 0;
   try{
      o.getRoutePaths().legs.forEach(function(e) { duration+=e.duration;  } );	
      } catch(e) { o.throwError(e); }
    return duration;
  }

   trackInfoComponentShow() { 
    let o = this;
     try{
      if(this.trackInfoPoligon == false) {
         console.log('distanceTrackShow');	
        $('#object-editor-dialog').after(
   	      '<div class="track-info-poligon row">'
          +'<div class="distance-track-info-poligon col-sm-6" data-toggle="tooltip" data-placement="bottom" data-original-title="Дистанция по автоматическому треку" >'
 	        +'<span class="distance-track-info-poligon-title">Дистанция (м):</span><span class="distance-track-info-poligon-value"></span></div>'
          +'<div class="duration-track-info-poligon col-sm-6" data-toggle="tooltip" data-placement="bottom" data-original-title="Время по автоматическому треку" >'
	        +'<span class="duration-track-info-poligon-title">Время (чч:мм):</span><span class="duration-track-info-poligon-value"></span></div>'
	        +'</div>'); 
          this.trackInfoPoligon = true;
	        $('[data-toggle="tooltip"]').tooltip();
       }
      } catch(e) { o.throwError(e); }
     return this;
   }

   distanceTrackShow(distance) {  
    console.log('distanceTrackShow');	
    let o = this;
     try{
      if(this.trackInfoPoligon == true) {
	    let km = Math.floor(distance/1000);
  	  let mm = Math.floor((distance - km * 1000)) ;
    	let km_mm = (km > 0 ? km + ' км. ' : '' )+' '+(mm > 0 ? mm + ' м.' : '' );
	    $('.distance-track-info-poligon-value').text(km_mm); 
     }	
   } catch(e) { o.throwError(e); }
    return this;
  }

   durationTrackShow(duration) {  
    console.log('durationTrackShow');	
    let o = this;
     try{
      if(this.trackInfoPoligon == true) {
	      let hh = Math.floor(duration/3600);
	      let mm = Math.floor((duration - hh * 3600)/ 60) ;
	      let hhmm = (hh > 0 ? hh + ' ч. ' : '' )+' '+(mm > 0 ? mm + ' мин.' : '' );
	      $('.duration-track-info-poligon-value').text(hhmm); 
     }	
   } catch(e) { o.throwError(e); }
   return this;
 }


// callback для обработки события при завершении построения автотрека
  onRouteCreatedCallback(data) {
   let o = this;
   try{
       console.log('onRouteCreatedCallback');
       this.trackInfoComponentShow().durationTrackShow(data.duration).distanceTrackShow(data.distance)
     } catch(e) { o.throwError(e); }
    return this;
  }


  getWaypointsArrayUpdate(params) {
    let o = this;	
    try {
      let _points = o._getWaypoints(o.user_id, o.date);
         o.points =  [];
	 o.points2 = [];
	     _points.forEach(function(e) {  
	       	switch(e.waypoint_type) {
	           case 'TRIP_LAST_DAY' : {  // исключить доезд с прошлого дня	
			e.trip = (params.LAST_DAY_TRIP_REJECTED == true) ? 0 : 1 ;
			break;
        	   }
	           case 'TRIP_START'    : {  // исключить выезд с сервисной площадки
			e.trip = (params.START_TRIP_REJECTED == true) ? 0 : 1 ;
			break;
        	   }
	           case 'TRIP_FINISH'    : { // исключить возврат на сервисную площадку
			e.trip = (params.FINISH_TRIP_REJECTED == true) ? 0 : 1 ;
			break;
	           }
		}
	    // Заполняем массивы
   	       if(e.trip == 1 && e.latitude != null && e.longitude != null && e.triptime != null) {
  	           o.points.push(e); 	
   	        } else 
	       o.points2.push(e); 	
          });
       } catch(e) { o.throwError(e); }
     return this;
  }


  createRoute(p){       /* создать автомаршрут */
    let o = this;
    try {
	o.loadingWidget(true);
	o.route =  new MultiRouterPortalController().create(p).editMode(true);
        o.route.onRouteCreatedEvent((data)=>{
		o.onRouteCreatedCallback(data);
	        o.loadingWidget(false);
	 }) ;  // callback при построении автотрека
       } catch(e) { o.throwError(e); }
    return this;
  }                                        
                                                    
  setUser(user = null) {
    let o = this;
    try {
	if(user) this.user = user;
       } catch(e) { o.throwError(e); }
    return this;
  }

  setObject(object = null) {
    let o = this;
    try {
       if(object) this.object = object;
       } catch(e) { o.throwError(e); }
   return this;
  }

  setCallId(callId = null){
    let o = this; 	
     if(callId) {
        o.call_id =  callId;
     }	
    return this;
  }

  setLocationTime(time = null){
    let o = this; 	
    console.log('setLocationTime=>',time);
     if(time) {
        o.location_date =  time;
      }	
     return this;
  }

  setFinishDate(time = null){
    let o = this; 
    console.log('setFinishDate=>',time);	
     if(time) {
        o.finishdate = time;
       }	
      return this;
  }


 setUserLocation(user_id = null, _date = null,  callback) {
    let o = this; 	
    if(user_id == null || _date == null) return this;
    try {
        $.ajax({ cache: false, method: "GET", dataType: "json",
          url: '/trip/location/'+user_id+'/'+_date,
	  beforeSend: function(_o) {  o.loadingWidget(true); },
          success: function(_o) {
	            o.loadingWidget(false);
  		    if(callback) callback(_o);
	           },
	  error : function(){
	       o.loadingWidget(false);
		},
           async: true
         });
      } catch(e) { o.throwError(e); }
     return this;
  }

   _savedTrackMessage(_show_ = true) {
    let o = this;
    if(!_show_) {
          $('.saved-route-alert-message').hide(); 
     } else {
       try {
          $('.saved-route-alert-message').show(); 
          $('.saved-route-alert-message-properties').off('click').on('click', ()=>{
          let globalMessage = new  globalMessages();
          new infoDialog().info('Присутствует сохраненный трек', globalMessage.get(globalMessage.glob.SAVED_TRACK_INFO_MESSAGE));
         });
       } catch(e) { o.throwError(e); }
    }
   return this;
  }


  _stepsSavedTrackExist(_o) {
     return (_o.waypoints.length > 1) ? true : false;
  }

  _stepsOutput( map, _o ) {
   let o = this; 	
   let wpIndex = 0; 
    try {
     if(o._stepsSavedTrackExist(_o) == true) {
      console.log('_o',_o);
      _o.waypoints.forEach(function(e) {
	  o._steps=[];
	     e.steps.forEach(function(_v) {
	      if(_v.latitude != undefined)
	       o._steps.push([_v.latitude,_v.longitude]); 
	  });
	  let graph = new YandexGraphLibrary(map);

	  console.log(o._steps);
	  console.log( "<div class=\"ya-tooltip-inner d-flex \">Сохраненный маршрут абонента,<br>"
	   +" участок: "+e.track_id+"<br>"
	   +" Начальные и конечные точки участка: <br> ["+o._steps[0][0]+","+o._steps[0][1]+" "+o._steps[o._steps.length-1][0]+","+o._steps[o._steps.length-1][1]+"]<br>"
	   +"</div>");
	  console.log( e.track_id);

	  let polyline = graph.polyline( 
	    o._steps, 
	  {
            hintContent: "<div class=\"ya-tooltip-inner d-flex \">Сохраненный маршрут абонента,<br>"
	   +" участок: "+e.track_id+"<br>"
	   +" Начальные и конечные точки участка: <br> ["+o._steps[0][0]+","+o._steps[0][1]+" "+o._steps[o._steps.length-1][0]+","+o._steps[o._steps.length-1][1]+"]<br>"
	   +"</div>",
	    objectType : "SAVED_ROUTE",
	    track_id   : e.track_id,		
	  },
	  {
            draggable: false, visible:true, 
	    strokeColor: (wpIndex % 2 ? '#0000aa' : '#0000ff'), 
	    strokeWidth: 6, 
           });
	  if(polyline != undefined)
	 	    graph.onMap(polyline);  // показываем инфоблок что есть сохраненный трек

  	    wpIndex++;
   	   });
   	}
    } catch(e) { o.throwError(e); }
   return this;
  }

  _getSteps(map, user_id, _date) {
    let o = this; 	
    try {
        $.ajax({ cache: false, method: "GET", dataType: "json",
	   beforeSend: function(_o) {
	     o.loadingWidget(true);
	   },
           url: '/trip/steps/'+user_id+'/'+_date,
	          success: function(_o) {
		     o._stepsOutput(map, _o)._savedTrackMessage(o._stepsSavedTrackExist(_o)).loadingWidget(false);
 	             o.loadingWidget(false);
	           },

		  error : function(){
		     o.loadingWidget(false);
		},
           async: true
         });
      } catch(e) { o.throwError(e); }
     return this;
  }

  setUserLocationCursor(map) {
   let o = this;
      try {
	 o.setUserLocation(o.user_id, o.date, (_o)=>{ // перевели фокус на локальную площадку
   	     map.setCenter([ _o.entity.latitude, _o.entity.longitude ]); 
		console.log('setUserLocationCursor=>',o);
  	     let _user = new YandexUserLibrary( map, o.user );
		 _user.setCallId(o.call_id)
		 .setFinishDate(o.finishdate)
		 .setLocationTime(_o.entity.location_date)
	         .setCoordinates({ latitude : _o.entity.latitude, longitude : _o.entity.longitude })
	         .onMap();
	}) 
      } catch(e) { o.throwError(e); }
     return this;

  }  

  onMap(map, user_id, date) {
      let o = this;
      o.user_id = user_id;
      o.date = date;
      let _date = date;	
      o.points = [], o._steps = [], o.points2 = [];
      let saved_route = false;
    try {
/* Кнопки управления обьектами на карте  */
     let tripContolPanel =  new TripRouteControls();
         tripContolPanel
	.button({class: "user-location-set-focus", icon : "fa-street-view", color: "#0000ff;", 
		 unselected : true,
	 	 hint : "Переместить фокус местоположение абонента в момент закрытия запроса при обслуживании данного обьекта"},
	  	 ()=>{   
  	   	 this.setUserLocationCursor(map);
          }) 
	.button({class: "local-service-place-set-focus", icon : "fa-home", color: "#0000ff;", 
		 unselected : true,
	 	 hint : "Переместить фокус на локальную площадку абонента"},
	  	 ()=>{
         	     map.setCenter(	[ // перевели фокус на локальную площадку
			o.user.local_address.latitude,
			o.user.local_address.longitude
		        ]); 
		}
         )
	.button({class: "service-object-cursor-set-focus", icon : "fa-bug", color: "#ff0000;", 
		 unselected : true,
	 	 hint : "Переместить фокус на обьект обслуживания по данной заявке"},
	  	 ()=>{   // перевели фокус на локальную площадку
                   map.setCenter([ o.object.latitude, o.object.longitude ]); 
		}
         )
        .separator()
	.button({class: "last-trip-waypoint-set-focus", icon : "fa-flag", color: "#0000ff;", 
		 unselected : true,
	 	 hint : "Переместить фокус на точку доезда с прошлого дня"},
	  	 ()=>{ this.getTripLastDayWaypoint(map,o.points); }
         )
	.button({class: "start-local-service-point-waypoint-set-focus", icon : "fa-flag", color: "#42c200;",  
		 unselected : true,
		 hint : "Переместить фокус на начало маршрута за "+_date.split('T')[0].split(' ')[0]},
	  	 ()=>{  this.getStartTripWaypoint(map,o.points); }
	 )
	.button({class: "finish-local-service-point-waypoint-set-focus", icon : "fa-flag", color: "#ff0000;",   
		unselected : true,
		hint : "Переместить фокус на завершение маршрута за "+_date.split('T')[0].split(' ')[0]},
  	 	()=>{ this.getFinishTripWaypoint(map,o.points); }
         )

        .separator()
	.bigButton({
		class: "last-trip-waypoint-control",  
		icon : [{ name: "fa-flag", color: "#0000ff;"}, { name: "fa-arrow-right", color: "#000000;" },{ name:  "fa-route", color: "#ff0000;" }], 
		color: "#ff0000;",   
		hint : "Отменить/добавить доезд с последнего обьекта прошлого маршрутного дня "},
	 	()=>{ 	o.tripParametersChange('LAST_DAY_TRIP_REJECTED'); }
	)
	.bigButton({
		class: "start-local-service-point-waypoint-control",  
		icon : [{ name: "fa-flag", color: "#42c200;"}, { name: "fa-arrow-right", color: "#000000;" },{ name:  "fa-route", color: "#ff0000;" }], 
		color: "#ff0000;",   
		hint : "Отменить/добавить начало маршрута с локальной площадки абонента за "+_date.split('T')[0].split(' ')[0]},
	 	()=>{ 	o.tripParametersChange('START_TRIP_REJECTED')  }
	)
	.bigButton({
		class: "finish-local-service-point-waypoint-control",  
		icon : [{ name: "fa-flag", color: "#ff0000;"}, { name: "fa-arrow-right", color: "#000000;" },{ name:  "fa-route", color: "#ff0000;" }], 
		color: "#ff0000;",   
		hint : "Отменить/добавить завершение маршрута на локальную площадку абонента за "+_date.split('T')[0].split(' ')[0]},
	 	()=>{ 	o.tripParametersChange('FINISH_TRIP_REJECTED')  }
	)

        .separator()
	.button({class: "show-calls-control", icon : "fa-check", color: "#444444;", 
		hint : "Показывать или отключить отражение запросов на карте  за "+_date.split('T')[0].split(' ')[0]},
	 	()=>{ o.showCalls(map);   }
	)
	.button({class: "show-auto-route-control", icon : "fa-route", color: "#ff0000;", 
		hint : "Показывать или отключить автоматически построенный трек за "+_date.split('T')[0].split(' ')[0]},
	 	()=>{ o.showRoute(map, { user_id : user_id, dateTrip : _date.split('T')[0].split(' ')[0],  RouteShowOnEditButton : true, 
	 	points: o.points, map : map });	  }
         )
	.button({class: "show-save-route-control", icon : "fa-route", color: "#0000ff;", 
		hint : "Показывать или отключить сохраненный трек за "+_date.split('T')[0].split(' ')[0]},
	  	 ()=>{ o.showSavedRoute(map) })
	.button({class: "show-geo-point-route-control", icon : "fa-circle", color: "#0000ff;", 
		hint : "Показывать или отключить геоточки  за "+_date.split('T')[0].split(' ')[0]},
	  	 ()=>{  o.showGeoPoint(map) }
        )
	.separator()
	.bigButton({class: "trash-save-route-control",
	        icon : [{ name: "fa-route", color: "#0000ff;"}, { name: "fa-arrow-right" , color: "#0000ff;"},{ name:  "fa-trash" , color: "#0000ff;"}], 
		color: "#0000ff;", 
		unselected : true,
		hint : "Удалить сохраненный трек  за "+_date.split('T')[0].split(' ')[0]},
	  	 ()=>{  o.clearSavedRoute(map, user_id, date)  }
	);

/* строим авто трэк  и выводим обьекты на карту */

	let tripParameters = { LAST_DAY_TRIP_REJECTED : false,    START_TRIP_REJECTED    : false,    FINISH_TRIP_REJECTED   : false 	}; 

// выводим автотрек
	o.getWaypointsArrayUpdate(tripParameters);
        o.properites = { user_id : user_id, dateTrip : _date.split('T')[0].split(' ')[0],  RouteShowOnEditButton : true,  points: o.points, map : map }; 
        o.properites.trip_params=tripParameters;
	o.createRoute(o.properites);

// выводим сохраненный трэк 
	o._getSteps(map, user_id, _date);		

      } catch(e) { o.throwError(e); }

     return this;
   }
 }




