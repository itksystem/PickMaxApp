/*******************************************************************/
/* Компонент управления доступа пользователя к группам организации */
/* Sinyagin Dmitry rel.at 10.10.2021                               */
/*******************************************************************/

class zoneServiceRelationGridComponent {
   data;   
   zoneId;
   paginationElement='a.profile-geozone-service-relation-nav';
   
    
  constructor(zoneId, config) {
      this.zoneId = zoneId;
      this.config = config;
      this.load(1);
  }
   load(page=1) {
      let  config=this.config;     
      var o = this;
      $.ajax({
        url: config.url+"/"+o.zoneId+"/"+page+"/"+o.config.limit,
        cache: false,
        method: "GET",
        dataType: "json",
        data : { 
            service_id   : $(".group-geozone-service-relation-names-filter option:selected").eq(0).val()
          },           
        success: function(data){ 
          let s;
          o.data = data;
 	  console.log(data);
          $.each(data.relations, function( key, val) {
 	  console.log(val.access);
          s+=
           ' <tr>'+
           '    <td>'+((data.page*data.limit-data.limit)+key+1)+'</td>'+
           '    <td>'+val.name+'</td>'+
           '    <td><span style="background:none; ">'+
           '    <div class="form-group" style="margin:0 0 0 0;">'+
           '     <div class="custom-control custom-switch">'+
           '        <input type="checkbox" class="custom-control-input profile-geozone-service-relation" id="geozone-service-relation-switchbox'+key+'" service-id="'+val.id+'"'
		   + ((val.access==1) ? " checked " : "0 ")+' >'+
           '        <label class="custom-control-label" for="geozone-service-relation-switchbox'+key+'"></label>'+
           '     </div>'+
           '    </div>'+
           '   </span></td>'+
           ' </tr>';
          })
          console.log(config);
          $(config.tableElement).html(s);
          $(config.paginationElementPoligon).html(o.pagination());   
          o.switchers();
          o.paginationHandler();

          o.loadServicesSelectElement('.group-geozone-service-relation-names-filter',function(){
	      o.load();
  	  });
	  console.log(o.data);
  	  $("#geozone-blocked").prop("checked",(o.data.zone.blocked==1) ? true : false);
          $(".group-geozone-service-relation-names-filter option[value='"+o.data.filter.service_id+"']").prop("selected",true);
         /* выделяем цветом активную страницу */
         $.each(data.pages, function( key, val) {
             $("a.profile-geozone-service-relation-nav").removeClass('active');
         });    
       $('a.profile-geozone-service-relation-nav.choice[page="'+page+'"]').addClass('active');
        /* Инициализация переключателей */
       
      }});
  }
   pagination() {
    var o = this;
    var pagination='<ul class="pagination pagination-sm m-0 float-right">'
          +'<li class="page-item"><a class="page-link profile-geozone-service-relation-nav first" page="1"  href="#"><<</a></li>';
       $.each(o.data.pages, function( key, val) {
         pagination+='<li class="page-item"><a class="page-link profile-geozone-service-relation-nav choice" page="'+val+'" href="#">'+val+'</a></li>';
        });
      pagination+='<li class="page-item"><a class="page-link profile-geozone-service-relation-nav last" page="'+o.data.pagesCount+'" href="#">>></a></li>'
        +'</ul>';
     return pagination;
  }

   paginationHandler() {     
    let o=this;
      $(o.paginationElement).on('click',function(e) {
          e.preventDefault();
          o.load($(this).attr('page'));
      });
   }

   handler(el, event, callback) {
    $(el).on(event,callback);
  }

  switchers(){
   let o = this; 
    $("input.profile-geozone-service-relation[type=checkbox]").on('change',function(e) {
      $(this).val(this.checked ? "TRUE" : "FALSE");
      console.log(this.checked);
       $.ajax({
         url: o.config.switcherUrl,
         cache: false,
        method: "POST",
        dataType: "json",
           data: {
		"zoneId":o.zoneId,"serviceId":$(this).attr("service-id"),
		"access": this.checked
		},
        success: function(response){ // если запрос успешен вызываем функцию
                     console.log(response);
        },
        error: function(response){ // если запрос успешен вызываем функцию
              console.log(response);
        }
      }).done(function() {});
    });
  }


  loadServicesSelectElement(el, callback){
    let o=this;
    let _s=
    '<select class="group-geozone-service-relation-names-filter form-control" style="height: 2rem;"> <option value="">-- Все типы сервисов --</option>';	
    $.each(o.data.relations, function( key, value) {   // собираем организации
       _s+='<option value="'+value.id+'">'+value.name+'</option>';	
    });
    $(el).html(_s+'</select>');
    $('select.group-geozone-service-relation-names-filter').off('change').on('change',callback);
  }


}

   
/* при открытии модального окна */
    $("#modal-change-geozone-name-dialog").on('show.bs.modal', function(){
        console.log('zoneServiceRelationGridComponent loading....');
	  new zoneServiceRelationGridComponent(
	   $("#change-geozone-id").val(), {
	    limit: 10,  
	    url:  "/geozones/service-relation",
	    switcherUrl : "/geozones/geozones-service-relation/set",
	    tableElement : ".profile-geozone-service-relation tbody",
	    paginationElementPoligon : ".profile-geozone-service-relation-navigation"
	  }
       );
    });

 