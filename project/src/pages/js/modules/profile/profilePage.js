class ProfileSection extends PageBuilder {
    constructor(containerId) {
        super(containerId);
        this.common = new CommonFunctions();
        this.api = new WebAPI();
        this.webRequest = new WebRequest();

        // Вынесение повторяющейся логики в общий компонент
        this.initVerificationSystem('EMAIL', 'Сохранить', 'Подтвердить');
        this.initVerificationSystem('PHONE', 'Сохранить', 'Подтвердить');

        // Инициализация менеджеров
        this.initManagers();
        this.addEventListeners();
    }

    // Общий метод для инициализации систем верификации
    initVerificationSystem(type, saveText, confirmText) {
        this[`${type.toLowerCase()}ActionNeed`] = 0;
        this[`${type}_NO_ACTION_NEED`] = 0;
        this[`${type}_SAVE_ACTION_NEED`] = 1;
        this[`${type}_CONFIRM_ACTION_NEED`] = 2;
        this[`${type}_SAVE_ACTION_DESCRIPTION`] = saveText;
        this[`${type}_CONFIRM_ACTION_DESCRIPTION`] = confirmText;
        this[`old${type}`] = '';
    }

    // Централизованная инициализация менеджеров
    initManagers() {
        this.managers = {
            email: new EmailManager(this),
            phone: new PhoneManager(this),
            profile: new ProfileManager(this),
            cards: new CardsManager(this),
	    subscriptions: new SubscriptionsManager(this),
	    address: new AddressManager(this),
	    balance: new AccountBalanceManager(),
	    location: new LocationManager(),	    	
	    security: new SecurityManager(),	    	
        };
    }

    UserProfileCardContainer(data = null) {
        const profileContainer = this.createProfileContainer();
        this.buildProfileContent(profileContainer, data);
        return profileContainer;
    }

    createProfileContainer() {
        const container = DOMHelper.createElement("div", "card card-container");
        container.appendChild(this.createHeader());
        return container;
    }

    createHeader() {
        return DOMHelper.createElement("div", "card-header", `
            <h3 class="card-title">Профиль</h3>
        `);
    }

    buildProfileContent(container, data) {
        this.addProfileAvatar(container, data);
        this.addProfileSections(container, data);
        this.addModule("Profile", container);
        this.profileContainer = container;
    }

    addProfileAvatar(container, data) {
        const avatarName = this.getAvatarName(data);
        const tgUsername = this.getTelegramUsername();
        
        container.appendChild(DOMHelper.createElement("div", "profile-avatar-container", `
            <div class="row w-100">
                <div class="col-5"><profile-picture></profile-picture></div>
                <div class="col">
                    ${this.createUserInfoSection(avatarName, tgUsername)}
                </div>
            </div>
        `));
    }

    getAvatarName(data) {
        return (data?.profile ? `${data.profile.surname || ''} ${data.profile.name || ''}`.trim() : 'Аноним');
    }

    getTelegramUsername() {
        return this.common.getTelegramWebAppObject()?.initDataUnsafe?.user?.username || '';
    }

    createUserInfoSection(name, username) {
        return `
            <div class="row w-100">
                <div class="col-12 shot-fio-container">${name}</div>
                ${username ? `
                <div class="col-12 telegram-account-container">${username}</div>
                <div class="col-12 telegram-account-status-container"></div>
                ` : ''}
            </div>
        `;
    }

    addProfileSections(container, data) {
        const sections = [
            { manager: 'profile', method: 'createProfileSection' },
            { manager: 'email',   method: 'createEmailSection' },
            { manager: 'phone',   method: 'createPhoneSection' },
            { manager: 'security',   method: 'createSecuritySection' },
            { manager: 'location',  method: 'createLocationSection' },
            { manager: 'cards',   method: 'createCardsSection' },
            { manager: 'subscriptions',   method: 'createSubscriptionsSection' },
            { manager: 'balance',   method: 'createAccountBalanceSection' },
            { manager: 'address',   method: 'createAddressesSection' },
            {
                type: 'exit',
                content: [DOMHelper.createButton("Выход", "w-100 text-center", this.exitButtonOnClick.bind(this))]
            }
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
    }


    exitButtonOnClick() {
        this.webRequest.post(this.api.closeSessionMethod(), {}, true);
        document.location.replace(this.api.LOGON_URL());
    }
}
