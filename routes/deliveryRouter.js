const express = require('express');
const router = express.Router();
const logger = require("../controllers/LoggerHandler"); // Работа с лог-файлами
const common = require("openfsm-common"); // Библиотека с общими параметрами
const { health, renderPage } = require('../controllers/mainController');
const authMiddleware = require('openfsm-middlewares-auth-service');

const DeliveryServiceHandler = require("openfsm-delivery-service-client-handler");
const deliveryService = new DeliveryServiceHandler();              // интерфейс для  связи с MC AuthService
const AuthServiceClientHandler = require("openfsm-auth-service-client-handler");
const authClient = new AuthServiceClientHandler();              // интерфейс для  связи с MC AuthService
const axios = require('axios'); // Импорт библиотеки axios

const CommonFunctionHelper = require("openfsm-common-functions")
const ResponseHelper = require("openfsm-response-helper")
const _response = new ResponseHelper();
require('dotenv').config({ path: '.env-pickmax-service' });


/* Получить список адресов клиента */
router.get('/v1/addresses', 	
	async (req, res) => {        
        try {
            const profile = await deliveryService.getAdresses(req, res);        
            if (!profile.success) throw({code : 422, message : "Client profile not found" })
                _response
                    .setCode(200)                    
                    .setData(profile.data)
                    .send(res);    
        } catch (error) {            
                _response
                    .setCode(error.code)
                    .setStatus(false)
                    .setMessage(error.message)
                    .send(res);                    
        }
});

/* Получить список адресов клиента */
router.patch('/v1/address', 	
	async (req, res) => {        
        try {
            const result = await deliveryService.setDefaultAdress(req, res);        
            if (!result.success) throw({code : 422, message : "Set address not execute" })
                _response
                    .setCode(200)                    
                    .setData(result.data)
                    .send(res);    
        } catch (error) {            
                _response
                    .setCode(error.code)
                    .setStatus(false)
                    .setMessage(error.message)
                    .send(res);                    
        }
});

// Сохранение адреса 
router.post('/v1/address', 	
	async (req, res) => {        
        try {
            const result = await deliveryService.saveAddress(req, res);        
            if (!result.success) throw({code : 422, message : "Save new address not executed" })
                _response
                    .setCode(200)                    
                    .setData(result.data)
                    .send(res);    
        } catch (error) {            
                _response
                    .setCode(error.code)
                    .setStatus(false)
                    .setMessage(error.message)
                    .send(res);                    
        }
});

// Сохранение адреса 
router.delete('/v1/address', 	
	async (req, res) => {        
        try {
            const result = await deliveryService.deleteAddress(req, res);        
            if (!result.success) throw({code : 422, message : "Delete address not executed" })
                _response
                    .setCode(200)                    
                    .setData(result.data)
                    .send(res);    
        } catch (error) {            
                _response
                    .setCode(error.code)
                    .setStatus(false)
                    .setMessage(error.message)
                    .send(res);                    
        }
});



/* Сохранить профиль клиента */
/*
router.post('/v1/profile', 	
	async (req, res) => {        
        try {
            const profile = await clientService.saveProfile(req, res);        
            if (!profile.success)  throw({code : profile.status, message : "Не удалось сохранить профиль пользователя" })             
                _response
                    .setCode(200)                    
                    .setData(profile.data)
                    .send(res);    
        } catch (error) {
                _response
                    .setCode(error.code)
                    .setStatus(false)
                    .setMessage(error.message)
                    .send(res);                    
        }
});

// Доступность сервиса заказов 
router.post('/v1/logout', 	
	async (req, res) => {        
        try {
            const logout = await authClient.logout(req, res);        
            if (!logout.success)  throw({code : logout.status, message : "Ошибка при выполнении операции выхода из сессии" })
                _response
                    .setCode(200)                    
                    .setData(logout.data)
                    .send(res);    
        } catch (error) {
            _response
                    .setCode(error.code)
                    .setStatus(false)
                    .setMessage(error.message)
                    .send(res);                    
        }
});

// Доступность сервиса заказов 
router.get('/v1/logout', 	
	async (req, res) => {        
        try {
            const logout = await authClient.logout(req, res);        
            if (!logout.success)  throw({code : logout.status, message : "Ошибка при выполнении операции выхода из сессии" })
                _response
                    .setCode(200)                    
                    .setData(logout.data)
                    .send(res);    
        } catch (error) {
            _response
                    .setCode(error.code)
                    .setStatus(false)
                    .setMessage(error.message)
                    .send(res);                    
        }
});





// Дадата 
router.get('/v1/suggest/address', async (req, res) => {        
    try {
        const profile = await clientService.getSuggestAddress(req, res);        
        if (!profile.success)  throw({code : profile.status, message : "Не получить адрес ищ сервиса Dadata" })             
            _response
                .setCode(200)                    
                .setData(profile.data)
                .send(res);    
    } catch (error) {
            _response
                .setCode(error.code)
                .setStatus(false)
                .setMessage(error.message)
                .send(res);                    
    }
   } 
);


// Получить подписки 
router.get('/v1/subscriptions', 	
	async (req, res) => {        
        try {
            const result = await clientService.getSubscriptions(req, res);        
            if (!result.success)  throw({code : logout.status, message : "Ошибка при выполнении операции выхода из сессии" })
                let subscriptions = result?.data || [];
                _response
                    .setCode(200)                    
                    .setData(subscriptions)
                    .send(res);    
        } catch (error) {
            _response
                    .setCode(error.code)
                    .setStatus(false)
                    .setMessage(error.message)
                    .send(res);                    
        }
});

router.patch('/v1/subscription', 	
	async (req, res) => {        
        try {
            const result = await clientService.setSubscription(req, res);        
            if (!result.success)  throw({code : logout.status, message : "Ошибка при выполнении операции выхода из сессии" })
                let subscriptions = result.data;
                _response
                    .setCode(200)                    
                    .setData(subscriptions)
                    .send(res);    
        } catch (error) {
            _response
                    .setCode(error.code)
                    .setStatus(false)
                    .setMessage(error.message)
                    .send(res);                    
        }
});
*/
  
module.exports = router;