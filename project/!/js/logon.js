 $(function(){
 function logon() {
  $('.login-error').html('').hide('slow');
  $.ajax({
	  type: "POST",
	  url: '/api/v.1/logon',
	  dataType: 'json',
	  data: {id:$('#username').val(),password:$('#password').val()},
	  success: function(val){
   	    if(val.userId != '' && val.code > 0){
   	        sessionStorage.setItem('userId',val.userId);
		location.replace('/main');
	    } else
 	    if(val.code == 0)  {
		$('.login-error').html('<span>Неверный логин или пароль! Повторите попытку.</span>').show('slow');
		sessionStorage.removeItem('userId');
		}
	      else
   	    if(val.code < 0)  {
		$('.login-error').html('<span>Сервис недоступен.Повторите операци позже.</span>').show('slow');
		sessionStorage.removeItem('userId');
		}
	  },
	  fail: function(err){
		$('.login-error').html('<span>Сервис недоступен! Возможно проблемы с сетью...</span>').show('slow');
		sessionStorage.removeItem('userId');
	 	console.log(err);
	  }
    });
 }

  $(document).on('keyup','input.logon-button', function(e) {
    var code = e.which; 
    if(code==13) {
	 e.preventDefault();
         logon();
     }
  });
  $(document).on('click','a.logon-button', function() {
	logon();
   });
});
