class ChangeSecurityQuestionManager {
    constructor() {
        this.api = new WebAPI();
        this.webRequest = new WebRequest();    
        this.addEventListeners();
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

    createSecurityQuestionSection(data) {
	 let elements = this.getElements() || [];
	 elements.push(
	    DOMHelper.createRadio(
	        -1,
	        "customQuestions",
	        `Укажу свой вопрос`,
		false,
	        'new-question',	                
	        ),
            DOMHelper.createTextBox(`question-text-box w-100`),
  	    DOMHelper.bottomDrawer(`content-drawer`, ``),
            DOMHelper.createHL(),
            DOMHelper.createButton("Установить проверку", "btn-success text-center w-100", this.saveUserQuestion.bind(this)),
            DOMHelper.createBR(),
            DOMHelper.createLinkButton(
                `О контрольном вопросе`,
                `text-end pt-4 security-question-button question-button`, 
                this.onAboutSecurityQuestionClick.bind(this)
            ),

         )   
        this.container =  DOMHelper.createDropdownSection("",  	   
	    elements,
        );
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



    saveUserQuestion(){
     return this;
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

