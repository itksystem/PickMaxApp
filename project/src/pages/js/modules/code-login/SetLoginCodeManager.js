class SetLoginCodeManager {
    constructor() {
        this.api = new WebAPI();
        this.webRequest = new WebRequest();    
        this.addEventListeners();
        this.common = new CommonFunctions();
        this.timeout = 300;
        this.init();

    }

    async init() {
        try {
            const webRequest = new WebRequest();
            const request = webRequest.get(this.api.getShopProfileMethod(), {}, true);
            this.profile = request.profile;
	    console.log(this.profile);	
        } catch (error) {
            console.error('Failed to initialize profile:', error);
            toastr.error('Не удалось загрузить данные профиля', 'Ошибка', { timeOut: 3000 });
        }
    }


    addEventListeners(data) {
     // Обработка события проверки кода
     // Handle interaction between the two login code components
     let o = this;	
     window.addEventListener('DOMContentLoaded', () => {
      o.firstLogin = document.querySelector('.login-code');
      o.secondLogin = document.querySelector('.login-code-repeat');
      o.sendConfirmationCodeButton = document.querySelector('.send-confirmation-code-button');
      o.backConfirmationCodeButton = document.querySelector('.back-confirmation-code-button'); 
      o.confirmationCodeElement = document.querySelector('confirmation-code');
      o.firstLogin.timeoutCallback(this.timeoutCallback.bind(this));
      o.secondLogin.timeoutCallback(this.timeoutCallback.bind(this));
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
	let requestId = null;
	let deliveryId = null;
	console.log(firstCode, secondCode)
        o.firstLogin.visible = false;
        o.secondLogin.visible = true;

        let response ={};
        if (firstCode === secondCode) {		
	    this.requestId = ConfirmationHelper.createConfirmationRequest(ConfirmationHelper.PHONE);
	    if(this.requestId) {
               deliveryId =  ConfirmationHelper.deliveryConfirmationCodeRequest(ConfirmationHelper.PHONE, this.requestId);
 	    }
	 } 

	 if(!deliveryId){ // код доставлен
           this.pinCodeBoxDisplay(`failed`)
           let actionResult = o.changeCodeActionResult(firstCode, secondCode, (response?.status == true));
   	   o.nextActionRedirectURL = o.nextActionRedirect(actionResult);
	   o.nextActionButtonCaption(o.secondLogin.nextActionButton, actionResult);
	   o.setFinalProcessElementVisible();
	   o.displayFinalMessage(o.finalMessage(actionResult))
	 } else {
	   this.confirmationPINCodeCardContainerDisplay(true)
	}
      });

       o.confirmationCodeElement.addEventListener('complete', (e) => {
            o.sendConfirmationCodeButton.classList.remove('disabled');
       });

      o.sendConfirmationCodeButton.addEventListener('click', (e) => {
 	console.log(`sendConfirmationCodeButton`);
          try {
            const pinCode = o.secondLogin.codeValues.join('');
            const code = o.confirmationCodeElement.getCode();
	    const requestId = ConfirmationHelper.checkConfirmationCode(code, o.requestId, `PIN_CODE_ENABLE`, { pinCode });
	    console.log(requestId);

            const confirmationCodeContainer = this.container.querySelector('.confirmation-code-container');     
 	    confirmationCodeContainer.classList.remove('d-block');	
 	    confirmationCodeContainer.classList.add('d-none');	

            const failedElements = this.container.querySelectorAll((!requestId) ? '.failed-result' : '.success-result');     
              failedElements.forEach(element => {
               element?.classList.remove('d-none');
               element?.classList.add('d-block');
	      });

  	      o.backConfirmationCodeButton.classList.remove('d-none');	
	      o.backConfirmationCodeButton.classList.add('d-block');	
          } catch (error) {
            console.error('Failed to initialize profile:', error);
       	    toastr.error('Не удалось загрузить данные профиля', 'Ошибка', { timeOut: 3000 });
          }
       }); 
     });
   }

   timeoutCallback(){
	console.log(`timeoutCallback ...`);
        const  changeCodeContainer = this.container.querySelectorAll('.profile-change-code-container, .confirmation-code-container, .pin-code-box-diplay');
        const  timeoutContainer = this.container.querySelectorAll('.timeout-result');
        // отключить 
        changeCodeContainer.forEach(element => {
            element?.classList.remove('d-block');
            element?.classList.add('d-none');
        });
        // включить 
        timeoutContainer.forEach(element => {
            element?.classList.remove('d-none');
            element?.classList.add('d-block');
        });
   }

   confirmationPINCodeCardContainerDisplay(visible){
      console.log(`confirmationPINCodeCardContainerDisplay`);
      const confirmationPINCodeCardContainer = 
	this.container.querySelectorAll('.confirmation-code-container');     
      const profileChangeCodeCardContainer = 
	this.container.querySelectorAll('.profile-change-code-container');     
      const pinCodeBoxDiplay =
	this.container.querySelectorAll('.pin-code-box-diplay');     

      confirmationPINCodeCardContainer.forEach(element => {
            element?.classList.remove('d-none');
            element?.classList.add('d-block');
        });

      profileChangeCodeCardContainer.forEach(element => {
            element?.classList.remove('d-block');
            element?.classList.add('d-none');
        });

      pinCodeBoxDiplay.forEach(element => {
            element?.classList.remove('d-block');
            element?.classList.add('d-none');
        });

      this.confirmationCodeElement.disabled = false;

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
   	  this.secondLogin.showPublicMessage(text, (isSuccess));
     }	

    ConfirmationPINCodeCardContainer() {
        this.PINCodeContainer = document.createElement("div");
        this.PINCodeContainer.className = "card confirmation-code-container d-none";

        const PINCodeContainerHeader = document.createElement("div");
        PINCodeContainerHeader.className = "card-header";
        PINCodeContainerHeader.innerHTML = `<h3 class="card-title">Подтверждение операции</h3>`;

        const PINCodeContainerContent = document.createElement("div");
        PINCodeContainerContent.className = "card-body";
        PINCodeContainerContent.innerHTML = `
            <div class="confirmation-phone-body-container">
                <div class="confirmation-phone-empty-text text-center" style="padding: 1rem 0; font-size: 0.9rem;">
                    Введите код.</br>Он поступит на ваш телефонный номер</br>
                    <b>${this.common.maskPhoneNumber(this.profile?.phone || '', '*', 4) || 'не указан'}</b>
                </div>
                <div class="text-center w-100" style="padding: 1rem 0 2rem 0;">
                    <confirmation-code></confirmation-code>
                </div>
                <div class="confirmation-information-label-container"></div>
                <div class="confirmation-phone-button-container"> 
                    <button class="btn btn-lg btn-success w-100 get-confirmation-code-button  d-none">Запросить код</button>
                    <button class="btn btn-lg btn-success w-100 send-confirmation-code-button disabled d-block">Отправить код</button>
                    <button class="btn btn-lg btn-success w-100 back-confirmation-code-button d-none">Вернуться в профиль</button>
                </div>
            </div>`;

        this.PINCodeContainer.appendChild(PINCodeContainerHeader);
        this.PINCodeContainer.appendChild(PINCodeContainerContent);
        return this.PINCodeContainer;
    }


    createDigitalCodeSection(data) {
        this.container =  DOMHelper.createDropdownSection("", 
 	   [
            DOMHelper.createElement("div", "profile-change-code-container", `
    	      <login-code class="login-code pin-code-box-diplay "  visible app-name="Введите код" code-length="5" timeout="${this.timeout ?? 300}"></login-code>
	      <login-code class="login-code-repeat pin-code-box-diplay" app-name="Повторите код" code-length="5" timeout="${this.timeout ?? 300}"></login-code>`
  	     ),
	    DOMHelper.createBR(),
	    this.ConfirmationPINCodeCardContainer(),	
	    DOMHelper.createBR(),
            DOMHelper.divBox(`Код неверен! Повторите операцию.`, `w-100 pb-3 text-center text-red failed-result d-none`),
            DOMHelper.divBox(`Время установки пин-кода истекло!`,`w-100 pb-3 text-center text-red timeout-result d-none`),
            DOMHelper.divBox(`Пин-код установлен!`,`w-100 pb-3 text-center success-result d-none`),
            DOMHelper.createButton(`В профиль`,`btn-success text-center w-100  success-result timeout-result failed-result  d-none`, 
		this.onSetResultPINCodeClick.bind(this)),
  	    DOMHelper.bottomDrawer(`content-drawer`, ``),
            DOMHelper.createLinkButton(
                `О pin-коде`,
                `text-end security-code-button question-button pin-code-box-diplay`, 
                this.onAboutCodeClick.bind(this)),
            DOMHelper.staticText(`set-pin-code-recommendation`,`pin-code-box-diplay`),
        ]);

	return this.container;
    }

       onSetResultPINCodeClick() {
         document.location.replace(this.api.PROFILE);
       }
      	

      pinCodeBoxDisplay(result = '') { // success, failed, timeout
        const  pincodeBoxElements 	= this.container.querySelectorAll('.pin-code-box-diplay'); 
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


	onAboutCodeClick() {
	    this.drawer = this.container.querySelector('[drawer-id="content-drawer"]');
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

