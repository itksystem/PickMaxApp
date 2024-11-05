/*
  Библиотека отражения пользователя на карте
  Синягин Д.В. 30-09-2022 (с)
*/

class UserLocalPlace{
     storage    = null;
     storageTag = "UserLocalPlace";
     map = null;
     obj = null;
     userLocalServicePlaceImageUrl = '/main/images/local_service_place.png'; 

     circlePropDefault ={
        draggable: false,
        fillColor: "#0000ee77",
        strokeColor: "#990066",
        strokeOpacity: 0.1,
        strokeWidth: 1	
    };


    constructor(map, user_id) {
      console.log('Start '+this.storageTag+' creating...');
      this.map  = map;
      this.user = new User(user_id);
      this.latitude  =  this.user.entity.user.local_address.latitude;
      this.longitude =  this.user.entity.user.local_address.longitude;
      return this;
    }

 

  setCircle(lat, lng, radius){
    try{
   	this.Circle=new ymaps.Circle([[lat, lng], radius], {
		objectType: "USER_LOCAL_PLACE_GEO_ZONE"
	}, this.circlePropDefault );
   	this.map.geoObjects.add(this.Circle);
       }catch(e){
     console.log(e);
    }
    return this;
  }




  onMap(){
    try{
      this.local_page_obj = new ymaps.Placemark(
	[this.latitude, this.longitude],
	{
            hintContent: 'Персональная локальная площадка пользователя ',
	    objectType : "LOCAL_SERVICE_PLACE"
        }, {
     	    user_id: this.user.entity.user.id,
            iconLayout: 'default#image',        // Необходимо указать данный тип макета.
            iconImageHref: this.userLocalServicePlaceImageUrl,       // Своё изображение иконки метки.
            iconImageSize: [32, 32]		// Размеры метки.
            ,iconImageOffset: [-1, -1]	        // Смещение левого верхнего угла иконки относительно
        });
        this.map.geoObjects.add(this.local_page_obj);	
	this.setCircle(this.latitude, this.longitude, 300);
       }catch(e){
         console.log(e);
     }
    return this;
   }


   hide(){
    try{
       }catch(e){
         console.log(e);
    }
    return this;
   }

 }
