const express = require('express');
const router = express.Router();
const logger = require("../controllers/LoggerHandler"); // Работа с лог-файлами
const common = require("openfsm-common"); // Библиотека с общими параметрами

const OrderServiceClientHandler = require("../handlers/OrderServiceClientHandler");
const orderClient = new OrderServiceClientHandler();   // интерфейс для  связи с MC Заказы

const CommonFunctionHelper = require("openfsm-common-functions")
const commonFunction= new CommonFunctionHelper();


/* Доступность сервиса заказов */
router.post('/v1/health', 	
	async (req, res) => {        
        try {
            const response = await orderClient.health(commonFunction.getJwtToken(req),req.body);        
            if (!response.success)  throw(response.status)
             res.status(200).json(response.data);    
        } catch (error) {
            logger.error(error );   
            res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });            
        }
});

/* Сформировать заказ */
router.post('/v1/order/create', 	
	async (req, res) => {        
        try {
            const {referenceId} = req.body;
            if(!referenceId) { throw(common.HTTP_CODES.BAD_REQUEST.code) }
            const response = await orderClient.create(commonFunction.getJwtToken(req), referenceId);
            if (!response.success)  throw(response.status)
            res.status(200).json(response.data);            
        } catch (error) {            
            logger.error(error );   
            res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });
        }       
});


/* Отменить заказ */
router.post('/v1/order/decline', 	
	async (req, res) => {        
        try {
            const response = await orderClient.decline(commonFunction.getJwtToken(req),req.body);
            if (!response.success)  throw(response.status)
            res.status(200).json(response.data);                
        } catch (error) {
            logger.error(error || 'Неизвестная ошибка' );   
            res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });
            
        }
});   

/* получить список заказов*/
router.get('/v1/orders', 	
	async (req, res) => {        
        try {
          const response = await orderClient.getOrders(commonFunction.getJwtToken(req));
          if (!response.success)  throw(response.status)
          res.status(200).json(response.data);                
        } catch (error) {
            logger.error(error || 'Неизвестная ошибка' );   
          res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });            
        }
});   

/* получить описание заказа */
router.get('/v1/order/:id', 	
	async (req, res) => {        
        try {
           const orderId = req.params.id;
           if(!orderId) { throw(common.HTTP_CODES.BAD_REQUEST.code) }
           const response = await orderClient.getOrder(commonFunction.getJwtToken(req),orderId);    
           if (!response.success)  throw(response.status)
           res.status(200).json(response.data);
        } catch (error) {
          logger.error(error || 'Неизвестная ошибка' );   
          res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });                        
        }
});   

module.exports = router;