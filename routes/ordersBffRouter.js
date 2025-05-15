const express = require('express');
const router = express.Router();
const logger = require("../controllers/LoggerHandler"); // Работа с лог-файлами
const common = require("openfsm-common"); // Библиотека с общими параметрами

const OrderServiceClientHandler = require("../handlers/OrderServiceClientHandler");
const orderClient = new OrderServiceClientHandler();   // интерфейс для  связи с MC Заказы

const WarehouseServiceClientHandler = require("openfsm-warehouse-service-client-handler");
const warehouseClient = new WarehouseServiceClientHandler();   // интерфейс для  связи с MC

const CommonFunctionHelper = require("openfsm-common-functions")
const commonFunction= new CommonFunctionHelper();

const AuthServiceClientHandler = require("openfsm-auth-service-client-handler");
const authClient = new AuthServiceClientHandler();              // интерфейс для  связи с MC AuthService


require('dotenv').config({ path: '.env-pickmax-service' });

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
            const response = await orderClient.create(req);
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
            const response = await orderClient.decline(req,req.body);
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
          const response = await orderClient.getOrders(req);
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
           const response = await orderClient.getOrder(req,orderId);    
           if (!response.success)  throw(response.status)
           res.status(200).json(response.data);
        } catch (error) {
          logger.error(error || 'Неизвестная ошибка' );   
          res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });                        
        }
});   


/* удалить из заказа товар */
router.post('/v1/order/product-remove', 	
	async (req, res) => {        
        try {
          const userId = await authClient.getUserId(req, res);                   
          if(!userId) throw(401)
           const {orderId, productId} = req.body;
           if(!orderId || !productId) { throw(common.HTTP_CODES.BAD_REQUEST.code) }
           const response = await warehouseClient.removeItemFromOrder(req);    
           if (!response.success)  throw(response.status)
           res.status(200).json(response.data);
        } catch (error) {
          logger.error(error || 'Неизвестная ошибка' );   
          res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });                        
        }
});   


module.exports = router;