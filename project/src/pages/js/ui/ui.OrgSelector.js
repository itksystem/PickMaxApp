/*   Получение и хранение данных селектора Организации с пользовательского интерфейса */

class OrgWogSelectorComponent {
      storage    = null;
      storageTag = "OrgSelector";
      el = null;
     _o = {org: { value : null, text: null }, wog: { value : null, text: null }};

     constructor() {
       console.log('Start '+this.storageTag+' creating...');
       let o         = this;
       o.org_el      = '#selectedOrg';
       o.wog_el      = '#selectedGroup';
       o.storage_key = '#OrgWog';
       o.storage     = new sessionStorageClass(); 
       o.onChangeOrg(); // вешаем обработчик на изменение Org
       o.onChangeWog(); // вешаем обработчик на изменение Wog
        let _o = o.storage.getObject(o.storage_key);
             o._o = _o;
	   if(!_o || _o.org.value == null){
	      o._o = {};
	      o._o.org = {};
	      o._o.wog = {};
              o._o.org.value  = o.value(o.org_el);
	      o._o.org.text   = o.text(o.org_el);
              o._o.wog.value  = o.value(o.wog_el);
	      o._o.wog.text = o.text(o.wog_el);
	      o.storage.setObject(o.storage_key, o._o);
            }      	
       return o;	
    }

   text(el) {
       return $(el+' option:selected').text();
   }

   value(el) {
       return $(el).val();
   }

   load(){
    let o = this;
     o.org_load(function(){
       o.wog_load()
     });
   }

   getOrgId(){
     let o = this;
     return (o._o.org.value == null || o._o.org.value == undefined)  ? '' :  o._o.org.value;
   }

   getWogId(){
     let o = this;
     return (o._o.wog.value == null || o._o.wog.value == undefined)  ? '' :  o._o.wog.value;
   }

   org_load(callback){
    let o = this;
    $.getJSON("/org/getOrgs", function(req) {  
     console.log('load()');	
     let e="<option value=\"\">Все организации</option>";	
       $.each(req, function(i, v) {
           e+="<option value=\""+v.organization_id+"\""
   	    +((v.organization_id==o._o.org.value) ? " selected " : "")
	    +" >"+v.organization_name+"</option>";
       });			
      $('#selectedOrg').html('<select class="form-control" id="selectedOrg" name="selectedOrg" class="form-control" maxlength="50" placeholder="Выбрать организацию" style="height: calc(1.55rem + 15px); font-size: 1rem; padding-left: 0.5rem;"> ' + e + '</select>');
      callback();
   })
 }

   wog_load(){
     let o = this;
     $.getJSON("/org/getGroups/"+o._o.org.value, function(_o) {  
       let e="<option value=\"\" selected >Все группы</option>";
           $.each(_o, function(i, v) {
              e+="<option value=\""+v.group_id+"\""
		+((v.group_id==o._o.wog.value) ? " selected " : "")
		+" >"+v.group_name+"</option>";
           });			
       $('#selectedGroup').html(
         '<select class="form-control" id="selectedGroup" name="selectedGroup" class="form-control" maxlength="50" ' +
         'placeholder="Выбрать организацию" style="height: calc(1.55rem + 15px); font-size: 1rem; padding-left: 0.5rem;"> ' + e + '</select>');
       });
   }

   onChangeOrg(){
	let o = this;
	$(o.org_el).off("change").on("change",function(e) {
              o._o.org.value = o.value(o.org_el);
	      o._o.org.text = o.text(o.org_el);
              o._o.wog.value = o.value(o.wog_el);
	      o._o.wog.text = o.text(o.wog_el);
	      o.storage.setObject(o.storage_key, o._o);
	      o.wog_load();
	});
   }
   onChangeWog(){
	let o = this;
	$(o.wog_el).off("change").on("change",function(e) {
              o._o.org.value = o.value(o.org_el);
	      o._o.org.text = o.text(o.org_el);
              o._o.wog.value = o.value(o.wog_el);
	      o._o.wog.text = o.text(o.wog_el);
	      o.storage.setObject(o.storage_key, o._o);
	});
   }

}
