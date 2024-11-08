class ObjectCreateDialog {
        constructor(o) {
  	    let globalVar = new  globalMessages();  // Локализация мессаджей
       	    new ModalDialog('modal-object-new')
		   .Prop({size : "middle" , draggable : true })
 	           .Header('Создать новый обьект?',{backgroundColor: '#343a40', color: '#aaaaae'})
 		   .Body('<div style="font-size: 1rem;line-height: 1.4;"><div class="row"><div class="col-sm-3"><img src="/main/images/underconstruction.png" style=""></div>'    
	                +'<div class="col-sm"><span style="font-size: 1.1rem;"><span>В запросе присутствует идентификатор обьекта ('+$(o).html()+'), который отсутствует в системе.</br>'
  		        +'Создать новый обьект и внести его в запрос?<br>'
		        +'</span></div></div></div>')
		   .Footer({ 
			  "ok"   : globalVar.get(globalVar.glob.CREATE_BUTTON), 
			  "close": globalVar.get(globalVar.glob.CLOSE_BUTTON)})
		   .Handler(()=>{
	 	     $(".modal-backdrop").remove(); // удаляем модальный бакдор
	  	     new ModalDialog('modal-object-edit').Prop({size : "super" , draggable : false })
	 	     .Header( globalVar.get(globalVar.glob.OBJECT_MANAGE_TITLE), { backgroundColor: '#343a40', color: '#aaaaae' })
 	             .Footer({
                          "ok"   : globalVar.get(globalVar.glob.SAVE_BUTTON), 
                          "close": globalVar.get(globalVar.glob.CLOSE_BUTTON)})
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
				  url: "/object/save/"+data.object_id+"?call-id="+$(o).attr("call-id"), // сохранение с перезапиью обьекта в запросе
			 	  cache: false,
				  method : globalVar.WebApi.WEBAPI_OBJECT_SAVE.method,
				  dataType: "json",
			          data: data,
				  success: function(o){ // если запрос успешен вызываем функцию
				   	    $(".loading").hide();
				   	     new infoDialog().success(
					 	globalVar.get(globalVar.glob.OBJECT_SAVE_TITLE), globalVar.get(globalVar.glob.OBJECT_SAVE_SUCCESS_DESCRIPTION));
					      },
			          error: function(o){ // если запрос успешен вызываем функцию
				   	     $(".loading").hide();
					     new infoDialog().error(
						 globalVar.get(globalVar.glob.OBJECT_SAVE_TITLE), globalVar.get(globalVar.glob.OBJECT_SAVE_ERROR_DESCRIPTION));	
					    } 
				     }).done(function() {});
   		       	       }).create()
                           .bodyLoader({url: "/object/"+$(o).attr("object-id")+"/edit?call-id="+$(o).attr("call-id")})
		           .show();
		   }).create()
  	           .show();
           return this;
        }

}
