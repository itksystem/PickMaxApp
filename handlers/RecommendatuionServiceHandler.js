// Обработчик взаимодействия с AuthService
const fetch = require('node-fetch');
require('dotenv').config();
const CommonFunctionHelper = require("openfsm-common-functions")
const commonFunction= new CommonFunctionHelper();

class RecommendationServiceHandler {
    constructor() {

    }

      /**
     * Метод для отправки лайка по продукту
     * @returns {Object} - Объект с результатом
     */
        async setLike(req) {
            try {
                const response = await fetch(process.env.RECOMMENDATION_SERVICE_LIKE_URL, {
                    method: 'POST',
                    headers: { 'Content-Type' : 'application/json', 'Authorization': `Bearer ${commonFunction.getJwtToken(req)}`, },
                    body: JSON.stringify(req.body)
                });    
    
                const data = await response.json();
                if (response.ok) {
                    console.log(`POST setLike successfully.`);
                    return { success: true, data };
                } else {
                    console.log(`POST setLike failed.`);
                    return { success: false, status: response.status, data };
                }
            } catch (error) {
                    console.log(`POST setLike failed.`);
                return { success: false, error: error.message };
            }
        }

/**
     * Метод для отправки лайка по продукту
     * @returns {Object} - Объект с результатом
     */
async getLikes(req, productId) {
    try {        
        const response = await fetch(process.env.RECOMMENDATION_SERVICE_LIKE_URL+`/${productId}`, {
            method: 'GET',
            headers: { 'Content-Type' : 'application/json', 'Authorization': `Bearer ${commonFunction.getJwtToken(req)}`, },            
        });    

        const data = await response.json();
        if (response.ok) {
            console.log(`POST setLike successfully.`);
            return { success: true, data };
        } else {
            console.log(`POST setLike failed.`);
            return { success: false, status: response.status, data };
        }
    } catch (error) {
            console.log(`POST setLike failed.`);
        return { success: false, error: error.message };
    }
}

}

module.exports = RecommendationServiceHandler;
