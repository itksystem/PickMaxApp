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


// Набор незащищенных маршрутов
const publicRoutes = [
    { path: '/', page: common.COMMON_PRODUCTS_PAGE, service : { service : "products"} },
    { path: '/registration', page: common.COMMON_REGISTRATION_PAGE },
    { path: '/registration-confirm', page: common.COMMON_REGISTRATION_CONFIRM_PAGE },
    { path: '/registration-success', page: common.COMMON_REGISTRATION_SUCCESS_PAGE },
    { path: '/registration-decline', page: common.COMMON_REGISTRATION_DECLINE_PAGE },
    { path: '/registration-failure', page: common.COMMON_REGISTRATION_FAILURE_PAGE },
    { path: '/page-404', page: common.COMMON_404_PAGE },
    { path: '/logon', page: common.COMMON_LOGON_PAGE },
    { path: '/logon-failed', page: common.COMMON_LOGON_FAILED_PAGE},
    { path: '/forgot-password', page: common.COMMON_FORGOT_PASSWORD_PAGE},
    { path: '/out-service', page: common.COMMON_OUT_SERVICE_PAGE },
    { path: '/session-close', page: common.COMMON_SESSION_CLOSE_PAGE },    
];

// Регистрация незащищенных маршрутов
publicRoutes.forEach(({ path, page, service = undefined}) => {
    router.get(path, async (req, res) => renderPage(req, res, page, service ));
});

// Маршрут с middleware для выхода
router.get('/logout', authMiddleware.logout, async (req, res) => renderPage(req, res, common.COMMON_LOGOUT_PAGE, {}));

// Маршрут для проверки доступности сервиса
router.get('/health', health);

// Набор защищенных маршрутов
const protectedRoutes = [
    { method : 'GET', path: '/app', page: common.COMMON_APP_PAGE , service : {}},
    { method : 'GET', path: '/products/:productId/page', page: common.COMMON_PRODUCTS_PAGE, service : { service : "product"} },
    { method : 'GET', path: '/products/page', page: common.COMMON_PRODUCTS_PAGE, service : { service : "products"} },
    { method : 'GET', path: '/profile/page', page: common.COMMON_PROFILE_PAGE, service :{service : "profile"} },
    { method : 'GET', path: '/basket/page', page: common.COMMON_BASKET_PAGE, service :{service : "basket"} },
    { method : 'GET', path: '/orders/:orderId/page', page: common.COMMON_ORDERS_PAGE, service :{service : "order"} },
    { method : 'GET', path: '/orders/page', page: common.COMMON_ORDERS_PAGE, service :{service : "orders"} },
    { method : 'GET', path: '/orders/create-error', page: common.COMMON_GET_ORDER_ERROR_PAGE, service :{service : "order-create-error"} },   
    { method : 'GET', path: '/orders/delivery-failed', page: common.COMMON_GET_ORDER_SUCCESS_PAGE, service :{service : 'order-delivery-error'} }, 
    { method : 'GET', path: '/orders/delivery/:referenceId', page: common.COMMON_GET_ORDER_SUCCESS_PAGE, service :{service : 'order-delivery'} },
    { method : 'GET', path: '/orders/payment/availability-error', page: common.COMMON_PAYMENT_PAGE, service :{service : 'availability-error'} },
    { method : 'GET', path: '/orders/payment/:referenceId', page: common.COMMON_PAYMENT_PAGE, service :{service : 'payment'} },
    { method : 'GET', path: '/orders/payment/success/:referenceId', page: common.COMMON_PAYMENT_PAGE, service :{service : 'payment-success'} },
    { method : 'GET', path: '/orders/payment/failed/:referenceId', page: common.COMMON_PAYMENT_PAGE, service :{service : 'payment-failed'} },        
    { method : 'GET', path: '/orders/:id', page: common.COMMON_GET_ORDER_PAGE, service :{} }, 
    { method : 'GET', path: '/reviews/:id/my/review/page', page: common.COMMON_GET_REVIEWS_PAGE, service :{service : 'reviews-my-page'}},  
    { method : 'GET', path: '/reviews/:id/page', page: common.COMMON_GET_REVIEWS_PAGE, service :{service : 'reviews'}},  
    { method : 'GET', path: '/products/:id/mails/page', page: common.COMMON_GET_MAILS_PAGE, service :{service : 'product-mail'}},  
    { method : 'GET', path: '/products/:id/mail-reply/:userId/page', page: common.COMMON_GET_MAILS_PAGE, service :{service : 'product-mail-reply'}},  
];

// Регистрация защищенных маршрутов
protectedRoutes.forEach(({ method, path, page, service }) => {
    switch(method) {
      case 'GET' : router.get(path, authMiddleware.authenticateToken, async (req, res) => renderPage(req, res, page, service));      
    }
    
});


// Обработка POST-запросов
router.post('/logout', 
    authMiddleware.logout,
    (req, res) => {
    res.clearCookie('accessToken');
    res.status(200).json({ message: 'Вы вышли из системы' });
});

router.post('/logon', async (req, res) => {
    const { email, password } = req.body;
    const response = await authClient.login(email, password);
    if (response.success) {
        res.cookie('accessToken', response.data.token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
            maxAge: 10800000, // 3 часа
        });
        res.status(200).json(response.data);
    } else {
        logger.error(response.error || 'Неизвестная ошибка' );   
        res.status(response.status || 500).json({ error: response.error ||  common.COMMON_HTTP_CODE_500 });
    }
});

router.post('/v1/checkCode',  authMiddleware.authenticateToken, async (req, res) => {
    const userId = await authMiddleware.getUserId(req, res);
    if(!userId) throw(401)
    const response = await authClient.checkCode(req);
    if (response.success) {        
        res.status(200).json(response.data);
    } else {
        logger.error(response.error || 'Неизвестная ошибка' );   
        res.status(response.status || 500).json({ error: response.error ||  common.COMMON_HTTP_CODE_500 });
    }
});


router.post('/registration', async (req, res) => {
    const { email, password } = req.body;
    const response = await authClient.register(email, password);
    if (response.success) {
        res.status(200).json(response.data);
    } else {
        logger.error(response.error || 'Неизвестная ошибка' );   
        res.status(response.status || 500).json({ error: response.error || common.COMMON_HTTP_CODE_500});
    }
});

module.exports = router;
