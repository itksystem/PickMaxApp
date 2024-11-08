
  console.log('FunctionsComponent loading....');
  new FunctionsComponent(
	   $("#profile-form").attr("user-id"), {
	   limit: 10,  
	    url:  "/access/functions",
	    switcherUrl : "/access/functions/set",
	    tableElement : ".profile-access-function tbody",
	    paginationElementPoligon : ".profile-access-function-navigation"
	}
  );


