/*******************************************************************/
/* Управление сокетами и обменом через них                         */
/* Sinyagin Dmitry rel.at 22.01.2022                               */
/*******************************************************************/
"use strict";

class SocketIOConnector {

 socket;
 userId;

 constructor(userId=null) {
    console.log('sockets loading....');
    let o = this;
    o.userId = userId;
    o.init();
  };

 action(msg){  // все реакции на сообщения
       let json = JSON.parse(msg);
       console.log(json);
       switch(json.type) {
         case 'error'   : {   toastr.error(json.text, json.title, {timeOut: json.timeout}); break; }
         case 'info'    : {  toastr.info(json.text, json.title, {timeOut: json.timeout}); break;  }
         case 'success' : {  toastr.success(json.text, json.title, {timeOut: json.timeout}); break;}
	 case 'dom-element-change-success' : 
	 case 'dom-element-change-info' :  
	 case 'dom-element-change-danger' : { 
			        $(json.filter).removeClass('badge-success').removeClass('badge-info').removeClass('badge-danger'); 
			        $(json.filter).addClass('badge-'+json.type.replaceAll('dom-element-change-', '')); 
				$(json.filter).html(json.text); 
				break;
		}
	 case 'underconstruction': {
	       let testModal=new ModalDialog('modal-under-constuction')
	      .Prop({size : "middle" })
	      .Body('<div style="font-size: 1rem;line-height: 1.4;"><div class="row">'
		+'<div class="col-sm-3"><img src="/main/images/underconstruction.png" >'
		+'</div><div class="col-sm"><span style="font-size: 1.3rem;">На сайте проводятся технические работы и мы вынуждены завершить вашу сессию. <br>Скоро вы сможете продолжить работу.<br>Приносим извинения за неудобства.</span></div></div></div>')
	      .Footer({ "ok": "Завершить работу"}).Handler(()=>{location.replace('/logoff');}).create().show();
	  break;
	 }
      }
 }

 init() {
   console.log(`[socket.init]`);
   let o = this;
   this.socket = io();
   let userId=sessionStorage.getItem('userId');
   let data = new Object;
   data.userId=userId;
   o.send('user:auth', JSON.stringify(data));

/* Оповещение об авторизации */
   this.socket.on('broadcast', (msg) => {   
       console.log('Server[broadcast] =>'+msg);  
       let json = JSON.parse(msg);
       console.log(json);
       switch(json.type) {
         case 'error'   :  toastr.error(json.text, json.title, {timeOut: json.timeout}); break;
         case 'info'    :  toastr.info(json.text, json.title, {timeOut: json.timeout}); break;
         case 'success' :  toastr.success(json.text, json.title, {timeOut: json.timeout}); break;
	 case 'dom-element-change'  : $(msg.filter).html(msg.text); break;
	 case 'underconstruction'   :
	   let testModal=new ModalDialog('modal-under-constuction')
	      .Prop({size : "middle" })
	      .Body('<div style="font-size: 1rem;line-height: 1.4;"><div class="row">'
		+'<div class="col-sm-3"><img src="/main/images/underconstruction.png" >'
		+'</div><div class="col-sm"><span style="font-size: 1.3rem;">На сайте проводятся технические работы и мы вынуждены завершить вашу сессию. <br>Скоро вы сможете продолжить работу.<br>Приносим извинения за неудобства.</span></div></div></div>')
	      .Footer({ "ok": "Завершить работу"}).Handler(()=>{location.replace('/logoff');}).create().show();
	break;
      }
   });


   this.socket.on('underconstruction', (msg) => {   
       console.log('Server[underconstruction]=>'+msg);  
       let json = JSON.parse(msg);
   });



   this.socket.on('user:auth', (msg) => {   
       console.log('Server[user:auth]=>'+msg);  
   });

/* Отправка сообщений */
/*
{"message-id":"1efa0800-1343-11ec-aecd-0242ac140003","eventName":"user:message","type":"error","title" : "Недоступен геокодер. Невозможно автоматическое определение координат обьектов","text" : "Уведомление об аварии!","timeout" : 3000}
*/
   this.socket.on('user:message', (msg) => {   
       console.log('Server[user:message]=>'+msg);  
       this.action(msg)
   });

/* Отправка broadcast-сообщений 
{"message-id":"1efa0800-1343-11ec-aecd-0242ac140003","eventName":"broadcast:message","type":"error","title" : "Недоступен геокодер. Невозможно автоматическое определение координат обьектов","text" : "Уведомление об аварии!","timeout" : 3000}
*/
   this.socket.on('broadcast:message', (msg) => {  
       console.log('Server[broadcast:message]=>'+msg);   
       let json = JSON.parse(msg);
       this.action(msg);
   });


/* Отправка broadcast-сообщений 
{"message-id":"1efa0800-1343-11ec-aecd-0242ac140003","eventName":"broadcast:message","type":"error","title" : "Недоступен геокодер. Невозможно автоматическое определение координат обьектов","text" : "Уведомление об аварии!","timeout" : 3000}
*/
   this.socket.on('admin:message', (msg) => {  
       console.log('Server[admin:message]=>'+msg);   
       this.action(msg);
   });


/* Изменение элемента у пользователя */
   this.socket.on('dom:user:element:change', (msg) => {   
     try{
	  console.log(msg);
	  $(msg.filter).html(msg.text); 
	} catch(error) {
	  console.log(error);
      }
   });

   this.socket.on('dom:element:change', (msg) => {   
     try{
	  console.log(msg);
	  $(msg.filter).html(msg.text); 
	} catch(error) {
	  console.log(error);
      }
   });
/* Оповещение об отключении */
   this.socket.on('disconnect', () => {
       console.log('Socket disconnected');
       toastr.error("Server connection error!", "Errors", {timeOut: 3000}); 
       o.send('user:auth', JSON.stringify(data));
    });
 };

 send(tag,message) {
  try {
   this.socket.emit(tag, message);
//    console.log(`[${tag}] ${message}`);
      } catch(err) {
       console.log(err);
  }
 };


 longPool(pooling=false){
    if(!pooling) return;	
    let o = this;
    setInterval(()=>{
	   let userId=sessionStorage.getItem('userId');
	   let data = new Object;
	   data.userId=userId;
	   o.send('user:auth', JSON.stringify(data));
       }, 60000
    ); 
  }
}

 
const socket= new SocketIOConnector().longPool(true);

