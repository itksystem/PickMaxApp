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
            console.log(profile);
            if (!profile.success)
                throw({code : (profile?.status?.message =='401') ? 401: 422})                    
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
            if (!result.success) 
                throw({code : (result?.status?.message =='401') ? 401: 422})                    
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
            if (!result.success) throw({code : (result?.status?.message =='401') ? 401: 422})                    
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
            if (!result.success) throw({code : (result?.status?.message =='401') ? 401: 422})                    
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



router.get('/v1/delivery-types', 	
	async (req, res) => {        
        try {
            const result = await deliveryService.deliveryTypes(req, res);        
            if (!result.success) throw({code : (result?.status?.message =='401') ? 401: 422})                    
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
  


router.get('/v1/russian-postal-units', async (req, res) => {        
    try {
        const profile = await deliveryService.getSuggestRussianPostalUnits(req, res);        
        if (!profile.success) throw({code : (profile?.status?.message =='401') ? 401: 422})                    
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

router.get('/v1/cdek-filials', async (req, res) => {        
    try {
        const profile = await deliveryService.getSuggestCdekFilials(req, res);        
        if (!profile.success) throw({code : (profile?.status?.message =='401') ? 401: 422})                    
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

module.exports = router;