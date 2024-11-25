const express = require('express');
const router = express.Router();
const logger = require("../controllers/LoggerHandler"); // Работа с лог-файлами
const common = require("openfsm-common"); // Библиотека с общими параметрами
const { health, renderPage } = require('../controllers/mainController');
const authMiddleware = require('openfsm-middlewares-auth-service');

const ClientServiceHandler = require("../handlers/ClientServiceHandler");
const clientService = new ClientServiceHandler();              // интерфейс для  связи с MC AuthService
const AuthServiceClientHandler = require("openfsm-auth-service-client-handler");
const authClient = new AuthServiceClientHandler();              // интерфейс для  связи с MC AuthService

const CommonFunctionHelper = require("openfsm-common-functions")
const commonFunction= new CommonFunctionHelper();


/* Получить профиль клиента */
router.get('/v1/profile', 	
	async (req, res) => {        
        try {
            const response = await clientService.profile(req, res);        
            if (!response.success)  throw(response.status)
             res.status(200).json(response.data);    
        } catch (error) {
            logger.error(error );   
            res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });            
        }
});

/* Сохранить профиль клиента */
router.post('/v1/profile', 	
	async (req, res) => {        
        try {
            const response = await clientService.saveProfile(req, res);        
            if (!response.success)  throw(response.status)
             res.status(200).json(response.data);    
        } catch (error) {
            logger.error(error );   
            res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });            
        }
});

/* Доступность сервиса заказов */
router.post('/v1/logout', 	
	async (req, res) => {        
        try {
            const response = await authClient.logout(req, res);        
            if (!response.success)  throw(response.status)
             res.status(200).json(response.data);    
        } catch (error) {
            logger.error(error );   
            res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });            
        }
});



module.exports = router;