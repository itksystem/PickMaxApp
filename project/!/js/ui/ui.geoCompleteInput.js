class geoCompleteInput{
     storage    = null;
     storageTag = "yandexGeoLib";
     myMap	= null;
     zoom	= 15;
     geoCompleteMarker = null;
     LatLng = null;
     triggers=[];

  constructor() {
     console.log('Start yandexGeoLib creating...');
     return this;	
  }

  initMap(e){
   this.myMap  = e;
  }

  setCenter(latlng=[0,0], zoom = 15 ){
    this.myMap.setCenter(latlng, zoom);
    return this;
  }

  setMarkerVisible(b){
    this.geoCompleteMarker.options.set('visible', b);
  }

  setMarker(latlng=[0,0], prop=null){
   if(this.geoCompleteMarker) {
  	 this.geoCompleteMarker.geometry.setCoordinates(latlng);
	 return this;
   }
   this.geoCompleteMarker = new ymaps.Placemark(latlng, prop
	, {
            preset: 'islands#darkOrangeStretchyIcon',
	    iconCaptionMaxWidth: '50',
            iconColor: '#ff0000',
	    objectType : "GEO_COMPLETE_MARKER",	
	    draggable: true
        }
     );

   this.myMap.geoObjects.add(this.geoCompleteMarker);
   return this;
  }

  getLatitude(){
    console.log(this.LatLng);
    return (!this.LatLng) ? null : this.LatLng[0]; 
  }

  getLongitude(){ 
    console.log(this.LatLng);
    return (!this.LatLng) ? null : this.LatLng[1]; 
  }  

  dragendCallback(func){
      func(this);
  }

  trigger(event, callback){  
    let o = this;
    o.triggers[event]=callback;
    o.geoCompleteMarker.events.add("dragend", function (event) {
       o.LatLng = event.get('target').geometry.getCoordinates();
       o.dragendCallback(o.triggers['dragend']);
    });
  }

  geoComlpete(e){
    let o = this;
    let _e = new ymaps.SuggestView(e);
    let address = null;
    _e.events.add(["select"], function (event) {
	address =  $('#'+e).val();
	ymaps.geocode(address).then(function (res) {
	o.LatLng=res.geoObjects.get(0).geometry.getCoordinates();
    	o.setCenter(res.geoObjects.get(0).geometry.getCoordinates());
        o.setMarker(res.geoObjects.get(0).geometry.getCoordinates());
        o.dragendCallback(o.triggers['dragend']);
        o.geoCompleteMarker.events.add("dragend", function (event) {
          o.LatLng = event.get('target').geometry.getCoordinates();
          o.dragendCallback(o.triggers['dragend']);
        });
     });
   });


    return _e;
  }

  create() {
  }

  remove(){
  }

   show(){
   }

   hide(){
   }
 }

