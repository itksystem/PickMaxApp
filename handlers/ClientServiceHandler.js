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
     * 
     */
    headers(req){
        let h = {
            'Content-Type': 'application/json',
            'x-tg-init-data': `${req?.headers['x-tg-init-data'] || '' }`, 
            'Authorization': `Bearer ${commonFunction.getJwtToken(req)}`,
        }
        return h;
    }
    

    async profile(req, res) {
        try {
            const response = await fetch(process.env.CLIENT_PROFILE_URL, {
                method: 'GET',
                headers: this.headers(req),
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
                headers: this.headers(req),
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
                headers: this.headers(req),
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
     * Метод для сохранения телефона пользователя 
     * @returns {Object} - Объект с результатом
*/
 async savePhone(req, res) {
    try {
        const response = await fetch(process.env.CLIENT_SAVE_PHONE_URL, {
            method: 'POST',
            headers: this.headers(req),
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        if (response.ok) {
            console.log(`Save phone successfully.`);
            return { success: true, data };
        } else {
            console.log(`Save phone failed.`);
            return { success: false, status: response.status, data };
        }
    } catch (error) {
        console.log(`Save phone failed.`);
        return { success: false, error: error.message };
    }
}   

 /**
     * Метод для проверки телефона пользователя 
     * @returns {Object} - Объект с результатом
*/
async checkPhone(req, res) {
    try {
        const response = await fetch(process.env.CLIENT_CHECK_PHONE_URL, {
            method: 'POST',
            headers: this.headers(req),
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        if (response.ok) {
            console.log(`Check phone successfully.`);
            return { success: true, data };
        } else {
            console.log(`Check phone failed.`);
            return { success: false, status: response.status, data };
        }
    } catch (error) {
        console.log(`Check phone failed.`);
        return { success: false, error: error.message };
    }
}   


/**
     * Метод для сохранения email пользователя 
     * @returns {Object} - Объект с результатом
*/
async saveEmail(req, res) {
    try {
        const response = await fetch(process.env.CLIENT_SAVE_EMAIL_URL, {
            method: 'POST',
            headers: this.headers(req),
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        if (response.ok) {
            console.log(`Save email successfully.`);
            return { success: true, data };
        } else {
            console.log(`Save email failed.`);
            return { success: false, status: response.status, data };
        }
    } catch (error) {
        console.log(`Save email failed.`);
        return { success: false, error: error.message };
    }
}



/**
     * Метод для проверки email  пользователя 
     * @returns {Object} - Объект с результатом
*/
async checkEmail(req, res) {
    try {
        const response = await fetch(process.env.CLIENT_CHECK_EMAIL_URL, {
            method: 'POST',
            headers: this.headers(req),
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        if (response.ok) {
            console.log(`Check email successfully.`);
            return { success: true, data };
        } else {
            console.log(`Check email failed.`);
            return { success: false, status: response.status, data };
        }
    } catch (error) {
        console.log(`Check email failed.`);
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
                headers: this.headers(req),
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
                headers: this.headers(req),
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
                headers: this.headers(req),
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
                headers: this.headers(req),
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
                headers: this.headers(req),               
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


    async getRegions(req) {
        try {
            const url = new URL(process.env.CLIENT_GET_CLIENT_REGIONS_URL);
            const response = await fetch(url, {
                method: 'GET',
                headers: this.headers(req),               
            });
            const data = await response.json();
            if (response.ok) {
                logger.info(`getRegions successfully.`);
                return { success: true, data };
            } else {
                logger.error(`getRegions failed.`);
                return { success: false, status: response.status, data };
            }
        } catch (error) {
            logger.error(`getRegions failed.`);
            return { success: false, error: error.message };
        }
    }

    async saveRegion(req) {
        try {
            const url = new URL(process.env.CLIENT_SAVE_CLIENT_REGION_URL);
            const response = await fetch(url, {
                method: 'POST',
                headers: this.headers(req),               
                body: JSON.stringify(req.body),
            });
            const data = await response.json();
            if (response.ok) {
                logger.info(`saveRegion successfully.`);
                return { success: true, data };
            } else {
                logger.error(`saveRegion failed.`);
                return { success: false, status: response.status, data };
            }
        } catch (error) {
            logger.error(`saveRegion failed.`);
            return { success: false, error: error.message };
        }
    }

    async deleteRegion(req) {
        try {
            const url = new URL(process.env.CLIENT_DELETE_CLIENT_REGION_URL);
            const response = await fetch(url, {
                method: 'DELETE',
                headers: this.headers(req),               
                body: JSON.stringify(req.body),
            });
            const data = await response.json();
            if (response.ok) {
                logger.info(`deleteRegion successfully.`);
                return { success: true, data };
            } else {
                logger.error(`deleteRegion failed.`);
                return { success: false, status: response.status, data };
            }
        } catch (error) {
            logger.error(`deleteRegion failed.`);
            return { success: false, error: error.message };
        }
    }

}

module.exports = ClientServiceHandler;
