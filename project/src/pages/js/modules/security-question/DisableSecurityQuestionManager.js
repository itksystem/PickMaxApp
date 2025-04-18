class DisableSecurityQuestionManager {
    constructor() {
        this.api = new WebAPI();
        this.webRequest = new WebRequest();    
        this.addEventListeners();
        this.requestId = null;
    }

    addEventListeners(data) {
        let o = this;	
        window.addEventListener('DOMContentLoaded', () => {

        });
    }

    changeCodeActionResult(firstCode = null, secondCode = null, status = null) {
        return (firstCode != secondCode || !status) ? false : true; 
    }
    
    nextActionButtonCaption(el, isSuccess) {
        el.classList.remove('btn-success');
        el.classList.remove('btn-failed');
        el.classList.add((isSuccess ? 'btn-success' : 'btn-failed'));
        el.innerText = (isSuccess ? 'Завершить' : 'Повторить');
        return this;
    }

    nextActionRedirect(isSuccess) {
        return (isSuccess ? this.api?.PROFILE ?? `` : this.api?.PROFILE_CHANGE_DIGITAL_CODE ?? ``)
    }

    finalMessage(isSuccess) {
        return (!isSuccess)
            ? `Возникла ошибка при установке кода! Повторите попытку.`
            : 'Код установлен!';
    }

    setFinalProcessElementVisible() {
        this.secondLogin.virtualKeyboardContainer.classList.add('d-none');
        this.secondLogin.nextActionButton.classList.remove('d-none');
        this.secondLogin.nextActionButton.classList.add('d-block');
        this.secondLogin.timerEl.classList.add('d-none');
    }

    displayFinalMessage(text, isSuccess) {
        if(isSuccess) {
            this.secondLogin.showPublicMessage(text, true);
        } else {
            this.secondLogin.showPublicMessage(text, false);
        }
    }	

    createSecurityQuestionSection(data) {
        this.requestId = this.createSecurityQuestionRequestId('security-question');
        let elements = this.getElements();
        console.log(elements)
        if(!elements) {
            elements = [];
            elements.push(
                DOMHelper.divBox(`Возникла ошибка! Попробуйте позже...`,`w-100 pb-3 text-center text-red failed-security-question-label`),
                DOMHelper.createButton(`В профиль`,
                    `btn-success text-center w-100 disable-box-element`, 
                this.onDisableResultSecurityQuestionClick.bind(this)),
            )
        } else 
        elements.push(
            DOMHelper.createHL(`disable-box-element`),
            DOMHelper.divBox(`Введите ответ:`,`w-100 pb-3 disable-box-element`),
            DOMHelper.createTextBox(`answer`,`answer-text-box form-control w-100 disable-box-element`),
            DOMHelper.bottomDrawer(`content-drawer`, ``),
            DOMHelper.createButton(`Ответить`, 
                `btn-success text-center disable-box-element w-100 `, 
            this.sendAnswerSecurityQuestion.bind(this)),
            DOMHelper.createConfirmationLabel(
                (!this.requestId ? "Попробуйте через 5 минут..." : ""),
                (!this.requestId ? "failed disable-box-element" : "success disable-box-element"), ),
            DOMHelper.createBR(`answer-text-box-web-element disable-box-element`),
            DOMHelper.createLinkButton(
                `Справка`,
                `text-end pt-4 security-question-button question-button disable-box-element`, 
                this.onAboutSecurityQuestionClick.bind(this)
            ),
            DOMHelper.divBox(`Код неверен! Повторите операцию.`,`w-100 pb-3 text-center text-red failed-security-question-label disable-result-box-element d-none`),
            DOMHelper.divBox(`Контрольный вопрос отключен!`,`w-100 pb-3 text-center success-security-question-label disable-result-box-element d-none`),
            DOMHelper.createButton(`В профиль`,`btn-success text-center w-100  disable-result-box-element failed-security-question-label success-security-question-label d-none`, this.onDisableResultSecurityQuestionClick.bind(this)),
            DOMHelper.staticText(`disable-security-question-recommendation`,`disable-result-box-element failed-security-question-label success-security-question-label d-none`),

        )	
        this.container =  DOMHelper.createDropdownSection("", elements, );
        return this.container;
    }

    onDisableResultSecurityQuestionClick() {
        document.location.replace(this.api.PROFILE);
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
                contentId: `about-disable-security-code-help`,
                drawerId: this.drawer.getAttribute('drawer-id')		    
            });
        }	
        return this;
    }

    getActiveSecurityQuestionRequestIdExists() { // получить активный идентификаатор запроса
        console.log('getActiveSecurityQuestionRequestIdExists');	
        try {
            const response =  this.webRequest.get(this.api.getActiveSecurityQuestionRequestIdExists(), {}, true);
            console.log('getActiveSecurityQuestionRequestIdExists', response);	
            return response?.status ? true : false;
        } catch (error) {
            console.error('getActiveSecurityQuestionRequestIdExists ', error);
            return false;
        }
        return false;
    }

    createSecurityQuestionRequestId(requestType = null) { // создать новый активный идентификатор запроса
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

    getSecurityQuestionChangeRequestId() { // получить активный идентификаатор запроса
        console.log('getSecurityQuestionChangeRequestId');	
        try {
            const response =  this.webRequest.get(this.api.getSecurityQuestionRequestIdMethod(), {}, true);
            return response?.status ? true : false;
        } catch (error) {
            console.error('getSecurityQuestionChangeRequestId ', error);
            return false;
        }
        return false;
    }   

    securityQuestionDisableBoxDisplay(result = false) {
        const  disableBoxElements = this.container.querySelectorAll('.disable-box-element');
        const  disableResultBoxElements = result
            ? this.container.querySelectorAll('.disable-result-box-element.success-security-question-label')
            : this.container.querySelectorAll('.disable-result-box-element.failed-security-question-label');
        // отключить 
        disableBoxElements.forEach(element => {
            element?.classList.remove('d-block');
            element?.classList.add('d-none');
        });
        // включить 
        disableResultBoxElements.forEach(element => {
            element?.classList.remove('d-none');
            element?.classList.add('d-block');
        });
    }	

    sendAnswerSecurityQuestion() {
        console.log('sendAnswerSecurityQuestion');	
        try {
            const answerEl = this.container.querySelector('textarea.answer-text-box');
            const answer = answerEl.value.trim();
            console.log(answerEl, this.requestId)	
            const response =  this.webRequest.post(this.api.sendSecurityAnswerMethod(), 
                {
                    action: 'DISABLE_SECURITY_QUESTION', //  отключаем контрольный вопрос
                    answer, 
                    requestId: this.requestId
                }, true);
	    console.log(response?.status);	
            this.securityQuestionDisableBoxDisplay((response?.status == true) ?? false) 
            return response?.status ? true : false;
        } catch (error) {
            console.error('Ошибка при получении вопросов:', error);
            toastr.error('Ошибка при получении вопросов', 'Безопасность', { timeOut: 3000 });
        }
        this.securityQuestionDisableBoxDisplay(false) 
        return false;
    }

    // Отображение вопросов в интерфейсе
    getElements() {
        console.log('getElements');	
        try {
            const question = this.getSecurityQuestion();
            let questions = question ? []  : null;
            console.log(question);
            if(question) {
                questions.push(DOMHelper.spanBox(`${question[0]?.text}`, `disable-box-element`));
            }
            return questions;
        } catch (error) {
            console.error('Ошибка при получении вопросов:', error);
            toastr.error('Ошибка при получении вопросов', 'Безопасность', { timeOut: 3000 });
        }
        return [];
    }

    getSecurityQuestion() {
        console.log('getSecurityQuestion');	
        try {
            const response =  this.webRequest.get(this.api.getSecurityQuestionMethod(), {}, true);
            if(!response) throw('Ошибка при получении вопросов');
            console.log(response);
            return response?.question ? [response?.question] : null;
        } catch (error) {
            console.error('Ошибка при получении вопросов:', error);
            toastr.error('Ошибка при получении вопросов', 'Безопасность', { timeOut: 3000 });
        }
        return null;
    }
}