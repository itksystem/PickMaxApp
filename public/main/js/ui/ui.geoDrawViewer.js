class geoDrawViewer{
     storage    = null;
     storageTag = "geoDrawViewer";

     DRAW_POLIGON_TYPE = {
        GEOZONE_DEFAULT_RADIUS_TYPE : "Окружная геозона с радиусом по умолчанию",
        GEOZONE_CUSTOM_RADIUS_TYPE  : "Окружная геозона с производным радиусом",
        GEOZONE_CUSTOM_POLIGON_TYPE : "Геозона- полигон"
     }
 
     drawPolygon= null;

     circlePropDefault ={
        draggable: false,
        fillColor: "#DB709377",
        strokeColor: "#990066",
        strokeOpacity: 0.1,
        strokeWidth: 1,
	objectType: "OBJECT_GEO_ZONE"
    };

    drawPropDefault ={
      strokeWidth: 2,
      strokeColor: '#0000FF',
      fillColor: "#00FF00",
      draggable: false
      };
   
     triggers=[];

  constructor(map) {
   console.log('Start '+this.storageTag+' creating...');
     if(!map) return null;
     this.map = map;
     return this;	
  }

  option(name,value){
     this.drawPolygon.options.set(name,value);
     return this;
  }

  balloonContent(text){
     this.drawPolygon.options.set('balloonContent',text);
     return this;
  }

  hintContent(text){
     this.drawPolygon.options.set('hintContent',text);
     return this;
  }

  draggable(draggable){
     this.drawPolygon.options.set('draggable',draggable);
     return this;
  }

  setCircle(lat, lng, radius){
    try{
   	this.Circle=new ymaps.Circle([[lat, lng], radius], {}, this.circlePropDefault );
   	this.map.geoObjects.add(this.Circle);
       }catch(e){
     console.log(e);
    }
    return this;
  }

  visible(b){
    this.drawPolygon.options.set('visible', b);
    return this;    
  }

  setPolygon(arr){
   try{
   if(arr.length == 0) return;
       this.Polygon = new ymaps.Polygon( [arr],
	      { hintContent: "Геозона обьекта"},
	      {
                fillColor: '#00FF00',
                strokeColor: '#088700',
                opacity: 0.4,
	        strokeOpacity: 1,
                strokeWidth: 2
               });
       this.map.geoObjects.add(this.Polygon);
       }catch(e){
         console.log(e);
    }
    return this;
  }                                                                                             

  geoZoneDefaultRadiusVisible(b){
    (b) ? $(".GEOZONE_DEFAULT_RADIUS_TYPE").show() : $(".GEOZONE_DEFAULT_RADIUS_TYPE").hide();
  } 

  geoZoneCustomRadiusVisible(b){
    (b) ? $(".GEOZONE_CUSTOM_RADIUS_TYPE").show()  : $(".GEOZONE_CUSTOM_RADIUS_TYPE").hide();
  } 

  geoZoneCustomPoligonVisible(b){
    (b) ? $(".GEOZONE_CUSTOM_POLIGON_TYPE").show() : $(".GEOZONE_CUSTOM_POLIGON_TYPE").hide(); 
  } 




  viewDrawPoligon(t, data=null){
   let o = this;
   console.log(t, data);
    this.map.geoObjects.remove(this.Circle); // удаляем коллекцию обьектов
    this.map.geoObjects.remove(this.Polygon); // удаляем коллекцию обьектов
       switch(t){
	  case   'GEOZONE_DEFAULT_RADIUS_TYPE' : { 
		  o.geoZoneDefaultRadiusVisible(true);
		  o.geoZoneCustomRadiusVisible(false);
		  o.geoZoneCustomPoligonVisible(false);
		  o.setCircle(data.center.latitude, data.center.longitude,  data.defaultRadius);
	        break;
	 }
	  case   'GEOZONE_CUSTOM_RADIUS_TYPE'  : { 
		  o.geoZoneDefaultRadiusVisible(false);
		  o.geoZoneCustomRadiusVisible(true);
		  o.geoZoneCustomPoligonVisible(false);
		  o.setCircle(data.center.latitude, data.center.longitude,  data.customRadius);
	        break;
	 }
	  case   'GEOZONE_CUSTOM_POLIGON_TYPE' : { 
		  o.geoZoneDefaultRadiusVisible(false);
		  o.geoZoneCustomRadiusVisible(false);
		  o.geoZoneCustomPoligonVisible(true);
		  o.setPolygon(data.tops);
	        break;
	}
      }
   }


}

