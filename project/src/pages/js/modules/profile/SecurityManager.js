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
     * Создает секцию выбора локации
     */
    createSecuritySection() {
        this.container =  DOMHelper.createDropdownSection("Безопасность", 
 	   [
            DOMHelper.createButton("Установить код", "text-end", this.setCodeFactor.bind(this)),
  	    DOMHelper.bottomDrawer(`about-security-code-drawer`, `about-security-code-help`),
            DOMHelper.createLinkButton(
                `О коде безопасности`,
                `text-end security-code-button`, 
                this.onAboutCodeClick.bind(this)
            )

        ]);
	return this.container;
    }

	onAboutCodeClick() {
	    this.aboutCodeLink = this.container.querySelector('[drawer-id="about-security-code-drawer"]');
	    console.log(this.aboutCodeLink);
    
	    if (!this.aboutCodeLink) {
	        console.error('Element with drawer-id="about-security-code-drawer" not found');
	        return this;
	    }

            if(eventBus) {
                console.log(eventBus)
                eventBus.emit("ContentBottomDrawerOpen", { // Убрать двойную вложенность
		        contentId: this.aboutCodeLink.getAttribute('action-id'),
		        drawerId: this.aboutCodeLink.getAttribute('drawer-id')		    
               });
   	    }	
	    return this;
	}


    setCodeFactor(){
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
