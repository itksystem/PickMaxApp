const express = require('express');
const router = express.Router();
const logger = require("../controllers/LoggerHandler"); // Работа с лог-файлами
const common = require("openfsm-common"); // Библиотека с общими параметрами
const { health, renderPage } = require('../controllers/mainController');
const authMiddleware = require('openfsm-middlewares-auth-service');

const AuthServiceClientHandler = require("openfsm-auth-service-client-handler");
const authClient = new AuthServiceClientHandler();              // интерфейс для  связи с MC AuthService
const WarehouseServiceClientHandler = require("openfsm-warehouse-service-client-handler");
const warehouseClient = new WarehouseServiceClientHandler();   // интерфейс для  связи с MC WarehouseService
const CommonFunctionHelper = require("openfsm-common-functions")
const commonFunction= new CommonFunctionHelper();
const RecommendatuionServiceHandler = require("../handlers/RecommendatuionServiceHandler");
const recoClient = new RecommendatuionServiceHandler();

router.get('/v1/products/:id', 
    async (req, res) => {
        try {
          const id = req.params.id;
          if(!id) { throw(common.HTTP_CODES.BAD_REQUEST.code) }
          const response = await warehouseClient.getProductById(commonFunction.getJwtToken(req), id);
          if (!response.success)  throw(response?.status || 500)
          res.status(200).json(response.data);             
        } catch (error) {
           logger.error(error || 'Неизвестная ошибка' );   
           res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  commonFunction.getDescriptionByCode((Number(error) || 500)) });
        }    
   });

   router.post('/v1/products', 	
	async (req, res) => {        
      try {
          let {categoryId} = req.body; 
          if(!categoryId) categoryId = null;
          const response = await warehouseClient.getProducts(commonFunction.getJwtToken(req),categoryId);
          for (const item of response.data) {
            let _likes = await recoClient.getLikes(req, item.productId);
               item.likes = (_likes?.data) ? _likes?.data?.likes : 0;     
               item.like = (_likes?.data) ? _likes?.data?.status: 0;                                    
            }               
          if (!response.success)  throw(response?.status || 500)
          res.status(200).json(response.data);            
      } catch (error) {
          logger.error(error || 'Неизвестная ошибка' );   
         res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  commonFunction.getDescriptionByCode((Number(error) || 500)) });
      }
   }
);   

   router.post('/v1/basket/product-add', 	
	async (req, res) => {
        try {
            const response = await warehouseClient.addItemToBasket(commonFunction.getJwtToken(req),req.body);
            if (!response.success)  throw(response?.status || 500)
            res.status(200).json(response.data);            
        } catch (error) {
            logger.error(error || 'Неизвестная ошибка' );   
            res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  commonFunction.getDescriptionByCode((Number(error) || 500)) });
        }  
   });
   
   router.post('/v1/basket/product-remove', 	
	async (req, res) => {  
        try {
            const response = await warehouseClient.removeItemFromBasket(commonFunction.getJwtToken(req),req.body);
            if (!response.success)  throw(response?.status || 500)
            res.status(200).json(response.data);            
        } catch (error) {
            logger.error(error || 'Неизвестная ошибка' );   
            res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  commonFunction.getDescriptionByCode((Number(error) || 500)) });
        }      
   });
   
   router.get('/v1/basket', 	
	async (req, res) => {  
        try {            
            const response = await warehouseClient.getBasket(commonFunction.getJwtToken(req));
            if (!response.success)  throw(response?.status || 500)
                res.status(200).json(response.data);            
        } catch (error) {
                logger.error(error || 'Неизвестная ошибка' );   
                res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  commonFunction.getDescriptionByCode((Number(error) || 500)) });
        }              
   });

   router.delete('/v1/basket/item/:productId', 	
	async (req, res) => {  
        try {            
            const response = await warehouseClient.deletePositionFromBasket(commonFunction.getJwtToken(req), req.params.productId);
            if (!response.success)  throw(response?.status || 500)
                res.status(200).json(response.data);            
        } catch (error) {
                logger.error(error || 'Неизвестная ошибка' );   
                res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  commonFunction.getDescriptionByCode((Number(error) || 500)) });
        }              
   });
   
   
   router.get('/v1/order/:id/details', 	
	async (req, res) => {          
        try {            
            const orderId = req.params.id;
            if(!orderId) { throw(common.HTTP_CODES.BAD_REQUEST.code) }
            const response = await warehouseClient.getOrderDetails(commonFunction.getJwtToken(req), orderId) ;
            if (!response.success)  throw(response?.status || 500)
                res.status(200).json(response.data);            
        } catch (error) {
                logger.error(error || 'Неизвестная ошибка' );   
                res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  commonFunction.getDescriptionByCode((Number(error) || 500)) });
        }              
   });
 

   module.exports = router;
