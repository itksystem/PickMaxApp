/***********************************************************************/
/* Компонент управления доступа пользователя к лицензиям в организации */
/* Sinyagin Dmitry rel.at 05.08.2021                                   */
/***********************************************************************/

class licensesComponent {
   data;   
   userId;
   paginationElement='a.profile-access-licenses-nav';
   
    
  constructor(config) {
      this.config = config;
      this.load(1);
  }


   load(page=1) {
      let  config=this.config;     
      var o = this;
      $.ajax({
        url: o.config.url +"/"+page+"/"+o.config.limit,
        cache: false,
        method: "POST",
        dataType: "json",
        data : { 
            key        : $(".group-access-licenses-names-filter option:selected").eq(0).val(),
            provider   : $(".group-provider-licenses-names-filter option:selected").eq(0).val(),
            service    : $(".group-services-licenses-names-filter option:selected").eq(0).val()
          },           
        success: function(data){ 
          let s;
          o.data = data;
          $(config.tableElement).html('');
          $.each(data.keys, function( key, val) {
          s+=
           ' <tr>'+
           '    <td class="sm-col-2 align-middle">'+((data.pagination.page*data.pagination.limit-data.pagination.limit)+key+1)+'</td>'+
           '    <td class="sm-col-2 align-middle">'+val.key+'</td>'+
           '    <td class="sm-col-2 text-center align-middle">'+
			   o.getSelectProvider(val,()=>{
			   })+'</td>'+
           '    <td class="sm-col-2 text-center align-middle">'+ 
			   o.getSelectService(val,()=>{
			   })+'</td>'+
           '    <td class="sm-col-2 text-center align-middle"><span style="background:none; ">'+
           '    <div class="form-group" style="margin:0 0 0 0;">'+
           '     <div class="custom-control custom-switch">'+
           '        <input type="checkbox" class="custom-control-input profile-access-licenses" id="access-licenses-switchbox'+key+'" license-id="'+val.keyId+'"'
		   + ((val.blocked==0) ? " checked " : " ")
		   + ' value="'+(val.blocked==0 ? "TRUE" : "FALSE")+'" '+
	   ' >'+
           '        <label class="custom-control-label" for="access-licenses-switchbox'+key+'"></label>'+
           '     </div>'+
           '    </div>'+
           '   </span></td>'+
           '    <td class="sm-col-2 text-center align-middle"><span style="background:none; ">'+
           '    <div class="form-group" style="margin:0 0 0 0;">'+
           '     <div class="custom-control custom-switch">'+
           '        <input type="checkbox" class="custom-control-input profile-balancer-licenses" id="balancer-licenses-switchbox'+key+'" license-id="'+val.keyId+'"'
		   + ((val.balancer==1) ? " checked " : " ")
		   + ' value="'+(val.balancer==1 ? "TRUE" : "FALSE")+'" '+
	   ' >'+
           '        <label class="custom-control-label" for="balancer-licenses-switchbox'+key+'"></label>'+
           '     </div>'+
           '    </div>'+
           '   </span></td>'+
           '    <td class="sm-col-2 text-center align-middle">'+val.counter+'</td>'+
           '    <td class="sm-col-2 text-center align-middle">'+val.created+'</td>'+
           '    <td class="sm-col-2 text-center align-middle">'+val.lastUsed+'</td>'+
	   // '	<td style="width: 1rem;" class="text-center"> <button type="button" class="btn btn-default btn-license-name-editor" license-id="'+val.keyId+'"><i class="fa fa-edit" data-original-title="Редактировать запись"></i></button> </td>'+
           '	<td style="width: 1rem;" class="sm-col-2 text-center align-middle"> <button type="button" class="btn btn-default btn-licenses-name-trasher" license-id="'+val.keyId+'"><i class="fa fa-trash-alt" data-original-title="Удалить запись"></i></button> </td>'+

           ' </tr>';
          })
          $(config.tableElement).html(s);
          $(config.paginationElementPoligon).html(o.pagination());   

          o.switchers();
          o.trashers();
          o.AddButtonInitialize();
          o.paginationHandler();

          o.getLicenseSelectFilterComponent('.group-access-licenses-names-filter',function(){ o.load(); });
          o.getProviderSelectFilterComponent('.group-provider-licenses-names-filter',function(){ o.load();});
          o.getServiceSelectFilterComponent('.group-services-licenses-names-filter',function(){ o.load(); });


          $(".group-access-licenses-names-filter option[value='"+o.data.filter.key+"']").prop("selected",true);
          $(".group-provider-licenses-names-filter option[value='"+o.data.filter.provider+"']").prop("selected",true);
          $(".group-services-licenses-names-filter option[value='"+o.data.filter.service+"']").prop("selected",true);

         /* выделяем цветом активную страницу */
         $.each(data.pagination.pages, function( key, val) {
             $("a.profile-access-license-nav").removeClass('active');
         });    
       $('a.profile-access-licenses-nav.choice[page="'+page+'"]').addClass('active');
        /* Инициализация переключателей */
       
      }});
  }


   pagination() {
    var o = this;
    var pagination='<ul class="pagination pagination-sm m-0 float-right">'
          +'<li class="page-item"><a class="page-link profile-access-licenses-nav first" page="1"  href="#"><<</a></li>';
       $.each(o.data.pagination.pages, function( key, val) {
         pagination+='<li class="page-item"><a class="page-link profile-access-licenses-nav choice" page="'+val+'" href="#">'+val+'</a></li>';
        });
      pagination+='<li class="page-item"><a class="page-link profile-access-licenses-nav last" page="'+o.data.pagesCount+'" href="#">>></a></li>'
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
    $(".custom-control-input, .group-services-licenses-names, .group-provider-licenses-names").on('change',function(e) {
      if($(this).hasClass('custom-control-input')) // для чекбоксов
	      $(this).val(this.checked ? "TRUE" : "FALSE");
      let checked= $(this).prop('checked');
      let licenseId= $(this).attr('license-id');

      let service= $("select.group-services-licenses-names[license-id="+licenseId+"] option:selected").val();
      let provider= $("select.group-provider-licenses-names[license-id="+licenseId+"] option:selected").val();
      let blocked= ($(".profile-access-licenses[license-id="+licenseId+"] ").val()=='FALSE' ? 'TRUE'  : 'FALSE');
      let balancer= $(".profile-balancer-licenses[license-id="+licenseId+"] ").val();

      $(this).prop('checked', checked);
       $.ajax({
         url: o.config.changeUrl+"/"+licenseId,
         cache: false,
         method: "POST",
         dataType: "json",
         data: { service: service, provider:provider, blocked : blocked, balancer : balancer },
        success: function(response){ // если запрос успешен вызываем функцию
                     console.log(response);
        },
        error: function(response){ // если запрос успешен вызываем функцию
              console.log(response);
        }
      }).done(function() {});
    });
  }

  getSelectService(el, callback){
    let o=this;
    let _s=
    '<select class="group-services-licenses-names form-control" style="height: 2rem;" license-id="'+el.keyId+'"> <option value="">-- Все сервисы --</option>'	
    +'<option value="yandex-route" '+(el.service=='yandex-route' ? 'selected' : '' )+'>Yandex.Матрица Расстояний и Построение Маршрута</option>'	
    +'<option value="yandex-js-geocoder" '+(el.service=='yandex-js-geocoder' ? 'selected' : '' )+'>Yandex.JavaScript API и HTTP Геокодер</option>'	
    +'<option value="service-license"  '+(el.service=='service-license' ? 'selected' : '' )+'>Коммерческая лицензия openfsm.ru</option>'	
    +'</select>';
    $('select.group-services-licenses-names-filter').off('change').on('change',callback);
    return _s;
  }

  getSelectProvider(el, callback){
    let o=this;
    let _s=
    '<select class="group-provider-licenses-names form-control" style="height: 2rem;" license-id="'+el.keyId+'"> <option value="">-- Все сервисы --</option>'	
    +'<option value="yandex" '+(el.provider=='yandex' ? 'selected' : '' )+'>Yandex</option>'	
    +'<option value="google" '+(el.provider=='google' ? 'selected' : '' )+'>Google</option>'	
    +'<option value="openfsm" '+(el.provider=='openfsm' ? 'selected' : '' )+'>Openfsm</option>'	
    +'</select>';
    $('select.group-provider-licenses-names-filter').off('change').on('change',callback);
    return _s;
  }


  getLicenseSelectFilterComponent(el, callback){
    let o=this;
    let _s=
    '<select class="group-access-licenses-names-filter form-control" style="height: 2rem;"> <option value="">-- Все ключи --</option>';	
    $.each(o.data.keys, function( key, value) {   // собираем организации
       _s+='<option value="'+value.key+'">'+value.key+'</option>';	
    });
    $(el).html(_s+'</select>');
    $('select.group-access-licenses-names-filter').off('change').on('change',callback);
  }


  getProviderSelectFilterComponent(el, callback){
    let o=this;
    let _s=
    '<select class="group-provider-licenses-names-filter form-control" style="height: 2rem;"> <option value="">-- Все сервисы --</option>'	
    +'<option value="yandex" >Yandex</option>'	
    +'<option value="google" >Google</option>'	
    +'<option value="openfsm" >Openfsm</option>'	
    +'</select>';
    $(el).html(_s);
    $('select.group-provider-licenses-names-filter').off('change').on('change',callback);
  }

  getServiceSelectFilterComponent(el, callback){
    let o=this;
    let _s=
    '<select class="group-services-licenses-names-filter form-control" style="height: 2rem;"> <option value="">-- Все сервисы --</option>'	
    +'<option value="yandex-route">Yandex.Матрица Расстояний и Построение Маршрута</option>'	
    +'<option value="yandex-js-geocoder">Yandex.JavaScript API и HTTP Геокодер</option>'	
    +'<option value="service-license">Коммерческая лицензия openfsm.ru</option>'	
    +'</select>';
    $(el).html(_s);
    $('select.group-services-licenses-names-filter').off('change').on('change',callback);
    return _s;
  }


  trashers(){
    let o = this;
    $("button.btn-licenses-name-trasher").on('click',function(e) {
      var el=$(this);
      new ModalDialog('modal-licenses-trasher').Prop({size : "middle" , draggable : true })
         .Header('Удаление ключа',{backgroundColor: '#343a40', color: '#aaaaae'})
         .Body('<div style="font-size: 1rem;line-height: 1.4;"><div class="row">'
	            +'<div class="col-sm-3"><img src="/main/images/underconstruction.png" >'
	            +'</div><div class="col-sm"><span style="font-size: 1.3rem;">Будьте внимательны - вы удаляете действующуй в системе лицензионный ключ!<br>'
	            +'После этого возможно не будут работать некоторые функции системы. </span></div></div></div>')
         .Footer({ "ok": "Удалить","close":"Закрыть"}).Handler(()=>{
          console.log(el)
          $.ajax({
            url: o.config.removeUrl+'/'+$(this).attr('license-id'),
            cache: false,
            method: "DELETE",
            dataType: "json",
             success: function(response){ // если запрос успешен вызываем функцию
                   new infoDialog().success('Удаление лицензионного ключ', "Успешное удаление ключа!" );
                   o.load();
             },
             error: function(response){ // если запрос успешен вызываем функцию
                   new infoDialog().error('Удаление лицензионного ключ', "Произошла ошибка! Мы уже работаем над ее устранением, повторите операцию позже." );
                   o.load();
             }
           }).done(function() {});

            $("#modal-licenses-trasher-dialog").remove();
            $(".modal-backdrop").remove();
       }).create()
      .Body()
      .show();
   });
 }
  
 AddButtonInitialize(){
  let o = this;
 $('button.new-license-add-btn').off('click').on('click', function(e){
  e.preventDefault();  	
  let addNewGeoZone = new inputDialog2({
       onclick: ".new-license-add-btn",
       target: ".new-license-add-element",   
       elementName: "new-license-add-name",
       type:"text",
       title:"Добавить новый ключ",
       placeholder:"Введите новый ключ",
       buttonName:'<i class="fa fa-edit" data-original-title="Редактировать запись"></i>Добавить роль'
     }, function(e){
	  $(".loading").show();
	  $.ajax({
	    url: o.config.addUrl,
	    cache: false,
	    method: "POST",
	    dataType: "json",
	    data: {"key": e[0].value },
	    success: function(response){ // если запрос успешен вызываем функцию
	           $(".loading").hide();	
	           new infoDialog().success('Добавление лицензионного ключа', "Ключ успешно добавлен!" );
	           o.load();
	    },
	    error: function(response){ // если запрос успешен вызываем функцию
        	   $(".loading").hide();
	           new infoDialog().error('Добавление лицензионного ключа', "Возникла ошибка при добавлении ключа!" );
	           o.load();
 	    }
	   }).done(function() {});
       }).show();
   });
 }

}


 console.log('licensesComponent loading....');
  new licensesComponent(
//   $("#profile-form").attr("user-id"), 
{
    limit: 25,  
    url:  "/licenses/list",
    switcherUrl : "/access/licenses/set",
    addUrl : "/licenses/add",
    removeUrl : "/licenses/remove",
    changeUrl : "/licenses/change",
    tableElement : ".profile-access-licenses tbody",
    paginationElementPoligon : ".profile-access-licenses-navigation"
   }
 );
