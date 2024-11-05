/*
   Работа с треком Yandex
*/

class MultiRouterPortalController{
     storage    = null;
     storageTag = "MultiRouterPortalController";
     polylineRoute = null;
     visible = false;

    constructor() {
      console.log('Start '+this.storageTag+' creating...');
      this.visible = true;      
    }

    hide(){
       this.p.map.geoObjects.remove(this.multiRoute);
       this.visible = false;      
    }

    show(){
       this.p.map.geoObjects.add(this.multiRoute);
	this.visible = true;      
    }



  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {  color += letters[Math.floor(Math.random() * 16)]; }
    return color;
  }



  setRouteColor() {
    o.multiRoute.getRoutes().each(function (route) {
      route.getPaths().each(function (path) {
        var index = path.properties.get('index');
        path.getSegments().each(function (segment) {
	   segment.options.set({ strokeColor: o.getRandomColor() });
        });
      });
     });
   }

   loadingWidget( b = false) { 
    switch(b) {
       case true  : { $(".loading").show(); break;}
       case false : { $(".loading").hide(); break;}
     }
   }

  create(p) {
    if(!p) return;
    let o = this;
    o.RoutePaths = null;
    o.RouteShowOnEditButton = p.RouteShowOnEditButton;
    o.p=p;
    let points=[];

     p.points.forEach(function(e) {
	   points.push([e.latitude, e.longitude]);
     });
  

    this.multiRoute = new ymaps.multiRouter.MultiRoute({
        referencePoints: points,
	objectType : "ROUTE"

    }, {
	routeStrokeColor: "000088",
	routeActiveStrokeColor: "ff0000",
        routeActiveStrokeWidth: 8,
	pinIconFillColor: "ff0000",
        editorMidPointsType: "via",
        editorDrawOver: false,
	visible : o.RouteShowOnEditButton,
	objectType : "ROUTE"

    });

   p.map.geoObjects.add(this.multiRoute);

// Подписываемся на события модели.
    this.multiRoute.model.events
    .add("requestsuccess", function (event) {
// Общий пробег 
	let from = { 
		latitude : Math.round(event.get("target").getRoutes()[0].properties.get('boundedBy')[0][0]*1000000)/1000000,
		longitide : Math.round(event.get("target").getRoutes()[0].properties.get('boundedBy')[0][1]*1000000)/1000000
		};
	let to   = { 
		latitude : Math.round(event.get("target").getRoutes()[0].properties.get('boundedBy')[1][0]*1000000)/1000000,
		longitide : Math.round(event.get("target").getRoutes()[0].properties.get('boundedBy')[1][1]*1000000)/1000000
		};
	let distance   =  Math.round(event.get("target").getRoutes()[0].properties.get('distance').value);
	let duration   =  Math.round(event.get("target").getRoutes()[0].properties.get('duration').value);
	let mode       =  event.get("target").getRoutes()[0].properties.get('type');
	let blocked    =  event.get("target").getRoutes()[0].properties.get('blocked');


        let data = new Object();
	data.feature  = 'RoutePaths';
	data.user_id  =	o.p.user_id;
	data.dateTrip =	o.p.dateTrip;
	data.datetime = o.getDateTimeNow();
	data.from     = from;
	data.to       = to;
	data.blocked  = blocked;
	data.mode     = mode; 
	data.duration = duration; 
	data.distance = distance; 
	data.track_id = CryptoJS.MD5(data.from.latitude+''+data.from.longitude+data.to.latitude+data.to.longitude).toString(); 
        data.legs=[];
	console.log(data);
	
        for (var i = 0, l = event.get("target").getRoutes()[0].getPaths().length; i < l; i++) {
	  let _mode = event.get("target").getRoutes()[0].getPaths()[i].properties.get('type');
  	  let _duration = Math.round(event.get("target").getRoutes()[0].getPaths()[i].properties.get('duration').value);
  	  let _distance = Math.round(event.get("target").getRoutes()[0].getPaths()[i].properties.get('distance').value);
  	  let _coordinates = event.get("target").getRoutes()[0].getPaths()[i].properties.get('coordinates');
	  let _call_id=o.p.points[i+1].call_id;
	  let _triptime=o.p.points[i+1].triptime;
	  let _service_object={search_code : o.p.points[i+1].object_search_code, latitude: o.p.points[i+1].latitude, longitude : o.p.points[i+1].longitude};
  	  let _from = null;
  	  let _to   = null;
	  let _points = []; 
	  
	  event.get("target").getRoutes()[0].getPaths()[i].properties.set('strokeColor', '#123456');
          event.get("target").getRoutes()[0].getPaths()[i].properties.get('coordinates').forEach(function(v){
	      let _o = 	{latitude : Math.round(v[0]*1000000)/1000000, longitude :Math.round(v[1]*1000000)/1000000};
    	      _from=(_from==null) ? _o : _from;
	      _to = _o;
              _points.push(_o);
	   });

     	    data.legs.push({ geocoder: "yandex", method: "ui.route.save", call_id: _call_id, triptime : _triptime,
		 service_object : _service_object, 
		 track_id : CryptoJS.MD5(''.concat(o.p.points[i].latitude, o.p.points[i].longitude, o.p.points[i+1].latitude, o.p.points[i+1].longitude)).toString(), 
		 mode: _mode, from : _from, to : _to, duration : _duration, length : _distance, points   : _points});
         }
        o.setRoutePaths(data);				// храним в обьекте значение с полной географией трека пробега
	o.loadingWidget(false);
        if(o.onRouteCreatedEventCallback)             // вызываем callback по завершению построения автотрека вызываем из ui.RouteTrip.js
           o.onRouteCreatedEventCallback(data);
	o.multiRoute.getMap().setZoom(13);
        })

    .add("requestfail", function (event) {
	o.loadingWidget(false);
        console.log("Error: " + event.get("error").message);                                                  
    });
   return this;
  }


  addPolylineRoute(polyline){
   this.polyline=polyline;
   return this;
  }

// callback для обработки события при завершении построения автотрека
  onRouteCreatedEvent(_callback_){
    console.log(_callback_);
    this.onRouteCreatedEventCallback = _callback_;
  }


  getRoutePaths(){
    return this.RoutePaths;
  }

  setRoutePaths(data){
    this.RoutePaths = (data.feature=='RoutePaths') ? data : null;
    return (this.RoutePaths.feature=='RoutePaths') ? true : false;
  }

  save(){
   let o = this;
     o.loadingWidget(true);
      $.ajax({
          url: '/trip/paths',
 	  cache: false, method: "POST",  dataType: "json",
	  data : {route : JSON.stringify(o.getRoutePaths())},	
          success: function(_o) {
  	      o.loadingWidget(false);
              if(_o.resultCode == 0) {
                new infoDialog().success('Трек', 'Трек сотрудника сохранен.');
           }
        },
      async:false
    });
  }

  getDateTimeNow(){
      var d = new Date();
      return d.toISOString();
  }


  editMode(editable){
  if(!editable)  return this;
    let o = this;
    console.log('editMode');
    var buttonEditor = new ymaps.control.Button({ data: { content: "Изменить трэк" } });
    buttonEditor.events.add("select", function () {
        o.multiRoute.options.set({visible:true}); // показывает трек
        /**
         * Enabling edit mode.
         * As options, you can pass an object with fields:
		addWayPoints: Boolean - разрешает добавление новых путевых точек при клике на карту. Значение по умолчанию: false.
		dragWayPoints: Boolean - разрешает перетаскивание уже существующих путевых точек. Значение по умолчанию true.
		removeWayPoints: Boolean – разрешает удаление путевых точек по двойному клику по ним. Значение по умолчанию: false.
		dragViaPoints: Boolean - разрешает перетаскивание уже существующих транзитных точек. Значение по умолчанию true.
		removeViaPoints: Boolean – разрешает удаление транзитных точек по двойному клику по ним. Значение по умолчанию true.
		addMidPoints: Boolean - разрешает добавление промежуточных транзитных или путевых точек посредством перетаскивания маркера, появляющегося при наведении курсора мыши на активный маршрут. Тип добавляемых точек задается опцией midPointsType. Значение по умолчанию true.         * @see https://api.yandex.com/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRoute.xml#editor
         * @see https://api.yandex.com/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRoute.xml#editor
          */
        // добавлять или удалять точки маршрута
        o.multiRoute.editor.start({ addWayPoints: false, removeWayPoints: false, dragViaPoints : true, removeViaPoints : true, addModPoints : true, });
    });


     o.multiRoute.events.add("update", function(e) {   // Turning off edit mode.
	    o.points = e.get('target').model.getReferencePoints(); //  выводим точки пути, с учетом изменений при модификации трека 
	    let j=0; let start = null, finish = null;	
	    for(let i=0; i < o.multiRoute.getWayPoints().getLength(); i++){
             var yandexWayPoint = o.multiRoute.getWayPoints().get(i);
	      let iconContent = '';
	      let preset =  "'islands#redStretchyIcon'";
	      if(o.p.points[i].trip > 0) j++;
	      if(start==null && o.p.points[i].trip > 0) start = j;	
	      if(finish==null && o.p.points[i].trip > 0 && i == o.multiRoute.getWayPoints().getLength()-1) finish = j;	
	       switch(j){
		    case start : { 
			  iconContent ='('+(j)+') <span style="color: red;">S</span>tart <span class="track-map-waypoint-icon-content" rel="'+o.p.points[i].call_id+'" >'+o.p.points[i].call_id+'</span>';
			  break; 
			}
		    case finish : {
			  iconContent ='('+(j)+') <span style="color: red;">F</span>inish <span class="track-map-waypoint-icon-content" rel="'+o.p.points[i].call_id+'">'+o.p.points[i].call_id+'</span>';
			  break; 
			}
		    default: {
			 if(o.p.points[i].trip == 1) {
			     iconContent ='('+(j)+') <span class="track-map-waypoint-icon-content" rel="'+o.p.points[i].call_id+'">'+o.p.points[i].call_id+'</span>';
			  } else {
			     iconContent ='<span class="track-map-waypoint-icon-content" rel="'+o.p.points[i].call_id+'">'+o.p.points[i].call_id+'</span>';
			   }
			  break; 
			}
		    }

                ymaps.geoObject.addon.balloon.get(yandexWayPoint);
                yandexWayPoint.options.set({
		 objectType : "servicecall", preset: preset, iconContentLayout: ymaps.templateLayoutFactory.createClass( iconContent ),
                 balloonContentLayout: ymaps.templateLayoutFactory.createClass(
                     '{{ properties.address|raw }}'
                 )
               });
            }
      });


    buttonEditor.events.add("deselect", function () {   // Turning off edit mode.
        o.multiRoute.editor.stop();
	$(".modal-backdrop").remove(); // удаляем подложку модалки перед открытием новой модалки

         new ModalDialog('modal-route-paths-edit')
	   .Prop({size : "middle" , draggable : true })
           .Header('Сохранить маршрут?',{backgroundColor: '#343a40', color: '#aaaaae'})
	   .Body('<div style="font-size: 1rem;line-height: 1.4;"><div class="row"><div class="col-sm-3"><img src="/main/images/underconstruction.png" style=""></div>'    
               +'<div class="col-sm"><span style="font-size: 1.1rem;"><span>Маршрут абонента был изменен оператором.</br>'
 	        +'Сохранить маршут?<br>'
	        +'</span></div></div></div>')
	   .Footer({ "ok": "Сохранить", "close": "Закрыть"})
	   .Handler(()=>{
		$("#modal-route-paths-edit-dialog").remove();
		$(".modal-backdrop").remove();
                o.save();
	   }).create().show();

    });

    o.p.map.controls.add(buttonEditor);

    $(document).off('click','span.track-map-waypoint-icon-content').on('click','span.track-map-waypoint-icon-content', function(e){
     let iconContentDataToggle =''
     let callId=$(this).attr('rel');
     o.p.points.forEach(function(e) {
       if(callId==e.call_id) {
        iconContentDataToggle =''
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
	       new infoDialog().success('Запрос № ' + callId + ' с заездом сотрудника', iconContentDataToggle );
	       break;	
	      }	
 	    default:{
	       new infoDialog().info('Запрос № ' + callId + ' без присутствия сотрудника', iconContentDataToggle );
	     }
           }
          return;
        }	
      });
    });
    return this;

  }



 }
