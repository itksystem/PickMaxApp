// Derived class for rendering a Profile section
class ProfileSection extends PageBuilder {
    constructor(containerId) {
        super(containerId);
    }

    /** 
     * Generates the Profile section module.
     */

     ProfileCardContainer(){
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

	const verificationCodeContainer = this.ProfileItemSectionButton(`Код подтверждения`, `verificationCode`,  ``, ``, ``);
        ProfileContainer.appendChild(verificationCodeContainer);

	const EmailContainer = this.ProfileItem(`Email`, `login`,  `Электронный адрес`, `readonly`, ``);
        ProfileContainer.appendChild(EmailContainer);
        ProfileContainer.appendChild(ProfileConfirmedMessageContainer);

	const FamilyContainer = this.ProfileItem(`Фамилия`,`surname`, `Укажите вашу фамилию`, `requred`, ``);
        ProfileContainer.appendChild(FamilyContainer);

	const NameContainer = this.ProfileItem(`Имя`,`firstname`, `Укажите ваше имя `, `requred`, ``);
        ProfileContainer.appendChild(NameContainer);

	const PatronymicContainer = this.ProfileItem(`Отчество`,`patronymic`, `Укажите ваше отчество `, `requred`, ``);
        ProfileContainer.appendChild(PatronymicContainer);

	const PhoneContainer = this.ProfileItem(`Телефон`,`phone`, `Укажите номер телефона `, `requred`, `Пожалуйста, введите номер в формате +7 (XXX) XXX-XXXX`);
        ProfileContainer.appendChild(PhoneContainer);


	const AddressContainer = this.InputAutoComplete(`Адрес`,`address`,`Укажите адрес доставки`, `requred`, `Заполните данные для доставки товара`)
        ProfileContainer.appendChild(AddressContainer);


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
        <span slot="title">Подтверждение регистрации</span>    
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
