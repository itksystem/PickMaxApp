class SecurityManager extends EventTarget {
    constructor(profileSection) {
        super();
        this.profileSection = profileSection;
        this.common = new CommonFunctions();
        this.api = new WebAPI();
        this.webRequest = new WebRequest();
        this.regions = [];
	this.selectedRegions = [];
        
        // Привязка контекста
        this.onSetCodeFactor = this.onSetCodeFactor.bind(this);
        this.onRemoveCodeFactor = this.onRemoveCodeFactor.bind(this);
    }
    /**
     * Проверка состояния установки контрольного вопроса
     */
     isSecurityQuestionActivated() {        
        try {          
          const response = this.webRequest.get(this.api.getIsSecurityQuestionActiveMethod(),{  }, true);
          return response?.status ?? false;
        } catch (error) {
          console.log('isSecurityQuestionActivated:', error);
        }
        return false;
    }
    /**
     * Проверка состояния установки pin-кода
     */
         isPINCodeActivated() {        
            try {          
              const response =  this.webRequest.get(this.api.getIsPINCodeActiveMethod(),{  }, true);
              return response?.status ?? false;
            } catch (error) {
              console.log('isSecurityQuestionActivated:', error);
            }
            return false;
        }
    /**
     * Создает секцию выбора локации
     */
    createSecuritySection() {
        let isSecurityQuestionActive = this.isSecurityQuestionActivated();
        let isPINCodeActive = this.isPINCodeActivated();
        this.container =  DOMHelper.createDropdownSection("Безопасность", 
 	   [
            DOMHelper.Header('PIN-код'),
            DOMHelper.createButton("Установить PIN-код", "text-end", this.setCodeFactor.bind(this)),
            DOMHelper.createConfirmationLabel(
                (isPINCodeActive === true ? "PIN-код установлен!" : "PIN-код не установлен!"), 
                (isPINCodeActive === true ? "success" : "failed"), ),
  	        DOMHelper.bottomDrawer(`content-drawer`, ``),
            DOMHelper.createLinkButton(
                `О pin-коде`,
                `text-end security-code-button question-button`, 
                this.onAboutCodeClick.bind(this)
            ),            
            DOMHelper.createHL(),
            DOMHelper.Header('Контрольный вопрос'),
            (isSecurityQuestionActive
                ? DOMHelper.createButton("Отключить проверку", "text-end", this.setSecurityQuestionFactorDisable.bind(this))
                : DOMHelper.createButton("Включить проверку", "text-end", this.setSecurityQuestionFactorEnable.bind(this))
            ),
            DOMHelper.createConfirmationLabel(
                (isSecurityQuestionActive === true ? "Контрольный вопрос установлен!" : "Контрольный вопрос не установлен!"),
                (isSecurityQuestionActive === true ? "success" : "failed"), ),
            DOMHelper.createLinkButton(
                `О контрольном вопросе`,
                `text-end security-question-button question-button`, 
                this.onAboutSecurityQuestionClick.bind(this)
            ),

        ]);
	return this.container;
    }

      onAboutSecurityQuestionClick() {
	    this.drawer = this.container.querySelector('[drawer-id="content-drawer"]');
	    console.log(this.drawer);
    
	    if (!this.drawer) {
	        console.error('Element with drawer-id="content-drawer" not found');
	        return this;
	    }

            if(eventBus) {
                console.log(eventBus)
                eventBus.emit("ContentBottomDrawerOpen", { // Убрать двойную вложенность
		        contentId: `about-security-question-help`,
		        drawerId: this.drawer.getAttribute('drawer-id')		    
               });
   	    }	
	    return this;
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


    setCodeFactor(){
	    window.location.replace(`/profile/change-digital-code/page`);
	    return this;
    }

    setSecurityQuestionFactorEnable(){
	    window.location.replace(`/profile/change-security-question/page`);
	    return this;
    }

    setSecurityQuestionFactorDisable(){
	    window.location.replace(`/profile/disable-security-question/page`);
	    return this;
    }


    /**
     * Обработчик установки кода
    */
    async onSetCodeFactor(event) {
        console.log('onSetCodeFactor');
        try {
            if (!event?.detail?.requestId) {
                throw new Error('Некорректные данные для onSetCodeFactor');
            }
            const requestId = event?.detail.requestId || null;
            const response = await this.webRequest.post(this.api.sendCodeFactorMethod(),{ requestId }, true);
        } catch (error) {
            console.log('Ошибка при установки кодового фактора:', error);
            throw error;
        }
    }

    /**
     * Обработчик удаления установки кода
     */
    async onRemoveCodeFactor(event) {
        console.log('onRemoveRegion', event);
        try {
            if (!event?.detail?.requestId) {
                throw new Error('Некорректные данные для onSetCodeFactor');
            }
            const requestId = event?.detail.requestId || null;
            const response = await this.webRequest.delete(this.api.deleteCodeFactorMethod(),{ requestId }, true
            );
        } catch (error) {
            console.log('Ошибка при удалении кодового фактора:', error);
            throw error;
        }
    }

 }
