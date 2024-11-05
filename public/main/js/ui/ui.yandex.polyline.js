/*
  Библиотека отражения ломанной линии на основе библиотеки Яндекса
  Синягин Д.В. 16-06-2022 (с)
*/

class YandexGraphLibrary{
     storage    = null;
     storageTag = "YandexGraphLib";
     map = null;
     
    constructor(map) {
      console.log('Start '+this.storageTag+' creating...');
      this.map = map;
    }

    exist(e){
      return ($(e).length) ? true : false;
    }

   polyline(points, properties, options){
    if(!points) return null;
    try{
        var polyline = new ymaps.Polyline(points, properties, options);
       }catch(e){
        console.log(e);
        return null;
     }
    return polyline;
   }
   
   destroy(e){
    try{
       e.removeFromMap(this.map);
       }catch(e){
       console.log(e);
    }
   }

   onMap(e){
    try{
	console.log(e);
        this.map.geoObjects.add(e); // Добавляем линию на карту.
        this.map.setBounds(e.geometry.getBounds()); // Устанавливаем карте границы линии.
       }catch(err){
         console.log(err);
      return null;
     }
    return this;
   }


   hide(){
    try{
       }catch(e){
         console.log(e);
    }
   }

 }
