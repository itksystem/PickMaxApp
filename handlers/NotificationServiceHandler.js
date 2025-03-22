// Обработчик взаимодействия с AuthService
const fetch = require('node-fetch');
require('dotenv').config({ path: '.env-pickmax-service' });
const CommonFunctionHelper = require("openfsm-common-functions")
const commonFunction= new CommonFunctionHelper();

class NotificationServiceHandler {
    constructor() {

    }
    headers(req){
        return {
            'Content-Type': 'application/json',
            'x-tg-init-data': `${req.headers['x-tg-init-data']}`, 
            'Authorization': `Bearer ${commonFunction.getJwtToken(req)}`,
        }
    }
    /**
     * Метод для получения переписки по товару текущего пользователя от NotificationService
     * @returns {Object} - Объект с результатом
     */
    async getProductMail(req, productId = null, filterId = null) {
        try {
            let url = (filterId) 
            ? process.env.NOTIFICATION_PRODUCT_MAIL_REQUEST_URL+`/${productId}?id=${filterId}`
            : process.env.NOTIFICATION_PRODUCT_MAIL_REQUEST_URL+`/${productId}`;

            const response = await fetch( url, {
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
     * Метод для отправки сообщения по товару  пользователя от NotificationService
     * @returns {Object} - Объект с результатом
     */
    async sendProductMail(req, productId) {
        try {
            const response = await fetch(process.env.NOTIFICATION_PRODUCT_MAIL_REQUEST_URL+`/${productId}`, {
                method: 'POST',
                headers: this.headers(req),
                body: JSON.stringify(req.body)
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
}

module.exports = NotificationServiceHandler;
