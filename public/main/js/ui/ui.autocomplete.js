/*
 Компоненте autocomplete
*/

class autocomplete{
     storage = null;
     storageTag = "autocomplete";

     constructor(p) {
      console.log('Start '+this.storageTag+' creating...');
      let o = this;
      o.p = p;
      o.el = p.el;
      console.log(o.exist())
      if(!o.exist()) {
            o.create();
            o.on('keyup',()=>{
            console.log($(o.el).val(),$(o.el).val().length);

            if($(o.el).val().length > 2){
              o.searchProcess(true);
              $.ajax({
                cache: false, method: "POST",
                url: "/object/autocomplete/0/1/10", 
                dataType: "json",
                data: {object_id: $(o.el).val(), category_id : ''},
                success: function( data ) {
                        var html='';    
                        var no_result_html = '<i>Нет данных</i>'; 
                        if(data.objects) {
                             $.each(data.objects, function(i, val){                             
                                html+= o.itemContainer(val);                            
                            });
                              $('div.autocomplete-result-container').show();
                        } else 
                        html = no_result_html; 
                        console.log((data.records < 10)  ? ((data.records+1) * 3.7)+'rem'  : (10 * 3.7)+'rem' );  

                        $('div.autocomplete-result-container').css('height', 
                           (data.records < 10) 
                              ? ((data.records+1) * 3.7)+'rem' 
                              : (10 * 3.7)+'rem' 
                        );

                        $('ul.autocomplete-list-container[for="'+o.el+'"]').html(html);
			                  $('.scrollbar-outer').scrollbar();
                        o.onClear();
	                },
                error: function(o){ // если запрос успешен вызываем функцию
                        $('ul.autocomplete-list-container[for="'+o.el+'"]').html(no_result_html);
                }
              }).done(function() {
                o.searchProcess(false);
              });
            } else o.containerClose();
           })
        }
        return this;
    }

   exist(){
     let o = this;
     return ($('div.autocomplete-result-container[for="'+o.el+'"]').length > 0) ? true : false;
   }

   searchProcess(b){
    let o = this;
     if(b){
        $('div.autocomplete-search-container[for="'+o.el+'"]').show() 
      } else  $('div.autocomplete-search-container[for="'+o.el+'"]').hide() 
      return this;
   }
   itemContainer(val=null){
    let o = this;
    if(val!=null) 
    return '<li class="autocomplete-list-item-container">'
            +'<div class ="autocomplete-item-container col-sm" code="'+val.search_code+'">'
             +'<div class="col-sm-12 autocomplete-item-container-f0">'
                +val.search_code
             +'</div>'
              +'<div class="col-sm-12 autocomplete-item-container-f1">'
                +(val.description == null ? '' : val.description+',')
                +(val.category_name == null ? '' : val.category_name+'<br />')
                +(val.address == null ? '' : val.address)
              +'</div>'              
          +'</div>'
       +'</li>';
   }

  create() {
    let o = this;
    $(o.el).after(' <div class="autocomplete-result-container scrollbar-outer " for="'+o.el+'">'
    +'<ul class="autocomplete-list-container" for="'+o.el+'"></ul></div>');
    $(o.el).after(' <div class="autocomplete-search-container" for="'+o.el+'"></div>');     
    $(o.el).after(' <div class="autocomplete-clear-container" for="'+o.el+'"><span class="autocomplete-clear-container" style="color:#000000;">×</span></div>');         
    return this;
   }

   on(action, callback){
   let o = this; 
     $(document).on(action, o.el, callback); 
     return this
   }

   
   onSelect(callback=null){
    let o = this;
    console.log('onSelect');
    $(document).on('click', 'div.autocomplete-item-container', function(e){
        callback(e,this);
        o.containerClose();
        return this;
      }
    );
    return this
  }


   onClear(){
    let o = this;
    console.log('onClear');
    $(document).on('click', 'div.autocomplete-clear-container *', function(e){
      $(o.el).val('');
      o.containerClose();
      return this;
    });
    
    return this
  }

   
  containerClose(){
    $('.autocomplete-result-container').hide(); 
    return this
   }
 }
