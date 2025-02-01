class ProfileSection extends PageBuilder {
    constructor(containerId) {
        super(containerId);
    }

    createElement(tag, className = '', innerHTML = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    }

    createButton(label, extraClass = '', onClick = null) {
        const placement = this.createElement("div", `width-100 text-end`, ``);
        const button = this.createElement("button", `profile-button ${extraClass}`, label);
	placement.append(button);
        if (onClick) button.addEventListener("click", onClick);
        return placement;
    }

    createProfileItem(label, id, placeholder, required = false, feedbackError = '') {
        const container = this.createElement("div", "profile-item-container");
        const labelElement = this.createElement("label", "form-label", label);
        labelElement.setAttribute("for", id);
        
        const inputElement = this.createElement("input", "form-control");
        inputElement.type = "text";
        inputElement.id = id;
        inputElement.placeholder = placeholder;
        if (required) inputElement.setAttribute("required", "required");
        
        const errorElement = this.createElement("div", "invalid-feedback", feedbackError);
        errorElement.id = `${id}-error`;
        errorElement.style.display = "none";
        
        container.append(labelElement, inputElement, errorElement);
        return container;
    }

    createDropdownSection(title, children = []) {
        const section = this.createElement("dropdown-section", '', `<span slot="title">${title}</span>`);
        children.forEach(child => section.appendChild(child));
        return section;
    }

    createRadioAddress(id, label) {
        return this.createElement("div", "custom-radio row", `
            <div class="col-10">
                <input class="custom-control-input" type="radio" id="${id}" name="customRadio">
                <label for="${id}" class="custom-control-label">${label}</label>
            </div>
            <div class="col-2">
                <button class="btn small-hot-button"><i class="fa-solid fa-x" style="font-size: 0.8rem;"></i></button>
            </div>
        `);
    }

    ProfileCardContainer(data = null) {
        const profileContainer = this.createElement("div", "card card-container");
        profileContainer.appendChild(this.createElement("div", "card-header", `<h3 class="card-title">Профиль</h3>`));

        const avatarName = `${data?.profile?.surname || ''} ${data?.profile?.name || ''}`.trim() || 'Аноним';
        const profileAvatar = this.createElement("div", "profile-avatar-container", `
            <div class="row w-100">
                <div class="col-4"><img src="/public/images/user-default.png" class="profile-avatar-image"></div>
                <div class="col">
                    <div class="row w-100">
                        <div class="col-12 shot-fio-container">${avatarName}</div>
                        <div class="col-12 telegram-account-container">@telegramAccount</div>
                        <div class="col-12 telegram-account-status-container"></div>
                    </div>
                </div>
            </div>
        `);
        profileContainer.appendChild(profileAvatar);

        profileContainer.appendChild(this.createProfileItem("Email", "login", "Электронный адрес", true));

        const fioSection = this.createDropdownSection("Мои данные", [
            this.createProfileItem("Фамилия", "surname", "Укажите вашу фамилию", true),
            this.createProfileItem("Имя", "firstname", "Укажите ваше имя", true),
            this.createProfileItem("Отчество", "patronymic", "Укажите ваше отчество", true),
            this.createButton("Сохранить", "text-end")
        ]);
        profileContainer.appendChild(fioSection);

        const phoneSection = this.createDropdownSection("Мой телефон", [
            this.createProfileItem("Телефон", "phone", "Укажите номер телефона", true, "Введите номер в формате +7 (XXX) XXX-XXXX"),
            this.createButton("Сохранить", "text-end")
        ]);
        profileContainer.appendChild(phoneSection);

        const addressSection = this.createDropdownSection("Мои адреса доставки", [
            this.createRadioAddress("customRadio1", "Москва, ул. Борисовские пруды 71к2 кв.10254"),
            this.createProfileItem("Добавить адрес", "address", "Укажите адрес доставки", true, "Заполните данные для доставки товара"),
            this.createButton("Сохранить", "text-end")
        ]);
        profileContainer.appendChild(addressSection);

        profileContainer.appendChild(this.createDropdownSection("Мои подписки", [this.createButton("Сохранить", "text-end")]));
        profileContainer.appendChild(this.createDropdownSection("Мои средства платежа", [this.createButton("Сохранить", "text-end")]));

        profileContainer.appendChild(this.createElement("div", "profile-button-container", `
            <button class='profile-button' style='margin-right: 2rem;'>Сохранить</button>
            <a class='session-close'>Выйти из магазина</a>
        `));

        this.addModule("Profile", profileContainer);
    }
}
