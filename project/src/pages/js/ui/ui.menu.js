/*
 Получение списка разрешенных фич 
*/
class Menu {
    const 
        list;
        item_count=0;
        constructor() {
           return this;
        }
    
       load(){
	 let o = this;
 	 $.ajaxSetup({ async: false });
         $.getJSON("/access/features",  function(_o) {  
             console.log(_o.features);
  	     return o.list = _o.features;
	 });
 	 $.ajaxSetup({ async: true });
      	 return null;
	}

        get(name){
            return this.list[name];
        }

        visible(name){
            return this.list[name] !== undefined;     // проверка на разрешение фичи
        }

       NewMenu(e){
	$(e).append(''
	     +' <nav class="mt-2">'
	     +'   <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">'
             +'	</ul>'
	     +' </nav>'
	);
       }

       Article(e, item){           // object {description: "Запросы", name: "servicecalls"}
	$(e).append(''
          +'<li class="nav-header pb-3 user-panel" style="margin: 20px 0px 20px 0;">'
	  +'<span style="font-size: 1.1rem; font-weight: 600;">'+item+'</span>'
	  +'</li>');
	 this.item_count++;
       }

       subMenu(e, _e, icon, item){           // object {description: "Запросы", name: "servicecalls"}
	$(e).append(''  
          +'<li class="nav-item nav-item-redirect nav-submenu" rel="'+item.name+'">'
  	  +'    <a href="#" class="nav-link nav-submenu" rel="'+item.name+'">'
   	  +'      <i class="nav-icon fas '+icon+'"></i><p>'+item.description+'<i class="fas fa-angle-left right"></i></p>'
	  +'    </a> '
   	  +'    <ul class="nav '+_e+'" rel="'+item.name+'"style="display: none; height: auto;"></ul>'
          +'</li>');
	 this.item_count++;
       }


       Item(e, icon, item, MENU_TYPE = 'nav-item', visible=false){           // object {description: "Запросы", name: "servicecalls"}
	if(this.visible('service.article.'+item.name) && visible)
	$(e).append(
          '<li class="'+MENU_TYPE+'">'+
          ' <a href="/'+item.name+'" class="nav-link garbage-clear nav-item" rel="'+item.name+'"'+
	  ' article="'+item.article+'"'+
	  ' flux="true" flux-event-name="portal-article-click" flux-event-code="'+item.name+'">'+
          '        <i class="nav-icon fas '+icon+' nav-item"></i>'+
          '        <p>'+item.description+'<span class="right badge badge-info" rel="'+item.name+'"></span></p>'+  // информационный badge
          '      </a>'+
          '</li>');
	 this.item_count++;
       }

     active(service){
   /* Управление меню Откроем субменю */
	console.log('active page =',service);
	$('a.nav-item[href="'+service+'"]').addClass('active');
	let article = $('a.nav-item[href="'+service+'"]').attr('article');
	console.log('active page =', article);

	$('.nav-submenu[rel="'+article+'"]').addClass('menu-is-opening');
	$('.nav-submenu[rel="'+article+'"]').addClass('menu-open');
	$('ul.nav-treeview[rel="'+article+'"]').show();
        $('.treeview-left-menu').height(this.item_count*50);
     }	
  }
         