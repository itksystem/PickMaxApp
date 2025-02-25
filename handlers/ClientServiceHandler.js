// Обработчик взаимодействия с AuthService
const fetch = require('node-fetch');
require('dotenv').config({ path: '.env-pickmax-service' });
const CommonFunctionHelper = require("openfsm-common-functions");
const logger = require('../controllers/LoggerHandler');
const commonFunction = new CommonFunctionHelper();

class ClientServiceHandler {
    constructor() {}

    /**
     * Метод для получения профиля текущего пользователя от ClientService
     * @returns {Object} - Объект с результатом
     */
    async profile(req, res) {
        try {
            const response = await fetch(process.env.CLIENT_PROFILE_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${commonFunction.getJwtToken(req)}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                console.log(`Get profile successfully.`);
                return { success: true, data };
            } else {
                console.log(`Get profile failed.`);
                return { success: false, status: response.status, data };
            }
        } catch (error) {
            console.log(`Get profile failed.`);
            return { success: false, error: error.message };
        }
    }

    /**
     * Метод для получения данных пользователя от ClientService
     * @returns {Object} - Объект с результатом
     */
    async client(req, clientId) {
        try {
            const response = await fetch(`${process.env.CLIENT_URL}/${clientId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${commonFunction.getJwtToken(req)}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                console.log(`Get profile successfully.`);
                return { success: true, data };
            } else {
                console.log(`Get profile failed.`);
                return { success: false, status: response.status, data };
            }
        } catch (error) {
            console.log(`Get profile failed.`);
            return { success: false, error: error.message };
        }
    }

    /**
     * Метод для сохранения профиля пользователя в AuthService
     * @returns {Object} - Объект с результатом
     */
    async saveProfile(req, res) {
        try {
            const response = await fetch(process.env.CLIENT_PROFILE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${commonFunction.getJwtToken(req)}`,
                },
                body: JSON.stringify(req.body),
            });

            const data = await response.json();
            if (response.ok) {
                console.log(`Save profile successfully.`);
                return { success: true, data };
            } else {
                console.log(`Save profile failed.`);
                return { success: false, status: response.status, data };
            }
        } catch (error) {
            console.log(`Save profile failed.`);
            return { success: false, error: error.message };
        }
    }

    /**
     * Метод для получения подсказок адресов
     * @returns {Object} - Объект с результатом
     */
    async getSuggestAddress(req, res) {
        try {
            const query = req.query.query;
            const url = new URL(process.env.CLIENT_DADATA_SUGGEST_ADDRESS_URL);
            url.searchParams.append('query', query);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${commonFunction.getJwtToken(req)}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                console.log(`Get suggest address successfully.`);
                return { success: true, data };
            } else {
                console.log(`Get suggest address failed.`);
                return { success: false, status: response.status, data };
            }
        } catch (error) {
            console.log(`Get suggest address failed.`);
            return { success: false, error: error.message };
        }
    }

    /**
     * Метод для получения подписки
     * @returns {Object} - Объект с результатом
     */
    async getSubscriptions(req, res) {
        try {
            const url = new URL(process.env.CLIENT_GET_SUBSCRIPTIONS_URL);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${commonFunction.getJwtToken(req)}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                console.log(`Get subscriptions successfully.`);
                return { success: true, data };
            } else {
                console.log(`Get subscriptions failed.`);
                return { success: false, status: response.status, data };
            }
        } catch (error) {
            console.log(`Get subscriptions failed.`);
            return { success: false, error: error.message };
        }
    }

    /**
     * Метод для установки подписки
     * @returns {Object} - Объект с результатом
     */
    async setSubscription(req, res) {
        try {
            const url = new URL(process.env.CLIENT_SET_SUBSCRIPTIONS_URL);

            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${commonFunction.getJwtToken(req)}`,
                },
                body: JSON.stringify(req.body),
            });

            const data = await response.json();
            if (response.ok) {
                console.log(`Set subscription successfully.`);
                return { success: true, data };
            } else {
                console.log(`Set subscription failed.`);
                return { success: false, status: response.status, data };
            }
        } catch (error) {
            console.log(`Set subscription failed.`);
            return { success: false, error: error.message };
        }
    }

    /**
     * Метод для установки изображения профиля
     * @returns {Object} - Объект с результатом
     */
    async setProfileImage(req, fileUrls) {
        try {
            const url = new URL(process.env.CLIENT_PROFILE_IMAGE_URL);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${commonFunction.getJwtToken(req)}`,
                },
                body: JSON.stringify({ fileUrls }),
            });

            const data = await response.json();
            if (response.ok) {
                logger.info(`Set profile image successfully.`);
                return { success: true, data };
            } else {
                logger.error(`Set profile image failed.`);
                return { success: false, status: response.status, data };
            }
        } catch (error) {
            logger.error(`Set profile image failed.`);
            return { success: false, error: error.message };
        }
    }

    async getProfileImage(req, fileUrls) {
        try {
            const url = new URL(process.env.CLIENT_GET_PROFILE_IMAGE_URL);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${commonFunction.getJwtToken(req)}`,
                },                
            });

            const data = await response.json();
            if (response.ok) {
                logger.info(`Set profile image successfully.`);
                return { success: true, data };
            } else {
                logger.error(`Set profile image failed.`);
                return { success: false, status: response.status, data };
            }
        } catch (error) {
            logger.error(`Set profile image failed.`);
            return { success: false, error: error.message };
        }
    }


    // Загрузка файлов картинки профиля доделать!
}

module.exports = ClientServiceHandler;
