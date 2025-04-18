class SetLoginCodeManager {
    constructor() {
        this.api = new WebAPI();
        this.webRequest = new WebRequest();    
        this.addEventListeners();
    }

    addEventListeners(data) {
     // Обработка события проверки кода
     // Handle interaction between the two login code components
     let o = this;	
     window.addEventListener('DOMContentLoaded', () => {
      o.firstLogin = document.querySelector('.login-code');
      o.secondLogin = document.querySelector('.login-code-repeat');
      o.nextActionButton = o.secondLogin.querySelector('.next-action-button');
      o.nextActionRedirectURL = null;
      console.log(o.firstLogin, o.secondLogin, o.secondLogin.nextActionButton);
      o.secondLogin.nextActionButton.addEventListener('click', (e) => {
	document.location.replace(o.nextActionRedirectURL);
      });

     o.firstLogin.addEventListener('code-submitted', (e) => {
         o.firstLogin.visible = false;
         o.secondLogin.visible = true;
         setTimeout(() => {
           const digits = o.secondLogin.shadowRoot.querySelectorAll('.code-digit');
           if (digits.length > 0) {
             digits[0].focus();
           }
         }, 100);
       });
      
      o.secondLogin.addEventListener('code-submitted', (e) => {
        const firstCode  = o.firstLogin.codeValues.join('');
        const secondCode = o.secondLogin.codeValues.join('');
	console.log(firstCode, secondCode)
        o.firstLogin.visible = false;
        o.secondLogin.visible = true;
       let response ={};
       if (firstCode === secondCode) {		
            response =  this.webRequest.post(o.api.setPINCodeMethod(), { 
		code : firstCode, 
		requestId : this.requestId
	  }, true);
	} 
       this.pinCodeBoxDisplay((response.status==true) ? `success`: `failed`)
       let actionResult = o.changeCodeActionResult(firstCode, secondCode, (response?.status == true));
	   o.nextActionRedirectURL = o.nextActionRedirect(actionResult);
           o.nextActionButtonCaption(o.secondLogin.nextActionButton, actionResult);
           o.setFinalProcessElementVisible();
           o.displayFinalMessage(o.finalMessage(actionResult))
        });
      });
   }

   changeCodeActionResult(firstCode = null, secondCode = null, status = null){
      return (firstCode != secondCode || !status ) ? false : true; 
   }
    
    nextActionButtonCaption(el, isSuccess){
       el.classList.remove('btn-success');
       el.classList.remove('btn-failed');
       el.classList.add((isSuccess ? 'btn-success' : 'btn-failed' ));
       el.innerText = (isSuccess ? 'Завершить' : 'Повторить' );
       return this;
   }

    nextActionRedirect(isSuccess){
       return (isSuccess ? this.api?.PROFILE ?? ``: this.api?.PROFILE_CHANGE_DIGITAL_CODE ?? ``)
    }

    finalMessage(isSuccess){
       return (!isSuccess)
	   ?  `Возникла ошибка при установке кода! Повторите попытку.`
           :  'Код установлен!';
    }

    setFinalProcessElementVisible(){
       this.secondLogin.virtualKeyboardContainer.classList.add('d-none');
       this.secondLogin.nextActionButton.classList.remove('d-none');
       this.secondLogin.nextActionButton.classList.add('d-block');
       this.secondLogin.timerEl.classList.add('d-none');
    }

    displayFinalMessage(text, isSuccess){
      if(isSuccess) {
   	  this.secondLogin.showPublicMessage(text, true);
         } else 	{
   	  this.secondLogin.showPublicMessage(text, false);
	}
     }	

    createDigitalCodeSection(data) {
        this.requestId = this.createPINCodeRequestIdMethod('pin-code');
        this.container =  DOMHelper.createDropdownSection("", 
 	   [
            DOMHelper.createElement("div", "profile-change-code-container", `
    	      <login-code class="login-code pin-code-box-diplay "  visible app-name="Введите код" code-length="5" timeout="300"></login-code>
	      <login-code class="login-code-repeat pin-code-box-diplay" app-name="Повторите код" code-length="5" timeout="300"></login-code>`
  	     ),
  	    DOMHelper.bottomDrawer(`content-drawer`, ``),
	    DOMHelper.createBR(),
            DOMHelper.createLinkButton(
                `О pin-коде`,
                `text-end security-code-button question-button  pin-code-box-diplay`, 
                this.onAboutCodeClick.bind(this)),
            DOMHelper.divBox(`Код неверен! Повторите операцию.`,`w-100 pb-3 text-center text-red failed-result d-none`),
            DOMHelper.divBox(`Время установки пин-кода истекло!`,`w-100 pb-3 text-center text-red timeout-result d-none`),
            DOMHelper.divBox(`Пин-код установлен!`,`w-100 pb-3 text-center success-result d-none`),
            DOMHelper.createButton(`В профиль`,`btn-success text-center w-100  success-result timeout-result failed-result  d-none`, 
		this.onSetResultPINCodeClick.bind(this)),
            DOMHelper.staticText(`set-pin-code-recommendation`,`pin-code-box-diplay`),
        ]);

	return this.container;
    }

       onSetResultPINCodeClick() {
         document.location.replace(this.api.PROFILE);
       }
      	

      pinCodeBoxDisplay(result = '') { // success, failed, timeout
        const  pincodeBoxElements =  this.container.querySelectorAll('.pin-code-box-diplay'); 
        const  successResultBoxElements = this.container.querySelectorAll('.success-result');
        const  failedResultBoxElements  = this.container.querySelectorAll('.failed-result');
        const  timeoutResultBoxElements = this.container.querySelectorAll('.timeout-result');

       	  pincodeBoxElements.forEach(element => {
            element?.classList.remove('d-block');
            element?.classList.add('d-none');
          });

        switch(result) {
	case 'success' : {
	        // отключить 
        	  successResultBoxElements.forEach(element => {
	            element?.classList.remove('d-none');
	            element?.classList.add('d-block');
	          });
		  break;	
		}
	case 'failed' : {
        	// включить 
	        failedResultBoxElements.forEach(element => {
	            element?.classList.remove('d-none');
	            element?.classList.add('d-block');
	        });
		  break;	
  	     }
	case 'timeout' : {
        	// истекло время
	        timeoutResultBoxElements.forEach(element => {
	            element?.classList.remove('d-none');
	            element?.classList.add('d-block');
	        });
		  break;	
  	     }
	}
    }	


    createPINCodeRequestIdMethod(requestType = null) { // создать новый активный идентификатор запроса
        console.log('createPINCodeRequestId ');	
        try {
            const response =  this.webRequest.post(this.api.createPINCodeRequestIdMethod(), {requestType}, true);
            console.log(response);
            return response?.requestId ?? null;
        } catch (error) {
            console.error('createPINCodeRequestId ', error);
            return false;
        }
        return false;
    }


	onAboutCodeClick() {
	    this.drawer = this.container.querySelector('[drawer-id="content-drawer"]');
	    console.log(this.drawer);
    
	    if (!this.drawer) {
	        console.error('Element with drawer-id="content-drawer" not found');
	        return this;
	    }

            if(eventBus) {
                console.log(eventBus)
                eventBus.emit("ContentBottomDrawerOpen", { // Убрать двойную вложенность
		        contentId: `about-security-code-help`,
		        drawerId: this.drawer.getAttribute('drawer-id')		    
               });
   	    }	
	    return this;
	}


}

