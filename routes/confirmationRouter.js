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


router.get('/v1/security-question-status', async (req, res) => {    // проверка на наличие установленного контрольного вопроса    
    try {
        const response = await confirmationService.getSecurityQuestionStatus(req);    
        if (response.success) 
            res.status(200).json(response.data);
    } catch (error) {
        logger.error(response.error || 'Неизвестная ошибка' );   
        res.status(response.status || 500).json({ error: response.error ||  common.COMMON_HTTP_CODE_500 });
    }

});

router.get('/v1/security-questions', async (req, res) => {    // список вопросов
    try{
      const response = await confirmationService.getSecurityQuestions(req);
      if (response.success) 
        res.status(200).json(response.data);
    } catch (error) {
      logger.error(response.error || 'Неизвестная ошибка' );   
      res.status(response.status || 500).json({ error: response.error ||  common.COMMON_HTTP_CODE_500 });
  }
});

router.post('/v1/security-question', async (req, res) => {    // установить вопрос
    try{
      const response = await confirmationService.setSecurityQuestion(req);
      if (response.success) 
        res.status(200).json(response.data);
    } catch (error) {
      logger.error(response.error || 'Неизвестная ошибка' );   
      res.status(response.status || 500).json({ error: response.error ||  common.COMMON_HTTP_CODE_500 });
  }
});



module.exports = router;
