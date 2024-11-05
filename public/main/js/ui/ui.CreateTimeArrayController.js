/*******************************************************************/
/* Компонент CreateTimeArrayController                             */
/* Создание массива элементов с временым диапазоном                */
/* Sinyagin Dmitry rel.at 10.10.2021                               */
/*******************************************************************/
"use strict";

class CreateTimeArrayController {
  constructor(prop) {
    console.log('CreateTimeArrayController loading....');
    if(prop!=null){
       this.storage          = new sessionStorageClass(); 
       this.max_count        = prop.max_count; 
       this.remove_key       = prop.remove;         // вкл. кнопку удалить
       this.storage_key      = prop.storage_key;    // ключ в хранилище
       this.tag              = prop.tag;  // маска элементов обработчиков события на добавление элементов
       this.add_button_class = 'object-'+prop.tag+'-add-btn';
       this.remove_button_class  = 'object-'+prop.tag+'-remove-btn';
       this.target_id=prop.target_id;  // уникальное имя ключа обьекта
     }
   return this;
  }

  getStorageName(){  return this.storage_key;  }

  getTag(){  
	return this.tag;  
  }

  getCount(dayOfWeek){
     let o = this;
     return $("div.object-input-servicetime-plg[storage='"+o.storage_key+"'][dayOfWeek='"+dayOfWeek+"']").length;
  }

  render(e = null){
   let o = this;
   if(o.max_count == null || o.getCount(e.dayOfWeek) < o.max_count )
   return '<div class="float-sm-left object-input-servicetime-plg" dayOfWeek="'+e.dayOfWeek+'" timeType="'+e.timeType+'" uid="'+e.uid+'" storage="'+o.storage_key+'">'
 	        +'<input class="object-timeobject-timepicker '+o.tag+'" type="text" timeAction="start" value="'+e.start+'" >'
	        +'- <input class="object-timeobject-timepicker '+o.tag+'" type="text"  timeAction="finish" value="'+e.finish+'">'
	        +((this.remove_key==true) ? '<button type="button" class="btn btn-tool '+o.remove_button_class+'"><i class="fas fa-times"></i></button>' : '')
	        +'</div>';
     }

 
  storageUpdate(){
     let o = this;
     let timeArray=[];
     $("div[storage='"+o.storage_key+"']" ).each(function(index) {
        let el = new Object(); 
            el.time_id   = $(this).attr("uid");
            el.dayOfWeek = $(this).attr("dayOfWeek");
            el.timeType  = $(this).attr("timeType");
            el.start     = $("div.object-input-servicetime-plg[uid='"+el.time_id+"'] input[timeaction='start']").val();
            el.finish    = $("div.object-input-servicetime-plg[uid='"+el.time_id+"'] input[timeaction='finish']").val();
            timeArray.push(el);
     });
     o.storage.setObject(o.storage_key,timeArray);
     o.storageView();
     return this;	
  }

  storageGet(){
     return this.storage.getObject(o.storage_key);
  }

  storageView(){
     let o = this;
     return this;
  }

  storageClear(){
    let o = this;
    let storage = new sessionStorageClass();
    storage.remove(o.storage_key);
    o.storageView();
    return this;
  }

  create(e){
    let el = new Object();
     el.uid       = generateUUID();
     el.dayOfWeek = $(e).attr('dayOfWeek');
     el.timeType  = $(e).attr('serviceTime');
     el.start     = '00:00';
     el.finish    = '23:59';
    return el;
  }

  renderAll(a){
    let o = this;
    $.each(a, function(key, val) {
      let el       = new Object();
      el.uid       = val.time_id;
      el.dayOfWeek = val.dayOfWeek;
      el.timeType  = val.time_type;
      el.start     = val.start;
      el.finish    = val.finish;
      $('.servicetime-poligon[dayOfWeek="'+el.dayOfWeek+'"][serviceTime="'+el.timeType+'"]').append(o.render(el));
   });
      o.storageUpdate();
      o.timePickerInitialize();
      o.clearButton();
      o.storageView();
   return this;
  }

  getInput(input){
     let el = new Object();      
     el.time_id    = input.parent("div").attr("uid");        // берем атрибуты  с родительского div
     el.timeType   = input.parent("div").attr("timeType");  //
     el.timeAction = input.attr("timeAction");
     el.storage    = input.attr("storage");
     el.start      = $("div.object-input-servicetime-plg[uid='"+el.time_id+"'] input[timeaction='start']").val();
     el.finish     = $("div.object-input-servicetime-plg[uid='"+el.time_id+"'] input[timeaction='finish']").val();
   return el;
  } 


  timePickerInitialize(){
     let o = this;
	$.datetimepicker.setLocale('ru');
	$('input.object-timeobject-timepicker.'+o.tag).datetimepicker({
//          ownerID : "modal",
          ownerID : o.target_id,

	  inline: false, step:15, timepicker: true, datepicker: false,
	  format: 'H:i',
		onGenerate:function( ct ){
             },
          onChangeDateTime:function(dp,$input){
               let el = o.getInput($input);  	
               if(toTime(el.start) > toTime(el.finish)) {
                  toastr.error('Внимание!<br/>Устанавливаемое время начала работы больше времени завершения!', 'Обьекты', {timeOut: 3000});
                  $input.val((el.timeAction=="start") ? el.finish : el.start);
               } 
             o.storageUpdate();
         }
      });
  }  

  remove(el){ // удаляем элемент времени 
    let o = this;
    let uid =   $(el).parent("div.object-input-servicetime-plg").attr('uid');
    $(el).parent('div.object-input-servicetime-plg[uid="'+uid+'"]').remove();
   return this;
  }

 clearButton(){
    let o = this;
    if(o.remove_key==true){
        $('.'+o.remove_button_class).off("click").on("click",function(e) {
	   o.remove(this); 	
           o.storageUpdate();
      });
    }
  }

 addButton(){
   let o = this;
   $('.'+o.add_button_class).off("click").on("click",function(e) {
	let el= o.create(this);
   	$('.servicetime-poligon[dayOfWeek="'+el.dayOfWeek+'"][serviceTime="'+el.timeType+'"]').append(o.render(el));
   	o.storage.setObject(el.uid,el);
        o.storageUpdate();
        o.timePickerInitialize();
        o.clearButton();
      });
 }


  run() {
      this.addButton();
   }
}


