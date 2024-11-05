
 $(function(){
 try{
	 console.log('RolesComponent loading....');
	  new RolesComponent(
	   $('#profile-form').attr('user-id'),
	{
	    limit: 10,  
	    url:  "/access/roles",
	    switcherUrl : "/access/roles/set",
	    tableElement : ".profile-access-roles tbody",
	    paginationElementPoligon : ".profile-access-roles-navigation"
	   }
	 );

 } catch(err) {
      console.log(err);
 }
}
);