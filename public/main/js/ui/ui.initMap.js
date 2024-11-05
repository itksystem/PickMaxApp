class Map{
     storageTag = "initMap";
     Map	= null;
     zoom	= 10;
     geoCompleteMarker = null;
     LatLng = null;
     triggers=[];
     el = null;

  constructor(el) {
     console.log('Start '+this.storageTag+' creating...');
     this.el=el;
     return this;	
  }

  init(){
  console.log(this.el);
  let o = this;
  o.Map = new ymaps.Map(o.el, {
        center:  [55.74954, 37.621587],
       	zoom : 10,
	controls: [
                'zoomControl', // Ползунок масштаба
                'rulerControl', // Линейка
                'typeSelector', // Переключатель слоев карты
            ]
      }); 
     o.Map.setCenter([55.74954, 37.621587], o.zoom);
     return o.Map;
  }

  setCenter(latlng=[0,0], zoom = 10 ){
     this.Map.setCenter(latlng, zoom);
     return this;
  }

 }

