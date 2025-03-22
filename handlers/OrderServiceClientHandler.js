// Коннектор c микросервисом заказов
const fetch = require('node-fetch');
require('dotenv').config({ path: '.env-pickmax-service' });
const common = require("openfsm-common"); // Библиотека с общими параметрами
const CommonFunctionHelper = require("openfsm-common-functions")
const commonFunction= new CommonFunctionHelper();


class OrderServiceClientHandler {
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
     * Метод для создания заказа на все товары и корзины пользователя
     * @returns {Object} - Объект с параметрами заказа
     */

    async create(req, referenceId) {
        try {
            const response = await fetch(process.env.ORDER_SERVICE_CREATE_URL, {
                method: 'POST',                
                headers: this.headers(req),
                body: JSON.stringify({referenceId})
            }); 
            if (!response.ok)  throw(response.status);       
            let data;
            try {
                data = await response.json();
                } catch (jsonError) {
                 console.log(jsonError);
                 throw(500);
            }
            return { success: true, data };
          } catch (error) {
            // Возвращаем ошибку с описанием
            return { success: false, status: error};
        }
    }

    /**
     * Метод для установки статуса ОТМЕНЕН
     * @params {token} - токен пользователя
     * @params {body} - ьтело запроса
     * @returns {Object} - Объект с параметрами заказа
     */

    async decline(req, body) {
        try {
            const response = await fetch(process.env.ORDER_SERVICE_DECLINE_URL, {
                method: 'POST',                
                headers: this.headers(req),
                body: JSON.stringify(body)
            });              
            if (!response.ok)  throw(response.status);       
            let data;
            try {
                data = await response.json();
                } catch (jsonError) {
                console.log(jsonError);                    
                throw(500);
            }
            return { success: true, data };
          } catch (error) {
            // Возвращаем ошибку с описанием
            return { success: false, status: error};
        }
   }

    /**
     * Метод для установки статуса ОТМЕНЕН
     * @params {token} - токен пользователя
     * @params {body} - ьтело запроса
     * @returns {Object} - Объект с параметрами заказа
     */
    async getOrders(req) {
        try {
            const response = await fetch(process.env.ORDER_SERVICE_ORDERS_URL, {
                method: 'GET',                
                headers: this.headers(req),         
            });  
            if (!response.ok)  throw(response.status);       
            let data;
            try {
                data = await response.json();
                } catch (jsonError) {
                console.log(jsonError);                                        
                throw(500);
            }
            return { success: true, data };
          } catch (error) {
            // Возвращаем ошибку с описанием
            return { success: false, status: error};
        }
   }

    /*
     * Метод для установки статуса ОТМЕНЕН
     * @params {token} - токен пользователя
     * @params {orderId} - ID запроса
     * @returns {Object} - Объект с параметрами заказа
     */

   async getOrder(req, orderId) {
    try {
        const response = await fetch(process.env.ORDER_SERVICE_ORDER_URL+`/${orderId}`, {
            method: 'GET',
            headers: this.headers(req),         
        });          
        if (!response.ok)  throw(response.status);       
        let data;
        try {
              data = await response.json();
            } catch (jsonError) {
             console.log(jsonError);                                        
             throw(500);
        }
        return { success: true, data };
      } catch (error) {
        // Возвращаем ошибку с описанием
        return { success: false, status: error};
    }
  }
}

module.exports = OrderServiceClientHandler;