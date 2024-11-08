
$(document).ready(function() {

    let orgSelector = new OrgWogSelectorComponent();
    let wogId = orgSelector.getWogId();
    let orgId = orgSelector.getOrgId();;

    let serviceCallTable = $('#table_id').DataTable( {
        'lengthMenu': [ [10, 25, 50, 100], [10, 25, 50, 100] ],
	responsive  : true,
        "searching" : true,
        "ordering"  : true,
	"processing": true,
        "serverSide": true,
	"pagingType":  "full_numbers",
          ajax: {
   	    url: '/servicecalls/list?wog='+wogId+'&org='+orgId
   	   },
 
 	"createdRow": function ( row, data, index ) {
                $(row).attr('call-id',data.id);
         },

	  columns: [
		{data : 'id',   render: function(data, type, row) {
		    if (type === 'display') {
			   return '<div class="w-100 text-center">'+(row.id!=null ? '<a href="#" class="data-table-element" rel="id" call-id="'+row.id+'"> '+(row.id!=null ? row.id: '')+'</a>' : '')+'</div>';
			}                                                                               
			return data;
		    } 
		},
		{data : 'ext_id',   render: function(data, type, row) {return '<div class="w-100 text-center" call-id="'+row.id+'">'+(row.ext_id!=null ? row.ext_id: '')+'</div>';} },
		{data : 'finishdate',   render: function(data, type, row) {return '<div class="w-100 text-center finishdate" rel="finishdate" call-id="'+row.id+'">'+(row.finishdate!=null ? row.finishdate: '')+'</div>';} },
		{data : 'triptime',   render: function(data, type, row) {return '<div class="w-100 text-center" rel="triptime" call-id="'+row.id+'">'+(row.triptime!=null ? row.triptime: '')+'</div>';} },
		{data : 'user_id',
                   render: function(data, type,row) {
		    var link = '<div class="w-100">'
				+'  <div class="row">'
				+'     <div class="col-sm text-center">'
				+'       <a href="#" class="data-table-element" rel="person" user-id="'+row.user_id+'" call-id="'+row.id+'"' 
				+'          data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Редактировать пользователя" >'+row.user_name+'</a>'
				+'    </div>'
				+'  </div>'
				+'</div>';
		      return link;                                                                         
		   }	
		},
		{data : 'group_id', render: function(data, type, row) {return '<div class="w-100 text-center" rel="group_id" group-id="'+(row.group_id!=null ? row.group_id: '')+'">'
				+(row.group_name!=null ? row.group_name: '')+'</div>';} },
		{data : 'locator_id',
		 render: function(data, type, row) {
		    if (type === 'display') {
	  	        var link = '<div class="w-100 text-center">'+(data!=null 
				? (row.locator_id!=null ? `<i class="fa fa-mobile-alt" title="${row.locator_id}"></i>`
			//  '<span class="d-inline-block text-truncate" style="max-width: 60px;" rel="locator_id">'+(row.locator_id!=null ? row.locator_id: '')+'</span>'
				: '')
				: '')+'</div>';
		        return link;                                                                         
		    }	
		    return data;
		   }	
		},

		{data : 'distance',
		 render: function(data, type, row) {
		    if (type === 'display') {
	  	        var link = '<div class="w-100 text-center">'
				+(data!=null ? '<span class="d-inline-block text-truncate" style="max-width: 30px;" rel="distance" call-id="'+row.id+'">'+(data!=null ? data: '')+'</span>': '')
				+'</div>';
		        return link;                                                                         
		    }	
		    return data;
		   }	
		},

		{data : 'mode',
		 render: function(data, type, row) {
		    if (type === 'display') {
	  	        var link = '<div class="w-100 text-center">'
//				+(row.mode!=null ? '<span class="d-inline-block text-truncate" style="max-width: 80px;" rel="mode" mode-id="'+row.mode+'" >'+(row.mode!=null ? row.mode_name: '')+'</span>': '')
				+(row.mode!=null 
					? ((row.mode=='100003') 
						? `<i class="fa fa-car" style="color: green;" title="${row.mode_name}"></i>` 
							: ((row.mode=='100002') 
								? `<i class="fa fa-bus"  style="color: blue;" title="${row.mode_name}"></i>` 
							: ((row.mode=='100001') 
								? `<i class="fa fa-walking" style="color: red;"  title="${row.mode_name}"></i>` 
							: ((row.mode=='100999') 
								? `<i class="fa fa-magic" style="color: #17a2b8;" title="${row.mode_name}"></i>` 
							:  ''
					   )
					)
				      )
				   )
						
					: ''
				 )
				+'</div>';
		        return link;                                                                         
		    }	
		    return data;
		   }	
		},

		{data : 'object_search_code',
                   render: function(data, type, row) {
		    if (type === 'display') { 
		    let btnInfo = (row.object_id!=null) ? 'btn-info' : 'btn-danger';
		    let tooltip =  (row.object_id==0) ? 'data-toggle="tooltip" data-placement="bottom" data-original-title="Добавить обьект"' : '';
		    var link = '<div class="w-100">'
				+'  <div class="row">'
				+'     <div class="col-sm">'
				+'       <button type="button" class="btn '+btnInfo+' btn-block btn-flat data-table-element" '+tooltip+' call-id="'+row.id+'" rel="object_search_code" object-id="'+row.object_id+'">'
				+row.object_search_code+'</button>'
				+'    </div>'
				+'  </div>'
				+'</div>';
		      return link;                                                                         
		    }	
                    return data;
  	  	  }
		},
		{data : 'trip',
                 render: function(data, type, row) {
		        let ApproveButton = new ApproveTripButtonComponent({id: row.id, state : row.trip});
			link = ApproveButton.render();
                        return link;
                 }
    	     },
		{data : 'approve',
                   render: function(data, type, row) {
		    var link =  '<div class="w-100">'
				+ '<div class="row">'
				+'  <div class="col-sm">'
				+'       <button type="button" class="btn btn-outline-success btn-block '
				+ ((row.trip != 0) ? 'd-none' :'')
				+' servicecalls-trip-approved-button" rel="retrip" '
				+'           data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Пересогласовать пробег" '
				+'           user-id="'+row.user_id+'" call-id="'+row.id+'"><i class="fas fa-check"></i></button>'
				+'    </div>'
				+' </div>'
				+'</div>';
		      return link;                                                                         
                    return data;
  	  	  }
		},
		 {data : 'retrip',
                   render: function(data, type, row) {
		    if (type === 'display') { 
		    var link =  '<div class="w-100">'
				+ '<div class="row">'
				+'  <div class="col-sm">'
				+'       <button type="button" class="btn btn-outline-primary '
				+' btn-block servicecalls-retrip-button" rel="retrip" '
				+'           data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Пересчет листа" '
				+'           user-id="'+row.user_id+'" trip-date="'+row.tripdate+'"><i class="fas fa-play"></i></button>'
				+'    </div>'
				+' </div>'
				+'</div>';
		      return link;                                                                         
		    }	
                    return data;
  	  	  }
		},

		{data : 'report',
                   render: function(data, type, row) {
		    if (type === 'display' ) { 
		    let	is_visible = (row.report == null ? "d-none" : "");
		    var link =  '<div class="w-100">'
				+ '<div class="row">'
				+'  <div class="col-sm">'
				+'       <button type="button" class="'+is_visible
                                +' btn btn-outline-warning btn-block tracks-report-button" rel="report" '
				+'           data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Маршрутный лист" '
				+'           user-id="'+row.user_id+'" trip-date="'+row.tripdate+'"><i class="fas fa-file"></i></button>'
				+'    </div>'
				+' </div>'
				+'</div>';
		      return link;                                                                         
		    }	
                    return data;
  	  	  }
		}


	 ],
	  "language": {
            "url": "/main/js/dataTables.Russian.json"
        }
    } );

 let o = this;
 this.user=new User();

 new selectLoader('person').loader("/user/org/"+orgId, {name:'name', value:'user_id'}, '') .render(".servicecalls-person");
 new selectLoader('group').loader("/org/getGroups/"+orgId, {name:'group_name', value:'group_id'}, '').render(".servicecalls-group");
 new selectLoader('mode').loader("/servicecalls/moving/modes", {name:'name', value:'id'}, '').render(".servicecalls-mode");

 new datetime2(false).render("finishdate",'servicecalls');
 new datetime2(true).render("triptime",'servicecalls');

 let globalMessage = new  globalMessages();  // Локализация мессаджей

 $('#table_id').on( 'draw.dt', function () { // Реинициализация обработчиков на новой странице 
	     $('div.tooltip-inner').remove(); // при перерисовке удаляем tooltip
	     $('div.arrow').remove(); // при перерисовке удаляем tooltip

	 $('a.data-table-element[rel="id"]').off('click').on('click', function(e){
	     e.preventDefault();  	
	     new CallEditDialog(this);  // ui.servicecalls.grid.call-edit.js 
	     $('.servicecall-textarea-scrollbar_10rem,.servicecall-textarea-scrollbar_15rem').scrollbar();
	 });

	 $('button.btn-new-servicecall-create').off('click').on('click', function(e){
	     e.preventDefault();  	
	     new CallEditDialog(this);  // ui.servicecalls.grid.call-edit.js 
	     $('.servicecall-textarea-scrollbar_10rem,.servicecall-textarea-scrollbar_15rem').scrollbar();
	 });


         $('button.servicecalls-retrip-button').off('click').on('click', function(e){ // перерсчет маршрутного листа
		let o1=this;
		 if(!$(this).hasClass('disabled')) {
		   $('button.servicecalls-retrip-button[user-id="'+$(o1).attr('user-id')+'"][trip-date="'+$(o1).attr('trip-date')+'"]').addClass('disabled');
		   $.post('/trip/recalc/'+$(this).attr('user-id')+'/'+$(this).attr('trip-date')+'/hand', null, function(o) {
			if(o.resultCode == '0') {
		       	   $("#modal-person-edit-dialog").remove();
			   $(".modal-backdrop").remove();
			   new infoDialog().success('Перерасчет поездки', "Маршутный лист пересчитан" );
			   $('button.servicecalls-retrip-button[user-id="'+$(o1).attr('user-id')+'"][trip-date="'+$(o1).attr('trip-date')+'"]').html('<i class="fas fa-play"></i>');	
			   $('button.tracks-report-button[user-id="'+$(o1).attr('user-id')+'"][trip-date="'+$(o1).attr('trip-date')+'"]').html('<i class="fas fa-file"></i>');	
			   $('button.tracks-report-button[user-id="'+$(o1).attr('user-id')+'"][trip-date="'+$(o1).attr('trip-date')+'"]').removeClass('d-none');	
		 	} else {
  	       	        new infoDialog().error('Перерасчет поездки', "При запуске перерасчета маршрутного листа произошла ошибка! Повторите операцию позже!" );
		      }
			  $('button.servicecalls-retrip-button[user-id="'+$(o1).attr('user-id')+'"][trip-date="'+$(o1).attr('trip-date')+'"]').removeClass('disabled');
		      });
			}	  
  	   });

	  $('a.data-table-element[rel="person"]').off('click').on('click', function(e){
  	     e.preventDefault();  	
             new ModalDialog('modal-person-edit').Prop({size : "extra", draggable : false })
	       .Header('Профиль пользователя',{backgroundColor: '#343a40', color: '#aaaaae'})
	       .Footer().Handler(()=>{}).create()
	       .bodyLoader({url: "/modal/profile/"+$(this).attr("user-id")+"/short"})
	       .show();
		$(".profile-no-modal-header-line").hide(); // отключаем заголовок с для не-модального окна
  	   });

	  $('button.data-table-element[rel="object_search_code"]').off('click').on('click', function(e){
 	       e.preventDefault(); 
 	       let objectDlg = (($(this).attr('object-id')!='null') ? new ObjectEditDialog(this) : new ObjectCreateDialog(this));
  	    });


	  $('a.data-table-element[rel="locator_id"]').off('click').on('click', function(e){
	          alert('locatorId '+$(this).text());
	  });

	 let ApproveTripButtonComponent = new ApproveTripButtonComponentController();

	  $('button.servicecalls-trip-approved-button[rel="retrip"]').off('click').on('click', function(e){
		let call_id= $(this).attr('call-id');
	           $.post('/trip/auto-approval/'+call_id, null, function(o) {
			if(o.resultCode == '0') {
			   ApproveTripButtonComponent.change(call_id,  (o.entity.status ? 'approved' : 'rejected'), false);			
		       	   $("#modal-person-edit-dialog").remove();
			   $(".modal-backdrop").remove();
                           $('div[rel="triptime"][call-id="'+o.entity.call_id+'"]').html(o.entity.location.location_date);
		 	} else {
  	       	        new infoDialog().error('Автосогласование поездки', "При запуске автосогласования поездки произошла ошибка!</br>  Повторите операцию позже!" );
		      }
	 	   });
	  });

	  $('button.tracks-report-button').off('click').on('click', function(e){
	         new ModalDialog('modal-tracks-report-view').Prop({size : "super" , draggable : false })
 	           .Header('Отчет о транспортном маршруте',{backgroundColor: '#343a40', color: '#aaaaae'})
		   .Footer({ "close": "Закрыть"}).Handler(()=>{}).create()
  	           .bodyLoader({url: "/modal/trip/view/"+$(this).attr("user-id")+"/"+$(this).attr("trip-date")})
  	           .show();
  	   });


	 $('[data-toggle="tooltip"]').tooltip();
 });



/* Устанавливаем обработчики на заголовки таблицы*/

let headerActions=[
	{name:'id', id: 0 , action: 'click', actionName :'clear'},
	{name:'ext_id', id: 1, action: 'click', actionName :'clear'},
	{name:'finishdate', id: 2, action: 'click', actionName :'clear'},
	{name:'triptime', id: 3, action: 'click', actionName :'clear'},
	{name:'person', id: 4, action: 'click', actionName :'clear'},
	{name:'group', id: 5, action: 'click', actionName :'clear'},
	{name:'mode', id: 8, action: 'click', actionName :'clear'},
	{name:'search_code', id: 9, action: 'click', actionName :'clear'},
	{name:'agreement', id: 10, action: 'click', actionName :'clear'},

	{name:'id', id: 0 , action: 'keyup', actionName :'keyup'},
	{name:'ext_id', id: 1, action: 'keyup', actionName :'keyup'},
	{name:'search_code', id: 8, action: 'keyup', actionName :'keyup'},

	{name:'finishdate', id: 2, action: 'change', actionName :'change'},
	{name:'triptime', id: 3, action: 'change', actionName :'change'},
	{name:'person', id: 4, action: 'change', actionName :'change'},
	{name:'group', id: 5, action: 'change', actionName :'change'},
	{name:'mode', id: 8, action: 'change', actionName :'change'},
	{name:'agreement', id: 10, action: 'change', actionName :'change'},
];

Object.entries(headerActions).forEach(([key, value]) => {
	switch (value.actionName) {
		case 'clear': {
			$('span.clear[for="'+value.name+'"]').off( value.action).on( value.action, function () {	
   		 		serviceCallTable.columns(value.id).search($('#'+value.name).val('').val()).draw();
			});
			break;
		}
		case 'keyup': {
			$('#'+value.name)
			.off( value.actionName)
			.on( value.actionName, function (e) {
				if (e.keyCode == 13)	serviceCallTable
					.columns(value.id).search(this.value).draw();
			} );
			break;						
		}
		case 'change': {
			$('#'+value.name)
			.off( value.actionName)
			.on( value.actionName, function () {
				serviceCallTable
					.columns(value.id).search(this.value).draw();
			} );
			break;						
		}
	}
 })
} );

$('.scrollbar-inner').scrollbar();

