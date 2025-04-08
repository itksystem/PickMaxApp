class ContentBottomDrawer extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        // Подключаем стили
        ['bottom-drawer.css', 'bootstrap.min.css'].forEach(file => {
            const link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('href', `/src/${file.includes('bootstrap') ? 'pages/css' : 'components/ui/bottom-drawer/css'}/${file}`);
            this.shadowRoot.appendChild(link);
        });

        // Разметка
        this.shadowRoot.innerHTML += `
            <div class="bottom-drawer">
                <div class="bottom-drawer__content">
                    <slot></slot>
                </div>
                <div class="bottom-drawer__actions">
                    <div class="row w-100">	
                        <div class="col text-center">
                            <button class="w-100 bottom-drawer__button bottom-drawer__button--close">Закрыть</button>
                        </div>
                        ${!this.getAttribute('action-id') ? '' : `
                            <div class="col text-center">
                                <button class="w-100 bottom-drawer__button bottom-drawer__button--action">${this.getAttribute('action-text') || 'Выполнить'}</button>
                            </div>`}
                    </div>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        this.drawerId = this.getAttribute("drawer-id") || 0;
        this.drawer = this.shadowRoot.querySelector('.bottom-drawer');
        this.closeButton = this.shadowRoot.querySelector('.bottom-drawer__button--close');
        this.actionButton = this.shadowRoot.querySelector('.bottom-drawer__button--action');
        this.contentContainer = this.shadowRoot.querySelector('.bottom-drawer__content');
        this.isOpen = false;

        this.attachEvents();
    }

    attachEvents() {
        this.closeButton.addEventListener('click', () => this.close());
        this.actionButton?.addEventListener('click', () => this.triggerAction());
	/* Обработка события удаления  картинки */
	let actionId = this.getAttribute('action-id');
	console.log(actionId);
	let o = this;
 	eventBus?.on("ContentBottomDrawerOpen",async (message) => {
	  const content = await o.getContent(message.contentId);
	  o.setContent(content);
	  o.open();
	});	    
    }

    handleOutsideClick(event) {
        if (this.isOpen && !this.shadowRoot.contains(event.target) && !this.contains(event.target)) {
            this.close();
        }
    }

    open() {
        this.isOpen = true;
        this.drawer.classList.add('open');
    }

    async getContent(contentId = null) {
       if (!contentId) {
	    return `<div class="help-content-not-found">Информация не найдена</div>`;
       }  
       const contentUrl = `/public/help/${contentId}.html`;
       return await this.fetchContent(contentUrl);
    }


    async fetchContent(url) {
	  try {
	    const response = await fetch(url);
	    
	    if (!response.ok) {
	      throw new Error(`HTTP error! status: ${response.status}`);
	    }
    
	    return await response.text();
	  } catch (error) {
	    console.error('Failed to fetch content:', error);
	    return `
	      <div class="error-message">
	        Не удалось загрузить контент. Ошибка: ${error.message}
	      </div>
	    `;
	  }
	}

  // API метода для обновления контента
     setContent(content) {
         this.innerHTML = content;
     }

    appendContent(content) {
        const div = document.createElement('div');
        div.innerHTML = content;
        this.appendChild(div);
    }

    close() {
        this.isOpen = false;
        this.drawer.classList.remove('open');
    }

    triggerAction() {
        const actionId = this.getAttribute('action-id') || 'unknown';
        const drawerId = this.drawerId || '';
        let event = {
            detail: { actionId, drawerId },
            bubbles: true,
            composed: true
        };
        this.dispatchEvent(new CustomEvent(actionId, event));
        console.log(event);
        this.close();
    }

    setContent(content) {
        if (typeof content === 'string') {
            this.contentContainer.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            this.contentContainer.innerHTML = '';
            this.contentContainer.appendChild(content);
        } else {
            console.warn('Content must be a string or HTMLElement');
        }
    }
}

customElements.define('content-bottom-drawer', ContentBottomDrawer);
