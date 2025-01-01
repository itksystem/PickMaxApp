const express = require('express');
const router = express.Router();
const logger = require("../controllers/LoggerHandler"); // Работа с лог-файлами
const common = require("openfsm-common"); // Библиотека с общими параметрами
const AuthServiceClientHandler = require("openfsm-auth-service-client-handler");
const authClient = new AuthServiceClientHandler();              // интерфейс для  связи с MC AuthService
const axios = require('axios'); // Импорт библиотеки axios

const CommonFunctionHelper = require("openfsm-common-functions")
const ResponseHelper = require("openfsm-response-helper")
const commonFunction= new CommonFunctionHelper();

const _response = new ResponseHelper();

const RecommendatuionServiceHandler = require("../handlers/RecommendatuionServiceHandler");
const recoClient = new RecommendatuionServiceHandler();

router.post('/v1/like/:productId', 	
	async (req, res) => {        
      try {
          let {status} = req.body;           
          let productId = req.params.productId;                     
          if(!productId) return res.status(400).json({ code: 400, message:  commonFunction.getDescriptionByCode(400)});            
          const response = await recoClient.setLike(req);
          if (!response.success)  throw(response?.status || 500)
          res.status(200).json(response.data);            
      } catch (error) {
          logger.error(error || 'Неизвестная ошибка' );   
          res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  commonFunction.getDescriptionByCode((Number(error) || 500)) });
      }
   });   

   router.get('/v1/review/:productId', 	
	async (req, res) => {        
      try {                   
          let productId = req.params.productId;                     
          if(!productId) return res.status(400).json({ code: 400, message:  commonFunction.getDescriptionByCode(400)});            
          const response = await recoClient.getReviews(req, productId);
          if (!response.success)  throw(response?.status || 500)
          res.status(200).json(response.data);            
      } catch (error) {
          logger.error(error || 'Неизвестная ошибка' );   
          res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  commonFunction.getDescriptionByCode((Number(error) || 500)) });
      }
   });   

   

   module.exports = router;