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
        let container =  DOMHelper.createDropdownSection("Безопасность", 
 	   [
            DOMHelper.regionSelector(
                "Укажите регион",
                "myTownSelector",
                this.onChoiceRegion,
		this.onRemoveRegion
            ),
        ]);
	return container;
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
