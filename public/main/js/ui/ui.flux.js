/* Модуль контроля и отправки статистики */
/* Синягин Д.В. 29-01-2022 		*/

class flux{
     storage    = null;
     storageTag = "flux";

     constructor(onclick=true) {
      console.log('Start flux service...');
    if(onclick==true)
      this.listner();
    }

   listner(){ // слушаем клики и обновляем sessionStorage
     let o = this;
      $('*[flux=true]').on("click",function(e) {
	console.log('flux ' +$(this).attr('flux-event-name')+' '+$(this).attr('flux-event-code'));
	let name =  $(this).attr('flux-event-name');
	let code =  $(this).attr('flux-event-code');
	$.ajax({url: "/flux/"+name+"/"+code, cache: false, method: "GET"}).done(function() {} );
      });
   }

   onload(name=null,code=null){ // слушаем клики и обновляем sessionStorage
      $.ajax({url: "/flux/"+name+"/"+code, cache: false, method: "GET"}).done(function() { console.log('flux.onload');} );
   }

 }
