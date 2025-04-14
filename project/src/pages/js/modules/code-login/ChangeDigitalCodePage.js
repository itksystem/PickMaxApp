class ChangeDigitalCodePageSection extends PageBuilder {
    constructor(containerId) {
        super(containerId);
        this.common = new CommonFunctions();
        this.api = new WebAPI();
        this.webRequest = new WebRequest();
        this.initManagers();
        this.addEventListeners();	     
    }
    
    initManagers() { // Централизованная инициализация менеджеров
        this.managers = {
            DigitalCode: new SetLoginCodeManager(this),
        };
    }

    ChangeDigitalCodeCardContainer(data = null) {
        const digitalCodeContainer = this.createDigitalCodeContainer();
        this.buildDigitalCodeContent(digitalCodeContainer, data);
        return digitalCodeContainer;
    }

    createDigitalCodeContainer() {
        const container = DOMHelper.createElement("div", "card card-container");
        container.appendChild(this.createHeader());
        return container;
    }

    createHeader() {
        return DOMHelper.createElement("div", "card-header", `
            <h3 class="card-title">Установка PIN-кода</h3>
        `);
    }

    buildDigitalCodeContent(container, data) {
        this.addDigitalCodeSections(container, data);
        this.addModule("DigitalCode", container);
        this.DigitalCodeContainer = container;
    }

    addDigitalCodeSections(container, data) {
        const sections = [
            { manager: 'DigitalCode', method: 'createDigitalCodeSection' },
    ];

    sections.forEach(section => {
      if (section.manager) {
          container.appendChild(this.managers[section.manager][section.method](data));
        } else {
          container.appendChild(this.createDynamicSection(section));
       }
     });
    }

    createDynamicSection(section) {
        switch(section.type) {
            case 'exit':
                return DOMHelper.createDropdownSection("Выход из системы", section.content);
            default:
                return DOMHelper.createDropdownSection(section.title, section.content);
        }
    }

    showNotification(type, message, title) {
        toastr[type](message, title, { timeOut: 3000 });
    }

    addEventListeners() {
        if (typeof eventBus === 'undefined') {
            console.error('eventBus не определен');
            return;
        }
     // Обработка события проверки кода
     document.addEventListener('DOMContentLoaded', () => {
       const firstLogin = document.querySelector('.login-code');
       const secondLogin = document.querySelector('.login-code-repeat');
       const api = new WebAPI();
       const webRequest = new WebRequest();    
      
       firstLogin.addEventListener('code-submitted', (e) => {
         // Hide first login and show second one
         firstLogin.visible = false;
         secondLogin.visible = true;
        
         // Focus first digit of second login
         setTimeout(() => {
           const digits = secondLogin.shadowRoot.querySelectorAll('.code-digit');
           if (digits.length > 0) {
             digits[0].focus();
           }
         }, 100);
       });
      
      secondLogin.addEventListener('code-submitted', (e) => {
        // Both codes have been entered - you can now compare them
        const firstCode = firstLogin.codeValues.join('');
        const secondCode = secondLogin.codeValues.join('');
        if (firstCode === secondCode) {		
            const response =  this.webRequest.get(api.setDigitalCodeMethod(), { code : firstCode}, true);
              if(response?.status) {
	          window.location.replace('/login-check/success/page');
	      } else 	
 	   window.location.replace('/login-check/failed/page');
	}
      });
    });
   }

    exitButtonOnClick() {
        this.webRequest.post(this.api.closeSessionMethod(), {}, true);
        document.location.replace(this.api.LOGON_URL());
    }
}
