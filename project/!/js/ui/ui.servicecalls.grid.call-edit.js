class CallEditDialog {
        constructor(o) {
             let title =($(o).attr("call-id")) ? 'Управление запросом ['+($(o).attr("call-id"))+']' : 'Создание нового запроса'; 
             new ModalDialog('modal-call-edit').Prop({size : "extra" , draggable : true })
 	        .Header(title, {backgroundColor: '#343a40', color: '#aaaaae'} )
	        .Footer({ "ok": "Сохранить","close":"Закрыть"}).Handler(()=>{
		     let form = $('#call-editor-dialog-form');
		     let callId=$(o).attr("call-id");	
			$.ajax({
			  url: "/servicecalls/"+$(o).attr("call-id")+"/save", cache: false, method: "POST",
			  dataType: "json",
		          data: form.serialize(),
			  success: function(o){ // если запрос успешен вызываем функцию

			/* меняем данные динамически */
				$("div.finishdate").html($('#call-finishdate').val());
				$("tr[call-id="+callId+"] a[rel=person]").html($('#call-person  option:selected').text());
				$("tr[call-id="+callId+"] a[rel=person]").attr('user-id',$('#call-person  option:selected').val());

				$("tr[call-id="+callId+"] div[rel=group_id]").html($('#call-workgroup option:selected').text());
				$("tr[call-id="+callId+"] div[rel=group_id]").attr('group-id',$('#call-workgroup option:selected').val());

				$("tr[call-id="+callId+"] div[rel=person]").html($('#call-person option:selected').text());
				$("tr[call-id="+callId+"] div[rel=person]").attr('user-id',$('#call-person option:selected').val());

				$("tr[call-id="+callId+"] span[rel=locator_id]").html(
					($('#call-person option:selected').attr('locator-id')=='null')
					   ? ''
					   : $('#call-person option:selected').attr('locator-id')
				);

				$("tr[call-id="+callId+"] div[rel=trip]").html($('#call-mileage').val());

				$("tr[call-id="+callId+"] span[rel=mode]").html($('#call-mode option:selected').text());
				$("tr[call-id="+callId+"] span[rel=mode]").attr('mode-id',$('#call-mode option:selected').val());

				$("tr[call-id="+callId+"] div[rel=object_search_code]").html($('#call-object-searchcode').val());

		      	        new infoDialog().success('Изменения сохранены!', "Изменения в запросе сохранены!" );
			
		  	    },
			  error: function(o){ // если запрос успешен вызываем функцию
		   	     console.log(o);
				alert('Ошибка при сохранении!');			
			  }
			}).done(function() {});
		 }).create()
  	        .bodyLoader({url: "/modal/servicecalls/"+$(o).attr("call-id")+"/edit"})
	        .show();
           return this;
        }
}
