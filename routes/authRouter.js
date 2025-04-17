const express = require('express');
const router = express.Router();
const logger = require("../controllers/LoggerHandler"); // Работа с лог-файлами
const common = require("openfsm-common"); // Библиотека с общими параметрами
const { health, renderPage } = require('../controllers/mainController');
const authMiddleware = require('openfsm-middlewares-auth-service');

const AuthServiceClientHandler = require("openfsm-auth-service-client-handler");
const authClient = new AuthServiceClientHandler();              // интерфейс для  связи с MC AuthService

require('dotenv').config({ path: '.env-pickmax-service' });


router.get('/v1/two-factors', async (req, res) => {    
    const userId = await authClient.getUserId(req, res);                   
    if(!userId) throw(401)
    const response = await authClient.get2PAFactorsList(req);
    if (response.success) {        
        res.status(200).json(response.data);
    } else {
        logger.error(response.error || 'Неизвестная ошибка' );   
        res.status(response.status || 500).json({ error: response.error ||  common.COMMON_HTTP_CODE_500 });
    }
});


router.get('/v1/security-question-status', async (req, res) => {    
    const userId = await authClient.getUserId(req, res);                   
    if(!userId) throw(401)
    const response = await authClient.getSecurityQuestionStatus(req);
    if (response.success) {        
        res.status(200).json(response.data);
    } else {
        logger.error(response.error || 'Неизвестная ошибка' );   
        res.status(response.status || 500).json({ error: response.error ||  common.COMMON_HTTP_CODE_500 });
    }
});


router.get('/v1/pin-code-status', async (req, res) => {    
    const userId = await authClient.getUserId(req, res);                   
    if(!userId) throw(401)
    const response = await authClient.getPINCodeStatus(req);
    if (response?.success) {        
        res.status(200).json(response.data);
    } else {
        logger.error(response.error || 'Неизвестная ошибка' );   
        res.status(response.status || 500).json({ error: response.error ||  common.COMMON_HTTP_CODE_500 });
    }
});

router.get('/v1/security-question', async (req, res) => {    
    const userId = await authClient.getUserId(req, res);                   
    if(!userId) throw(401)
    const response = await authClient.getSecurityQuestion(req);
    if (response?.success) {        
        res.status(200).json(response.data);
    } else {
        logger.error(response.error || 'Неизвестная ошибка' );   
        res.status(response.status || 500).json({ error: response.error ||  common.COMMON_HTTP_CODE_500 });
    }
});


router.post('/v1/security-question-answer', async (req, res) => {    
    const userId = await authClient.getUserId(req, res);                   
    if(!userId) throw(401)
    const response = await authClient.getSecurityAnswer(req);
    if (response?.success) {        
        res.status(200).json(response.data);
    } else {
        logger.error(response.error || 'Неизвестная ошибка' );   
        res.status(response.status || 500).json({ error: response.error ||  common.COMMON_HTTP_CODE_500 });
    }
});


router.post('/v1/security-question', async (req, res) => {    
    const userId = await authClient.getUserId(req, res);                   
    if(!userId) throw(401)
    const response = await authClient.setSecurityQuestion(req);
    if (response?.success) {        
        res.status(200).json(response.data);
    } else {
        logger.error(response.error || 'Неизвестная ошибка' );   
        res.status(response.status || 500).json({ error: response.error ||  common.COMMON_HTTP_CODE_500 });
    }
});

module.exports = router;
