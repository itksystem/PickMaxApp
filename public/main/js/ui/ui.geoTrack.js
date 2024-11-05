class geoTrack{
  storageTag = "geoTrack";
  points = [];

  constructor(prop) {
     console.log('Start '+this.storageTag+' creating...');
     this.prop=prop;
     return this;	
  }

  get(){
  let _o = null;
   $.ajax({
     url: "/user/track/"+this.user_id,
     cache: false,
     async: false,
     method: "GET",
     dataType: "json",
     success: function(_o){ // если запрос успешен вызываем функцию
	return _o;
     }
   });
   return _o;
 }

  onMap(map){
   let o = this;
   $.ajax({
     url: "/user/track/"+this.prop.date+"/"+this.prop.user_id,
     cache: false,
     async: false,
     method: "GET",
     dataType: "json",
     success: function(_o){ // если запрос успешен вызываем функцию
     let points=[];
     o.arr=[];
      $.each(_o.points, function(i, v){
         o.points[v.request_id] = o.setPoint(map,[v.latitude,v.longitude,v.source,v.request_id,v.location_date, i]);  // массив геоточек
         o.points[v.request_id].events.add("balloonopen", function () {
     	        let index  = o.points[v.request_id].properties.get('index');		// индекс
     	        let latlng  = o.points[v.request_id].geometry.getCoordinates();		// Меняем координаты в balloonContent
     	        let source = o.points[v.request_id].properties.get('source');		// тип геоточки
     	        let request_id = o.points[v.request_id].properties.get('request_id');	// идентификатор геоточки  
     	        let location_date = o.points[v.request_id].properties.get('location_date');	// дата геоточки

 		o.points[v.request_id].properties.set("balloonContent",''                       // устанавливаем контент балуна
		    +'<div class="geo-point-index w-100" rel="'+request_id+'">№<span>'+ index+'</span>'+'</div>'
		    +'<div class="geo-point-request-id w-100" rel="'+request_id+'">Идентификатор:      ' +'<span>'+ request_id+'</span>'+'</div>'
		    +'<div class="geo-point-coordinates w-100" rel="'+request_id+'">Широта,долгота: ' +'<span>'
		    +parseFloat(latlng[0]).toFixed(4)+','+parseFloat(latlng[1]).toFixed(4)+'</span>'+'</div>'
		    +'<div class="geo-point-type w-100" rel="'+request_id+'">Тип геоточки:   ' +'<span>'+ ((source=='0') ? 'авточек' : 'чекин')+'</span>'+'</div>'
		    +'<div class="geo-point-date w-100" rel="'+request_id+'">Дата геоточки:  ' +'<span>'+ location_date+'</span>'+'</div>'
	 	    +'</hr>'
		    +'</br><button class="geo-point-type-button" point-type="1" rel="'+request_id+'">Чекин</button>&nbsp;'
	 	    +'<button class="geo-point-type-button" point-type="0" rel="'+request_id+'">Авточек</button>'
	       );
   	    });
           o.arr.push([v.latitude,v.longitude]);			       // заполняем массив стрелок между геоточками	
           o.points[v.request_id].events.add("dragend", function (event) {       // обработчик события перемещения геоточки	
                map.geoObjects.remove(o.arrow);     			         // удаляем старые стрелки
	        o.points[v.request_id].properties.set('changed',true);
 	        o.arr=[]; 
                let latlng = o.points[v.request_id].geometry.getCoordinates();	// Меняем координаты в balloonContent
      	          for (var key in o.points) {					
	              o.arr.push(o.points[key].geometry.getCoordinates());  	// собираем новый массив стрелок с уже измененными координатами	
   	          }
		console.log(o.points[v.request_id]);
	        o.setArrow(map, o.arr);						// укладываем на карту
	        o.saveStorage();
            });
       });

      o.setArrow(map, o.arr);
      $(document).off('click','.geo-point-type-button').on('click','.geo-point-type-button', function(e){
	 let requestId=$(this).attr('rel');        
	 let pointType=$(this).attr('point-type');        
	 o.points[requestId].properties.set('source',pointType);
	 o.points[requestId].options.set('iconColor',((pointType=='0') ? 'blue' : 'red'),);
	 $('div.geo-point-type[rel="'+requestId+'"] span').html(((pointType=='0') ? 'авточек' : 'чекин'));
	 let latlng = o.points[requestId].geometry.getCoordinates();
	 $('div.geo-point-coordinates[rel="'+requestId+'"] span').html(parseFloat(latlng[0]).toFixed(4)+','+parseFloat(latlng[1]).toFixed(4));
         o.points[requestId].properties.set('changed',true);
	 o.saveStorage();
      });

     }
   }).done( function() {return this;});
   return this;          
 }

  setArrow(map, arr){
   let o = this;
    ymaps.modules.require(['geoObject.Arrow'], function (Arrow) {
      o.arrow = new Arrow(arr, null, {
            geodesic: true,
	    strokeColor: "#FF0000", // Цвет линии.
            strokeWidth: 2,
            opacity: 1,
            strokeStyle: 'solid',
	    visible : true, 	
	    objectType: "ARROW"	
        });
     map.geoObjects.add(o.arrow);
    return o.arrow;
   });
 }

 setPoint(map, arr){
  let o = this;
  let point = new ymaps.Placemark(arr, {
      index : arr[5],
      changed : false,	
      source : arr[2],
      request_id : arr[3],	
      location_date : arr[4],	
      balloonContent: 'test '+arr[5]+ ' '+arr[3]+' '+arr[0]+','+arr[1],
      objectType: "GEOPOINT"	
    },{
    draggable : true,	
    visible : true,	
    preset: 'islands#circleDotIcon',
    iconColor: ((arr[2]=='0') ? 'blue' : 'red'),
    iconImageSize: [30, 42],
    iconImageOffset: [-5, -38]
   }
  );
  map.geoObjects.add(point);
  return point;
 }

 getChangedArray(){
  let arr=[];
  let o = this;
    for (var key in o.points) {					
	if(o.points[key].properties.get('changed')==true){
             let latlng = o.points[key].geometry.getCoordinates();	
             let source = o.points[key].properties.get('source');		// тип геоточки
             let request_id = o.points[key].properties.get('request_id');	// идентификатор геоточки  
             let location_date = o.points[key].properties.get('location_date');	// дата геоточки
             arr.push(
		[latlng[0],latlng[1], source, request_id, location_date ]);  	// собираем новый массив стрелок с уже измененными координатами	
  	 }	 
     }
   return arr; 
 }

  saveStorage(){
  if(!this.prop.storageTrack) return;	
    console.log(this.prop);	
    let storage = new sessionStorageClass();
    storage.setObject(this.prop.storageTrack, this.getChangedArray());
  }

}



