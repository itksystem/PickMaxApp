// обработка кнопки выход в интерфейсе пользоваптеля

function usersViewController(blockedStatus, alfa){
   if(alfa == '[ВСЕ ЗАПИСИ]') {
     $(".contact-profile-card").addClass('d-md-none').addClass('d-lg-none').addClass('d-sm-none').addClass('d-xl-none');
     $(".contact-profile-card[blocked='"+blockedStatus+"']").removeClass('d-md-none').removeClass('d-lg-none').removeClass('d-sm-none').removeClass('d-xl-none');
    } else {
     $(".contact-profile-card").addClass('d-md-none').addClass('d-lg-none').addClass('d-sm-none').addClass('d-xl-none');
     $(".contact-profile-card[contact^='"+alfa+"'][blocked='"+blockedStatus+"']").removeClass('d-md-none').removeClass('d-lg-none').removeClass('d-sm-none').removeClass('d-xl-none');
  }
}

$(".users-all-list").click(function() {
    $(".users-all-list").removeClass('btn-primary');
    $(this).addClass('btn-primary');
    blockedStatus=$(".users-all-list.btn-primary[blocked-status^='1']").length;
    alfa=$(".users-nav-alfabeta.active").eq(0).html();
    usersViewController(blockedStatus, alfa);
    
});

$(".users-nav-alfabeta").click(function() {
    $(".users-nav-alfabeta").removeClass('active');
    $(this).addClass('active');
    blockedStatus=$(".users-all-list.btn-primary[blocked-status^='1']").length;
    alfa = $(this).html();
    usersViewController(blockedStatus, alfa);

});

$(".add-user").click(function() {
   document.location.href='/users/addContact';	
});

 usersViewController( 0, '[ВСЕ ЗАПИСИ]');

$(".fa-comments").click(function(e) {
		e.preventDefault();  	
 		alert('ok');
});

/*
$("a.contacts-profile-card").click(function(e) {
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
*/


