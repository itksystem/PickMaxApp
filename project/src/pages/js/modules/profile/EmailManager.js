class EmailManager {
    constructor(profileSection) {
        this.profileSection = profileSection;
        this.EMAIL_NO_ACTION_NEED = 0;
        this.EMAIL_SAVE_ACTION_NEED = 1;
        this.EMAIL_CONFIRM_ACTION_NEED = 2;
        this.emailActionNeed = this.EMAIL_NO_ACTION_NEED;

        this.EMAIL_SAVE_ACTION_DESCRIPTION = 'Сохраните изменения!';
        this.EMAIL_CONFIRM_ACTION_DESCRIPTION = `Почту необходимо подтвердить!`;

        this.EMAIL_SAVE_ACTION_TEXT_BUTTON = 'Сохранить';
        this.EMAIL_CONFIRM_ACTION_TEXT_BUTTON = 'Подтвердить';
        this.oldEmail = '';
    }

    createEmailSection(data) {
        this.oldEmail = data?.profile?.email || '';
        this.emailActionNeed = this.determineEmailActionNeed(data?.profile);

        const isEmailConfirmed = data?.profile?.emailConfirmedAt;
        const emailStatusText = isEmailConfirmed ? `Email подтвержден` : this.EMAIL_CONFIRM_ACTION_DESCRIPTION;
        const emailStatusClass = isEmailConfirmed ? `confirmation-label-success` : `confirmation-label-error`;
        const emailValidationClass = data?.profile?.email ? 'is-valid' : '';

        const emailButtonState = this.getEmailButtonState(data);

        const emailSection = DOMHelper.createDropdownSection("Электронный адрес", [
            DOMHelper.createProfileItem(
                "Email",
                "email",
                "Электронный адрес",
                true,
                "",
                data?.profile?.email || "",
                emailValidationClass
            ),
            DOMHelper.createConfirmationLabel(emailStatusText, `email-confirmation-label ${emailStatusClass}`),
            DOMHelper.createButton(
                emailButtonState.name,
                `text-end email-save-button ${emailButtonState.disabled}`,
                this.emailButtonClick.bind(this)
            )
        ]);

        const emailElement = emailSection.querySelector('#email');
        if (emailElement) {
            emailElement.addEventListener("input", (event) => {
                this.validateAndCheckEmail(event.target.value);
            });
        }

        return emailSection;
    }

    getCreateConfirmationLabel() {
       return document.querySelector('.email-confirmation-label');
    }

    getEmailButtonState(data) {
        return {
            name: this.emailActionNeed === this.EMAIL_CONFIRM_ACTION_NEED ? 
                this.EMAIL_CONFIRM_ACTION_TEXT_BUTTON : 
                this.EMAIL_SAVE_ACTION_TEXT_BUTTON,
            disabled: this.emailActionNeed === this.EMAIL_NO_ACTION_NEED || 
                    (this.emailActionNeed === this.EMAIL_SAVE_ACTION_NEED && data?.profile?.emailConfirmedAt) ? 
                    'disabled' : ''
        };
    }

    determineEmailActionNeed(profile) {
        if (!profile?.email) return this.EMAIL_NO_ACTION_NEED;
        return profile.emailConfirmedAt ? this.EMAIL_NO_ACTION_NEED : this.EMAIL_CONFIRM_ACTION_NEED;
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

        errorElement.style.display = "none";
        this.checkEmailOnServer(email);
    }

    async checkEmailOnServer(email) {
        const confirmMessageElement = document.querySelector(".registration-confirm-message");
        const emailButton = document.querySelector('.email-save-button');

        try {
            const response = await this.profileSection.webRequest.post(
                this.profileSection.api.checkEmailMethod(), 
                { email }, 
                true
            );

            if (response.status) {
                confirmMessageElement.textContent = response.message;

                if (this.oldEmail === email) {
                    emailButton.classList.add('disabled');
                    emailButton.setAttribute('disabled', 'disabled');
                } else {
                    emailButton.textContent = this.EMAIL_SAVE_ACTION_TEXT_BUTTON;
                    emailButton.classList.remove('disabled');
                    emailButton.removeAttribute('disabled');
                    this.emailActionNeed = this.EMAIL_SAVE_ACTION_NEED;
                }
            } else {
                confirmMessageElement.textContent = response.message;
                confirmMessageElement.style.color = "red";
                emailButton.classList.add('disabled');
                emailButton.setAttribute('disabled', 'disabled');
            }
        } catch (error) {
            confirmMessageElement.textContent = "Ошибка при проверке email";
            confirmMessageElement.style.color = "red";
            emailButton.classList.add('disabled');
            emailButton.setAttribute('disabled', 'disabled');
        }
    }

    emailButtonClick() {
        if (this.emailActionNeed !== this.EMAIL_NO_ACTION_NEED) {
            switch (this.emailActionNeed) {
                case this.EMAIL_CONFIRM_ACTION_NEED: 
                    this.confirmEmailButtonOnClick(); 
                    break;
                case this.EMAIL_SAVE_ACTION_NEED:    
                    this.saveEmailButtonOnClick(); 
                    break;
            }
        }
    }

    confirmEmailButtonOnClick() {
        document.location.replace('/confirmation/email/page');
    }

    async saveEmailButtonOnClick() {
        try {
            await this.profileSection.webRequest.post(
                this.profileSection.api.saveEmailMethod(),
                { email: this.getEmail() },
                false
            );
            
            toastr.success('Почта сохранена', 'Профиль', { timeOut: 3000 });
            this.getEmailButton().textContent = this.EMAIL_CONFIRM_ACTION_TEXT_BUTTON;
            this.emailActionNeed = this.EMAIL_CONFIRM_ACTION_NEED;
	    this.getCreateConfirmationLabel().textContent = this.EMAIL_CONFIRM_ACTION_DESCRIPTION;
        } catch (error) {                                        
            toastr.error('Ой! Что то пошло не так...', 'Профиль клиента', { timeOut: 3000 });
        }
    }

    getEmail() {
        const emailInput = document.querySelector('[id="email"]');
        return emailInput ? emailInput.value.trim() : '';
    }

    getEmailButton() {
        return document.querySelector('.email-save-button');
    }
}
