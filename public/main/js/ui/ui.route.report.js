/*  Формирование маршрутного листа  */

class routeReport{
     storage    = null;
     storageTag = "routeReport";

     constructor(p) {
      if(!p) return;
      this.prop = p;
      console.log('Start '+this.storageTag+' creating...');
      console.log(this.prop);

    }
  
  distanceException(track_id, mode= null){
     let o = this;
    $.get('/trip/distance/'+track_id, null, function(_o) {
     if(mode == null) mode = '';
     let html = "<b>Информация об участке пути</b>:</br>"; 	
       if(_o.entity != undefined) {
	 
	      html+= "Идентификатор участка пути (track ID): <b>"+_o.entity.track_id+"</b></br>"; 	
	      html+= "Геопровайдер: <b>"+_o.entity.geocoder+"</b></br>"; 	
	      html+= "<b>Начало участка:</b></br>"; 	
	      html+= "Координаты: "+_o.entity.from_latitude+","+_o.entity.from_longitude+"</br>"; 	
	      html+= "<b>Завершение участка:</b></br>"; 	
	      html+= "Координаты: "+_o.entity.to_latitude+","+_o.entity.to_longitude+"</br>"; 	
 	      html+= "<table>"
	      html+= "<tr><td>Длина дистанции (метров):</td><td>"+"<input type=number id=distance-exception-length class=\"distance-exception-length form-control\" onkeypress='return event.charCode >= 48 && event.charCode <= 57' value=\""+_o.entity.length+"\"</input>"+"</td>"; 	
	      html+= '<td><a class="btn btn-app distance-exception-click"  track-id="'+_o.entity.track_id+'" role="distance" title="Сохранить длину дистанции" data-toggle="tooltip" data-placement="bottom" data-original-title="Сохранить" style="height:unset; width: 2.4rem; padding: 5px; margin: unset; min-width:unset; max-width:unset;"><i class="fas fa-save"></i></a></td>'
	      html+= '<td><i class="distance-exception-result fas " role="distance" title=""></i></td>'
	      html+= '<td><div class="distance-exception-loading-spin" role="distance" ></div></td>'
	      html+= '</tr>'
	      html+= "<tr><td>Время дистанции (секунд):</td><td>"+"<input type=number id=distance-exception-duration class=\"distance-exception-duration form-control\" onkeypress='return event.charCode >= 48 && event.charCode <= 57' value=\""+_o.entity.duration+"\"></input>"+"</td>"; 	
	      html+= '<td><a class="btn btn-app distance-exception-click" track-id="'+_o.entity.track_id+'" role="duration" title="Сохранить время на маршруте" data-toggle="tooltip" data-placement="bottom" data-original-title="Сохранить" style="height:unset; width: 2.4rem; padding: 5px; margin: unset; min-width:unset; max-width:unset;"><i class="fas fa-save"></i></a></td>'
	      html+= '<td><i class="distance-exception-result fas " role="duration" title=""></i></td>'
	      html+= '<td><div class="distance-exception-loading-spin" role="duration" ></div></td>'
	      html+= '</tr>'                                                   
	      html+= '<tr><td>Статус дистанции:</td><td><b>'+((_o.entity.status=='HAND') 
			? 'Установлено вручную'
			: (_o.entity.status=='ERROR') ? 'Неопределено геокодером' 
			: (_o.entity.status=='OK') ? 'Определено геокодером' : 'Статус неизвестен')+'</b></td></tr>'
	      html+= '<tr><td>Тип перемещения:</td><td><b>'+_o.entity.mode+'</b></td></tr>'
 	      html+= "</table>"
	      html+= "Параметры установлены: <b>"+(_o.entity.user_id == null ? 'СИСТЕMОЙ' : 
		_o.entity.name + "</br>"+"("+_o.entity.user_id +")"
		)+"</b></br>"; 	
	      html+= "Cоздано: "+_o.entity.created+"</br>"; 	
	      html+= "Обновлено: "+_o.entity.updated+"</br>"; 	
	} else  
	   html+= "Нет подробных данных о данной дистанции!</br> Произведите перерасчет маршрутного листа."; 	
          new infoDialog().info('Информация о дистанции', html);
  	      $(".distance-exception-click").click(function(){
		let _o = this;
		  $("div.distance-exception-loading-spin[role="+$(this).attr('role')+"]").show();
  		      let _data = $(this).attr('role') == 'distance'
			 	 ? { distance : $('.distance-exception-length').val() }
				 : { duration : $('#distance-exception-duration').val() };
		  $("i.distance-exception-result[role="+$(_o).attr('role')+"]").removeClass("fa-check").removeClass("fa-exclamation-triangle");
		        $.ajax({
			  url: "/trip/distance/"+$(this).attr('track-id')+"/"+$(this).attr('role'),
		 	  cache: false,
			  method: "POST", 
			  data: ($(this).attr('role') == 'distance')
			 	 ? { value : $('.distance-exception-length').val() }
				 : { value : $('#distance-exception-duration').val() }, 
			  dataType: "json",
			  success: function(){ // если запрос успешен вызываем функцию
				console.log('success');
		  	        $("div.distance-exception-loading-spin[role="+$(_o).attr('role')+"]").hide();
	  	  	        $("i.distance-exception-result[role="+$(_o).attr('role')+"]").addClass("fa-check").addClass("green");
				$("i.distance-exception-result[role="+$(_o).attr('role')+"]").attr('title', 'Сохранено');
			  },
			  error: function(){ // если запрос успешен вызываем функцию
				console.log('error');
		  	        $("div.distance-exception-loading-spin[role="+$(_o).attr('role')+"]").hide();
				$("i.distance-exception-result[role="+$(_o).attr('role')+"]").addClass("fa-exclamation-triangle").addClass("red");
				$("i.distance-exception-result[role="+$(_o).attr('role')+"]").attr('title', 'Не сохранено');
			  }
		     }).done(
		  function() {}
  	        );	
	});

    },'json');	  
  }

  getIcon(action) {
     switch(action){
      case 'ERROR': return '<i class="fas red fa-exclamation-triangle" title="Ошибка расчета"></i>';
      case 'HAND' : return '<i class="fas green fa-eye" title="Дистанция выставлена координатором вручную"></i>';
      default :
         return '<i class="fas green fa-check" title="Расчет произведен"></i>';
      }
  }

  get() {
   let html='';
   let distance_sum=0;
   let user_distance_sum=0;
   let duration_sum=0;
   let o = this;
    $.get('/trip/report/'+this.prop.user_id+'/'+this.prop.date, null, function(_o) {
     console.log(_o);
     if(_o.resultCode == '0') {
       o.o = _o;
       console.log(_o);
       $('span.trip-report-person-name-value').html(_o.userName);
       $('span.trip-report-date-value').html(_o.dateTrip);
       $('span.trip-report-org-name-value').html(_o.orgName);
       $('span.trip-report-group-name-value').html(_o.groupName);
       $('span.trip-report-location-name-value').html(_o.location);
       if(_o.waybill.length > 0) {
	$.each(_o.waybill, function(k,v){
	 html+='<tr '+
                (v.status == 'ERROR' ? ' class="red" ' : '')
		+'>'
		+'<td class="text-center">'+(k+1)+'</td>'
		+'<td class="text-center">'+v.time_trip+'</td>'
		+'<td class="text-center">'+v.id+'</br>'+'</td>'
		+'<td class="text-center">'+v.object_search_code+'</td>'
		+'<td class="text-center">'+v.transp_type+'</td>'

		+'<td class="text-center">'+v.description+'</td>'
		+'<td class="text-left">'+v.address_from+'</td>'
		+'<td class="text-left">'+v.address_to+'</td>'

		+'<td class="text-center">'+v.distance+'</td>'
		+'<td class="text-center">'+v.user_distance+'</td>'
		+'<td class="text-center">'+v.duration+'</td>'
		+'<td class="text-center">'
		+o.getIcon(v.status)
		+'</td>'
		+'<td class="text-center"><a class="btn btn-app distance-exception" track_id="'+v.track_id+'"'
                +' data-toggle="tooltip" data-placement="bottom" data-original-title="Добавить в исключения" style="height:unset; width: 2rem; padding: 5px; margin: unset; min-width:unset; max-width:unset;">+</a></td>'
		+'</tr>';
                distance_sum+=v.distance;
		user_distance_sum+=v.user_distance;
		duration_sum+=v.duration;
	 });	


        let hh = Math.trunc((duration_sum)/3600);       console.log(hh);
        let mm = Math.trunc((duration_sum-hh*3600)/60); console.log(mm);
        let ss = Math.trunc(duration_sum-hh*3600-mm*60);console.log(ss);

        let hhmmss= (hh  ? hh+'&nbsp;ч.': '');
            hhmmss+= (mm ? mm+'&nbsp;м.': '');

	html+='<tr>'
		+'<td colspan=8 style="text-align:right;padding-right: 5rem; font-size: 24px; font-weight: 400">Итого:</td>'
		+'<td class="text-center"><b>'+(Math.round(distance_sum*1000)/1000)+'</b></td>'
		+'<td class="text-center"><b>'+(Math.round(user_distance_sum*100)/100)+'</b></td>'
		+'<td class="text-center"><b>'+(Math.round(duration_sum*100)/100)+'</b></br>('+hhmmss+')</td>'
		+'<td class="text-center"></td>'
		+'<td rowspan=1 class="text-center"><a class="btn btn-app" '
		+' data-toggle="tooltip" data-placement="bottom" data-original-title="Просмотр трека" style="height:unset; width: 2.4rem; padding: 5px; margin: unset; min-width:unset; max-width:unset;"><i class="fas fa-map" ></i></a></td>'
		+'</tr>';
		$('table#table_trip_report tbody.trip-report').append(html);
	    } else {
	  html+='<tr><td colspan=10><center><h2>Нет данных по пробегу за '+o.prop.date+'</h2></center></td></tr>';
 	  $('table#table_trip_report').append(html);
	}
        console.log(o);

        } else {
          new infoDialog().error('Получение информациии о поездке', "При получении возникла ошибка - повторите операцию!" );
        }
	  $('.scrollbar-inner').scrollbar(); // реинициализируем скролл
 	  console.log('.scrollbar-inner');
	 $('a.distance-exception').off('click').on('click', function(e){
		   let track_id = $(this).attr('track_id');
		   console.log(track_id);
   		   o.distanceException(track_id)
	     });

     },'json');


    return this;
   }

 }
