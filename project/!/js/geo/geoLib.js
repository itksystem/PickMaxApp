/*******************************************************************/
/* Класс доступа к функциям геокодеров				   */
/* Sinyagin Dmitry rel.at 10.10.2021                               */
/*******************************************************************/

class geoLib {
  marker=null;
  config=null;
  newShape=null;
  objectGeoZone=null;
  constructor() {
   console.log('geoLib loading....');   
  }


/* загрузка карты google */
 mapLoad(config){
  switch(config.coder) {
   case "google":
     return new google.maps.Map(document.getElementById(config.mapElementName), config.geoParams);
   case "yandex" :
      return myMap;   
   default: 
     return null;
   }
 }

 mapGeozoneReload(config){
  let o = this;
  switch(config.coder) {
  case "google":
    myMap = new google.maps.Map(document.getElementById(config.mapElementName), config.geoParams);
    console.log(config.tops);
    o.config = config;
     if(config.tops.length > 0 ) {
       o.newShape=new google.maps.Polygon({ map: myMap, paths: config.tops, editable: false});
       myMap.setZoom(7);
             google.maps.event.addListener(o.newShape, 'click', function() {
	      console.log('click'); 	
              o.updateCurSelText(o.newShape);
            });
            google.maps.event.addListener(o.newShape, 'drag', function() {
	      console.log('drag'); 	
              o.updateCurSelText(o.newShape);
            });
            google.maps.event.addListener(o.newShape, 'dragend', function() {
	      console.log('dragend'); 	
              o.updateCurSelText(o.newShape);
            });
            google.maps.event.addListener(o.newShape, 'resize', function() {
	      console.log('resize'); 	
              o.updateCurSelText(o.newShape);
            });
  	    google.maps.event.addListener(o.newShape.getPath(), 'insert_at', function() {
	      console.log('insert_at'); 	
              o.updateCurSelText(o.newShape);
	    });
 	 google.maps.event.addListener(o.newShape.getPath(), 'set_at', function() {
	      console.log('set_at'); 	
              o.updateCurSelText(o.newShape);
	    });
 	 google.maps.event.addListener(o.newShape.getPath(), 'remove_at', function() {
	      console.log('remove_at'); 	
              o.updateCurSelText(o.newShape);
	    });

      }	
     return myMap;
  case "yandex" :
     return myMap;   
  default: 
    return null;
  }
 }

  clearShape(){
     if(this.newShape!=null) this.newShape.setMap(null);
     this.newShape=null;
  }

  clearMarker(){
     if(this.marker!=null) this.marker.setMap(null);
     this.marker=null;
  }

  clearObjectGeoZone(){
     if(this.objectGeoZone!=null) this.objectGeoZone.setMap(null);
     this.objectGeoZone=null;
  }


  updateCurSelText(shape) {
     let pathstr = "[ ";
     for (var i = 0; i < shape.getPath().getLength(); i++) {
        pathstr += shape.getPath().getAt(i).toUrlValue() + " , ";
     }
    pathstr += "]";
    console.log(pathstr);
  }


  setNewShapeOnMap(myMap, tops) {
     let o = this;
     o.newShape=(o.newShape==null) ? new google.maps.Polygon({ map: myMap, paths: tops, editable: false}) : o.newShape;
  }



  setShape(polygon, arr) {
    if(polygon){
      arr.forEach((value) => {
        polygon.getPath().push(new google.maps.LatLng(value.lat, value.lng));
     });
    }
  }

  setMarkerVisible(visible){
   if(this.marker)
     this.marker.setVisible(visible);
  }

  setObjectGeoZoneVisible(visible){
   if(this.objectGeoZone)
     this.objectGeoZone.setVisible(visible);
  }


  getShapeArray(shape) {
     let pathstr = "[ ";
     let _s="";
     for (var i = 0; i < shape.getPath().getLength(); i++) {
       let _o = shape.getPath().getAt(i).toUrlValue().split(',');
       let _p = new Object();
           _p.lat = parseFloat(_o[0]);
           _p.lng = parseFloat(_o[1]);
            pathstr += _s+'{"lat":'+_p.lat+',"lng":'+_p.lng+'}';
	   _s=",";
     }
    pathstr += "]";
    return pathstr;
  }

  getShapeArrayStoreString(shape) { // выдать массив геоточек в формате хранилища 
     let pathstr = "";
     let _s="";
     for (var i = 0; i < shape.getPath().getLength(); i++) {
       let _o = shape.getPath().getAt(i).toUrlValue().split(',');
       let _p = new Object();
           _p.lat = parseFloat(_o[0]);
           _p.lng = parseFloat(_o[1]);
            pathstr += _s+_p.lat+' '+_p.lng;
	   _s=",";
     }
    pathstr += "";
    return pathstr;
  }


/* редактирование нового обьекта */
  drawingManager(map){
    let o = this;
    var polyOptions = {
        strokeWeight: 0,
        fillOpacity: 0.45,
        editable: true
      };

    let drawManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
           drawingModes: [
            google.maps.drawing.OverlayType.POLYGON
           ],
        },
        markerOptions: {
            draggable: true,
            editable: true,
          },
          map: map
        });
        drawManager.setMap(map);

        google.maps.event.addListener(drawManager, 'overlaycomplete', function(e) {
            var isNotMarker = (e.type != google.maps.drawing.OverlayType.MARKER);
            drawManager.setDrawingMode(null);
            o.newShape = e.overlay;
            o.newShape.type = e.type;
            o.setShape(o.newShape, o.config.tops);
            o.updateCurSelText(o.newShape);
            o.newShape.setEditable(true);

            google.maps.event.addListener(o.newShape, 'click', function() {
	      console.log('click'); 	
              o.updateCurSelText(o.newShape);
            });
            google.maps.event.addListener(o.newShape, 'drag', function() {
	      console.log('drag'); 	
              o.updateCurSelText(o.newShape);
            });
            google.maps.event.addListener(o.newShape, 'dragend', function() {
	      console.log('dragend'); 	
              o.updateCurSelText(o.newShape);
            });
            google.maps.event.addListener(o.newShape, 'resize', function() {
	      console.log('resize'); 	
              o.updateCurSelText(o.newShape);
            });
  	    google.maps.event.addListener(o.newShape.getPath(), 'insert_at', function() {
	      console.log('insert_at'); 	
              o.updateCurSelText(o.newShape);
	    });
 	 google.maps.event.addListener(o.newShape.getPath(), 'set_at', function() {
	      console.log('set_at'); 	
              o.updateCurSelText(o.newShape);
	    });
 	 google.maps.event.addListener(o.newShape.getPath(), 'remove_at', function() {
	      console.log('remove_at'); 	
              o.updateCurSelText(o.newShape);
	    });

        });

   return  drawManager;
 }


 geoComplete(params=null){
  console.log("geoComplete");
  let o = this;
  switch(params.coder) {
    case "google":
       console.log("params.object.geocomplete");
       $(params.object).geocomplete({
          map: params.map,
	  location:  new google.maps.LatLng(parseFloat($(params.latitude).val()).toFixed(4),parseFloat($(params.longitude).val()).toFixed(4)),
	  markerOptions: {
            position: new google.maps.LatLng(parseFloat($(params.latitude).val()).toFixed(4),parseFloat($(params.longitude).val()).toFixed(4)),
            map: params.map,
            draggable: true,
            title: $(params.object).val(),
            visible : true
          }
       });

   /* Переносим маркер в новую позицию на карте и перемещаем карту */
     var map = $(params.object).geocomplete("map");
     o.marker = $(params.object).geocomplete("marker");
     console.log(o.marker);
     map.setZoom(17);
     map.setCenter(new google.maps.LatLng(parseFloat($(params.latitude).val()).toFixed(4)*1.00001, parseFloat($(params.longitude).val()).toFixed(4)*1.00001));

     o.marker.setPosition(new google.maps.LatLng(parseFloat($(params.latitude).val()).toFixed(4),parseFloat($(params.longitude).val()).toFixed(4)));
     o.setMarkerVisible(true);
/*     o.setCircle(params.map, $(params.latitude).val(), $(params.longitude).val(), 300); */

     $(params.object).geocomplete({ map: params.map }).bind("geocode:result", function(event, result){
         $(params.latitude).val(parseFloat(result.geometry.location.lat()).toFixed(4));
         $(params.longitude).val(parseFloat(result.geometry.location.lng()).toFixed(4));
  	 o.objectGeoZone.setCenter({lat:parseFloat($(params.latitude).val()).toFixed(4)*1, lng: parseFloat($(params.longitude).val()).toFixed(4)*1});
       });
	
     $(params.object).bind("geocode:dragged", function(event, latLng){
          $(params.latitude).val(parseFloat(latLng.lat()).toFixed(4));
          $(params.longitude).val(parseFloat(latLng.lng()).toFixed(4));
  	  o.objectGeoZone.setCenter({lat:parseFloat($(params.latitude).val()).toFixed(4)*1, lng: parseFloat($(params.longitude).val()).toFixed(4)*1});
       });
       return;
    case "yandex" :
       return;   
    default: 
       return null;
    }
 }


 setCircle(map, lat, lng, radius){
 try{
    console.log("radius=>"+radius);
    this.objectGeoZone = null;
    this.objectGeoZone = new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map : map,
      center: {lat: lat*1, lng: lng*1},
      radius: radius,
     });
       this.objectGeoZone.setRadius(radius);
       console.log(this.objectGeoZone);
     } catch(err) {
       console.log(err);
       return  null;
   }
 }

  moveMarkerCursor(map, location){
  /* Перемещаем курсор по новым координатам */
      let o = this;
      o.marker.setPosition(location); // маркер
       switch(confug.coder){
        case 'google': {  map.setCenter(new google.maps.LatLng(location.lat, location.lng));  break; }
        case 'yandex': {  map.setCenter(latlng, zoom); break; }
	}

  }

  moveCircleCursor(map, location){
  /* Перемещаем зону по новым координатам */
      let o = this;
      o.objectGeoZone.setCenter({lat:parseFloat(location.lat).toFixed(4)*1, lng: parseFloat(location.lng).toFixed(4)*1}); // зона
      map.setCenter(new google.maps.LatLng(location.lat, location.lng)); // центр карты
  }




}

