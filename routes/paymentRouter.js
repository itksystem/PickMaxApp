const express = require('express');
const paymentRouter = express.Router();
const logger = require("../controllers/LoggerHandler"); // Работа с лог-файлами
const common = require("openfsm-common"); // Библиотека с общими параметрами
const CommonFunctionHelper = require("openfsm-common-functions")
const commonFunction= new CommonFunctionHelper();

const PaymentServiceClientHandler = require("openfsm-payment-service-client-handler");
const paymentClient = new PaymentServiceClientHandler();   // интерфейс для  связи с MC WarehouseService
require('dotenv').config({ path: '.env-pickmax-service' });

/* Сформировать оплату */
paymentRouter.post('/v1/create', 	
	async (req, res) => {        
        try {
            const response = await paymentClient.create(commonFunction.getJwtToken(req), req.body);
            if (!response.success)  throw(response.status)
            res.status(200).json(response.data);            
        } catch (error) {            
            logger.error(error );   
            res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });
        }       
});

/* Отменить оплату */
paymentRouter.post('/v1/decline', 	
	async (req, res) => {        
        try {            
            const response = await paymentClient.decline(commonFunction.getJwtToken(req), req.body);
            if (!response.success)  throw(response.status)
            res.status(200).json(response.data);            
        } catch (error) {            
            logger.error(error );   
            res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });
        }       
});

/*  Работа с средствами платежа */
paymentRouter.get('/v1/instruments', 	
	async (req, res) => {        
        try {            
            const response = await paymentClient.instruments(commonFunction.getJwtToken(req));
            if (!response.success)  throw(response.status)
            res.status(200).json(response.data);            
        } catch (error) {            
            logger.error(error );   
            res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });
        }       
});

paymentRouter.get('/v1/cards', 	
	async (req, res) => {        
        try {            
            const response = await paymentClient.cards(commonFunction.getJwtToken(req));
            if (!response.success)  throw(response.status)
            res.status(200).json(response.data);            
        } catch (error) {            
            logger.error(error );   
            res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });
        }       
});

paymentRouter.patch('/v1/card', 	
	async (req, res) => {        
        try {            
            const response = await paymentClient.setDefaultCard(commonFunction.getJwtToken(req), req);
            if (!response.success)  throw(response.status)
            res.status(200).json(response.data);            
        } catch (error) {            
            logger.error(error );   
            res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });
        }       
});

paymentRouter.delete('/v1/card', 	
	async (req, res) => {        
        try {            
            const response = await paymentClient.deleteCard(commonFunction.getJwtToken(req), req);
            if (!response.success)  throw(response.status)
            res.status(200).json(response.data);            
        } catch (error) {            
            logger.error(error );   
            res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });
        }       
});


module.exports = paymentRouter;
