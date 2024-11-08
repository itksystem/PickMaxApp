class _ajax{
      constructor() {
      console.log('Start _ajax creating...');
    }

   prop(p){
     this.url = p.url;
     this.dataType = p.dataType;
     return this;
   } 	

   error(){
     return this;
   }
   

   GET(callback){
     	$(".loading").show();
	$.ajax({
	  url: this.irl,
 	  cache: false,
	  method: "GET",
	  dataType: "text",
	  success: function(o){ // если запрос успешен вызываем функцию
	        this.html = o;
		$(".loading").hide();
		callback();
	  }
	}).done(
	      function() {
   	   return this;
	 }
        );
     return this;
   }
   
   render(el){
	$(el).html(o);
     return this;  
  }
 }




