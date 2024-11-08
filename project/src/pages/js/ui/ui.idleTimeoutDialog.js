class idleTimeoutDialogComponent{
     storage    = null;
     storageTag = "lastActiveTime";
     IdleTimeout = 60*30;
     IdleDialogShow = false;

     constructor() {
      console.log('Start idleTimeoutComponent creating...');
      this.storage = new sessionStorageClass();
      this.storage.set(this.storageTag, Date.now());
      this.longPool();
      this.listner();
    }


   listner(){ // слушаем клики и обновляем sessionStorage
     let o = this;
     $(document).on("click",function(e) {
       let lastDate = Date.now();
	if(o.getIdleTimeout() >=lastDate) e.preventDefault();  	
	 o.storage.set(o.storageTag, lastDate);
      });
   }

   getIdleTimeout(){
     let o = this;
     let lastDate = Date.now();
     let storeTimeout=o.storage.get(this.storageTag);
     return parseInt((lastDate - storeTimeout) / 1000);
   }

   longPool(){
    let o = this;
    setInterval(()=>{
       console.log(o.getIdleTimeout(),o.IdleTimeout,o.IdleDialogShow);	
       if(o.getIdleTimeout() >= o.IdleTimeout && o.IdleDialogShow==false ) {
  	   o.IdleDialogShow = true;
           new ModalDialog('idle-timeout')
	      .Prop({size : "middle" })
	      .Body('<div style="font-size: 1rem;line-height: 1.4;"><div class="row">'
		+'<div class="col-sm-3"><img src="/main/images/underconstruction.png" >'
		+'</div><div class="col-sm"><span style="font-size: 1.3rem;">Вас долго не было, поэтому мы завершили сеанс на сайте,<br> для  Вашей безопасности.</span></div></div></div>')
	      .Footer({ "ok": "Завершить работу"}).Handler(()=>{location.replace('/logoff');}).create().show();
       }
     }, 10000); 
   }
 }
