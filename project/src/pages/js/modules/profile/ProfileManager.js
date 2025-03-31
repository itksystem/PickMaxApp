class ProfileManager {
    constructor(profileSection) {
        this.profileSection = profileSection;
    }

    createProfileSection(data) {
        return DOMHelper.createDropdownSection("Мои данные", [
            DOMHelper.createProfileItem(
                "Фамилия", 
                "surname", 
                "Укажите вашу фамилию", 
                true, 
                "", 
                data?.profile?.surname || ""
            ),
            DOMHelper.createProfileItem(
                "Имя",
                "firstname",
                "Укажите ваше имя",
                true,
                "",
                data?.profile?.name || ""
            ),
            DOMHelper.createProfileItem(
                "Отчество",
                "patronymic",
                "Укажите ваше отчество",
                true,
                "",
                data?.profile?.patronymic || ""
            ),
            DOMHelper.createButton(
                "Сохранить",
                "text-end",
                this.saveProfileButtonOnClick.bind(this)
            )
        ]);
    }

    async saveProfileButtonOnClick() {
        try {
            await this.profileSection.webRequest.post(
                this.profileSection.api.saveShopProfileMethod(),
                {
                    surname: this.getSurname(),
                    name: this.getFirstname(),
                    patronymic: this.getPatronymic(),
                },
                false
            );
            
            toastr.success('Профиль сохранен', 'Профиль', { timeOut: 3000 });
            this.updateAvatarName();
        } catch (error) {
            console.log('showProfilePage.Произошла ошибка =>', error);
            toastr.error('Ой! Что то пошло не так...', 'Профиль клиента', { timeOut: 3000 });
        }
    }

    updateAvatarName() {
        const avatarNameElement = this.profileSection.profileContainer.querySelector('.shot-fio-container');
        if (avatarNameElement) {
            avatarNameElement.textContent = `${this.getSurname() || ''} ${this.getFirstname() || ''}`;
        }
    }

    getSurname() {
        const input = document.querySelector('[id="surname"]');
        return input ? input.value.trim() : '';
    }

    getFirstname() {
        const input = document.querySelector('[id="firstname"]');
        return input ? input.value.trim() : '';
    }

    getPatronymic() {
        const input = document.querySelector('[id="patronymic"]');
        return input ? input.value.trim() : '';
    }
}
