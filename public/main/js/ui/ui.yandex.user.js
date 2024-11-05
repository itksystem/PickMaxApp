/*
  Библиотека отражения пользователя на карте
  Синягин Д.В. 30-09-2022 (с)
*/

class YandexUserLibrary{
     storage    = null;
     storageTag = "YandexUserLibrary";
     map = null;
     obj = null;
     imageUrl = '/main/images/user_red_32x32.png'; 
     userLocalServicePlaceImageUrl = '/main/images/local_service_place.png'; 

    constructor(map, user) {
      console.log('Start '+this.storageTag+' creating...');
      this.map  = map;
      this.user = user;
      return this;
    }

 
   destroy(){
    try{
       this.obj.removeFromMap(this.map);
       }catch(e){
       console.log(e);
     }
     return this;
    }

   onclick(event){
       alert('click');
       return this;
   }

  setCoordinates(lanlng=null){
     if(lanlng) {
        this.user.latitude =  lanlng.latitude;
        this.user.longitude =  lanlng.longitude;
       }	
      return this;
  }

  setLocationTime(time=null){
     if(time) {
        this.location_date =  time;
       }	
      return this;
  }

  setFinishDate(time=null){
     if(time) {
        this.finishdate =  time;
       }	
      return this;
  }


  setCallId(callId = null){
     if(callId) {
        this.call_id =  callId;
     }	
    return this;
  }


  onMap(){
    try{
     this.obj = new ymaps.Placemark([this.user.latitude, this.user.longitude],
	{
            hintContent: '<div class="yandex-user-placemark">Нахождение пользователя в момент </br> закрытия запроса '+ this.call_id+' </div>',
            balloonContent: '<div class="yandex-user-placemark">Нахождение пользователя \n в момент закрытия запроса </br> '
		+ 'Запрос: '+this.call_id+'</br>'
		+ 'Время закрытия :' +this.finishdate+'</br>'
		+ 'Время нахождения в данной позиции :' +this.location_date+'</br>'
		+' </div>'
        }, { // Опции.
     	    user_id: this.user.id,
	    objectType : "USER",
            iconLayout: 'default#image', // Необходимо указать данный тип макета.
            iconImageHref: this.imageUrl,// Своё изображение иконки метки.
            iconImageSize: [30, 42],     // Размеры метки.
            iconImageOffset: [-5, -38]   // Смещение левого верхнего угла иконки относительно её "ножки" (точки привязки).
        });

        this.map.geoObjects.add(this.obj);
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
