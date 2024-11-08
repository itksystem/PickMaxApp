/*******************************************************************/
/* Компонент управления запросом                                   */
/* Sinyagin Dmitry rel.at 19.03.2022                               */
/*******************************************************************/
class CallEditComponent {
   callId=null;

  constructor(config=null) {
      console.log('load CallEditComponent ');
      return  this;
  }

  render(call_id=null){
   if(!call_id) return;
      let o = this;
      $.getJSON("/servicecalls/"+call_id, function(data) {  
	console.log(data);
	if(call_id=== "undefined") { 
		data.entity.id = generateUUID();   // создаем новый запрос
		$('#call-extid').attr('readonly', false);
		data.entity.details.milage = 0;
	}

	$('#call-id').val(data.entity.id);
	$('#call-extid').val(data.entity.ext_id);
	$('#call-finishdate').val(data.entity.dates.finishdate);
	$('#call-deadline').val(data.entity.dates.deadline);
        new datetime2(true).render("call-finishdate",'modal-call-edit-dialog');
        new datetime2(true).render("call-deadline",'modal-call-edit-dialog');

	$('#call-org').val(data.entity.user.org_name);
	$('#call-workgroup').val(data.entity.user.group_name);
	$('#call-person').val(data.entity.user_name);
	$('#call-object-searchcode').val(data.entity.object.search_code);
	$('#call-mileage').val(data.entity.details.milage);
	$('#call-transptype').val(data.entity.details.mode);
	$('#call-information').val(data.entity.information);
	$('#call-solution').val(data.entity.solution);

	$('#start_local_address_exclude').prop('checked',data.entity.options.start_local_address_exclude);
	$('#last_day_arrival_exclude').prop('checked',data.entity.options.last_day_arrival_exclude);
	$('#return_local_address_exclude').prop('checked',data.entity.options.return_local_address_exclude);
	$('#start_local_address_include').prop('checked',data.entity.options.start_local_address_include);
	$('#return_local_address_include').prop('checked',data.entity.options.return_local_address_include);

         let searchcode = new autocomplete({el : "#call-object-searchcode"});
	 searchcode.onSelect((e,el)=>{
		console.log(e,el);	
		$(searchcode.el).val($(el).attr('code'));
         });	


        let customerDefault = data.entity.customer_id;
        $.getJSON("/org/customer", function(data) {  
  	      let e = "<option></option>";
	      $.each(data, function(i, v) {
   	         e+="<option value=\""+v.organization_id+"\" "+((v.organization_id==customerDefault) 
			? "selected" : "")
			+" prefix=\""+v.prefix+"\""
			+" >"
			+v.organization_name+"</option>";
   	     });			
            $('#call-customer-id').html("<select id=\"call-customer-id\" name=\"call_customer_id\">"+e+"</select>");
        });



        let orgDefault = data.entity.user.org_id;
        $.getJSON("/org/contractor", function(data) {  
	   let e = '';
	      $.each(data, function(i, v) {
   	         e+="<option value=\""+v.organization_id+"\" "+((v.organization_id==orgDefault) 
			? "selected" : "")
			+" prefix=\""+v.prefix+"\""
			+" >"
			+v.organization_name+"</option>";
   	     });			
            $('#call-org').html("<select id=\"call-org\" name=\"call_org\">"+e+"</select>");
        });

        let groupDefault = data.entity.user.group_id;
        $.getJSON("/org/getGroups/"+orgDefault, function(data) {  
      	  let e = '';
	     $.each(data, function(i, v) {
   	         e+="<option value=\""+v.group_id+"\" "+((v.group_id==groupDefault) 
			? "selected" : "")+" >"
			+v.group_name+"</option>";
   	     });			
            $('#call-workgroup').html("<select id=\"call-workgroup\" name=\"call_workgroup\">"+e+"</select>");
        });

        let userDefault = data.entity.user.id;
        $.getJSON("/user/group/"+groupDefault, function(data) {  
      	  let e = '';
	     $.each(data, function(i, v) {
   	         e+="<option locator-id=\""+v.locator_id+"\" value=\""+v.user_id+"\" "+((v.user_id==userDefault) 
			? "selected" : "")+" >"
			+v.name+"</option>";
   	     });			
            $('#call-person').html("<select id=\"call-person\" name=\"call_person\">"+e+"</select>");
        });


        let modeDefault = data.entity.details.mode;
        $.getJSON("/servicecalls/moving/modes", function(data) {  
      	  let e = '';
	     $.each(data, function(i, v) {
   	         e+="<option value=\""+v.id+"\" "+((v.id==modeDefault) 	? "selected" : "")+" >"	+v.name+"</option>";
   	     });			
            $('#call-mode').html("<select id=\"call-mode\" name=\"call_mode\" style=\"min-width: 8rem;\">"+e+"</select>");
        });
      });


      $("#modal-call-edit-dialog").off('change','#call-org').on('change', '#call-org', function(e) {
	$.ajax({
	  url: "/org/getGroups/"+this.options[this.selectedIndex].value,
 	  cache: false,
	  method: "GET",
	  dataType: "json",
	  success: function(o){ // если запрос успешен вызываем функцию
   	     console.log(o);
	     var e;	
	     $.each(o, function(i, v) {
   	         e+="<option value=\""+v.group_id+"\">"+v.group_name+"</option>";
   	     });			
            $('#call-workgroup').html("<select id=\"call-workgroup\" name=\"call_workgroup\">"+e+"</select>");
	    $('#call-workgroup').trigger('change');	
	  }
	}).done(
      function() {}
      );
   });

      $("#modal-call-edit-dialog").off('change','#call-workgroup').on('change', '#call-workgroup', function(e) {
        $.getJSON("/user/group/"+this.options[this.selectedIndex].value, function(data) {  
	  let e = '';
	     $.each(data, function(i, v) {
   	         e+="<option locator-id=\""+v.locator_id+"\" value=\""+v.user_id+"\" >"+v.name+"</option>";
   	     });			
       	    $('#call-person').html("<select id=\"call-person\" name=\"call_person\">"+e+"</select>");
        });
   });

    return  this;
  }
}

var callEditor  =  new CallEditComponent(null).render($('#output.servicecall-editor').attr('call-id'));

