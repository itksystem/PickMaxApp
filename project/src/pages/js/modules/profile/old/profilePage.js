// Импорт всех необходимых модулей
import { ProfileSection } from './ProfileSection.js';
import { CommonFunctions } from './CommonFunctions.js';
import { WebAPI } from './WebAPI.js';
import { WebRequest } from './WebRequest.js';


// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    // Создаем экземпляры необходимых классов
    const common = new CommonFunctions();
    const api = new WebAPI();
    const webRequest = new WebRequest();
    
    // Инициализируем секцию профиля
    const profileSection = new ProfileSection('profile-container');
    
    // Загружаем данные профиля (пример)
    loadProfileData();
    
    async function loadProfileData() {
        try {
            const response = await webRequest.get(api.getProfileMethod(), true);
            profileSection.UserProfileCardContainer(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке данных профиля:', error);
            toastr.error('Не удалось загрузить данные профиля', 'Ошибка');
        }
    }
});