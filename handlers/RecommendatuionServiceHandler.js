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
                const response = await fetch(process.env.RECOMMENDATION_SERVICE_LIKE_URL+`/${req.params.productId}`, {
                    method: 'POST',
                    headers: { 'Content-Type' : 'application/json', 'Authorization': `Bearer ${commonFunction.getJwtToken(req)}`, },
                    body: JSON.stringify(req.body)
                });    
    
                const data = await response.json();
                if (response.ok) {
                    console.log(`setLike successfully.`);
                    return { success: true, data };
                } else {
                    console.log(`setLike failed.`);
                    return { success: false, status: response.status, data };
                }
            } catch (error) {
                    console.log(`setLike failed.`);
                return { success: false, error: error.message };
            }
        }

/**
     * Метод для получения лайка по продукту
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
            console.log(`getLikes successfully.`);
            return { success: true, data };
        } else {
            console.log(`getLikes failed.`);
            return { success: false, status: response.status, data };
        }
    } catch (error) {
            console.log(`getLikes failed.`);
        return { success: false, error: error.message };
    }
}

/**
     * Метод для получения лайка по продукту
     * @returns {Object} - Объект с результатом
     */
async getReviewCount(req, productId) {
    try {        
        const response = await fetch(process.env.RECOMMENDATION_SERVICE_REVIEW_URL+`/${productId}/counter`, {
            method: 'GET',
            headers: { 'Content-Type' : 'application/json', 'Authorization': `Bearer ${commonFunction.getJwtToken(req)}`, },            
        });    

        const data = await response.json();
        if (response.ok) {
            console.log(`getReviewCount successfully.`);
            return { success: true, data };
        } else {
            console.log(`getReviewCount failed.`);
            return { success: false, status: response.status, data };
        }
    } catch (error) {
            console.log(`getReviewCount failed.`);
        return { success: false, error: error.message };
    }
}


async getRating(req, productId) {
    try {        
        const response = await fetch(process.env.RECOMMENDATION_SERVICE_RATING_URL+`/${productId}`, {
            method: 'GET',
            headers: { 'Content-Type' : 'application/json', 'Authorization': `Bearer ${commonFunction.getJwtToken(req)}`, },            
        });    

        const data = await response.json();
        if (response.ok) {
            console.log(`getRating successfully.`);
            return { success: true, data };
        } else {
            console.log(`getRating failed.`);
            return { success: false, status: response.status, data };
        }
    } catch (error) {
            console.log(`getRating failed.`);
        return { success: false, error: error.message };
    }
}


async getReviews(req, productId) {
    try {        
        const response = await fetch(process.env.RECOMMENDATION_SERVICE_REVIEWS_URL+`/${productId}`, {
            method: 'GET',
            headers: { 'Content-Type' : 'application/json', 'Authorization': `Bearer ${commonFunction.getJwtToken(req)}`, },            
        });    

        const data = await response.json();
        if (response.ok) {
            console.log(`getReviews successfully.`);
            return { success: true, data };
        } else {
            console.log(`getReviews failed.`);
            return { success: false, status: response.status, data };
        }
    } catch (error) {
            console.log(`getReviews failed.`);
        return { success: false, error: error.message };
    }
}

async getReviewUser(req, productId) {
    try {        
        const response = await fetch(process.env.RECOMMENDATION_SERVICE_REVIEWS_URL+`/${productId}/my/review`, {
            method: 'GET',
            headers: { 'Content-Type' : 'application/json', 'Authorization': `Bearer ${commonFunction.getJwtToken(req)}`, },            
        });    

        const data = await response.json();
        if (response.ok) {
            console.log(`getReviewUser successfully.`);
            return { success: true, data };
        } else {
            console.log(`getReviewUser failed.`);
            return { success: false, status: response.status, data };
        }
    } catch (error) {
            console.log(`getReviewUser failed.`);
        return { success: false, error: error.message };
    }
}

async setRating(req, productId) {
    try {        
        const response = await fetch(process.env.RECOMMENDATION_SERVICE_RATING_URL+`/${productId}`, {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json', 'Authorization': `Bearer ${commonFunction.getJwtToken(req)}`, },            
            body: JSON.stringify(req.body),
        });    

        const data = await response.json();
        if (response.ok) {
            console.log(`setRating successfully.`);
            return { success: true, data };
        } else {
            console.log(`setRating failed.`);
            return { success: false, status: response.status, data };
        }
    } catch (error) {
            console.log(`setRating failed.`);
        return { success: false, error: error.message };
    }
}

async setReview(req, productId) {
    try {        
        const response = await fetch(process.env.RECOMMENDATION_SERVICE_REVIEW_URL+`/${productId}`, {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json', 'Authorization': `Bearer ${commonFunction.getJwtToken(req)}`, },            
            body: JSON.stringify(req.body),
        });    

        const data = await response.json();
        if (response.ok) {
            console.log(`setReview successfully.`);
            return { success: true, data };
        } else {
            console.log(`setReview failed.`);
            return { success: false, status: response.status, data };
        }
    } catch (error) {
            console.log(`setReview failed.`);
        return { success: false, error: error.message };
    }
}



}

module.exports = RecommendationServiceHandler;
