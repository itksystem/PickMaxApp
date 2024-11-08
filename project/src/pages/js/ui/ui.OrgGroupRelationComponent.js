class OrgGroupRelationComponent {
     storage    = null;
     storageTag = "OrgGroupRelationComponent";
     p = null;

   constructor(p) {
      console.log('Start '+this.storageTag+' creating...');
      this.properties = p;	
      this.create();
   }

   create() {
    let o = this;
    try{
       new selectLoader(this.properties.tag+'-organization-id')
	.loader("/org/getOrgs",
	 {name:'organization_name', value:'organization_id'}, this.properties.organization_id) 
	.render('#'+this.properties.tag+'-organization-id')
	.onSelect(()=>{
          if($('#'+o.properties.tag+'-organization-id').val()==''){
	        $('#'+o.properties.tag+'-group-id option').remove();
  	  } else
	     new selectLoader(this.properties.tag+'-group-id')
		.loader("/org/getGroups/"+$('#'+this.properties.tag+'-organization-id').val(), 
	   	     {name:'group_name', value:'group_id'}, this.properties.group_id) 
			.render('#'+this.properties.tag+"-group-id");
	});
	     new selectLoader(this.properties.tag+'-group-id')
		.loader("/org/getGroups/"+this.properties.organization_id, 
		      {name:'group_name', value:'group_id'}, this.properties.group_id) 
			.render('#'+this.properties.tag+"-group-id");


             $(document)
	        .off('click','.object-organization-id-input-clear-btn')
	        .on('click', '.object-organization-id-input-clear-btn', function(e) {
    		  $('#'+o.properties.tag+"-organization-id option[value='']").prop("selected",true);
    		  $('#'+o.properties.tag+"-group-id option[value='']").prop("selected",true);
		   if($('#'+o.properties.tag+"-organization-id").val()==''){
		        $('#'+o.properties.tag+'-group-id option').remove();
		    }
		 });

             $(document)
	        .off('click','.object-group-id-input-clear-btn')
        	.on('click', '.object-group-id-input-clear-btn', function(e) {
		        $('#'+o.properties.tag+"-group-id option[value='']").prop("selected",true);
		});

       }catch(e){
         console.log(e);
    }
  }
}
