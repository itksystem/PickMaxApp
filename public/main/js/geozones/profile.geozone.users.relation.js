/*******************************************************************/
/* Компонент управления доступа пользователя к группам организации */
/* Sinyagin Dmitry rel.at 10.10.2021                               */
/*******************************************************************/

class zoneUserRelationGridComponent {
   data;   
   zoneId;
   paginationElement='a.profile-geozone-user-relation-nav';
   
    
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
            service_id   : $(".group-geozone-user-relation-names-filter option:selected").eq(0).val()
          },           
        success: function(data){ 
          let s;
          o.data = data;
 	  console.log(data);
          $.each(data.users, function( key, val) {
 	  console.log(val.access);
          s+=
           ' <tr>'+
           '    <td>'+((data.page*data.limit-data.limit)+key+1)+'</td>'+
           '    <td>'+val.user_name+'</td>'+
           '    <td>'+val.group_name+'</td>'+
           '    <td><span style="background:none; ">'+
           '    <div class="form-group" style="margin:0 0 0 0;">'+
           '     <div class="custom-control custom-switch">'+
           '        <input type="checkbox" class="custom-control-input profile-geozone-user-relation" id="geozone-user-relation-switchbox'+key+'" geozone-id="'+data.geozone_id+'"'+' user-id="'+val.user_id+'"'
		   + ((val.access==1) ? " checked " : "0 ")+' >'+
           '        <label class="custom-control-label" for="geozone-user-relation-switchbox'+key+'"></label>'+
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

          o.loadServicesSelectElement('.group-geozone-user-relation-names-filter',function(){
	      o.load();
  	  });
	  console.log(o.data);
          $(".group-geozone-user-relation-names-filter option[value='"+o.data.filter.service_id+"']").prop("selected",true);
         /* выделяем цветом активную страницу */
         $.each(data.pages, function( key, val) {
             $("a.profile-geozone-user-relation-nav").removeClass('active');
         });    
       $('a.profile-geozone-user-relation-nav.choice[page="'+page+'"]').addClass('active');
        /* Инициализация переключателей */
       
      }});
  }
   pagination() {
    var o = this;
    var pagination='<ul class="pagination pagination-sm m-0 float-right">'
          +'<li class="page-item"><a class="page-link profile-geozone-user-relation-nav first" page="1"  href="#"><<</a></li>';
       $.each(o.data.pages, function( key, val) {
         pagination+='<li class="page-item"><a class="page-link profile-geozone-user-relation-nav choice" page="'+val+'" href="#">'+val+'</a></li>';
        });
      pagination+='<li class="page-item"><a class="page-link profile-geozone-user-relation-nav last" page="'+o.data.pagesCount+'" href="#">>></a></li>'
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
    $("input.profile-geozone-user-relation[type=checkbox]").on('change',function(e) {
      $(this).val(this.checked ? "TRUE" : "FALSE");
      console.log("input.profile-geozone-user-relation[type=checkbox]"+this.checked);

       $.ajax({
        url: o.config.switcherUrl,
        cache: false,
        method: "POST",
        dataType: "json",
        data: {"userId":$(this).attr("user-id"),"geozoneId":$(this).attr("geozone-id"),"access": this.checked},
        success: function(response){ 
                     console.log("input.profile-geozone-user-relation[type=checkbox]"+this.checked);
        },
        error: function(response){
              console.log(response);
        }
      }).done(function() {});
    });
  }


  loadServicesSelectElement(el, callback){
    let o=this;
    let _s=
    '<select class="group-geozone-user-relation-names-filter form-control" style="height: 2rem;"> <option value="">-- Все типы сервисов --</option>';	
    $.each(o.data.users, function( key, value) {   // собираем организации
       _s+='<option value="'+value.id+'">'+value.name+'</option>';	
    });
    $(el).html(_s+'</select>');
    $('select.group-geozone-user-relation-names-filter').off('change').on('change',callback);
  }


}

   
/* при открытии модального окна */
    $("#modal-change-geozone-name-dialog").on('show.bs.modal', function(){
        console.log('zoneUserRelationGridComponent loading....');
	  new zoneUserRelationGridComponent(
	   $("#change-geozone-id").val(), {
	    limit: 10,  
	    url:  "/geozones/user-relation",
            switcherUrl : "/access/geozones/set",
	    tableElement : ".profile-geozone-user-relation tbody",
	    paginationElementPoligon : ".profile-geozone-user-relation-navigation"
	  }
        );
    });

 