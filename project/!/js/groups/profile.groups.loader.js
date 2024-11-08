 $(function(){
 try{
  let me = new Me();
     new GroupsComponent(
	   $('#profile-form').attr('user-id'),
	  {
	   limit: 10,  
	    url:  "/access/groups",
	    switcherUrl : "/access/groups/set",
	    tableElement : ".profile-access-group tbody",
	    paginationElementPoligon : ".profile-access-group-navigation"
	}
     )
   } catch(err) {
      console.log(err);
 }
}
);

