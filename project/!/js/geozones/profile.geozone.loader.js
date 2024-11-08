/* Модуль загрузки компонента */
jQuery(document).ready(function(){
 console.log('GeozonesComponent loading....');
  ymaps.ready(()=>{
   $( "#tabs" ).tabs(); 
 try{
  let me = new Me();
//  console.log('sGridComponent loading....');
//     me.initialization(()=>{
	 new GeozonesComponent(
         $('#profile-form').attr('user-id'),
	{
	    limit: 10,  
	    url:  "/geozones/autocomplete",
	    switcherUrl : "/access/geozones/set",
	    getGeoZone : "/geozones",
	    tableElement : ".profile-access-geozones tbody",
	    paginationElementPoligon : ".profile-access-geozones-navigation"
	  }
	);
//    }
//  ).get();
 } catch(err) {
      console.log(err);
 }
});


 $('button.modal-geozone-dialog-click').off('click').on('click', function(e){
    e.preventDefault();  	
    let addNewGeoZone = new inputDialog({
         target: ".modal-geozone-dialog-click",   
         elementName: "new-geozone-name",
         type:"text",
         title:"Добавить новую геозону",
         placeholder:"Введите имя геозоны",
         buttonName:"Добавить"
       }, function(elementValue){
	      e.preventDefault();  	
		$(".loading").show();
		$.ajax({
		  url: "/geozones/add",
	 	  cache: false,
		  method: "POST",
		  dataType: "json",
	          data: {"name": elementValue},
		  success: function(o){ // если запрос успешен вызываем функцию
       		        console.log(o);
	   	        $(".loading").hide();	
		         toastr.success('Создана новая геозона '+$("#new-geozone-name").val(), 'Геозоны', {timeOut: 3000});
		  },
		  error: function(o){ // если запрос успешен вызываем функцию
	   	     console.log(o);
     		     $(".loading").hide();
		         toastr.error('Возникла ошибка при создании геозоны', 'Геозоны', {timeOut: 3000});
		  }
	   }).done(function() {});

    }).show();
  });

});