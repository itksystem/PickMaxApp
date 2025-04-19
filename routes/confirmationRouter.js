const express = require('express');
const router = express.Router();
const logger = require("../controllers/LoggerHandler"); // Работа с лог-файлами
const common = require("openfsm-common"); // Библиотека с общими параметрами
const ConfirmationServiceHandler = require("../handlers/ConfirmationServiceHandler");
const confirmationService = new ConfirmationServiceHandler();              // интерфейс для  связи с MC Confirmation
require('dotenv').config({ path: '.env-pickmax-service' });


router.post('/v1/check-code', async (req, res) => {
    const { code, requestId, action } = req.body;    
    try {
        if(!code || !requestId || !action) throw(422)
        const response = await confirmationService.checkCode(req);
        if (!response.success)  throw(422)    
        res.status(200).json(response.data);    
      } catch (error) {
        logger.error(`/v1/check-code ${error}`);   
        res.status(error).json({ status: false });
    }        
    
});

router.get('/v1/request/security-question', async (req, res) => {        
    try {
        const response = await confirmationService.getSecurityQuestionRequestId(req);
        if (!response.success)  throw(422)    
        res.status(200).json(response.data);        
    } catch (error) {
        logger.error(`/v1/request/security-question ${error}`);   
        res.status(error).json({ status: false });
    }
});

router.get('/v1/request/pin-code', async (req, res) => {        
    try {
        const response = await confirmationService.getPINCodeRequestId(req);
        if (!response.success)  throw(422)    
        res.status(200).json(response.data);        
    } catch (error) {
        logger.error(`/v1/request/pin-code ${error}`);   
        res.status(error).json({ status: false });
    }
});


router.post('/v1/request', async (req, res) => {    
    try {
         const { confirmationType } = req.body;
          if(!confirmationType) throw(400)    
          const response = await confirmationService.createRequest(req);
          if (!response.success)  throw(422)    
          res.status(200).json(response.data);
        } catch (error) {
         logger.error(`/v1/request ${error}`);   
         res.status(error).json({ status: false });
    }            
});

//
router.post('/v1/send-code-request', async (req, res) => {    
    try {
         const { confirmationType } = req.body;
          if(!confirmationType) throw(400)    
          const response = await confirmationService.sendCodeRequest(req);
          if (!response.success)  throw(422)    
          res.status(200).json(response.data);
        } catch (error) {
         logger.error(`/v1/request ${error}`);   
         res.status(error).json({ status: false });
    }        
});


module.exports = router;
