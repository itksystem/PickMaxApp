/*  Компонента установки кнопок согласования пробегов */

class ApproveTripButtonComponent{
    storage    = null;
    storageTag = "ApproveTripButton";

    constructor(prop) {
//      console.log('Start '+this.storageTag+' creating...');
//      console.log(prop);
      this.prop=prop;
    }


     UnApproveButtonView(){ // Рассогласованный статус
         let visible = (this.prop.state == 0) ? true : false;
	 return  '  <div class="row">'
		+'     <div class="col-sm">'
		+'       <button type="button"  class="btn btn-outline-success btn-block servicecalls-approve-click '+((visible) ? '' : 'd-none')+'" rel="trip" call-id="'+this.prop.id+'"><i class="fa fa-check"></i>Да</button>'
		+'    </div>'
		+'    <div class="col-sm">'
		+'        <button type="button"  class="btn btn-block btn-outline-danger servicecalls-reject-click '+((visible) ? '' : 'd-none')+'" rel="trip" call-id="'+this.prop.id+'"><i class="fa fa-ban"></i>Нет</button>'
		+'   </div>'
		+'  </div>';
     }

    ApproveButtonView(){
         let visible = (this.prop.state >= 1) ? true : false;
         return  '  <div class="row">'
   	   +'     <div class="col-sm">'
	   +'       <button type="button" class="btn btn-block btn-success servicecalls-approved-button '+((visible) ? '' : 'd-none')+'" rel="trip" state="approved" call-id="'+this.prop.id+'"><i class="fa fa-check"></i>&nbsp;Транспортные расходы учтены</button>'
	   +'    </div>'                                                                                                    
	   +'  </div>';
     }

     RejectedButtonView(){
         let visible = (this.prop.state == -1) ? true : false;
         return  '  <div class="row">'
  	   +'    <div class="col-sm">'
	   +'        <button type="button" class="btn btn-block btn-danger servicecalls-rejected-button '+((visible) ? '' : 'd-none')+'" rel="trip" state="rejected" call-id="'+this.prop.id+'"><i class="icon fas fa-ban"></i>&nbsp;Нет транспортных расходов </button>'
	   +'   </div>'
	   +'  </div>';
     }

     render() {
       return '<div class="w-100">'+this.UnApproveButtonView()+this.ApproveButtonView()+this.RejectedButtonView()+'</div>';
   }

 }



class ApproveTripButtonComponentController{
    storage    = null;
    storageTag = "ApproveTripButtonComponentController";

    constructor() {
      console.log('Start '+this.storageTag+' creating...');
      this.listner(); 	
    }

     listner(){
       let o = this;
       $('.servicecalls-approve-click, .servicecalls-reject-click, .servicecalls-approved-button, .servicecalls-rejected-button')
	.off('click')
	.on('click',
	   function(e){
		let state = '';
		if($(this).hasClass("servicecalls-approved-button") ||$(this).hasClass("servicecalls-rejected-button")) {
		   state='unapproved';
  		   e.preventDefault();  	
          	   new ModalDialog('modal-approved-status-edit')
		      .Prop({size : "middle" })
		      .Body('<div style="font-size: 1rem;line-height: 1.4;"><div class="row">'
			+'<div class="col-sm-3"><img src="/main/images/underconstruction.png" style="height: 120px;"></div>'
			+'<div class="col-sm"><div class="w-100 h-100">'
			+'<span style="font-size: 1.3rem;">Вы по запросу <b>'+$(this).attr('call-id')
			+'</b> можете рассогласовать поездку, </br> для проведения корректировок и нового согласования </br>  поездки.</span>'
			+'</div>'
			+'</div></div></div>')
        	      .Footer({"ok":"Рассогласовать","close": "Закрыть"})
		      .Handler(()=>{
			   o.change($(this).attr('call-id'), state);
			   $("#modal-approved-status-edit-dialog").remove();
			   $(".modal-backdrop").remove();
	               }).create().show();
		   } else {
			if($(this).hasClass("servicecalls-approve-click"))   state='approved';
			if($(this).hasClass("servicecalls-reject-click"))    state='rejected';
		        o.change($(this).attr('call-id'), state);
         	   }
    	      }
	  );
     }   

     change(id, state, update = true){
      console.log(id, state);
	switch(state){
	   case 'approved' : {
		  $('.servicecalls-approve-click[call-id="'+id+'"]').addClass('d-none');
		  $('.servicecalls-reject-click[call-id="'+id+'"]').addClass('d-none');
		  $('.servicecalls-trip-approved-button[call-id="'+id+'"]').addClass('d-none');

		  $('.servicecalls-approved-button[call-id="'+id+'"]').removeClass('d-none');
		  $('.servicecalls-rejected-button[call-id="'+id+'"]').addClass('d-none');
		  break;
		}
	  case  'rejected' : {
		  $('.servicecalls-approve-click[call-id="'+id+'"]').addClass('d-none');
		  $('.servicecalls-reject-click[call-id="'+id+'"]').addClass('d-none');
		  $('.servicecalls-trip-approved-button[call-id="'+id+'"]').addClass('d-none');

		  $('.servicecalls-approved-button[call-id="'+id+'"]').addClass('d-none');
		  $('.servicecalls-rejected-button[call-id="'+id+'"]').removeClass('d-none');
		  break;
		}
	  case  'unapproved' : {
		  $('.servicecalls-approve-click[call-id="'+id+'"]').removeClass('d-none');
		  $('.servicecalls-reject-click[call-id="'+id+'"]').removeClass('d-none');
		  $('.servicecalls-trip-approved-button[call-id="'+id+'"]').removeClass('d-none');

		  $('.servicecalls-approved-button[call-id="'+id+'"]').addClass('d-none');
		  $('.servicecalls-rejected-button[call-id="'+id+'"]').addClass('d-none');

		  break;
		}
   	   }
   	  if(update){
	    $.post('/trip/approval/'+id+'/'+state, null, function(o) {
		if(o.resultCode == '0') {
	 	} else {
      	        new infoDialog().error('Установка статуса поездки', "При установке статуса поездки возникла ошибка - повторите операцию!" );
	      }
	   },'json');
	}
     }	

}