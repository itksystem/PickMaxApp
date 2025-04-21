class ChangeSecurityQuestionManager {
    constructor() {
        this.api = new WebAPI();
        this.webRequest = new WebRequest();    
        this.addEventListeners();
	this.SAVE_SECURITY_QUESTION_ERROR='Ошибка при сохранении контрольного вопроса';
    }

    addEventListeners(data) {
     let o = this;	
     window.addEventListener('DOMContentLoaded', () => {

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

    mySecurityQuestionBoxDisplay(visible = false) {
    const labelElement = this.container.querySelector('div.question-text-box-label');
    const textElement = this.container.querySelector('textarea.question-text-box');
     
     [labelElement, textElement].forEach(element => {
        element.classList.remove(visible ? 'd-none' : 'd-block');
        element.classList.add(visible ? 'd-block' : 'd-none');
     });
   }	

    securityQuestionBoxResultDisplay(result = false) {
     const questionTextBoxLabel = this.container.querySelector('div.question-text-box-label');
     const questionTextBox = this.container.querySelector('textarea.question-text-box');

     const questions = this.container.querySelectorAll('.custom-radio.row, .security-question-web-element');

     const answerTextBoxLabel = this.container.querySelector('div.answer-text-box-label');
     const answerTextBox = this.container.querySelector('textarea.answer-text-box');

     const contentDrawer = this.container.querySelector('content-drawer');
     const successButton= this.container.querySelector('.btn-send-request');

     const successResultTextBoxLabel = this.container.querySelector('div.success-result-text-box-label');
     const failedResultTextBoxLabel = this.container.querySelector('div.failed-result-text-box-label');

     const resultQuestionButton = this.container.querySelector('button.result-question-button');

     [questionTextBoxLabel, questionTextBox, answerTextBoxLabel,  answerTextBox, contentDrawer, successButton, 
      ].forEach(element => {
          element?.classList.remove('d-block');
          element?.classList.add('d-none');
       });

     questions.forEach(element => {
          element?.classList.remove('d-block');
          element?.classList.add('d-none');
       });

     successResultTextBoxLabel?.classList.remove(result ? 'd-none' : 'd-block')
     successResultTextBoxLabel?.classList.add(result ? 'd-block' : 'd-none'); 

     failedResultTextBoxLabel?.classList.remove(!result ? 'd-none' : 'd-block')
     failedResultTextBoxLabel?.classList.add(!result ? 'd-block' : 'd-none'); 

     resultQuestionButton?.classList.remove('d-none'); 
     resultQuestionButton?.classList.add('d-block'); 

    }	


    createSecurityQuestionSection(data) {
	 let elements = this.getElements() || [];
	 elements.push(
	    DOMHelper.createRadio(
	        -1,
	        "customQuestions",
	        `Укажу свой вопрос`,
		false,
		this.radionButtonOnClick.bind(this)
	        ),
	    DOMHelper.divBox(`Введите свой вопрос`,`question-text-box-label w-100 pb-2 pt-3 d-none`),
            DOMHelper.createTextBox(`question-text-box`,`question-text-box form-control w-100 d-none`),
	    DOMHelper.divBox(`Введите ответ`,`w-100 pb-2 pt-3 answer-text-box-label`),
            DOMHelper.createTextBox(`answer-text-box`,`answer-text-box form-control w-100`),
  	    DOMHelper.bottomDrawer(`content-drawer`, ``),
            DOMHelper.createHL(`security-question-web-element`),
            DOMHelper.createButton("Установить проверку", "btn-send-request text-center w-100", this.saveSecurityQuestion.bind(this)),
            DOMHelper.createBR(`security-question-web-element`),
	    DOMHelper.divBox(
		`Контрольный вопрос установлен!`,
		`success-result-text-box-label text-center w-100 pb-2 pt-3 d-none`),
	    DOMHelper.divBox(
		`Возникла ошибка, повторите попытку.`,
		`failed-result-text-box-label text-center w-100 pb-2 pt-3 d-none`),
            DOMHelper.createButton(
                `В профиль`,
                `text-center result-question-button btn-success d-none`, 
                this.onResultSecurityQuestionClick.bind(this)
            ),
            DOMHelper.createLinkButton(
                `О контрольном вопросе`,
                `text-end pt-4 security-question-button question-button`, 
                this.onAboutSecurityQuestionClick.bind(this)
            ),
	    DOMHelper.staticText(`change-security-question-recommendation`),

         )   
        this.container =  DOMHelper.createDropdownSection("",  	   
	    elements,
        );
	return this.container;
     }

      onResultSecurityQuestionClick(){
         document.location.replace(this.api.PROFILE);
      }
 
      radionButtonOnClick(e){       
	this.mySecurityQuestionBoxDisplay((e == -1))  
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


    createSecurityQuestionRequestId(requestType = null){ // создать новый активный идентификатор запроса
       console.log('createSecurityQuestionRequestIdMethod ');	
        try {
            const response =  this.webRequest.post(this.api.createSecurityQuestionRequestIdMethod(), {requestType}, true);
  	    console.log(response);
            return response?.requestId ?? null;
        } catch (error) {
            console.error('createSecurityQuestionRequestIdMethod ', error);
            return false;
        }
       return false;
    }


    saveSecurityQuestion(){
        try {
            const requestId = this.createSecurityQuestionRequestId(`custom-question`);
	    if(!requestId) throw(this.SAVE_SECURITY_QUESTION_ERROR);	
	    const selectedQuestion = this.container.querySelector('input[name="customQuestions"]:checked');	
 	    let factorId     = selectedQuestion?.value == -1 ? null : selectedQuestion?.value; 
	    const myQuestion = this.container.querySelector('textarea[id="question-text-box"]');	
	    const myAnswer   = this.container.querySelector('textarea[id="answer-text-box"]');	
	    let factorText   = myQuestion?.value ?? null; 
	    let answerText   = myAnswer?.value ?? null; 
	    console.log(factorId, factorText, answerText, requestId);	
	    if((!factorText && !factorId) && (!answerText)) throw(this.SAVE_SECURITY_QUESTION_ERROR);		
            const response   = this.webRequest.post(
	      this.api.setSecurityQuestionMethod(), 
              { factorId, factorText, answerText, requestId }, 
	      true
	    );
	    if(!response || response?.status != true) throw(this.SAVE_SECURITY_QUESTION_ERROR);	
	    this.securityQuestionBoxResultDisplay(true)
            return response;
        } catch (error) {
            console.error(error);
            toastr.error(error, 'Безопасность', { timeOut: 3000 });
	    this.securityQuestionBoxResultDisplay(false)
            return null;
        }
    }

    // Отображение вопросов в интерфейсе
    getElements() {
	    try {
	        const questions = this.getSecurityQuestions();

	        const elements = questions.map(question => 
	            DOMHelper.createRadio(
	                question.questionId,
	                "customQuestions",
	                `${question.question}`,
	                 null,
			 this.radionButtonOnClick.bind(this)
	            )
	        );
                              
	        return elements;
	    } catch (error) {
	        console.error('Ошибка при получении вопросов:', error);
	        toastr.error('Ошибка при получении вопросов', 'Безопасность', { timeOut: 3000 });
	        return [];
	    }
      }


    getSecurityQuestions() {
        try {
            const response =  this.webRequest.get(this.api.getSecurityQuestionsMethod(), {}, true);
	    if(response?.status != true) throw('Ошибка при получении вопросов');
            return response?.questions || [];
        } catch (error) {
            console.error('Ошибка при получении вопросов:', error);
            toastr.error('Ошибка при получении вопросов', 'Безопасность', { timeOut: 3000 });
            return [];
        }
    }

}

