/*
   Получение и хранение данных селектора Организации с пользовательского интерфейса
 */

class WogSelector{
      storage    = null;
      storageTag = "WogSelector";
      el = null;
     _o = { value : null, text: null };

     constructor() {
       console.log('Start '+this.storageTag+' creating...');
       let o = this;
       o.el = '#selectedGroup';
       o.storage_key = '#selectedGroup';
       o.storage = new sessionStorageClass(); 
       o.onChange(); // вешаем обработчик на изменение
        let _o = o.storage.getObject(o.storage_key);
             o._o = _o;
	   if(!_o || _o.value == null){
	      o._o = {};
              o._o.value = o.value();
	      o._o.text = o.text();
	      o.storage.setObject(o.storage_key, o._o);
	      console.log('storage save WogSelector', o._o);
            }      	
       return o;	
    }

   text() {
       return $(this.el+' option:selected').text();
   }

   value() {
       return $(this.el).val();
   }

   load(){
    let o = this;
    $.getJSON("/org/getGroups", function(req) {  
     console.log('load()');	
    let e="<option value=\"\" selected >Все группы</option>";
       $.each(req, function(i, v) {
	  console.log(v.group_id,o._o.value);
          e+="<option value=\""+v.group_id+"\""
		+((v.group_id==o._o.value) ? " selected " : "")>"+v.group_name+"</option>";

       });			

    $('#selectedGroup').html(
       '<select class="form-control" id="selectedGroup" name="selectedGroup" class="form-control" maxlength="50" ' +
       'placeholder="Выбрать организацию" style="height: calc(1.55rem + 15px); font-size: 1rem; padding-left: 0.5rem;"> ' + e + '</select>');   }

   onChange(){
	let o = this;
	$(o.el).off("change").on("change",function(e) {
              o._o.value = o.value();
	      o._o.text = o.text();
	      console.log('change WogSelector',o._o);	
	      o.storage.setObject(o.storage_key, o._o);
	});
   }

}
