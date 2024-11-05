    new ModalDialog('modal-role-delete')
     .Prop({size : "middle" , draggable : true })
     .Header('Удалить роль?', {backgroundColor: '#343a40', color: '#aaaaae'})
     .Body('<div style="font-size: 1rem;line-height: 1.4;"><div class="row"><div class="col-sm-3">'
       +'<img src="/main/images/trash.png" style="width:4rem; margin: 0.4rem; margin-left: 3rem;"></div>'    
       +'<div class="col-sm"><span style="font-size: 1.1rem;"><span>Вы хотите удалить роль?<br>'
       +'<b>'+ role_name+'</b>'
       +'</span></div></div></div>')
     .Footer({ "ok": "Да", "close": "Нет"})
     .Handler(()=>{
 	      $("#modal-role-delete-dialog").remove();
	      $(".modal-backdrop").remove();
  }).create().show();