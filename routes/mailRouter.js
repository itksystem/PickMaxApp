const express = require('express');
const mailRouter = express.Router();
const logger = require("../controllers/LoggerHandler"); // Работа с лог-файлами
const common = require("openfsm-common"); // Библиотека с общими параметрами
const axios = require('axios'); // Импорт библиотеки axios
const multer = require('multer');
const path = require('path');
const authMiddleware = require('openfsm-middlewares-auth-service');

const CommonFunctionHelper = require("openfsm-common-functions")
const commonFunction= new CommonFunctionHelper();

const ResponseHelper = require("openfsm-response-helper")
const _response = new ResponseHelper();

const NotificationServiceHandler = require("../handlers/NotificationServiceHandler");
const NotificationClient = new NotificationServiceHandler();

const ClientServiceHandler = require("../handlers/ClientServiceHandler");
const clientService = new ClientServiceHandler();              // интерфейс для  связи с MC AuthService


mailRouter.get( '/v1/product/:productId', authMiddleware.authenticateToken,async (req, res) => {        
    try {
        let {status} = req.body;           
        let productId = req.params.productId;                     
        let filterId = req.query.id;                     
        if(!productId) return res.status(400).json({ code: 400, message:  commonFunction.getDescriptionByCode(400)});            
        const response = await NotificationClient.getProductMail(req, productId, filterId);                   
            if (!response.success)  throw(response?.status || 500)
             if(response.data?.mails?.length > 0 )   
              await Promise.all( // Асинхронно загружаем медиафайлы для каждого продукта
                  response.data?.mails?.map(async (mail) => {
                      try { 
                        console.log(mail);
                        let user = await clientService.client(req, mail.user_id);    
                        mail.author = (user?.data?.profile?.name || user?.data?.profile?.surname)
                          ? (user?.data?.profile?.name || '')
                          +(' ')+(user?.data?.profile?.patronymic || '')
                          +(' ')+(user?.data?.profile?.surname[0] || '')+(user?.data?.profile?.surname[0] ? '.' : '')
                          : 'Аноним';                        
                      } catch (mediaError) { // Логируем ошибку загрузки медиафайлов, но продолжаем обработку других продуктов          
                        console.error(`Error fetching media : ${mediaError.message}`);                                            }
                      return mail;
                    })	
                  );     

        res.status(200).json(response.data);            
    } catch (error) {
        logger.error(error || 'Неизвестная ошибка' );   
        res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  commonFunction.getDescriptionByCode((Number(error) || 500)) });
    }
 });
mailRouter.post('/v1/product/:productId', authMiddleware.authenticateToken,async (req, res) => {        
    try {
        let {status} = req.body;           
        let productId = req.params.productId;                     
        if(!productId) return res.status(400).json({ code: 400, message:  commonFunction.getDescriptionByCode(400)});            
        const response = await NotificationClient.sendProductMail(req, productId);
        if (!response.success)  throw(response?.status || 500)
        res.status(200).json(response.data);            
    } catch (error) {
        logger.error(error || 'Неизвестная ошибка' );   
        res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  commonFunction.getDescriptionByCode((Number(error) || 500)) });
    }
 });
module.exports = mailRouter;