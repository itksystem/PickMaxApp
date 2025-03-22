
class ProfileSection extends PageBuilder {

    constructor(containerId) {
        super(containerId);
        this.telegramBot = 'https://t.me/pickmaxbot';
        this.telegramVerificationLink = 'owjejehi919k2jj21k1k1j1k1k1konn1ggnk1k26383h';
        this.common = new CommonFunctions();
        this.oldEmail = '';
        return this;
    }

    createElement(tag, className = '', innerHTML = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    }

    createButton(label, extraClass = '', onClick = null) {
        const placement = this.createElement("div", `width-100 text-end`, ``);
        const button = this.createElement("button", `profile-button btn btn-primary ${extraClass}`, label);
	placement.append(button);
        if (onClick) button.addEventListener("click", onClick);
        return placement;
    }

    createConfirmationLabel(label = null, extraClass ='') {
	const placement = this.createElement("div", `width-100 text-end `, ``);
        placement.className = `registration-confirm-message ${extraClass}`;
        placement.innerHTML = (label ? label : ``);
        return placement;
    }

    createProfileItem(label, id, placeholder, required = false, feedbackError = '', value = null) {
        const container = this.createElement("div", "profile-item-container");
        const labelElement = this.createElement("label", "form-label", label);
        labelElement.setAttribute("for", id);
        
        const inputElement = this.createElement("input", "form-control");
        inputElement.type = "text";
        inputElement.id = id;
        inputElement.placeholder = placeholder;
        if(value) inputElement.value = value;

        if (required) inputElement.setAttribute("required", "required");
        if (!required) inputElement.setAttribute("disabled", "disabled");
        
        const errorElement = this.createElement("div", "invalid-feedback", feedbackError);
        errorElement.id = `${id}-error`;
        errorElement.style.display = "none";

  // Добавляем обработчик события input для проверки email
        if (id === "email") {
            inputElement.addEventListener("input", (event) => {
                this.validateAndCheckEmail(event.target.value);
            });
        }

        
        container.append(labelElement, inputElement, errorElement);
        return container;
    }

    validateAndCheckEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.ru$/;
        const errorElement = document.getElementById("email-error");
        const confirmMessageElement = document.querySelector(".registration-confirm-message");

        if (!emailRegex.test(email)) {
            errorElement.textContent = "Введите корректный email в зоне .ru";
            errorElement.style.display = "block";
            confirmMessageElement.textContent = "";
            return;
        }

        // Если email валиден, скрываем сообщение об ошибке
        errorElement.style.display = "none";
        let emailButton =  document.querySelector('.email-save-button')
        // Отправляем запрос на сервер
        this.checkEmailOnServer(email).then(response => {
            if (response.status) {
                confirmMessageElement.textContent = response.message;
                confirmMessageElement.style.color = "green";

                emailButton.textContent = (this.oldEmail == email ? 'Подтвердить' : 'Сохранить');
     	        if(this.oldEmail == email) {
  	         console.log(this.oldEmail == email);	
  	         emailButton.classList.add('disabled');
                 emailButton.setAttribute('disabled', 'disabled'); // Отключаем функциональность кнопки
                } else {
	        emailButton.classList.remove('disabled');
	        emailButton.removeAttribute('disabled'); // Включаем функциональность кнопки
		}
            } else {
                confirmMessageElement.textContent = response.message;
                confirmMessageElement.style.color = "red";
	        emailButton.classList.add('disabled');
        	emailButton.setAttribute('disabled', 'disabled'); // Отключаем функциональность кнопки
            }
        }).catch(error => {
            confirmMessageElement.textContent = "Ошибка при проверке email";
            confirmMessageElement.style.color = "red";
	    emailButton.classList.add('disabled');
            emailButton.setAttribute('disabled', 'disabled'); // Отключаем функциональность кнопки
        });
    }

    async checkEmailOnServer(email) {
        const api = new WebAPI();
        const webRequest = new WebRequest();
        try {
            const response = await webRequest.post(api.checkEmailMethod(), { email }, true);
	    console.log(this.oldEmail, email); 	
            return response;
        } catch (error) {
            console.error("Ошибка при проверке email:", error);
            throw error;
        }
    }


//
    createDropdownSection(title, children = []) {
        const section = this.createElement("dropdown-section", '', `<span slot="title">${title}</span>`);
         if (children.length === 0) {
// Создаем контейнер для текста и иконки
	     const noInfoContainer = document.createElement('div');
	        noInfoContainer.style.display = 'flex';
	        noInfoContainer.style.alignItems = 'center';
	        noInfoContainer.style.justifyContent = 'center';
	        noInfoContainer.style.gap = '8px'; // Расстояние между иконкой и текстом

	        // Добавляем иконку предупреждения
	        const warningIcon = document.createElement('span');
	        warningIcon.innerHTML = '⚠️'; // Используем эмодзи или можно вставить SVG
	        warningIcon.style.fontSize = '18px'; // Размер иконки

	        // Добавляем текст
	        const noInfoText = document.createElement('p');
	        noInfoText.textContent = 'Нет информации';
        	noInfoText.style.margin = '0'; // Убираем отступы у параграфа

	        // Собираем контейнер
	        noInfoContainer.appendChild(warningIcon);
	        noInfoContainer.appendChild(noInfoText);
	
	        // Добавляем контейнер в секцию
	        section.appendChild(noInfoContainer);
           } else {
          children.forEach(child => section.appendChild(child));
        }
        return section;
    }

    createRadio(id, name, label, checked = false, onClick = null, onDelete = null) {
       // Создание основного контейнера
       const placement = document.createElement("div");
       placement.className = "custom-radio row";

       // Создание контейнера для радио-кнопки и label
       const radioContainer = document.createElement("div");
       radioContainer.className = "col-10";

       // Создание радио-кнопки
       const radioInput = document.createElement("input");
       radioInput.className = "custom-control-input";
       radioInput.type = "radio";
       radioInput.id = `radio-${id}`;
       radioInput.name = name;
       radioInput.checked = checked;
       radioInput.value = id;

       // Создание label
       const radioLabel = document.createElement("label");
       radioLabel.className = "custom-control-label";
       radioLabel.setAttribute("for", `radio-${id}`);
       radioLabel.textContent = label;

       // Добавление радио-кнопки и label в контейнер
       radioContainer.appendChild(radioInput);
       radioContainer.appendChild(radioLabel);

       // Создание контейнера для кнопки удаления
       const buttonContainer = document.createElement("div");
       buttonContainer.className = "col-2";

       // Создание кнопки удаления
       const removeButton = document.createElement("button");
       removeButton.className = "btn small-hot-button";
       removeButton.type = "button";
       removeButton.value = id;

       // Создание иконки внутри кнопки
       const removeIcon = document.createElement("i");
       removeIcon.className = "fa-solid fa-x";
       removeIcon.style.fontSize = "0.8rem";

       // Добавление иконки в кнопку
       removeButton.appendChild(removeIcon);
       buttonContainer.appendChild(removeButton);

       // Добавление элементов в основной контейнер
       placement.appendChild(radioContainer);
       placement.appendChild(buttonContainer);

       // Добавление обработчиков событий
       if (onClick) {
           radioInput.addEventListener("click", onClick);
       }
       if (onDelete) {
           removeButton.addEventListener("click", onDelete);
       }
       return placement;
}

 createCheckbox(id, name, label, checked = false, onClick = null) {
    // Создание основного контейнера
    const placement = document.createElement("div");
    placement.className = "custom-checkbox row";

    // Создание контейнера для чекбокса и метки
    const checkboxContainer = document.createElement("div");
    checkboxContainer.className = "col";

    // Создание чекбокса
    const checkboxInput = document.createElement("input");
    checkboxInput.className = "form-check-input";
    checkboxInput.type = "checkbox";
    checkboxInput.id = `check-${id}`;
    checkboxInput.name = name;
    checkboxInput.checked = checked;
    checkboxInput.value = id;

    // Создание метки
    const checkboxLabel = document.createElement("label");
    checkboxLabel.className = "custom-checkbox-label";
    checkboxLabel.setAttribute("for", `check-${id}`);
    checkboxLabel.textContent = label;

    // Добавление чекбокса и метки в контейнер
    checkboxContainer.appendChild(checkboxInput);
    checkboxContainer.appendChild(checkboxLabel);

    // Добавление контейнера в основной контейнер
    placement.appendChild(checkboxContainer);

    // Добавление обработчика события, если передан
    if (onClick) {
        placement.addEventListener("click", onClick);
    }

    return placement;
}


  InputAutoComplete(label, id, placeholder, required, feedbackError) {
    const container = document.createElement("div");
    container.className = "profile-input-group";

    const labelElement = Object.assign(document.createElement("label"), {
        htmlFor: id,
        className: "form-label",
        textContent: label
    });

    const autoCompleteElement = Object.assign(document.createElement("x-autocomplete"), {
        id,
        placeholder,
        url: "/api/bff/client/v1/town"
    });

    if (required) autoCompleteElement.setAttribute("required", "required");

    const errorElement = Object.assign(document.createElement("div"), {
        id: `${id}-error`,
        className: "invalid-feedback",
        style: "display: none;",
        textContent: feedbackError
    });

    container.append(labelElement, autoCompleteElement, errorElement);
    return container;
}

   telegramConfirmForm(label, id, placeholder, required, feedbackError) {
    const container = document.createElement("div");
    container.className = "registration-confirm-form";
    container.innerHTML = `
        <div class="w-100">
            <div class="text-center">
                <button type="button" class="btn btn-block btn-primary confirm-telegram-button w-100" 
                    id="${id}-button">Подтвердить профиль в Telegram</button>
            </div>
        </div>
    `;

    // Добавляем обработчик события
    const telegramButton = container.querySelector(`#${id}-button`);
    if (telegramButton) {
        telegramButton.addEventListener("click", () => {
            window.location.href = `${this.telegramBot}?start=${this.telegramVerificationLink}`;
        });
    }

    return container;
   }
    
  registrationConfirmCodeForm(label, id, placeholder, required, feedbackError) {
     const container = document.createElement("dropdown-section");
     container.className = "registration-confirm-form";
     container.innerHTML = `
        <span slot="title">Подтверждение регистрации</span>    
        <div class="registration-confirm-form-text">Введите код отправленный на вашу электронную почту</div>
	<div class="profile-item-container">	
 	 <div class="row">
	    <div class="col-12 text-center">
	        <input type="text" class="form-control mx-auto" id="verificationCode" placeholder="" style="max-width: 300px;">
	    </div>
	</div>
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
     return container;
    }



    UserProfileCardContainer(data = null) {
        let api = new WebAPI();
        let webRequest = new WebRequest();
	let o = this; 	

        const profileContainer = this.createElement("div", "card card-container");
        profileContainer.appendChild(this.createElement("div", "card-header", `<h3 class="card-title">Профиль</h3>`));

        const avatarName = `${data?.profile?.surname || ''} ${data?.profile?.name || ''}`.trim() || 'Аноним';
        const tg = this.common.getTelegramWebAppObject();
        const tgUsername = (tg?.initDataUnsafe ? tg?.initDataUnsafe?.user?.username : null)
        const profileAvatar = this.createElement("div", "profile-avatar-container", `
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
//	profileContainer.appendChild(this.registrationConfirmCodeForm(`Код подтверждения Email`, `verificationCode`,  ``, ``, ``));
//	profileContainer.appendChild(this.telegramConfirmForm(`Код подтверждения Telegram`, `telegramVerification`,  ``, ``, ``));

        const fioSection = this.createDropdownSection("Мои данные", [
            this.createProfileItem("Фамилия", "surname", "Укажите вашу фамилию", true, ``, `${data?.profile?.surname || ''}`),
            this.createProfileItem("Имя", "firstname", "Укажите ваше имя", true, ``,`${data?.profile?.name || ''}`),
            this.createProfileItem("Отчество", "patronymic", "Укажите ваше отчество", true,``, `${data?.profile?.patronymic || ''}`),
            this.createButton("Сохранить", "text-end", this.saveProfileButtonOnClick)
        ]);
        profileContainer.appendChild(fioSection);

        this.oldEmail = data?.profile?.email;
        const emailButtonName = 
		(data?.profile?.email) 
			? (data?.profile?.emailConfirmedAt ? "Сохранить" : "Подтвердить")
			: "Сохранить";
	const emailSection = this.createDropdownSection("Электронный адрес", [
		this.createProfileItem("Email", "email", "Электронный адрес", true, ``, `${data?.profile?.email || ''}`),
		this.createConfirmationLabel(
			(data?.profile?.emailConfirmedAt ? `Email потвержден` : `Email необходимо подтвердить!` ),
			(data?.profile?.emailConfirmedAt ? `confirmation-label-success` : `confirmation-label-error` )
		),
	        this.createButton(emailButtonName, 
			"text-end email-save-button disabled", 
			(data?.profile?.emailConfirmedAt ? this.saveEmailButtonOnClick : this.saveEmailButtonOnClick ))
        ]);
        profileContainer.appendChild(emailSection);

        const phoneSection = this.createDropdownSection("Мой телефон", [
            this.createProfileItem("Телефон", "phone", "Укажите номер телефона", true, 
		"Введите номер в формате +7 (XXX) XXX-XXXX",
		`${data?.profile?.phone || ''}`),
            this.createButton("Сохранить", "text-end", this.savePhoneButtonOnClick)
        ]);
        profileContainer.appendChild(phoneSection);

        // Секция для подписок
   	 let SubscriptionsDialog = new ClientSubscriptionsDialog();
	 profileContainer.appendChild(this.createDropdownSection("Мои подписки", SubscriptionsDialog.getElements() || []));

        // Секция для адресов
         let AddressDialogElementsArray = [];
         this.AddressesContainer = this.createElement("div", "addresses-card-container");
         let AddressDialog = new ClientAddressDialog();
  	 AddressDialog.getElements().forEach((item, index) => {
	     o.AddressesContainer.appendChild(item); 
	 });
         AddressDialogElementsArray.push(this.AddressesContainer);
         AddressDialogElementsArray.push(AddressDialog.AddressAutoComplete("Добавить адрес", "address", "Укажите адрес доставки", true, "Заполните данные для доставки товара"))
         AddressDialogElementsArray.push(
         this.createButton("Сохранить", "text-end", (()=>{
	        let autocomplete = document.getElementById('address');
	        let address = autocomplete.getObject();
                const response = webRequest.post(api.addDeliveryAddressMethod(), address, true);
                autocomplete.setValue(``);
                toastr.success('Aдрес успешно сохранен', 'Доставка', { timeOut: 3000 });
	        if(eventBus) {
	          console.log(eventBus)
	          eventBus.emit("ClientAddressDialogReload", {});
	       }
             })
           )
         )
         console.log(AddressDialogElementsArray);	
         profileContainer.appendChild(this.createDropdownSection("Мои адреса доставки",  
		AddressDialogElementsArray));

        // Секция для карт
   	 let CardDialog = new ClientCardsDialog();
	 profileContainer.appendChild(this.createDropdownSection("Мои средства платежа", 
		CardDialog.getElements() || []));

         profileContainer.appendChild(this.createDropdownSection("Выход из системы",
	[this.createButton("Выход", "w-100 text-center", this.exitButtonOnClick)]))
         this.addModule("Profile", profileContainer);
         this.profileContainer = profileContainer; 
	 this.addEventListeners();

    }


    ClientAddressDialogLoading(AddressesContainer){
     let o = this;
     let api = new WebAPI();
     let webRequest = new WebRequest();
    } 


    addEventListeners() {                                                           
      let o = this;
      console.log(`Перезагрузка экрана`)
      eventBus.on('ClientAddressDialogReload', () => {
       let AddressDialog = new ClientAddressDialog();
        o.AddressesContainer.innerHTML = ``;
          AddressDialog.getElements().forEach((item, index) => {
            o.AddressesContainer.appendChild(item); 
         });
      });
     }

    saveProfileButtonOnClick(){
     let o = this;
     let api = new WebAPI();
     let webRequest = new WebRequest();

     let email =  document.querySelector('[id="email"]')
     let telegram =  document.querySelector('[id="telegram"]')
     let surname = document.querySelector('[id="surname"]')
     let firstname = document.querySelector('[id="firstname"]')
     let patronymic = document.querySelector('[id="patronymic"]')
     let phone = document.querySelector('[id="phone"]')
     let address = document.querySelector('x-autocomplete')
     let autocomplete = document.getElementById('address');

     let request = webRequest.post(api.saveShopProfileMethod(),{
  	    surname : surname.value,
	    name : firstname.value,
	    patronymic : patronymic.value,
//	    phone : phone.value,
//	    address : autocomplete.getValue(),
//	    fiasId : autocomplete.getValueId(),
	   },  
	    false ).then(function(data) {
             toastr.success('Профиль сохранен', 'Профиль', {timeOut: 3000});
           }).catch(function(error) {
         console.log('showProfilePage.Произошла ошибка =>', error);
         toastr.error('Ой! Что то пошло не так...', 'Профиль клиента', {timeOut: 3000});
      });
   }

    saveEmailButtonOnClick(){
     let o = this;
     let api = new WebAPI();
     let webRequest = new WebRequest();

     let email =  document.querySelector('[id="email"]')
     let request = webRequest.post(api.saveEmailMethod(),{
  	    email : email.value
	   },  
	    false ).then(function(data) {
             toastr.success('Почта сохранена', 'Профиль', {timeOut: 3000});
           }).catch(function(error) {
         console.log('saveEmailButtonOnClick.Произошла ошибка =>', error);
         toastr.error('Ой! Что то пошло не так...', 'Профиль клиента', {timeOut: 3000});
      });
   }

    savePhoneButtonOnClick(){
     let o = this;
     let api = new WebAPI();
     let webRequest = new WebRequest();

     let phone =  document.querySelector('[id="phone"]')
     let request = webRequest.post(api.savePhoneMethod(),{
  	    phone : phone.value
	   },  
	    false ).then(function(data) {
             toastr.success('Телефон сохранен', 'Профиль', {timeOut: 3000});
           }).catch(function(error) {
         console.log('saveEmailButtonOnClick.Произошла ошибка =>', error);
         toastr.error('Ой! Что то пошло не так...', 'Профиль клиента', {timeOut: 3000});
      });
   }


   exitButtonOnClick(){
      let o = this;
      let api = new WebAPI();
      let webRequest = new WebRequest();
      const closeSessionButton = document.querySelector('[class="session-close"]');
      let request = webRequest.post(api.closeSessionMethod(), {}, false )
       .then(function(data) {
    	   document.location.replace(api.LOGON_URL());
         })                                
	.catch(function(error) {
 	   console.log('showProfilePage.Произошла ошибка =>', error);
	   toastr.error('Ой! Что то пошло не так...', 'Профиль клиента', {timeOut: 3000});
         });
      }

     getPaymentInstruments(){     
      let o = this;
      let api = new WebAPI();
      let webRequest = new WebRequest();
      let request = webRequest.get(api.getPaymentInstrumentsMethod(),{},  
	    false)
	.then(function(data) {
	   console.log(data);                
           }).catch(function(error) {
         console.log('getPaymentInstruments.Произошла ошибка =>', error);
         toastr.error('Ой! Что то пошло не так...', 'Профиль клиента', {timeOut: 3000});
      });
     }
}
