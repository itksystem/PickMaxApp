class ProfileManager {
    constructor(containerId, apiService) {
        this.containerId = containerId;
        this.apiService = apiService;
        this.oldEmail = '';
        this.common = new CommonFunctions();
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
        const emailButton = document.querySelector('.email-save-button');

        this.apiService.checkEmail(email).then(response => {
            if (response.status) {
                confirmMessageElement.textContent = response.message;
                confirmMessageElement.style.color = "green";

                emailButton.textContent = (this.oldEmail === email ? 'Подтвердить' : 'Сохранить');
                if (this.oldEmail === email) {
                    emailButton.classList.add('disabled');
                    emailButton.setAttribute('disabled', 'disabled');
                } else {
                    emailButton.classList.remove('disabled');
                    emailButton.removeAttribute('disabled');
                }
            } else {
                confirmMessageElement.textContent = response.message;
                confirmMessageElement.style.color = "red";
                emailButton.classList.add('disabled');
                emailButton.setAttribute('disabled', 'disabled');
            }
        }).catch(error => {
            confirmMessageElement.textContent = "Ошибка при проверке email";
            confirmMessageElement.style.color = "red";
            emailButton.classList.add('disabled');
            emailButton.setAttribute('disabled', 'disabled');
        });
    }

    saveProfileButtonOnClick() {
        const surname = document.querySelector('[id="surname"]').value;
        const firstname = document.querySelector('[id="firstname"]').value;
        const patronymic = document.querySelector('[id="patronymic"]').value;

        this.apiService.saveProfile({ surname, name: firstname, patronymic })
            .then(() => toastr.success('Профиль сохранен', 'Профиль', { timeOut: 3000 }))
            .catch(error => {
                console.error('Произошла ошибка =>', error);
                toastr.error('Ой! Что то пошло не так...', 'Профиль клиента', { timeOut: 3000 });
            });
    }

    saveEmailButtonOnClick() {
        const email = document.querySelector('[id="email"]').value;
        this.apiService.saveEmail(email)
            .then(() => toastr.success('Почта сохранена', 'Профиль', { timeOut: 3000 }))
            .catch(error => {
                console.error('Произошла ошибка =>', error);
                toastr.error('Ой! Что то пошло не так...', 'Профиль клиента', { timeOut: 3000 });
            });
    }

    savePhoneButtonOnClick() {
        const phone = document.querySelector('[id="phone"]').value;
        this.apiService.savePhone(phone)
            .then(() => toastr.success('Телефон сохранен', 'Профиль', { timeOut: 3000 }))
            .catch(error => {
                console.error('Произошла ошибка =>', error);
                toastr.error('Ой! Что то пошло не так...', 'Профиль клиента', { timeOut: 3000 });
            });
    }

    exitButtonOnClick() {
        this.apiService.closeSession()
            .then(() => document.location.replace(this.api.LOGON_URL()))
            .catch(error => {
                console.error('Произошла ошибка =>', error);
                toastr.error('Ой! Что то пошло не так...', 'Профиль клиента', { timeOut: 3000 });
            });
    }
}
