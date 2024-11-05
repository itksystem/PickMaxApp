class uploadFile {
     storage = null;
     storageTag = "uploadFile";

   constructor() {
      console.log('Start '+this.storageTag+' creating...');
    }

    exist(e){
      return ($(e).length) ? true : false;
    }


   render(el){
    this.handler()
   }

   handler(){
     $('#fileupload').fileupload({
        url: $("#fileupload").attr('action'),
        dataType:'json',
        autoUpload: true,
        sequentialUploads:true,
        acceptFileTypes:/(\.|\/)(gif|jpe?g|png)$/i,

          done: function (e, data) {  
		console.log(data); 
	   if(data._response.result.status == 'error') {
	 	  new infoDialog().error('Ошибка',  data._response.result.errors);
    		}
		else {
		$(data._response.result.self == true ? ".image-thumbnail-logged-user" : "#user-photo-image")
			.attr('src', data._response.result.url+'?_='+Math.random());
		$("a.image-thumbnail-user").attr('href', $("#user-photo-image").attr('src'));

		}
 	  }, 
	progressall: function (e, data) { 
		console.log(data); 
          } 
      });
  }

   remove(){
    try{
       }catch(e){
         console.log(e);
     }
   }

   show(){
    try{
       }catch(e){
         console.log(e);
    }
   }

   hide(){
    try{
       }catch(e){
         console.log(e);
    }
   }

 }

