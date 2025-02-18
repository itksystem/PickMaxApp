const express = require('express');
const router = express.Router();
const logger = require("../controllers/LoggerHandler"); // Работа с лог-файлами
const common = require("openfsm-common"); // Библиотека с общими параметрами
const { health, renderPage } = require('../controllers/mainController');
const authMiddleware = require('openfsm-middlewares-auth-service');

const ClientServiceHandler = require("../handlers/ClientServiceHandler");
const clientService = new ClientServiceHandler();              // интерфейс для  связи с MC AuthService
const AuthServiceClientHandler = require("openfsm-auth-service-client-handler");
const authClient = new AuthServiceClientHandler();              // интерфейс для  связи с MC AuthService
const axios = require('axios'); // Импорт библиотеки axios
const multer = require('multer');
const path = require('path');


const CommonFunctionHelper = require("openfsm-common-functions")
const ResponseHelper = require("openfsm-response-helper")
const _response = new ResponseHelper();


/* Получить профиль клиента */
router.get('/v1/profile', 	
	async (req, res) => {        
        try {
            const profile = await clientService.profile(req, res);        
            if (!profile.success) throw({code : 422, message : "Client profile not found" })
                _response
                    .setCode(200)                    
                    .setData(profile.data)
                    .send(res);    
        } catch (error) {            
                _response
                    .setCode(error.code)
                    .setStatus(false)
                    .setMessage(error.message)
                    .send(res);                    
        }
});

/* Сохранить профиль клиента */
router.post('/v1/profile', 	
	async (req, res) => {        
        try {
            const profile = await clientService.saveProfile(req, res);        
            if (!profile.success)  throw({code : profile.status, message : "Не удалось сохранить профиль пользователя" })             
                _response
                    .setCode(200)                    
                    .setData(profile.data)
                    .send(res);    
        } catch (error) {
                _response
                    .setCode(error.code)
                    .setStatus(false)
                    .setMessage(error.message)
                    .send(res);                    
        }
});

/* Доступность сервиса заказов */
router.post('/v1/logout', 	
	async (req, res) => {        
        try {
            const logout = await authClient.logout(req, res);        
            if (!logout.success)  throw({code : logout.status, message : "Ошибка при выполнении операции выхода из сессии" })
                _response
                    .setCode(200)                    
                    .setData(logout.data)
                    .send(res);    
        } catch (error) {
            _response
                    .setCode(error.code)
                    .setStatus(false)
                    .setMessage(error.message)
                    .send(res);                    
        }
});

/* Доступность сервиса заказов */
router.get('/v1/logout', 	
	async (req, res) => {        
        try {
            const logout = await authClient.logout(req, res);        
            if (!logout.success)  throw({code : logout.status, message : "Ошибка при выполнении операции выхода из сессии" })
                _response
                    .setCode(200)                    
                    .setData(logout.data)
                    .send(res);    
        } catch (error) {
            _response
                    .setCode(error.code)
                    .setStatus(false)
                    .setMessage(error.message)
                    .send(res);                    
        }
});





/* Дадата */
router.get('/v1/suggest/address', async (req, res) => {        
    try {
        const profile = await clientService.getSuggestAddress(req, res);        
        if (!profile.success)  throw({code : profile.status, message : "Не получить адрес ищ сервиса Dadata" })             
            _response
                .setCode(200)                    
                .setData(profile.data)
                .send(res);    
    } catch (error) {
            _response
                .setCode(error.code)
                .setStatus(false)
                .setMessage(error.message)
                .send(res);                    
    }
   } 
);


/* Получить подписки */
router.get('/v1/subscriptions', 	
	async (req, res) => {        
        try {
            const result = await clientService.getSubscriptions(req, res);        
            if (!result.success)  throw({code : result.status, message : "Ошибка при выполнении операции выхода из сессии" })
                let subscriptions = result?.data || [];
                _response
                    .setCode(200)                    
                    .setData(subscriptions)
                    .send(res);    
        } catch (error) {
            _response
                    .setCode(error.code)
                    .setStatus(false)
                    .setMessage(error.message)
                    .send(res);                    
        }
});

router.patch('/v1/subscription', 	
	async (req, res) => {        
        try {
            const result = await clientService.setSubscription(req, res);        
            if (!result.success)  throw({code : result.status, message : "Ошибка при выполнении операции выхода из сессии" })
                let subscriptions = result.data;
                _response
                    .setCode(200)                    
                    .setData(subscriptions)
                    .send(res);    
        } catch (error) {
            _response
                    .setCode(error.code)
                    .setStatus(false)
                    .setMessage(error.message)
                    .send(res);                    
        }
});
  

router.get('/v1/profile-image', 	
	async (req, res) => {        
        try {
            const result = await clientService.getProfileImage(req, res);        
            if (!result.success)  throw({code : result.status, message : "Ошибка при выполнении операции выхода из сессии" })
                if(!result.data) throw('Get profile image load error!');
                _response
                    .setCode(200)                    
                    .setData(result.data)
                    .send(res);    
        } catch (error) {
            _response
                    .setCode(error.code)
                    .setStatus(false)
                    .setMessage(error.message)
                    .send(res);                    
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
    if (['image/png', 'image/jpeg', 'image/gif'].includes(file.mimetype)) {
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

   
  router.post('/v1/profile-image', upload.array('file', 1), 	
    authMiddleware.authenticateToken,
	async (req, res) => {        
        try {
            const fileUrls = req.files.map(file => `/uploads/${file.filename}`);            
            const result = await clientService.setProfileImage(req, fileUrls);        
            if (!result.success)  throw({code : result.status, message : "Ошибка при выполнении операции выхода из сессии" })
                let subscriptions = result.data;
                _response
                    .setCode(200)                    
                    .setData(subscriptions)
                    .send(res);    
        } catch (error) {
            logger.error(error);
            _response
                    .setCode(error.code)
                    .setStatus(false)
                    .setMessage(error.message)
                    .send(res);                    
        }
 });

   
   


module.exports = router;