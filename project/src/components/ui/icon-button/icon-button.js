class IconButton extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.active = false; // Изначальное состояние
        this.api = new WebAPI();
    }

    connectedCallback() {
        // Проверяем атрибут template и извлекаем значения для action, action-success, action-failed, redirect
        const template = this.getAttribute('template');
        const templateData = this.getTemplateData(template);

        this.id = this.getAttribute('id');
        this.readonly = this.getAttribute('readonly') || this.getAttribute('readonly') || true ;
        this.iconPassive = this.getAttribute('icon-passive') || templateData?.iconPassive || '';
        this.iconActive = this.getAttribute('icon-active') || templateData?.iconActive || '';
        this.value = this.getAttribute('value') || '';

        this.templateName = templateData?.templateName || ''; // имя шаблона
        this.redirect = this.getAttribute('redirect') || templateData?.redirect || ''; // если redirect из templateData

        this.action = this.getAttribute('action') || templateData?.action || ''; // если action из templateData
        this.actionFailed = this.getAttribute('action-failed') || templateData?.actionFailed || ''; // если action-failed из templateData
        this.actionSuccess = this.getAttribute('action-success') || templateData?.actionSuccess || ''; // если action-success из templateData
        if(this.actionSuccess)
            this.setAttribute('action-success', this.actionSuccess || ''); 
        if(this.actionFailed)
            this.setAttribute('action-failed', this.actionFailed || '');

        this.title = this.getAttribute('title') || '';

   /* Установить состояние элемента  */
        this.active = this.getValue() > 0;
        this.render();

    // Добавление обработчика клика
        this.shadowRoot.querySelector('button').addEventListener('click', () => this.handleClick());
    }

   getValue(){
        let value = this.getAttribute('value');
    return (value) ? value : 0;
   }


    // Получаем данные на основе template
    getTemplateData(template) {
       let o = this; 
       const templates = {
            'window.history.back': {
                templateName: 'window.history.back',
		iconPassive :`<svg width="45" height="35" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">                    
				  <path d="M18 8L12 14L18 20" class="back-arrow" stroke="white" stroke-width="4" fill="none"></path>
				  <path d="M18 14H14 31" class="back-arrow" stroke="white" stroke-width="4" fill="none"></path>
				  <path d="M18 8L12 14L18 20" class="back-arrow" stroke="black" stroke-width="2" fill="none"></path>
				  <path d="M18 14H14 30" class="back-arrow" stroke="black" stroke-width="2" fill="white"></path>
				</svg>`,
  	        iconActive : `
			<svg width="45" height="35" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">                    
				  <path d="M18 8L12 14L18 20" class="back-arrow" stroke="white" stroke-width="4" fill="none"></path>
				  <path d="M18 14H14 31" class="back-arrow" stroke="white" stroke-width="4" fill="none"></path>
				  <path d="M18 8L12 14L18 20" class="back-arrow" stroke="black" stroke-width="2" fill="none"></path>
				  <path d="M18 14H14 30" class="back-arrow" stroke="white" stroke-width="2" fill="red"></path>
				</svg>`
	     },
            'like': {
                templateName: 'like',
                action: `${o.api.setProductLikeMethod(o.id)}`,
		iconPassive : `<svg width="35" height="35" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" 
			class="like" stroke="black" stroke-width="2" fill="white"/>
			</svg>`,
  	        iconActive : `
			<svg width="35" height="35" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" 
			class="like" stroke="white" stroke-width="2" fill="red"/>`
            },
            // Добавьте другие шаблоны по необходимости
            'like1': {
                templateName: 'like1',
                action: `${o.api.setProductLikeMethod(o.id)}`,
                actionSuccess: 'https://example.com/success2',
                actionFailed: 'https://example.com/failed2',
                redirect: 'https://example.com/redirect2',
		iconPassive : `<svg width="35" height="35" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" 
			class="like" stroke="black" stroke-width="2" fill="white"/>
			</svg>`,
  	        iconActive : `
			<svg width="35" height="35" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" 
			class="like" stroke="white" stroke-width="2" fill="red"/>`
            },

        };

        return templates[template] || {};
    }

    async handleClick() {
	console.log(this.templateName);
        if(this.templateName == 'window.history.back') {
	   window.history.back();
	   return;
	} else
        if (this.redirect) {
            window.location.href = this.redirect;
        } else {
            try {
                const response = await fetch(this.action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: this.active ? false : true })
                });

                if (!response.ok) {
                    throw new Error(`Ошибка запроса: ${response.statusText}`);
                }

                const result = await response.json();
                console.log(result)
                if (typeof result.status === 'boolean') {
                    this.active = (result.status ? 1 : 0);
                    this.updateIcon();

                    // Если атрибут redirect задан, перенаправляем
                    if (this.actionSuccess) {
                        window.location.href = this.actionSuccess;
                    }

                } else {
                    console.warn('Некорректный формат ответа от сервера');
                }

            } catch (error) {
                console.error('Ошибка при выполнении POST-запроса:', error);
  	        toastr.error('Что-то пошло не так...', 'Ой!', {timeOut: 3000});
                if (this.actionFailed) {
                    window.location.href = this.actionFailed;
                }
            }
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 4px;
                    position: absolute;
                    z-index: 100;
                    width: 2rem;
                }
                button:focus {
                    outline: none;
                }
                .icon {
                    width: 24px;
                    height: 24px;
                }
            </style>
            <button title="${this.title}">
                <div class="icon">
                    ${this.active ? this.iconActive : this.iconPassive}
                </div>
            </button>
        `;
    }

    updateIcon() {
        const iconContainer = this.shadowRoot.querySelector('.icon');
        iconContainer.innerHTML = this.active ? this.iconActive : this.iconPassive;
    }
}

// Регистрация элемента
customElements.define('icon-button', IconButton);
