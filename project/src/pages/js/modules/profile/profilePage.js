// Derived class for rendering a Profile section
class ProfileSection extends PageBuilder {
    constructor(containerId) {
        super(containerId);
    }

    /** 
     * Generates the Profile section module.
     */

     ProfileCardContainer(data = null){
        const ProfileContainer = document.createElement("div");
        ProfileContainer.className = "card card-container";

        const ProfileContainerHeader = document.createElement("div");
        ProfileContainerHeader.className = "card-header";
        ProfileContainerHeader.innerHTML = `<h3 class="card-title">Профиль</h3>`;

        const ProfileContainerContent = document.createElement("div");
        ProfileContainerContent.className = "card-body";


        const ProfileContainerSaveProfileButton = document.createElement("div");
        ProfileContainerSaveProfileButton.className = "profile-button-container";
        ProfileContainerSaveProfileButton.innerHTML = `
	<button class="profile-button" style="margin-right: 2rem;" >Сохранить</button>
        <a class="session-close">Выйти из магазина</a>`;

	const ProfileConfirmedMessageContainer = document.createElement("div");
        ProfileConfirmedMessageContainer.className = "registration-confirm-message";
        ProfileConfirmedMessageContainer.innerHTML = ``;
   
        ProfileContainer.appendChild(ProfileContainerHeader);
        ProfileContainer.appendChild(ProfileContainerContent);

	let avatarName = `${(data?.profile?.surname ? data?.profile?.surname : '')} ${(data?.profile?.name ? data?.profile?.name : '')}`;
        let telegramAccount = '@telegramAccount';

        const ProfileAvatarContainer = document.createElement("div");
        ProfileAvatarContainer.className = "profile-avatar-container";
        ProfileAvatarContainer.innerHTML = `
	<div class="row w-100">
		<div class="col-4"><img src="/public/images/user-default.png " class="profile-avatar-image"></div>
		<div class="col">
			<div class="row w-100">
	  		  <div class="col-12 shot-fio-container">${avatarName == '' ? 'Аноним' : avatarName }</div>
	  		  <div class="col-12 telegram-account-container">${telegramAccount}</div>
	  		  <div class="col-12 telegram-account-status-container"></div>
	  	       </div>
	     </div>
	</div>
	`;
        ProfileContainer.appendChild(ProfileAvatarContainer);


	const verificationCodeContainer = this.ProfileItemSectionButton(`Код подтверждения`, `verificationCode`,  ``, ``, ``);
        ProfileContainer.appendChild(verificationCodeContainer);

	const EmailContainer = this.ProfileItem(`Email`, `login`,  `Электронный адрес`, `readonly`, ``);
        ProfileContainer.appendChild(EmailContainer);
        ProfileContainer.appendChild(ProfileConfirmedMessageContainer);

//  Секция "Мои данные" 

        const fioSectionContainer = document.createElement("dropdown-section");
        fioSectionContainer.innerHTML = `<span slot="title">Мои данные</spa>`;

	const FamilyContainer = this.ProfileItem(`Фамилия`,`surname`, `Укажите вашу фамилию`, `requred`, ``);
	      fioSectionContainer.appendChild(FamilyContainer);
	const NameContainer = this.ProfileItem(`Имя`,`firstname`, `Укажите ваше имя `, `requred`, ``);
	      fioSectionContainer.appendChild(NameContainer);
	const PatronymicContainer = this.ProfileItem(`Отчество`,`patronymic`, `Укажите ваше отчество `, `requred`, ``);
	      fioSectionContainer.appendChild(PatronymicContainer);
	      ProfileContainer.appendChild(fioSectionContainer);

        const fioContainerSaveProfileButton = document.createElement("div");
        fioContainerSaveProfileButton.className = "profile-button-container text-end";
        fioContainerSaveProfileButton.innerHTML = `<button class="profile-button">Сохранить</button>`;

	const fioConfirmedMessageContainer = document.createElement("div");
        fioConfirmedMessageContainer.className = "registration-confirm-message";
        fioConfirmedMessageContainer.innerHTML = ``;
        fioSectionContainer.appendChild(fioContainerSaveProfileButton);
        fioSectionContainer.appendChild(fioConfirmedMessageContainer);
//
        const phoneSectionContainer = document.createElement("dropdown-section");
              phoneSectionContainer.innerHTML = `<span slot="title">Мой телефон</spa>`;
	const PhoneContainer = this.ProfileItem(`Телефон`,`phone`, `Укажите номер телефона `, `requred`, `Пожалуйста, введите номер в формате +7 (XXX) XXX-XXXX`);
              phoneSectionContainer.appendChild(PhoneContainer);
	      ProfileContainer.appendChild(phoneSectionContainer);

        const phoneContainerSaveProfileButton = document.createElement("div");
        phoneContainerSaveProfileButton.className = "profile-button-container text-end";
        phoneContainerSaveProfileButton.innerHTML = `<button class="profile-button">Сохранить</button>`;

	const phoneConfirmedMessageContainer = document.createElement("div");
        phoneConfirmedMessageContainer.className = "profile-phone-confirm-message";
        phoneConfirmedMessageContainer.innerHTML = ``;
        phoneSectionContainer.appendChild(phoneContainerSaveProfileButton);
        phoneSectionContainer.appendChild(phoneConfirmedMessageContainer);

//
        const addressSectionContainer = document.createElement("dropdown-section");
              addressSectionContainer.innerHTML = `<span slot="title">Мои адреса доставки</spa>`;

        const addressListContainer = document.createElement("div");
              addressListContainer.className = `profile-address-list-container`;
//
/*
<div class="custom-radio">
 <input class="custom-control-input" type="radio" id="customRadio1" name="customRadio">
 <label for="customRadio1" class="custom-control-label">Custom Radio</label>
</div>
*/
        let addressContainer1 = document.createElement("div");
              addressContainer1.className = "custom-radio row";
              addressContainer1.innerHTML = `
 <div class="col-10">
	<input class="custom-control-input" type="radio" id="customRadio1" name="customRadio">
	<label for="customRadio1" class="custom-control-label">Москва, ул. Борисовские пруды 71к2 кв.10254 </label>
 </div>
 <div class="col-2"><button class="btn small-hot-button"><i class="fa-solid fa-trash"></i></button>
 </div>
`;
        addressListContainer.appendChild(addressContainer1);

         let addressContainer2 = document.createElement("div");
              addressContainer2.className = "custom-radio row";
              addressContainer2.innerHTML = `
 <div class="col-10">
	 <input class="custom-control-input" type="radio" id="customRadio2" name="customRadio">
	 <label for="customRadio2" class="custom-control-label">Москва, ул. Борисовские пруды 71к2 кв.10254 </label>
 </div>
 <div class="col-2"><button class="btn small-hot-button"><i class="fa-solid fa-trash"></i></button>
 </div>
`;
        addressListContainer.appendChild(addressContainer2);

         let addressContainer3 = document.createElement("div");
              addressContainer3.className = "custom-radio row";
              addressContainer3.innerHTML = `
 <div class="col-10">
	<input class="custom-control-input" type="radio" id="customRadio3" name="customRadio">
	<label for="customRadio3" class="custom-control-label">Москва, ул. Борисовские пруды 71к2 кв.10254 </label>
 </div>
 <div class="col-2"><button class="btn small-hot-button"><i class="fa-solid fa-trash"></i></button>
 </div>
`;
        addressListContainer.appendChild(addressContainer3);



//
        addressSectionContainer.appendChild(addressListContainer);

	const AddressContainer = this.InputAutoComplete(`Добавить адрес`,`address`,`Укажите адрес доставки`, `requred`, `Заполните данные для доставки товара`)
              addressSectionContainer.appendChild(AddressContainer);
        ProfileContainer.appendChild(addressSectionContainer);

        const addressContainerSaveProfileButton = document.createElement("div");
        addressContainerSaveProfileButton.className = "profile-button-container text-end";
        addressContainerSaveProfileButton.innerHTML = `<button class="profile-button">Сохранить</button>`;

	const addressConfirmedMessageContainer = document.createElement("div");
        addressConfirmedMessageContainer.className = "profile-phone-confirm-message";
        addressConfirmedMessageContainer.innerHTML = ``;
        addressSectionContainer.appendChild(addressContainerSaveProfileButton);
        addressSectionContainer.appendChild(addressConfirmedMessageContainer);

//
        const subscribeSectionContainer = document.createElement("dropdown-section");
              subscribeSectionContainer.innerHTML = `<span slot="title">Мои подписки</spa>`;
        ProfileContainer.appendChild(subscribeSectionContainer);

        const subscribeContainerSaveProfileButton = document.createElement("div");
        subscribeContainerSaveProfileButton.className = "profile-button-container text-end";
        subscribeContainerSaveProfileButton.innerHTML = `<button class="profile-button">Сохранить</button>`;

	const subscribeConfirmedMessageContainer = document.createElement("div");
        subscribeConfirmedMessageContainer.className = "profile-phone-confirm-message";
        subscribeConfirmedMessageContainer.innerHTML = ``;
        subscribeSectionContainer.appendChild(subscribeContainerSaveProfileButton);
        subscribeSectionContainer.appendChild(subscribeConfirmedMessageContainer);


//
        const paymentSectionContainer = document.createElement("dropdown-section");
              paymentSectionContainer.innerHTML = `<span slot="title">Мои средства платежа</spa>`;
        ProfileContainer.appendChild(paymentSectionContainer);
        const paymentContainerSaveProfileButton = document.createElement("div");
        paymentContainerSaveProfileButton.className = "profile-button-container text-end";
        paymentContainerSaveProfileButton.innerHTML = `<button class="profile-button">Сохранить</button>`;

	const paymentConfirmedMessageContainer = document.createElement("div");
        paymentConfirmedMessageContainer.className = "profile-phone-confirm-message";
        paymentConfirmedMessageContainer.innerHTML = ``;
        paymentSectionContainer.appendChild(paymentContainerSaveProfileButton);
        paymentSectionContainer.appendChild(paymentConfirmedMessageContainer);


//
        ProfileContainer.appendChild(ProfileContainerSaveProfileButton);

        this.addModule("Profile", ProfileContainer);
      }

 
  ProfileItem( label, id, placeholder, required, feedbackError) {
    const ProfileContainer = document.createElement("div");
    ProfileContainer.className = "card card-container";

    const profileItemContainer = document.createElement("div");
    profileItemContainer.className = "profile-item-container";

    // Создаем и добавляем label
    const labelElement = document.createElement("label");
    labelElement.setAttribute("for", id);
    labelElement.className = "form-label";
    labelElement.textContent = label;
    profileItemContainer.appendChild(labelElement);

    // Создаем и добавляем input
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.className = "form-control";
    inputElement.id = id;
    inputElement.placeholder = placeholder;
    if (required ) {
        inputElement.setAttribute(required, required);
    } 
    profileItemContainer.appendChild(inputElement);

    // Создаем и добавляем div для ошибки
    const errorElement = document.createElement("div");
    errorElement.id = `${id}-error`;
    errorElement.className = "invalid-feedback";
    errorElement.style.display = "none";
    errorElement.textContent = feedbackError;
    profileItemContainer.appendChild(errorElement);
    return profileItemContainer;
  }


 InputAutoComplete(label, id, placeholder, required, feedbackError) {
    const container = document.createElement("div");
    container.className = "profile-input-group";

    // Создаем label
    const labelElement = document.createElement("label");
    labelElement.setAttribute("for", id);
    labelElement.className = "form-label";
    labelElement.textContent = label;
    container.appendChild(labelElement);

    // Создаем x-autocomplete
    const autoCompleteElement = document.createElement("x-autocomplete");
    autoCompleteElement.id = id;
    autoCompleteElement.placeholder = placeholder;
    autoCompleteElement.setAttribute("url", "/api/bff/client/v1/town");
    if (required) {
        autoCompleteElement.setAttribute("required", "required");
    }
    container.appendChild(autoCompleteElement);

    // Создаем div для ошибки
    const errorElement = document.createElement("div");
    errorElement.id = `${id}-error`;
    errorElement.className = "invalid-feedback";
    errorElement.style.display = "none";
    errorElement.textContent = feedbackError;
    container.appendChild(errorElement);

    return container;                                    
  }



  ProfileItemSectionButton( label, id, placeholder, required, feedbackError) {
    const profileItemSectionContainer = document.createElement("dropdown-section");
    profileItemSectionContainer.className = "registration-confirm-form";
    profileItemSectionContainer.innerHTML = `
        <span slot="title">Подтверждение регистрации</spa>    
        <div style="margin: 1rem 0.1rem; text-align: center;">Введите код отправленный на вашу электронную почту</div>
	<div class="profile-item-container">	
 	 <div class="row">
	    <div class="col-4"></div>
	    <div class="col-4"><input type="text" class="form-control" id="${id}" placeholder="${placeholder}"></div>
	    <div class="col-4"></div>
        </div>
	<div class="row">
	    <div class="col-2"></div>
	    <div class="col-8 text-center"><button type="button" class="confirm-code-button" id="${id}-button">Отправить код</button></div>
	    <div class="col-2"></div>
	    
        </div>
	<div class="row">
            <div id="${id}-error" class="invalid-feedback" style="display: none;"></div>
        </div>
      </div>
    `;
    return profileItemSectionContainer;
  }


}
