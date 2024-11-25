// Обработчик взаимодействия с AuthService
const fetch = require('node-fetch');
require('dotenv').config();
const CommonFunctionHelper = require("openfsm-common-functions")
const commonFunction= new CommonFunctionHelper();

class ClientServiceHandler {
    constructor() {

    }

    /**
     * Метод для получения сервисных данных пользователя от AuthService
     * @returns {Object} - Объект с результатом
     */
    async profile(req, res) {
        try {
            const response = await fetch(process.env.CLIENT_PROFILE_URL, {
                method: 'GET',
                headers: { 'Content-Type' : 'application/json', 'Authorization': `Bearer ${commonFunction.getJwtToken(req)}`, },            
   	    });

            const data = await response.json();
            if (response.ok) {
                console.log(`Get Me successfully.`);
                return { success: true, data };
            } else {
                console.log(`Get Me failed.`);
                return { success: false, status: response.status, data };
            }
        } catch (error) {
                console.log(`Get Me failed.`);
            return { success: false, error: error.message };
        }
    }

        /**
     * Метод для получения сервисных данных пользователя от AuthService
     * @returns {Object} - Объект с результатом
     */
        async saveProfile(req, res) {
            try {
                const response = await fetch(process.env.CLIENT_PROFILE_URL, {
                    method: 'POST',
                    headers: { 'Content-Type' : 'application/json', 'Authorization': `Bearer ${commonFunction.getJwtToken(req)}`, },
                    body: JSON.stringify(req.body)
                });    
    
                const data = await response.json();
                if (response.ok) {
                    console.log(`Get Me successfully.`);
                    return { success: true, data };
                } else {
                    console.log(`Get Me failed.`);
                    return { success: false, status: response.status, data };
                }
            } catch (error) {
                    console.log(`Get Me failed.`);
                return { success: false, error: error.message };
            }
        }
     
}

module.exports = ClientServiceHandler;
