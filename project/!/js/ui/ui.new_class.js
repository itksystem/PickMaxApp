/*
  описание 
*/

class NewClass{
     storage    = null;
     storageTag = "NewClass";

     constructor() {
      console.log('Start '+this.storageTag+' creating...');
     if(!this.exist()) {
      }
    }

   exist(e){
     return ($(e).length) ? true : false;
   }


  create() {
  $("body").append(
    ' <div class="modal fade idleTimeoutDialog" id="idle-timeout-dialog" tabindex="-1" aria-labelledby="modal-idle-timeout-dialog-label" role="dialog" aria-modal="true" style="padding-right: 21px;display: block;">'
   +'   <div class="modal-dialog modal-lg modal-dialog-centered" style="max-width: max-content;">'
   +'     <div class="modal-content">'
   +'        <div class="modal-header" style="background-color: #FFF;color: #242527;">'
   +'          <h4 class="modal-title">Завершение неактивного сеанса</h4>'
   +'           <button type="button" class="close" data-dismiss="modal" aria-label="Close">'
   +'               <span aria-hidden="true" style="color:aliceblue;">×</span>'
   +'           </button>'
   +'        </div>'
   +' <div class="modal-body">'
   +' <div style="font-size: 1rem;line-height: 1.4;">Вас долго не было, поэтому мы завершили сеанс на сайте,<br> для  Вашей безопасности.</div>'
   +'  </div>'
   +'  <div class="modal-footer">'
   +'      <button type="button" class="btn btn-block bg-gradient-primary btn-lg button-exit">Понятно</button>'
   +' </div>'
   +'</div>'
   +' </div>'
   +'</div>');
   }

   remove(){
    try{
       }catch(e){
         console.log(e);
    }
   }

   show(){
    try{
       }catch(e){
         console.log(e);
    }
   }

   hide(){
    try{
       }catch(e){
         console.log(e);
    }
   }
 }
