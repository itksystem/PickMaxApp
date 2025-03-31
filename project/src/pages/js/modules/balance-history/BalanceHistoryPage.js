class BalanceHistorySection extends PageBuilder {
    constructor(containerId) {
        super(containerId);
        this.common = new CommonFunctions();
        this.api = new WebAPI();
        this.webRequest = new WebRequest();

        // Инициализация менеджеров
        this.initManagers();
        this.addEventListeners();
    }

    // Централизованная инициализация менеджеров
    initManagers() {
        this.managers = {
//            deposit: new DepositAccountManager(this), // внесение средств
            operations: new OperationsAccountManager(this), // списание средств
        };
    }


    BalanceHistoryCardContainer(data = null) {
        const balanceHistoryContainer = this.createBalanceHistoryContainer();
        this.buildBalanceHistoryContent(balanceHistoryContainer, data);
        return balanceHistoryContainer;
    }

    createBalanceHistoryContainer() {
        const container = DOMHelper.createElement("div", "card balance-history-card-container");
        container.appendChild(this.createHeader());
        return container;
    }

    createHeader() {
        return DOMHelper.createElement("div", "card-header", `<h3 class="card-title">История операций</h3>`);
    }

    buildBalanceHistoryContent(container, data) {
        this.addBalanceHistorySections(container, data);
        this.addModule("Profile", container);
        this.balanceHistoryContainer = container;
    }

    addBalanceHistorySections(container, data) {
      const sections = [
//        { manager: 'deposit', method: 'createDepositSection' },
        { manager: 'operations',   method: 'createOperationsSection' },
      ];
    
    sections.forEach(section => {
        if (section.manager && this.managers[section.manager]) {
            const sectionElement = this.managers[section.manager][section.method](data);
            if (sectionElement instanceof Node) {  // Проверяем, что это DOM-элемент
                container.appendChild(sectionElement);
            } else {
                console.error(`Метод ${section.method} не вернул валидный DOM-элемент`);
            }
        } else {
            console.error(`Менеджер ${section.manager} не найден`);
        }
       });
      }
   

    showNotification(type, message, title) {
        toastr[type](message, title, { timeOut: 3000 });
    }

    addEventListeners() {
        if (typeof eventBus === 'undefined') {
            console.error('eventBus не определен');
            return;
        }
    }
}
