import { EmailManager } from './EmailManager.js';
import { PhoneManager } from './PhoneManager.js';
import { ProfileManager } from './ProfileManager.js';
import { DOMHelper } from './DOMHelper.js';
import { CommonFunctions } from './CommonFunctions.js';
import { WebAPI } from './WebAPI.js';
import { WebRequest } from './WebRequest.js';
import { ClientSubscriptionsDialog } from './clientSubscriptionsDialog.js';
import { ClientAddressDialog } from './clientAddressDialog.js';
import { ClientCardsDialog } from './clientCardsDialog.js';
import { InputMaskValidator } from '../../../../store/validators/InputMaskValidators.js'; //
import { PageBuilder } from '../../../../pages/js/modules/page-builder.js';

export class ProfileSection extends PageBuilder {
    constructor(containerId) {
        super(containerId);
        this.common = new CommonFunctions();
        this.api = new WebAPI();
        this.webRequest = new WebRequest();
        
        this.emailManager = new EmailManager(this);
        this.phoneManager = new PhoneManager(this);
        this.profileManager = new ProfileManager(this);
        
        this.addressesContainer = null;
        this.profileContainer = null;
        
        this.addEventListeners();
    }

    UserProfileCardContainer(data = null) {
        const profileContainer = DOMHelper.createElement("div", "card card-container");
        profileContainer.appendChild(DOMHelper.createElement("div", "card-header", `<h3 class="card-title">Профиль</h3>`));

        // Аватар и основная информация
        this.addProfileAvatar(profileContainer, data);
        
        // Секции профиля
        this.addProfileSections(profileContainer, data);
        
        this.addModule("Profile", profileContainer);
        this.profileContainer = profileContainer;
        
        return profileContainer;
    }

    addProfileAvatar(container, data) {
        const avatarName = data ? `${data.profile?.surname || ''} ${data.profile?.name || ''}`.trim() || 'Аноним' : 'Аноним';
        const tg = this.common.getTelegramWebAppObject();
        const tgUsername = (tg?.initDataUnsafe ? tg?.initDataUnsafe?.user?.username : null);
        
        const profileAvatar = DOMHelper.createElement("div", "profile-avatar-container", `
            <div class="row w-100">
                <div class="col-5">
                    <profile-picture></profile-picture>
                </div>
                <div class="col">
                    <div class="row w-100">
                        <div class="col-12 shot-fio-container">${avatarName}</div>
                        <div class="col-12 telegram-account-container">${!tgUsername ? '' : tgUsername}</div>
                        <div class="col-12 telegram-account-status-container"></div>
                    </div>
                </div>
            </div>
        `);
        container.appendChild(profileAvatar);
    }

    addProfileSections(container, data) {
        // Секция ФИО
        container.appendChild(this.profileManager.createProfileSection(data));
        
        // Секция Email
        container.appendChild(this.emailManager.createEmailSection(data));
        
        // Секция Телефона
        container.appendChild(this.phoneManager.createPhoneSection(data));
        
        // Секция подписок
        const subscriptionsDialog = new ClientSubscriptionsDialog();
        const subscriptionElements = subscriptionsDialog.getElements() || [];
        container.appendChild(DOMHelper.createDropdownSection("Мои подписки", subscriptionElements));
        
        // Секция адресов
        this.addAddressSection(container);
        
        // Секция карт
        const cardDialog = new ClientCardsDialog();
        container.appendChild(DOMHelper.createDropdownSection("Мои средства платежа", cardDialog.getElements() || []));
        
        // Секция выхода
        container.appendChild(DOMHelper.createDropdownSection("Выход из системы", [
            DOMHelper.createButton("Выход", "w-100 text-center", this.exitButtonOnClick.bind(this))
        ]));
    }

    addAddressSection(container) {
        this.addressesContainer = DOMHelper.createElement("div", "addresses-card-container");
        const addressDialog = new ClientAddressDialog();
        
        addressDialog.getElements().forEach(item => {
            this.addressesContainer.appendChild(item);
        });

        const addressElements = [
            this.addressesContainer,
            addressDialog.AddressAutoComplete(
                "Добавить адрес",
                "address",
                "Укажите адрес доставки",
                true,
                "Заполните данные для доставки товара"
            ),
            DOMHelper.createButton("Сохранить", "text-end", this.saveAddress.bind(this))
        ];

        container.appendChild(DOMHelper.createDropdownSection("Мои адреса доставки", addressElements));
    }

    async saveAddress() {
        try {
            const autocomplete = document.getElementById('address');
            const address = autocomplete.getObject();
            
            await this.webRequest.post(
                this.api.addDeliveryAddressMethod(),
                address,
                true
            );
            
            autocomplete.setValue('');
            toastr.success('Адрес успешно сохранен', 'Доставка', { timeOut: 3000 });
            
            if (eventBus) {
                eventBus.emit("ClientAddressDialogReload", {});
            }
        } catch (error) {
            console.error('Ошибка при сохранении адреса:', error);
            toastr.error('Не удалось сохранить адрес', 'Ошибка', { timeOut: 3000 });
        }
    }

    addEventListeners() {
        if (typeof eventBus !== 'undefined' && eventBus) {
            eventBus.on('ClientAddressDialogReload', () => {
                let addressDialog = new ClientAddressDialog();
                this.addressesContainer.innerHTML = ``;
                addressDialog.getElements().forEach((item) => {
                    this.addressesContainer.appendChild(item);
                });
            });
        } else {
            console.error('eventBus не определен');
        }
    }

    exitButtonOnClick() {
        let request = this.webRequest.post(this.api.closeSessionMethod(), {}, true);
        document.location.replace(this.api.LOGON_URL());
    }
}
