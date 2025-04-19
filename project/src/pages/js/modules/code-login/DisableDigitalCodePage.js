class DisableDigitalCodePageSection extends PageBuilder {
    constructor(containerId) {
        super(containerId);
        this.api = new WebAPI();
        this.webRequest = new WebRequest();
        this.common = new CommonFunctions();
        this.profile = null;
        this.requestId = null;
        this.code = null;
        this.init();
    }

    async init() {
        try {
            const request = this.webRequest.get(this.api.getShopProfileMethod(), {}, true);
            this.profile = request.profile;
	    console.log(this.profile);	
        } catch (error) {
            console.error('Failed to initialize profile:', error);
            toastr.error('Не удалось загрузить данные профиля', 'Ошибка', { timeOut: 3000 });
        }                             
    }

    /**
     * Generates the DigitalCode section module.
     * @param {number} totalQuantity - Total quantity of items (unused in current implementation)
     * @param {number} totalAmount - Total amount (unused in current implementation)
     */
    DisableDigitalCodeCardContainer() {
        this.DigitalCodeContainer = document.createElement("div");
        this.DigitalCodeContainer.className = "card confirmation-code-container";

        const DigitalCodeContainerHeader = document.createElement("div");
        DigitalCodeContainerHeader.className = "card-header";
        DigitalCodeContainerHeader.innerHTML = `<h3 class="card-title">Отключение PIN-кода</h3>`;

        const DigitalCodeContainerContent = document.createElement("div");
        DigitalCodeContainerContent.className = "card-body";
        DigitalCodeContainerContent.innerHTML = `
            <div class="confirmation-phone-body-container">
                <div class="confirmation-phone-empty-text text-center" style="padding: 1rem 0; font-size: 0.9rem;">
                    Запросите код.</br>Он поступит на ваш телефонный номер</br>
                    <b>${this.common.maskPhoneNumber(this.profile?.phone || '', '*', 4) || 'не указан'}</b>
                </div>
                <div class="text-center w-100" style="padding: 1rem 0 2rem 0;">
                    <confirmation-code disabled></confirmation-code>
                </div>
                <div class="confirmation-information-label-container"></div>
                <div class="confirmation-phone-button-container"> 
                    <button class="btn btn-lg btn-success w-100 get-confirmation-code-button d-block">Запросить код</button>
                    <button class="btn btn-lg btn-success w-100 send-confirmation-code-button d-none">Отправить код</button>
                    <button class="btn btn-lg btn-success w-100 back-confirmation-code-button d-none">Вернуться в профиль</button>
                </div>
            </div>`;

        this.DigitalCodeContainer.appendChild(DigitalCodeContainerHeader);
        this.DigitalCodeContainer.appendChild(DigitalCodeContainerContent);

        this.addModule("DigitalCode", this.DigitalCodeContainer);
        this.addEventListeners();
    }

    /**
     * Sends confirmation code for verification
     * @param {string} code - The confirmation code
     * @param {string} requestId - The request ID from the confirmation request
     * @param {string} action - The request ID from the confirmation request
     * @returns {Promise<Object>} - Response from the server
     */

     checkConfirmationCode(code, requestId, action) {
        try {
            const response =
	        this.webRequest.post(
	        this.api.checkConfirmationCodeMethod(), 
		{code, 
		requestId,
		action
		}, true);
                console.log(response);
            return response.requestId ?? null;
        } catch (error) {
            console.error('checkConfirmationCodeMethod ', error);
            return null;
        }
        return null;
    }

// создать новый активный идентификатор запроса
    createConfirmationRequest(confirmationType = null) { 
        console.log('createConfirmationRequest ');	
        try {
            const response =
	        this.webRequest.post(
	  	 this.api.createConfirmationRequestMethod(), {confirmationType}, true);
                 console.log(response);
            return response?.requestId ?? null;
        } catch (error) {
            console.error('createConfirmationRequest ', error);
            return null;
        }
        return null;
    }

// отправить код по идентификатору запроса
    deliveryConfirmationCodeRequest(confirmationType = null, requestId = null) { 
        console.log('deliveryConfirmationCodeRequest ');	
        try {
	   if(!confirmationType || !requestId ) throw('!confirmationType || !requestId error');
           const response =  
		this.webRequest.post(
		this.api.deliveryConfirmationCodeRequestMethod(), 
		{confirmationType, requestId}, true);
	        console.log(response);
            return response?.requestId ?? null;
        } catch (error) {
            console.error('deliveryConfirmationCodeRequest ', error);
            return false;
        }
        return false;
    }
    
    /**
     * Adds event listeners to the confirmation phone elements
     */
    addEventListeners() {
        const getConfirmationCodeButton = this.DigitalCodeContainer.querySelector('.get-confirmation-code-button');
        const sendConfirmationCodeButton = this.DigitalCodeContainer.querySelector('.send-confirmation-code-button');
        const backProfileButton = this.DigitalCodeContainer.querySelector('.back-confirmation-code-button');

        const infoLabel = this.DigitalCodeContainer.querySelector('.confirmation-information-label-container');
        const confirmationCodeElement = this.DigitalCodeContainer.querySelector('confirmation-code');

        // Handle code completion event
        confirmationCodeElement.addEventListener('complete', (e) => {
            sendConfirmationCodeButton.classList.add('d-block');
            sendConfirmationCodeButton.classList.remove('d-none');
        });

        // запросить код
        getConfirmationCodeButton?.addEventListener('click', async () => {
            try {
                getConfirmationCodeButton.disabled = true;
                infoLabel.innerHTML = 'Запрашиваем код...';
                infoLabel.classList.remove('failed');
                
              	this.requestId = this.createConfirmationRequest('phone'); //создаем новый идентификатор запроса
                if (!this.requestId) {
                    throw new Error(request?.message || 'Неизвестная ошибка при запросе кода');
                }
                const requestId = this.deliveryConfirmationCodeRequest('phone', this.requestId);      //создаем запрос на доставку кода
                if (!requestId) {
                    throw new Error('Повторите операцию позже...');
                }

                // Update UI
                confirmationCodeElement.disabled = false;
                infoLabel.innerHTML = `Введите полученный код, отправленный на телефон ${this.common.maskPhoneNumber(this.profile?.phone || '', '*', 4)}`;
                infoLabel.classList.add('success');
                
                getConfirmationCodeButton.classList.add('d-none');
                sendConfirmationCodeButton.classList.add('d-none');
            } catch (error) {
                console.error('Confirmation code error:', error);
                infoLabel.classList.add('failed');
                infoLabel.innerHTML = error.message || 'Произошла непредвиденная ошибка';
                toastr.error('Ошибка при запросе кода', 'Подтверждение', { timeOut: 3000 });
            } finally {
                getConfirmationCodeButton.disabled = true;
            }
        });

        // отправить код
        sendConfirmationCodeButton?.addEventListener('click', async () => {
            try {
                sendConfirmationCodeButton.disabled = true;
                infoLabel.innerHTML = 'Проверяем код...';
                infoLabel.classList.remove('failed');

                const code = confirmationCodeElement.getCode();
                if (!code) {
                    throw new Error('Код не введен');
                }
                // выполняемый процесс
                const requestId = this.checkConfirmationCode(code, this.requestId, 'PIN_CODE_DISABLE');  
                if (!requestId) {
                    throw new Error(request?.message || 'Неизвестная ошибка при проверке кода');
                }

                // Success case
                confirmationCodeElement.disabled = true;
                infoLabel.innerHTML = 'PIN-код отключен!';
                infoLabel.classList.add('success');
                getConfirmationCodeButton.classList.add('d-none');
                sendConfirmationCodeButton.classList.add('d-none');
                backProfileButton.classList.add('d-block');   
                backProfileButton.classList.remove('d-none'); 
            } catch (error) {
                console.error('Code verification error:', error);
                infoLabel.classList.add('failed');
                infoLabel.innerHTML = error.message || 'Ошибка при проверке кода';
                toastr.error('Ошибка при проверке кода', 'Подтверждение', { timeOut: 3000 });
            } finally {
                sendConfirmationCodeButton.disabled = false;
            }
        });

        // Handle back button click
        backProfileButton?.addEventListener('click', async () => {
            try {
		document.location.replace(`/profile/page`);
              } catch (error) {
                console.error('Back error:', error);
                toastr.error('Ошибка ', 'Подтверждение', { timeOut: 3000 });
              } finally {
                sendConfirmationCodeButton.disabled = false;
            }
        });

    }
}