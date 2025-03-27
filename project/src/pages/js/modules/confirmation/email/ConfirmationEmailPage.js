class ConfirmationEmailSection extends PageBuilder {
    constructor(containerId) {
        super(containerId);
        this.api = new WebAPI();
        this.common = new CommonFunctions();
        this.profile = null;
	this.requestId = null;
	this.code = null;
        this.init();
    }

    async init() {
        let webRequest = new WebRequest();
        let request = webRequest.get(this.api.getShopProfileMethod(), {}, true);
        this.profile = request.profile;
    }

    /**
     * Generates the ConfirmationEmail section module.
     */
    ConfirmationEmailCardContainer(totalQuantity = 0, totalAmount = 0) {
        let o = this;
        this.ConfirmationEmailContainer = document.createElement("div");
        this.ConfirmationEmailContainer.className = "card confirmation-code-container";

        const ConfirmationEmailContainerHeader = document.createElement("div");
        ConfirmationEmailContainerHeader.className = "card-header";
        ConfirmationEmailContainerHeader.innerHTML = `<h3 class="card-title">Подтверждение почты</h3>`;

        const ConfirmationEmailContainerContent = document.createElement("div");
        ConfirmationEmailContainerContent.className = "card-body";
        ConfirmationEmailContainerContent.innerHTML = `
            <div class="confirmation-email-body-container">
                <div class="confirmation-email-empty-text text-center" style="padding: 1rem 0; font-size: 0.9rem;"> Введите код полученный на указанный вами электронный адрес </br> <b>${this.profile?.email}</b></div> 
                   <div class="text-center w-100" style="padding: 1rem 0 2rem 0;">
			<confirmation-code disabled></confirmation-code>
		  </div>
 		  <div class="confirmation-information-label-container">
		  </div>
                <div class="confirmation-email-button-container"> 
                    <button class="btn btn-lg btn-success w-100 get-confirmation-code-button d-block">Запросить код</button>
                    <button class="btn btn-lg btn-success w-100 send-confirmation-code-button d-none">Отправить код</button>
                </div>
            </div>`;

        this.ConfirmationEmailContainer.appendChild(ConfirmationEmailContainerHeader);
        this.ConfirmationEmailContainer.appendChild(ConfirmationEmailContainerContent);

        this.addModule("ConfirmationEmail", this.ConfirmationEmailContainer);
        this.addEventListeners();
    }

    /* Запрос кода */
    async GetConfirmationEmailCode(confirmationType = `email`) {
        let o = this;
        let webRequest = new WebRequest();
        let request = await webRequest.post(
		o.api.getConfirmationRequestMethod(),
		o.api.getConfirmationRequestMethodPayload(confirmationType),
		true);
        return request;
    }

    /* Отправка кода */
    async SendConfirmationEmailCode(code,requestId) {
        let o = this;
        let webRequest = new WebRequest();
        let request = await webRequest.post(
		o.api.sendConfirmationCodeMethod(),
		o.api.sendConfirmationCodeMethodPayload( code, requestId ),
		true);
        return request;
    }
    
   addEventListeners() {
    console.log(this);
    const getConfirmationCodeButton = this.ConfirmationEmailContainer.querySelector('.get-confirmation-code-button');
    const sendConfirmationCodeButton = this.ConfirmationEmailContainer.querySelector('.send-confirmation-code-button');
    const getInformationLabel = this.ConfirmationEmailContainer.querySelector('.confirmation-information-label-container');
    const confirmationCodeElement = this.ConfirmationEmailContainer.querySelector('confirmation-code');

    const codeElement = this.ConfirmationEmailContainer.querySelector('confirmation-code');
    codeElement.addEventListener('complete', (e) => {
//      console.log('Event: Введен код', e.detail.code);
        // Button state changes
        sendConfirmationCodeButton.classList.add('d-block');
        sendConfirmationCodeButton.classList.remove('d-none');
    });


   getConfirmationCodeButton?.addEventListener('click', async () => {
    try {
        const request = await this.GetConfirmationEmailCode(`email`);
        console.log(request);
        
        if (request?.status !== true) {
            throw new Error(request?.message || 'Неизвестная ошибка при запросе кода');
        }

        if (!request.requestId) {
            throw new Error('Отсутствует requestId в ответе сервера');
        }

        this.requestId = request.requestId;

        // UI Updates
        confirmationCodeElement.disabled = false;
        getInformationLabel.innerHTML = 'Введите полученный код';
        getInformationLabel.classList.add('success');
        getInformationLabel.classList.remove('failed');

        getConfirmationCodeButton.classList.add('d-none');
        getConfirmationCodeButton.classList.remove('d-block');
        sendConfirmationCodeButton.classList.add('d-none');
        sendConfirmationCodeButton.classList.remove('d-block');

    } catch (error) {
        console.error('Confirmation code error:', error);
        
        // Reset UI state
        getInformationLabel.classList.remove('success');
        getInformationLabel.classList.add('failed');
        confirmationCodeElement.disabled = true;
        
        // Show appropriate error message
        const errorMessage = error?.message
            ? error.message 
            : 'Произошла непредвиденная ошибка';
        
        getInformationLabel.innerHTML = errorMessage;
        toastr.error('Ой! Что-то пошло не так...', 'Подтверждение', {timeOut: 3000});
      }
    });

    sendConfirmationCodeButton?.addEventListener('click', async () => {
	try{
	    const codeElement = document.querySelector('confirmation-code');
	    if(!codeElement) throw({message : `Element confirmation-code not found`})

            let request = await this.SendConfirmationEmailCode(codeElement.getCode(), this.requestId);
            console.log(request);
	    if(request?.status !== true) throw(request);
            codeElement.disabled = true; 
            confirmationCodeElement.disabled = false;
	    getInformationLabel.innerHTML = 'Почта подтверждена!';
 	    getInformationLabel.classList.add('success');
 	    getInformationLabel.classList.remove('failed');
 	    sendConfirmationCodeButton.disabled = true;

	  }catch(error){
   	    console.log(error);
   	    getInformationLabel.classList.remove('success');
 	    getInformationLabel.classList.add('failed');
            sendConfirmationCodeButton.disabled = false;
 	    getInformationLabel.innerHTML = error.message;
 	    toastr.error('Ой! Что то пошло не так...', 'Подтверждение', {timeOut: 3000});
	}
    });
  }
}