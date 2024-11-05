
$(document).ready(function() {
  $( "#tabs" ).tabs();  // включаем jquier tab component
    console.log(document.location.href);
    $.getJSON("/user/"+$("#profile-form").attr('user-id'), function( data ) {  
	console.log('PROFILE USER',data, $("#profile-form").attr('user-id'));
        if(data.resultCode == 1){ // новый пользователь
		data.entity = {};
		data.entity.user = {};
		data.entity.user.id = $("#profile-form").attr('user-id');
		data.entity.user.name = '';
		data.entity.user.search_code= $("#profile-form").attr('user-id');
		data.entity.user.photo ='';
		data.entity.user.group_id = "daaa09c1-1345-11ec-aecd-0242ac140003";
		data.entity.user.org_id = "4a507d6a-13f4-11ec-beff-0242ac140003";
		data.entity.user.blocked =  0;
		data.entity.user.last_activity = '';
		data.entity.user.local_address = {};
		data.entity.user.local_address.timezone = 2;
		data.entity.user.local_address.address ="Москва, Красная площадь, 7";
		data.entity.user.local_address.latitude = 55.752483;
		data.entity.user.local_address.longitude = 37.623121;
        }	
	$("#fio").val(data.entity.user.name);
	$("#access_id").val(data.entity.user.access_id);
	$("#email").val(data.entity.user.email);
	$("#phone").val(data.entity.user.phone);
	$('span[type="UserId"]').text(data.entity.user.id);
	$('span[type="last_activity"]').text(data.entity.user.last_activity);
	$('#timezone').val(data.entity.user.local_address.timezone);
	$('#search_code').val(data.entity.user.search_code);
	$('#address').val(data.entity.user.local_address.address);
	$('#latitude').val(data.entity.user.local_address.latitude );
	$('#longitude').val(data.entity.user.local_address.longitude);
	$('#blocked').prop("checked",(data.entity.user.blocked == 0 ? false : true ));
	$('#password').val('');

        let orgDefault = data.entity.user.org_id; // неопознанные обьекты
        $.getJSON("/org/getOrgs", function(data) {  
	   let e = '';
	      $.each(data, function(i, v) {
   	         e+="<option value=\""+v.organization_id+"\" "+((v.organization_id==orgDefault) 
			? "selected" : "")+" >"
			+v.organization_name+"</option>";
   	     });			
            $('#organization_id').html("<select id=\"organization_id\" name=\"organization_id\">"+e+"</select>");
        });

        let groupDefault = data.entity.user.group_id; // неопознанные обьекты
        $.getJSON("/org/getGroups/"+orgDefault, function(data) {  
      	  let e = '';
	     $.each(data, function(i, v) {
   	         e+="<option value=\""+v.group_id+"\" "+((v.group_id==groupDefault) 
			? "selected" : "")+" >"
			+v.group_name+"</option>";
   	     });			
            $('#group_id').html("<select id=\"group_id\" name=\"group_id\">"+e+"</select>");
        });


    $("#profile-form").off('change','#organization_id').on('change', '#organization_id', function(e) {
	$.ajax({
	  url: "/org/getGroups/"+this.options[this.selectedIndex].value,
 	  cache: false,
	  method: "GET",
	  dataType: "json",
	  success: function(o){ // если запрос успешен вызываем функцию
   	     console.log(o);
	     var e;	
	     $.each(o, function(i, v) {
   	         e+="<option value=\""+v.group_id+"\">"+v.group_name+"</option>";
   	     });			
            $('#group_id').html("<select id=\"group_id\" name=\"group_id\">"+e+"</select>");
	  }
	}).done(
      function() {}
      );

   
      });

    $("#profile-save-button").off("click").on("click",  function(e) {
    e.preventDefault();  	
    var form = $("#profile-form");
	$(".loading").show();
	$.ajax({
	  url: "/user/save/"+$("#profile-form").attr("user-id"),
 	  cache: false,
	  method: "POST",
	  dataType: "json",
          data: form.serialize(),
	  success: function(o){ // если запрос успешен вызываем функцию
       	    console.log(o);
   	    $(".loading").hide();		
   	    $('.fio-title[rel="'+$("#profile-form").attr("user-id")+'"]').text($("#fio").val());
            new infoDialog().success('Сохранение данных пользователя', "Успешно!" );
	  },
	  error: function(o){ // если запрос успешен вызываем функцию
   	     console.log(o);
     	     $(".loading").hide();
	     new infoDialog().error('Сохранение данных пользователя', o.responseJSON.resultMessage );
	  }

	}).done(function() {});


});

// Загрузка карты 

ymaps.ready(()=>{
  let mapPoligon = new Map('map');  // инициализация карта
   mapPoligon.init();
   let latitude  = (parseFloat($('#latitude').val()).toFixed(6)  != 0 ? parseFloat($('#latitude').val()).toFixed(6)  : 55.755864 );
   let longitude = (parseFloat($('#longitude').val()).toFixed(6) != 0 ? parseFloat($('#longitude').val()).toFixed(6) : 37.617698 );
   if($("#profile-form").attr('user-id')=='') $('#address').val('Москва');

   let ya = new geoCompleteInput();   // инициализация элемента geoCompleteInput
   ya.initMap(mapPoligon.Map);       // линкуем к карте 



   ya.geoComlpete('address');        // цепляем элемент выбора адреса
   ya.setCenter([latitude, longitude]) // переводим цент карты
     .setMarker([latitude, longitude], // ставим маркер
	{ hintContent:  'Переместите маркер на точку выезда сотрудника'
	 // ,balloonContent:  'Это красивая метка'
        }
     );
// Элемент управляет маркером на карте и при его переносе выполняет установку в нужные поля широты и долготы 
   ya.trigger('dragend', (e)=>{
	$('#latitude').val(parseFloat(e.getLatitude()).toFixed(6));
	$('#longitude').val(parseFloat(e.getLongitude()).toFixed(6));
     });
   });


  upFile = new uploadFile();
  upFile.render('.profile-photo-load-poligon');
       $('[data-toggle="tooltip"]').tooltip();

   });

});



