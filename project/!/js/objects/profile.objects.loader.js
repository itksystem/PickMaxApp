
 $(function(){
  ymaps.ready(()=>{
 try{
  let me = new Me();
  console.log(me);
  console.log('sGridComponent loading....');
//  me.initialization(()=>{
//	 console.log('ObjectsComponent loading....');
	  new ObjectsComponent(
//	   me.userId,
         $('#profile-form').attr('user-id'),
	 {
	    coder : "yandex",
	    limit: 10,  
	    url:  "/object/autocomplete",
	    geoUrl: "/geozones/autocomplete",
	    switcherUrl : "/access/object/set",
	    getObject : "/object",
	    tableElement : ".profile-access-objects tbody",
	    paginationElementPoligon : ".profile-access-objects-navigation"
	  }
	);
//    }
//   ).get();
    } catch(err) {
      console.log(err);
    }
  })
});