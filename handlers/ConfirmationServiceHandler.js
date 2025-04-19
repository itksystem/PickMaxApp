// Обработчик взаимодействия с AuthService
const fetch = require('node-fetch');
require('dotenv').config({ path: '.env-pickmax-service' });
const CommonFunctionHelper = require("openfsm-common-functions");
const logger = require('../controllers/LoggerHandler');
const commonFunction = new CommonFunctionHelper();

class ConfirmationServiceHandler {
    constructor() {}

    /**
     * Метод для получения профиля текущего пользователя от ClientService
     * @returns {Object} - Объект с результатом
     * 
     */
    headers(req){
        return {
            'Content-Type': 'application/json',
            'x-tg-init-data': `${req?.headers['x-tg-init-data'] || '' }`, 
            'Authorization': `Bearer ${commonFunction.getJwtToken(req)}`,
        }
    }
    
    /**
     * Метод проверки кода  
     * @returns {Object} - Объект с результатом
     */
    async checkCode(req, res) {
        try {
            const response = await fetch(process.env.CHECK_CONFIRMATION_CODE_URL, {
                method: 'POST',
                headers: this.headers(req),
                body: JSON.stringify(req.body),
            });

            const data = await response.json();
            if (response.ok) {
                console.log(`checkCode successfully.`);
                return { success: true, data };
            } else {
                console.log(`checkCode failed.`);
                return { success: false, status: response.status, data };
            }
        } catch (error) {
            console.log(`checkCode failed.`);
            return { success: false, error: error.message };
        }
    }

// Получение активного запроса на смену контрольного вопроса 
async getSecurityQuestionRequestId(req) {
    try {        
        const response = await fetch(process.env.GET_CONFIRMATION_SECURITY_QUESTION_REQUEST_ID_URL, {
            method: 'GET',
            headers: this.headers(req),            
        });
        const data = await response.json();
        if (response.ok) {
            console.log(`getSecurityQuestionRequestId success.`);
            return { success: true, data };
        } else {
            console.log(`getSecurityQuestionRequestId failed.`);
            return { success: false, status: response.status, data };
        }
    } catch (error) {
        console.log(`getSecurityQuestionRequestId failed.`);
        return { success: false, error: error.message };
    }
  }
// Получение активного запроса на смену pin-кода
async getPINCodeRequestId(req) {
    try {        
        const response = await fetch(process.env.GET_CONFIRMATION_PIN_CODE_REQUEST_ID_URL, {
            method: 'GET',
            headers: this.headers(req),            
        });
        const data = await response.json();
        if (response.ok) {
            console.log(`getPINCodeRequestId success.`);
            return { success: true, data };
        } else {
            console.log(`getPINCodeRequestId failed.`);
            return { success: false, status: response.status, data };
        }
    } catch (error) {
        console.log(`getPINCodeRequestId failed.`);
        return { success: false, error: error.message };
    }
  }
  
    /**
     * Метод создания запроса на доставку кода
     * @returns {Object} - Объект с результатом
     */
    async createRequest(req, res) {
        try {
            const response = await fetch(process.env.CONFIRMATION_CREATE_REQUEST_ID_URL, {
                method: 'POST',
                headers: this.headers(req),
                body: JSON.stringify(req.body),
            });

            const data = await response.json();
            if (response.ok) {
                console.log(`sendRequest successfully.`);
                return { success: true, data };
            } else {
                console.log(`sendRequest failed.`);
                return { success: false, status: response.status, data };
            }
        } catch (error) {
            console.log(`sendRequest failed.`);
            return { success: false, error: error.message };
        }
    }

/**
* Метод для отправки кода 
* @returns {Object} - Объект с результатом
*/
async sendCodeRequest(req, res) {
    try {
        const response = await fetch(process.env.DELIVERY_CONFIRMATION_CODE_REQUEST_ID_URL, {
            method: 'POST',
            headers: this.headers(req),
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        if (response.ok) {
            console.log(`sendCodeRequest successfully.`);
            return { success: true, data };
        } else {
            console.log(`sendCodeRequest failed.`);
            return { success: false, status: response.status, data };
        }
    } catch (error) {
        console.log(`sendCodeRequest failed.`);
        return { success: false, error: error.message };
    }
}    

}



module.exports = ConfirmationServiceHandler;
