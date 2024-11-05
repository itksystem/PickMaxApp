class ObjectEditDialog {
        constructor(o) {
		 let globalMessage = new  globalMessages();  // Локализация мессаджей
	         new ModalDialog('modal-object-edit').Prop({size : "super" , draggable : false })
 	           .Header('Управление обьектом ( запрос № '+$(o).attr("call-id")+')',{backgroundColor: '#343a40', color: '#aaaaae'})
       		   .Footer({ "ok": globalMessage.get(globalMessage.glob.SAVE_BUTTON), "close": globalMessage.get(globalMessage.glob.CLOSE_BUTTON)})
		   .Handler(()=>{
		      var form = $("#object-change-form");
		      let data = new Object;
		      let storage = new sessionStorageClass();
    		      let geoPoints = storage.getObject("object-properties-component-track");
  		      $.each(form.serializeArray(), function(i,v){ data[v.name]=v.value; });

		            data['geopoints'] = geoPoints;
			    data.worktime=storage.getObject("STORAGE_OBJECT_WORK_TIME_ARRAY");
			    data.servicetime=storage.getObject("STORAGE_OBJECT_SERVICE_TIME_ARRAY");
			    $(".loading").show();
				  $.ajax({
				  url: "/object/save/"+data.object_id,
			 	  cache: false,
				  method: "POST",
				  dataType: "json",
			          data: data,
				  success: function(o){ // если запрос успешен вызываем функцию
			   	    $(".loading").hide();
			   	     new infoDialog().success('Сохранение данных обьекта', "Успешное сохранение данных по обьекту!" );
				   },
				    error: function(o){ // если запрос успешен вызываем функцию
			     	     $(".loading").hide();
				     new infoDialog().error('Сохранение данных обьекта', "При сохранении данных по обьекту возникла ошибка!" );
				    } 
			     }).done(function() {});
   	       	       }).create()
  	           .bodyLoader({url: "/modal/object/"+$(o).attr("object-id")+"/"+$(o).attr("call-id")})
	           .show();                 
           return this;
        }
}
