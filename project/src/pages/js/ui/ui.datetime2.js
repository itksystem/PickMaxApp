/*
  Компонент-обертка отражения компонента datetime
  Синягин Д.В. 
  12-02-2022
*/

class datetime2{
     storage    = null;
     storageTag = "datetime2";
     el=null;     // название dom-элемента 
     url=null;

   constructor(timepicker=false) {
    let o=this;
    o.timepicker=timepicker;
    console.log('Start '+this.storageTag+' creating...');
   }

  onGenerate(){
    let o=this;
  }

  onChangeDateTime(dp,$input){
    let o=this;
       	$input.html($input.val());	
  }

  exist(){
     return ($("."+this.el).length) ? true : false;
  }

  render(el, ownerID=null){
    if(this.exist()) return; 
    let o=this;
    $.datetimepicker.setLocale('ru');
    $('#'+el).datetimepicker({
      ownerID : ((ownerID==null) ? "" : ownerID),
      inline: false,
      step:15,
      timepicker: o.timepicker,
//      value: 'getDate',
      value: '',
      format: (!o.timepicker ? 'Y-m-d' : 'Y-m-d H:i'),
      onGenerate:function( ct ){
		o.onGenerate();
             },
		onChangeDateTime:function(dp,$input){
		o.onChangeDateTime(dp,$input);
	}
    });  
   return this;
  }
}


