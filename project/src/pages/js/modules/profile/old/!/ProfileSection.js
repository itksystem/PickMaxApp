class ProfileSection extends PageBuilder {
    constructor(containerId) {
        super(containerId);
        this.apiService = new ApiService();
        this.profileManager = new ProfileManager(containerId, this.apiService);
        this.telegramBot = 'https://t.me/pickmaxbot';
        this.telegramVerificationLink = 'owjejehi919k2jj21k1k1j1k1k1konn1ggnk1k26383h';
        return this;
    }

    UserProfileCardContainer(data = null) {
        const profileContainer = DOMHelper.createElement("div", "card card-container");
        profileContainer.appendChild(DOMHelper.createElement("div", "card-header", `<h3 class="card-title">Профиль</h3>`));

        const avatarName = `${data?.profile?.surname || ''} ${data?.profile?.name || ''}`.trim() || 'Аноним';
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

        profileContainer.appendChild(profileAvatar);

        const fioSection = this.createDropdownSection("Мои данные", [
            DOMHelper.createProfileItem("Фамилия", "surname", "Укажите вашу фамилию", true, ``, `${data?.profile?.surname || ''}`),
            DOMHelper.createProfileItem("Имя", "firstname", "Укажите ваше имя", true, ``, `${data?.profile?.name || ''}`),
            DOMHelper.createProfileItem("Отчество", "patronymic", "Укажите ваше отчество", true, ``, `${data?.profile?.patronymic || ''}`),
            DOMHelper.createButton("Сохранить", "text-end", this.profileManager.saveProfileButtonOnClick.bind(this.profileManager))
        ]);
        profileContainer.appendChild(fioSection);

        this.profileManager.oldEmail = data?.profile?.email;
        const emailButtonName = (data?.profile?.email) ? (data?.profile?.isEmailConfirmed ? "Сохранить" : "Подтвердить") : "Сохранить";
        const emailSection = this.createDropdownSection("Электронный адрес", [
            DOMHelper.createProfileItem("Email", "email", "Электронный адрес", true, ``, `${data?.profile?.email || ''}`),
            DOMHelper.createConfirmationLabel(
                (data?.profile?.isEmailConfirmed ? "Email подтвержден" : "Email необходимо подтвердить!"),
                (data?.profile?.isEmailConfirmed ? "confirmation-label-success" : "confirmation-label-error")
            ),
            DOMHelper.createButton(emailButtonName, "text-end email-save-button disabled", this.profileManager.saveEmailButtonOnClick.bind(this.profileManager))
        ]);
        profileContainer.appendChild(emailSection);

        const phoneSection = this.createDropdownSection("Мой телефон", [
            DOMHelper.createProfileItem("Телефон", "phone", "Укажите номер телефона", true, 
                "Введите номер в формате +7 (XXX) XXX-XXXX",
                `${data?.profile?.phone || ''}`),
            DOMHelper.createButton("Сохранить", "text-end", this.profileManager.savePhoneButtonOnClick.bind(this.profileManager))
        ]);
        profileContainer.appendChild(phoneSection);

        // Остальные секции (подписки, адреса, карты) можно добавить аналогично

        this.addModule("Profile", profileContainer);
        this.profileContainer = profileContainer;
        this.addEventListeners();
    }
}

