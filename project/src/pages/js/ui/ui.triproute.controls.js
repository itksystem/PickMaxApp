/*
  Библиотека отражения пользователя на карте
  Синягин Д.В. 30-09-2022 (с)
*/

class TripRouteControls{
     storage    = null;
     storageTag = "TripRouteControls";
     elClass = 'trip-route-control-buttons';
     elHTML  = '<div class="'+this.elClass+'"></div>';


    constructor() {
    try{
       console.log('Start '+this.storageTag+' creating...');
       $('.trip-control-buttons-container').append(this.elHTML);
       }catch(e){
        console.log(e);
      }
      return this;
    }


  bigButton(p,
  callback = null){
    try{
	$('.'+this.elClass).append(
	'<button type="button" class="btn btn-default trip-control-button '+ ((p.unselected==true) ? '' : ' selected ')+p.class+'"'
		+'>'
		+'<i class="fas '+p.icon[0].name+'" style="color:'+p.icon[0].color+';"'
		+' data-toggle="tooltip" data-placement="bottom" data-original-title="'+p.hint+'"'
		+'></i>'
		+'<i class="fas '+p.icon[1].name+'" style="color:'+p.icon[1].color+' padding: 0 0.2rem;"'
		+' data-toggle="tooltip" data-placement="bottom" data-original-title="'+p.hint+'"'
		+'></i>'
		+'<i class="fas '+p.icon[2].name+'" style="color:'+p.icon[2].color+';"'
		+' data-toggle="tooltip" data-placement="bottom" data-original-title="'+p.hint+'"'
		+'></i>'
	+'</button>'


	); 	
	if(callback!=null){
	   $(document).off('click','.'+p.class).on('click','.'+p.class, function(e){
    	     if(!p.unselected) {
	       if(!$('.'+p.class).hasClass('selected')) {
	               $('.'+p.class).addClass('selected');
  	          } else	
	        $('.'+p.class).removeClass('selected');	
		}
		callback(p);
       	    }); 	
         }
       }catch(e){
      console.log(e);
    }
    this.hintHide();
    $('[data-toggle="tooltip"]').tooltip();
    return this;
  }


  separator(){
    try{
	$('.'+this.elClass).append('<span>&nbsp;|&nbsp;</span>'); 	
       }catch(e){
      console.log(e);
    }
    return this;
  }

  button(p,
  callback = null){
    try{
	$('.'+this.elClass).append(
	'<button type="button" class="btn btn-default trip-control-button '
	+ ((p.unselected==true) ? '' : ' selected ')+p.class+'"'	
	+' ><i class="fas '+p.icon+'" '
	+' data-toggle="tooltip" data-placement="bottom" data-original-title="'+p.hint+'" '
	+' style="color:'+p.color+';"></i></button>'); 	
	if(callback!=null){
	   $(document).off('click','.'+p.class).on('click','.'+p.class, function(e){
    	     if(!p.unselected) {
	       if(!$('.'+p.class).hasClass('selected')) {
	               $('.'+p.class).addClass('selected');
  	          } else	
	        $('.'+p.class).removeClass('selected');	
		}
		callback(p);
       	    }); 	
         }
       }catch(e){
      console.log(e);
    }
    this.hintHide();
    $('[data-toggle="tooltip"]').tooltip();
    return this;
  }

  click(p, callback){
   try{
    $('.'+p.class).off('click').on('click', function(e){
      if($('.'+p.class).hasClass('selected')) {
         $('.'+p.class).addClass('selected');
      } else	
        $('.'+p.class).removeClass('selected');	
	callback(p);
      }); 	
     } catch(e) {
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

   hintHide() {
    try {
         $('[data-toggle="tooltip"]').mouseout(function(e){
	       $('.tooltip.show[role="tooltip"]').remove();      
         });
       } catch(e) {
         console.log(e);
    }
    return this;
  }

 }

