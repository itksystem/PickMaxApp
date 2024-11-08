/*******************************************************************/
/* Компонент управления доступа пользователя к группам организации */
/* Sinyagin Dmitry rel.at 14.05.2022                               */
/*******************************************************************/

class ContactPageComponent {
   data;   
   userId;
   paginationElement='a.contacts-page-nav';
   
    
  constructor(config) {
      this.userId = config.userId;
      this.config = config;
      $(".add-new-user-button").attr('href','/profile/'+generateUUID());
      this.load(1);
      let o=this;
      new SearchInputDialogComponent({el:"search-input-dialog"}).render('.search-user-dialog').execute(function(v){
                $(".users-nav-alfabeta").removeClass('active');
	        o.config.alfabeta=v;
		o.load(1);
      });
  }

 alfaBetaNavigation(){
   let arr='АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
   console.log($('nav.nav-pills').length);
   if($('nav.nav-pills').length > 0) return;
   let html ='<nav class="nav nav-pills" style="padding: 0px 10px 0px 10px;"> <a class="float-left text-sm-center nav-link active users-nav-alfabeta users-nav-alfabeta-border" style="width: 10rem; padding-top: 10px;" href="#">[ВСЕ ЗАПИСИ]</a>';
     for(let i=0; i < arr.length-1; i++){
        html+='<a class="users-nav-alfabeta-border float-left text-sm-center nav-link users-nav-alfabeta " href="'+arr[i]+'">'+arr[i]+'</a>';
     }
     html+='</nav>';
   return html;
 }


 card(user){
   return '<div class="float-left col-12 col-sm-10 col-md-3 d-flex float-left align-items-stretch contact-profile-card"' 
                +' contact="'+user.name+'"' 
                +' blocked="'+user.blocked+'" >'
                +' <div class="card bg-light w-100">'
                +' <div class="card-header text-muted border-bottom-0">'+user.organization_name+'</div>'
                +' <div class="card-body pt-0">'
	         + ((user.blocked ==  0 ) ? '' : '<div class="ribbon-wrapper ribbon-lg"><div class="ribbon bg-danger">Заблокирован</div></div>')
                 +' <div class="row">'
                 +'   <div class="col-sm-7">'
                 +'     <h2 class="lead" style="font-size: 1.3rem;font-weight: 200;"><b>'+user.name+'</b></h2>'
                 +'   </div>'
                 +'   <div class="col-sm-5">'
                 +'      <div class="row d-flex">'
	         +'        <div class="col-sm">'
		 +'	<a href="/profile/'+user.user_id+'" class="contacts-profile-card">'
                 +'          <img src="'+(!user.avatar ? '/main/images/user-default.jpg' : '/main/images/users/'+user.avatar+'?_='+Math.random())+'" alt="user-avatar" class="float-right img-circle img-fluid" style="width: 6rem;">'
		 +'         </a>'
                 +'        </div>'
                 +'     </div>'
                 +'      <div class="row d-flex float-right">'
	         +'        <div class="col-sm">'
		 +'          <span class="float-right badge '+(user.online==0 ? 'badge-offline': 'badge-online' )+' badge-online-indicator contact-online-indicator" rel="badge-online-indicator" profile="1efa0800-1343-11ec-aecd-0242ac140003" alt="Online">&nbsp;</span>'
                 +'        </div>'
                 +'      </div>'
                 +'   </div>'
		 +' </div>'
                 +' <div class="row">'
                 +'</div>'
                 +'</div>'
                 +'<div class="card-footer">'
                 +'<div class="text-left">'
		+(user.job_location != null 
                 ? '<button type="button" class="btn btn-default contact-address-card" user-id="'+user.user_id+'" style="color: #646e77!important; margin:0.1rem;"> <i class="fas fa-lg fa-building"></i></button>'
	         : '')		
		+(user.phone != null 
                 ?'<button type="button" class="btn btn-default contact-phone-card" user-id="'+user.user_id+'" style="color: #646e77!important; margin:0.1rem;"> <a href="tel:'+user.phone+'"><i class="fas fa-lg fa-phone" ></i></a></button>'
	         : '')		
		+(user.email != null 
                 ?'<button type="button" class="btn btn-default contact-email-card" user-id="'+user.user_id+'" style="color: #646e77!important; margin:0.1rem;"> <a href="mailto:'+user.email+'"><i class="fas fa-lg fa-envelope" ></i></a></button>'
	         : '')		
 		 +' <button type="button"  class="btn btn-default contact-map-card" user-id="'+user.user_id+'" style="color: #646e77!important; margin:0.1rem;"> <i class="fas fa-lg fa-map" ></i></button>'
                 +' <a href="/profile/'+user.user_id+'" class="float-right btn btn-sm btn-primary contacts-profile-card">'
                 +'  <i class="fas fa-user"></i> Профиль</a>'
                 +' </div>'
                 +' </div>'
                 +' </div>'
                 +' </div>';    
      }


   onContactCardAddressClick(){
     let o = this;
     let address;
     $("button.contact-address-card").off('click').on('click',function(e) {
       let search_user_id = $(this).attr('user-id');
	$.each(o.data.users , function(index, val) { 
	   if(val.user_id == search_user_id) {
   	        console.log(val.user_id, search_user_id);	
		address=val.job_location;
		return address; 
	   }
	});
        new infoDialog().info('Адрес пользователя', address );
      });
   }


   getAbonentPlacement(user_id){
    let result;
     $.ajax({
        url: '/user/position/'+user_id,
        cache: false,
        method: "GET",
        dataType: "json",
	async: false,
        success: function(response){ // если запрос успешен вызываем функцию
           console.log(response);
           result=(response.latitude == null || response.longitude == null)
           ? null 
           :'<div class="container-fluid"  style="font-size: .8rem;">'
               	+'  	            <div class="card container-fluid">'
               	+'  				<div class="card-body container-fluid" >'
               	+'  			              <div id="map" class="container-fluid" style=" height:50rem;"></div>'
		+'		  	       </div>'
		+'		   </div>'
               	+'  	  	  <div  class="card" style="width: 30rem; top: 0; right: 1rem; z-index: 100; position: absolute; padding: 1rem;">'
               	+'	    	            <div class="input-group mb-3" style="margin-bottom: 0.5rem!important;">'
               	+'  		                 <label for="fio" class="col-sm-3 col-form-label font-weight-normal">ФИО</label>'
               	+'  			         <div class="input-group-prepend"><span class="input-group-text" data-toggle="tooltip" data-placement="bottom" data-original-title="Имя пользователя">'
               	+'  		       		 <i class="fas fa-user"></i></span></div>'
               	+'  		         	<input type="fio" class="form-control" placeholder="ФИО" id="fio" name="fio" style="height: calc(1.55rem + 15px); font-size: 1rem; padding-left: 0.5rem;" value="">'
               	+'  		   	    </div>'    
               	+'	    	            <div class="input-group mb-3" style="margin-bottom: 0.5rem!important;">'
               	+'  		                 <label for="organization_id" class="col-sm-3 col-form-label font-weight-normal">Организация</label>'
               	+'  			         <div class="input-group-prepend"><span class="input-group-text" data-toggle="tooltip" data-placement="bottom" data-original-title="Организация">'
               	+'  		       		 <i class="fas fa-user"></i></span></div>'
               	+'  		         	<input type="organization_id" class="form-control" placeholder="Организация" id="organization_id" name="organization_id" style="height: calc(1.55rem + 15px); font-size: 1rem; padding-left: 0.5rem;" value="">'
               	+'  		   	    </div>'    
               	+'	    	            <div class="input-group mb-3" style="margin-bottom: 0.5rem!important;">'
               	+'  		                 <label for="group_id" class="col-sm-3 col-form-label font-weight-normal">Группа</label>'
               	+'  			         <div class="input-group-prepend"><span class="input-group-text" data-toggle="tooltip" data-placement="bottom" data-original-title="Группа">'
               	+'  		       		 <i class="fas fa-user"></i></span></div>'
               	+'  		         	<input type="group_id" class="form-control" placeholder="Группа" id="group_id" name="group_id" style="height: calc(1.55rem + 15px); font-size: 1rem; padding-left: 0.5rem;" value="">'
               	+'  		   	    </div>'    
               	+'	    	            <div class="input-group mb-3" style="margin-bottom: 0.5rem!important;">'
               	+'  		                 <label for="last_activity" class="col-sm-3 col-form-label font-weight-normal">Активность</label>'
               	+'  			         <div class="input-group-prepend"><span class="input-group-text" data-toggle="tooltip" data-placement="bottom" data-original-title="Активность">'
		+'				 <i class="fas fa-user"></i></span></div>'
               	+'  		         	<input type="last_activity" class="form-control " placeholder="Активность" id="last_activity" name="last_activity" style="height: calc(1.55rem + 15px); font-size: 1rem; padding-left: 0.5rem;" value="">'
               	+'  		   	    </div>'    
		+'	       	      </div>'
		+'</div>';

        },
        error: function(response){ // если запрос успешен вызываем функцию

        }
    }).done(function() {});
     return result;
   }

   onContactCardMapClick(){
     let o = this;
     $("button.contact-map-card").off('click').on('click',function(e) {
        let info =  o.getAbonentPlacement($(this).attr('user-id'));
	console.log(info);	
        if(info) {
	     new infoDialog().modal('extra','Местоположение абонента', info);
	     ymaps.ready(()=>{
		  let mapPoligon = new Map('map');  // инициализация карта
		   mapPoligon.init();
		   let ya = new geoCompleteInput();   // инициализация элемента geoCompleteInput
		     ya.initMap(mapPoligon.Map);       // линкуем к карте 
		   });
		} else {
	          new infoDialog().error('Местоположение абонента', 'Возникла ошибка при определении геопозиционирования абонента.');
	     }
	 });
   }

/*
   onContactProfileClick(){
     $("a.contacts-profile-card").off('click').on('click',function(e) {
	e.preventDefault();  	
	$(".loading").show();
	$.ajax({
	  url: $(this).attr('href'),
 	  cache: false,
	  method: "GET",
	  dataType: "text",
	  success: function(o){ // если запрос успешен вызываем функцию
	     $("#output-main-panel").html(o);
	     $(".loading").hide();
	  }
   	   }).done(
             function() {}
        );
    });
   }
*/
   onNewUserAddClick(){
     $("a.add-new-user-button").off('click').on('click',function(e) {
	e.preventDefault();  	
	$(".loading").show();
	$.ajax({
	  url: $(this).attr('href'),
 	  cache: false,
	  method: "GET",
	  dataType: "text",
	  success: function(o){ // если запрос успешен вызываем функцию
	     $("#output-main-panel").html(o);
	     $(".loading").hide();
	  }
   	   }).done(
             function() {}
        );
    });
   }


   onContactMsgClick(){
	$(".fa-comments").off('click').on('click',function(e) {
		e.preventDefault();  	
 		alert('Функция отправки сообщения пользователю временно недоступна!');
	});
   }

   onBlockUnBlockClick(){
    let o = this;
	$(".get-status-users-list").off('click').on('click',function(e) {
                $(".get-status-users-list").removeClass('btn-primary');
                $(this).addClass('btn-primary');
	        o.config.blocked=$(this).attr("blocked-status");	
		o.load(1);
	});
   }


   onAlfaBetaNavClick(){
    let o = this;
	$(".users-nav-alfabeta").off('click').on('click',function(e) {
		e.preventDefault();  	
                $(".users-nav-alfabeta").removeClass('active');
                $(this).addClass('active');
		$("#search-input-dialog").val('');
	        o.config.alfabeta= (($(this).attr("href")!='#') ? $(this).attr("href") : '');
		o.load(1);
	});
   }

   setActive(count){  $("span.active-status-users-badge").html(count)}
   setBlocked(count){ $("span.blocked-status-users-badge").html(count)}

   load(page=1) {
      var o = this;
      let orgSelector = new OrgWogSelectorComponent();
      o.config.orgId   = ((orgSelector.getOrgId()=='') ? 0: orgSelector.getOrgId());
      o.config.groupId = ((orgSelector.getWogId()=='') ? 0: orgSelector.getWogId());

      $('.contacts-page').html('');
      console.log(o);	
      $.ajax({
        url: o.config.url+"/"+o.config.orgId+"/"+o.config.groupId+"/"+page+"/"+o.config.limit+"?search="+o.config.alfabeta+"&blocked="+o.config.blocked,
        cache: false,
        method: "GET",
        dataType: "json",                   
        success: function(data){ 
        let s='';
        o.data = data;
        console.log(data);

         if(data)
           if(data.users.length > 0){
             $.each(data.users, function( key, val) {
       		$('.contacts-page').append(o.card(val));
	        $.each(data.pagination.pages, function( key, val) { /* выделяем цветом активную страницу */
	               $("a.contacts-page-nav").removeClass('active');
            });    
           $('a.contacts-page-nav.choice[page="'+page+'"]').addClass('active');
          });
        } else {
	 $('.contacts-page').append('<span class="align-middle text-center w-100 p-5">Нет пользователей</span>');	 	
      }
	 o.setActive(data.activeUsers);
 	 o.setBlocked(data.blockedUsers);
 	 $('.contacts-page-navigation-panel').html(o.pagination(page));
 	 $('.alfabeta-navigation-poligon').append(o.alfaBetaNavigation());
   	  o.onContactCardAddressClick();
   	  o.onContactCardMapClick();
//   	  o.onContactProfileClick();
   	  o.onNewUserAddClick();
	  o.onContactMsgClick();
	  o.onAlfaBetaNavClick();
	  o.onBlockUnBlockClick();
	  o.paginationHandler();
    }
  });
}

   pagination(page) {
    var o = this;
    var pagination='<ul class="pagination pagination-sm m-0 float-right">'
          +'<li class="page-item"><a class="page-link contacts-page-navigation first" page="1"  href="#"><<</a></li>';
       $.each(o.data.pagination.pages, function( key, val) {
          console.log(page,key, val);
         let active=((page)==(val)) ? ' active ' : '';
         pagination+='<li class="page-item"><a class="page-link contacts-page-navigation choice '+active+'" page="'+val+'" href="#">'+val+'</a></li>';
        });
      pagination+='<li class="page-item"><a class="page-link contacts-page-nav last" page="'+o.data.pagination.pagesCount+'" href="#">>></a></li>'
        +'</ul>';
     return pagination;
  }

   paginationHandler() {     
    let o=this;
      $('a.contacts-page-navigation').off('click').on('click',function(e) {
          e.preventDefault();
          o.load($(this).attr('page'));
      });
   }

   loadServiceSelectElement(el, callback){
    let o=this;
    let _s=
    '<select class="function-access-service-names-filter form-control" style="height: 2rem;"> <option value="">-- Все сервисы --</option>';	
   if(o.data.services.length > 0) 
      $.each(o.data.services, function( key, value) {   // собираем организации
       _s+='<option value="'+value.id+'">'+value.name+'</option>';	
    });
    $(el).html(_s+'</select>');
    $('select.function-access-service-names-filter').off('change').on('change',callback);
   }
   
   handler(el, event, callback) {
    $(el).on(event,callback);
  }

  switchers(){
   let o = this; 
    $("input.contacts-page[type=checkbox]").on('change',function(e) {
      $(this).val(this.checked ? "TRUE" : "FALSE");
       $.ajax({
         url: o.config.switcherUrl,
         cache: false,
        method: "POST",
        dataType: "json",
           data: {"userId":o.userId,"function_id":$(this).attr("function-id"),"access": this.checked},
        success: function(response){ // если запрос успешен вызываем функцию
                     console.log(response);
        },
        error: function(response){ // если запрос успешен вызываем функцию
              console.log(response);
        }
      }).done(function() {});
    });
  }

}


 $(function(){
 try{
  let me = new Me();
  console.log(me);
      console.log('sGridComponent loading....');
	  me.initialization(()=>{
		console.log("ContactPageComponent class");
		  new ContactPageComponent({
 		    limit: 50,  
		    userId : me.userId,
		    url:  "/user/list",
		    tableElement : ".contacts-page tbody",
		    paginationElementPoligon : ".contacts-page-navigation-panel",
		    blocked : 0,
		    alfabeta : 'all'
		  });
	    }
	  ).get();
   } catch(err) {
      console.log(err);
 }
}
);




