const express = require('express');
const paymentRouter = express.Router();
const logger = require("../controllers/LoggerHandler"); // Работа с лог-файлами
const common = require("openfsm-common"); // Библиотека с общими параметрами
const CommonFunctionHelper = require("openfsm-common-functions")
const commonFunction= new CommonFunctionHelper();

const PaymentServiceClientHandler = require("openfsm-payment-service-client-handler");
const paymentClient = new PaymentServiceClientHandler();   // интерфейс для  связи с MC WarehouseService

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

module.exports = paymentRouter;
