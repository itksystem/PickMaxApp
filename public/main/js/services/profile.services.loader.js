 $(function(){
 try{
	  console.log('ServicesComponent loading....');
	  new ServicesComponent(
	   $('#profile-form').attr('user-id'),
	   {
	    limit: 10,  
	    url:  "/access/services",
	    switcherUrl : "/access/services/set",
	    tableElement : ".profile-access-services tbody",
	    paginationElementPoligon : ".profile-access-services-navigation"
	  }
	);
      } catch(err) {
      console.log(err);
   }  
}
);