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

router.get('/v1/products/:id', 

    async (req, res) => {
        const id = req.params.id;
        if(!id) { res.status(204).json(); }
        else {
        const response = await warehouseClient.getProductById(commonFunction.getJwtToken(req), id);
        if (response.success) {
            res.status(200).json(response.data);
        } else {
            logger.error(response.error || 'Неизвестная ошибка' );   
            res.status(response.status || 500).json({ error: response.error ||  common.COMMON_HTTP_CODE_500 });
        }
    }
   });

   router.post('/v1/products', 
	
	async (req, res) => {        
        let {categoryId} = req.body; 
        if(!categoryId) categoryId = null;
        const response = await warehouseClient.getProducts(commonFunction.getJwtToken(req),categoryId);
        if (response.success) {
            res.status(200).json(response.data);
        } else {
            logger.error(response.error || 'Неизвестная ошибка' );   
            res.status(response.status || 500).json({ error: response.error ||  common.COMMON_HTTP_CODE_500 });
        }
   });
   

   router.post('/v1/basket/product-add', 	
	async (req, res) => {        
        const response = await warehouseClient.addItemToBasket(commonFunction.getJwtToken(req),req.body);
        if (response.success) {
            res.status(200).json(response.data);
        } else {
            logger.error(response.error || 'Неизвестная ошибка' );   
            res.status(response.status || 500).json({ error: response.error ||  common.COMMON_HTTP_CODE_500 });
        }
   });
   
   router.post('/v1/basket/product-remove', 	
	async (req, res) => {        
        const response = await warehouseClient.removeItemFromBasket(commonFunction.getJwtToken(req),req.body);
        if (response.success) {
            res.status(200).json(response.data);
        } else {
            logger.error(response.error || 'Неизвестная ошибка' );   
            res.status(response.status || 500).json({ error: response.error ||  common.COMMON_HTTP_CODE_500 });
        }
   });
   
   router.get('/v1/basket', 	
	async (req, res) => {        
        const response = await warehouseClient.getBasket(commonFunction.getJwtToken(req));
        if (response.success) {
            res.status(200).json(response.data);
        } else {
            logger.error(response.error || 'Неизвестная ошибка' );   
            res.status(response.status || 500).json({ error: response.error ||  common.COMMON_HTTP_CODE_500 });
        }
   });
   

   module.exports = router;
