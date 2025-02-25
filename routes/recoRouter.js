const express = require('express');
const router = express.Router();
const logger = require("../controllers/LoggerHandler"); // Работа с лог-файлами
const common = require("openfsm-common"); // Библиотека с общими параметрами
const AuthServiceClientHandler = require("openfsm-auth-service-client-handler");
const authClient = new AuthServiceClientHandler();              // интерфейс для  связи с MC AuthService
const ClientServiceHandler = require("../handlers/ClientServiceHandler");
const clientService = new ClientServiceHandler();              // интерфейс для  связи с MC AuthService
const axios = require('axios'); // Импорт библиотеки axios
const multer = require('multer');
const path = require('path');


const CommonFunctionHelper = require("openfsm-common-functions")
const ResponseHelper = require("openfsm-response-helper")
const commonFunction= new CommonFunctionHelper();

const _response = new ResponseHelper();
const RecommendatuionServiceHandler = require("../handlers/RecommendatuionServiceHandler");
const recoClient = new RecommendatuionServiceHandler();
require('dotenv').config({ path: '.env-pickmax-service' });

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
            await Promise.all( // Асинхронно загружаем медиафайлы для каждого продукта
                response.data.reviews.map(async (review) => {
                    try { 
                      console.log(review);
                      let user = await clientService.client(req, review.user_id);    
                      review.author = (user?.data?.profile?.name || user?.data?.profile?.surname)
                        ? (user?.data?.profile?.name || '')
                        +(' ')+(user?.data?.profile?.patronymic || '')
                        +(' ')+(user?.data?.profile?.surname[0] || '')+(user?.data?.profile?.surname[0] ? '.' : '')
                        : 'Аноним';                        
                    } catch (mediaError) { // Логируем ошибку загрузки медиафайлов, но продолжаем обработку других продуктов          
                      console.error(`Error fetching media : ${mediaError.message}`);                      
                    }
                    return review;
                  })	
                );             
        
        res.status(200).json(response.data);                       
      } catch (error) {
          logger.error(error || 'Неизвестная ошибка' );   
          res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  commonFunction.getDescriptionByCode((Number(error) || 500)) });
      }
   });   

   router.get('/v1/review/:productId/my/review', 	
	async (req, res) => {        
      try {                   
          let productId = req.params.productId;                     
          if(!productId) return res.status(400).json({ code: 400, message:  commonFunction.getDescriptionByCode(400)});
          const response = await recoClient.getReview(req, productId);
          const user = await clientService.profile(req, res);    
          if (!response.success)  throw(response?.status || 500)          
           if(response.data?.reviews?.length > 0 ) 
          response.data.reviews[0].author = (user?.data?.profile?.name || user?.data?.profile?.surname)
            ? (user?.data?.profile?.name || '')
                +(' ')+(user?.data?.profile?.patronymic || '')
                +(' ')+(user?.data?.profile?.surname[0] || '')+(user?.data?.profile?.surname[0] ? '.' : '')
            : 'Аноним';          
          res.status(200).json(response.data);            
      } catch (error) {
          logger.error(error || 'Неизвестная ошибка' );   
          res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  commonFunction.getDescriptionByCode((Number(error) || 500)) });
      }
   });   

   router.post('/v1/rating/:productId/', 	
	async (req, res) => {        
      try {                   
          let productId = req.params.productId;                     
          if(!productId) return res.status(400).json({ code: 400, message:  commonFunction.getDescriptionByCode(400)});            
          const response = await recoClient.setRating(req, productId);
          if (!response.success)  throw(response?.status || 500)
          res.status(200).json(response.data);            
      } catch (error) {
          logger.error(error || 'Неизвестная ошибка' );   
          res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  commonFunction.getDescriptionByCode((Number(error) || 500)) });
      }
   });   


   router.post('/v1/review/:productId/', 	
	async (req, res) => {        
      try {                   
          let productId = req.params.productId;                     
          if(!productId) return res.status(400).json({ code: 400, message:  commonFunction.getDescriptionByCode(400)});            
          const response = await recoClient.setReview(req, productId);
          if (!response.success)  throw(response?.status || 500)
          res.status(200).json(response.data);            
      } catch (error) {
          logger.error(error || 'Неизвестная ошибка' );   
          res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  commonFunction.getDescriptionByCode((Number(error) || 500)) });
      }
   });   

   router.delete('/v1/review/media/:fileId', 
	async (req, res) => {        
      try {                   
          let fileId = req.params.fileId;                     
          if(!fileId) return res.status(400).json({ code: 400, message:  commonFunction.getDescriptionByCode(400)});            
          const response = await recoClient.deleteReviewMedia(req, fileId);
          res.status(200).json(response.data);            
      } catch (error) {
          logger.error(error || 'Неизвестная ошибка' );   
          res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  commonFunction.getDescriptionByCode((Number(error) || 500)) });
      }
   });   




// ***********************  Настройка хранилища для файлов ***********************************************************************
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, common.COMMON_PATH_TO_SITE + '/uploads/'); // Папка для сохранения файлов
    },
    filename: (req, file, cb) => {
        // Получаем fileId из заголовков запроса
        const fileId = req.headers['fileid'];
        const fileExtension = path.extname(file.originalname); // Получаем расширение файла

        if (fileId) {
            // Если есть fileId, используем его с текущим расширением
            cb(null, `${fileId}${fileExtension}`);
        } else {
            // Если fileId нет, используем текущее время и оригинальное имя файла
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    }
});

// Проверка типа файла
const fileFilter = (req, file, cb) => {
    if (['image/png', 'image/jpeg'].includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

// Инициализация Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

   router.post('/v1/review/:productId/upload', 	upload.array('file', 5),
	async (req, res) => {        
      try {                   
          let productId = req.params.productId;                     
          if(!productId) return res.status(400).json({ code: 400, message:  commonFunction.getDescriptionByCode(400)});            
          const fileUrls = req.files.map(file => `/uploads/${file.filename}`);
          res.json({ productId,   files: fileUrls  });
      } catch (error) {
          logger.error(error || 'Неизвестная ошибка' );   
          res.status(Number(error) || 500).json({ code: (Number(error) || 500), message:  commonFunction.getDescriptionByCode((Number(error) || 500)) });
      }
   });   
   
   
   

   module.exports = router;