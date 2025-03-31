class PhoneManager {
    constructor(profileSection) {
        this.profileSection = profileSection;
        this.PHONE_NO_ACTION_NEED = 0;
        this.PHONE_SAVE_ACTION_NEED = 1;
        this.PHONE_CONFIRM_ACTION_NEED = 2;
        this.phoneActionNeed = this.PHONE_NO_ACTION_NEED;
        this.PHONE_SAVE_ACTION_DESCRIPTION = 'Сохранить';
        this.PHONE_CONFIRM_ACTION_DESCRIPTION = 'Подтвердить';
        this.oldPhone = '';
    }

    createPhoneSection(data) {
        this.oldPhone = data?.profile?.phone || '';
        this.phoneActionNeed = this.determinePhoneActionNeed(data?.profile);

        const isPhoneConfirmed = data?.profile?.phoneConfirmedAt;
        const phoneStatusText = isPhoneConfirmed ? `Телефон подтвержден` : `Телефон необходимо подтвердить!`;
        const phoneStatusClass = isPhoneConfirmed ? `phone-confirmation-label-success` : `phone-confirmation-label-error`;
        const phoneValidationClass = data?.profile?.phone ? 'is-valid' : '';

        const phoneButtonState = this.getPhoneButtonState(data);

        const phoneSection = DOMHelper.createDropdownSection("Мой телефон", [
            DOMHelper.createProfileItem(
                "Телефон", 
                "phone", 
                "Укажите номер телефона", 
                true, 
                "Введите номер в формате +7 (XXX) XXX-XXXX", 
                `${data?.profile?.phone || ''}`, 
                phoneValidationClass
            ),
            DOMHelper.createConfirmationLabel(phoneStatusText, phoneStatusClass),
            DOMHelper.createButton(
                phoneButtonState.name,
                `text-end phone-save-button ${phoneButtonState.disabled}`, 
                this.phoneButtonClick.bind(this)
            )
        ]);

        new InputMaskValidator(
            { id: 'phone', error: 'phone-error' }, 
            phoneSection,
            this.phoneValidatorSuccessCallback.bind(this),
            this.phoneValidatorErrorCallback.bind(this)
        );

        return phoneSection;
    }

    getPhoneButtonState(data) {
        return {
            name: this.phoneActionNeed === this.PHONE_CONFIRM_ACTION_NEED ? 
                this.PHONE_CONFIRM_ACTION_DESCRIPTION : 
                this.PHONE_SAVE_ACTION_DESCRIPTION,
            disabled: this.phoneActionNeed === this.PHONE_NO_ACTION_NEED || 
                    (this.phoneActionNeed === this.PHONE_SAVE_ACTION_NEED && data?.profile?.phoneConfirmedAt) ? 
                    'disabled' : ''
        };
    }

    determinePhoneActionNeed(profile) {
        if (!profile?.phone) return this.PHONE_NO_ACTION_NEED;
        return profile.phoneConfirmedAt ? this.PHONE_NO_ACTION_NEED : this.PHONE_CONFIRM_ACTION_NEED;
    }

    phoneValidatorSuccessCallback() {
        const phone = this.profileSection.profileContainer.querySelector('[id="phone"]');
        const phoneButton = this.profileSection.profileContainer.querySelector('.phone-save-button');
        
        if (this.oldPhone !== phone.value) {
            phoneButton.classList.remove('disabled');
            phoneButton.textContent = this.PHONE_SAVE_ACTION_DESCRIPTION;
            this.phoneActionNeed = this.PHONE_SAVE_ACTION_NEED;
        } else {
            phoneButton.classList.add('disabled');
        }
    }

    phoneValidatorErrorCallback() {
        const phoneButton = this.profileSection.profileContainer.querySelector('.phone-save-button');
        phoneButton.classList.add('disabled');
    }

    phoneButtonClick() {
        if (this.phoneActionNeed !== this.PHONE_NO_ACTION_NEED) {
            switch (this.phoneActionNeed) {
                case this.PHONE_CONFIRM_ACTION_NEED: 
                    this.confirmPhoneButtonOnClick(); 
                    break;
                case this.PHONE_SAVE_ACTION_NEED:    
                    this.savePhoneButtonOnClick(); 
                    break;
            }
        }
    }

    confirmPhoneButtonOnClick() {
        document.location.replace('/confirmation/phone/page');
    }

    async savePhoneButtonOnClick() {
        try {
            await this.profileSection.webRequest.post(
                this.profileSection.api.savePhoneMethod(),
                { phone: this.getPhone() },
                false
            );
            
            toastr.success('Телефон сохранен', 'Профиль', { timeOut: 3000 });
            this.getPhoneButton().textContent = this.PHONE_CONFIRM_ACTION_DESCRIPTION;
            this.phoneActionNeed = this.PHONE_CONFIRM_ACTION_NEED;
        } catch (error) {
            toastr.error('Ой! Что то пошло не так...', 'Профиль клиента', { timeOut: 3000 });
        }
    }

    getPhone() {
        const input = document.querySelector('[id="phone"]');
        return input ? input.value.trim() : '';
    }

    getPhoneButton() {
        return document.querySelector('.phone-save-button');
    }
}