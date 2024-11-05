/*
  Компонент отражения компонента select с ajax загрузкой
  Синягин Д.В. 
  05-02-2022
*/
class selectLoader{
     storage    = null;
     storageTag = "selectLoader";
     el=null;     // название dom-элемента 
     url=null;

   constructor(el) {
     if(!el) return;
     this.el=el;
     console.log('Start '+this.storageTag+' creating...');
   }

  exist(target){
     return ($("#"+this.el).length) ? true : false;
  }


  loader(url=null, prop=null, def=null){
   if(!url) return;
   this.url = url;
   this.prop= prop;
// this.vfa = vfa; 
   this.def = def; 
   return this;
  }

  loading(){
   let o = this;
   let selected = '';
   if(!o.url || !o.prop) return;
   o.spin(true);
   $('#'+o.el+' option').remove(); 
   $.getJSON(o.url, function(data) {
        $('#'+o.el).append($("<option></option>").attr("value", '').text('')); 
        $.each(data, function( key, val ) {
          if(val[o.prop.value]==o.def)
             selected = o.def;
	     $('#'+o.el).append($("<option></option>").attr("value", val[o.prop.value]).text(val[o.prop.name])); 
        });
       $('#'+o.el).val(selected); 
     o.spin(false);
   });
   return this;
  }

  spin(state){
    switch(state) {
     case true: {
	$('#'+this.el).hide();
	$('.'+this.el+'.select-loading-title').show('inline-flex');
	break;
      } 
      case false: {
	$('.'+this.el+'.select-loading-title').hide();
	$('#'+this.el).show();
	break;
       } 
      default: {
      }
    } 
  return this;
  }


  onSelect(callback){
     $('#'+this.el).off("change").on("change",function(e) {
           callback();
     });
  return this;
  }

  render(target){
   console.log('render(target)=>',target);
    if(!this.exist(target)){
     let html='	<div style="display: inline-flex; display: inline-flex;">'
	      +'  <select class="select" id="'+this.el+'" placeholder=""></select>'
	      +'    <div class="'+this.el+' select-loading-title" style="display: inline-flex;">'
	      +'      <div class="person-loading-spin" '
              +'         style="background-image: url(/main/images/loaders/loading_v1.gif);'
	      +'	 width: 70px;'
	      +'	 height: 12px;'
	      +'	 background-repeat-x: no-repeat;'
	      +'	 background-repeat-y: no-repeat;'
	      +'	 background-position: 55px;"><span>loading...</span></div>'
    	      +'   </div>'
  	      +' </div>';
     $(target).append(html);
    }
    this.loading();
    return this;
  }
}

