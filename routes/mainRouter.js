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
require('dotenv').config({ path: '.env-pickmax-service' });

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
    { path: '/products/page', page: common.COMMON_PRODUCTS_PAGE, service : { service : "products"} },
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
router.get('/logout', async (req, res) =>{
    let result = await authClient.logout(req, res);  
    renderPage(req, res, common.COMMON_LOGOUT_PAGE, {})
  }
);

// Маршрут для проверки доступности сервиса
router.get('/health', health);

// Набор защищенных маршрутов
const protectedRoutes = [
    { method : 'GET', path: '/app', page: common.COMMON_APP_PAGE , service : {}},
    { method : 'GET', path: '/products/:productId/page', page: common.COMMON_PRODUCTS_PAGE, service : { service : "product"} },
    { method : 'GET', path: '/profile/page', page: common.COMMON_PROFILE_PAGE, service :{service : "profile"} },
    { method : 'GET', path: '/basket/page', page: common.COMMON_BASKET_PAGE, service :{service : "basket"} },
    { method : 'GET', path: '/orders/:orderId/page', page: common.COMMON_ORDERS_PAGE, service :{service : "order"} },
    { method : 'GET', path: '/orders/page', page: common.COMMON_ORDERS_PAGE, service :{service : "orders"} },
    { method : 'GET', path: '/confirmation/email/page', page: common.COMMON_CONNFIRMATION_EMAIL_PAGE, service :{service : "confirmation-email"} },
    { method : 'GET', path: '/confirmation/phone/page', page: common.COMMON_CONNFIRMATION_PHONE_PAGE, service :{service : "confirmation-phone"} },
    { method : 'GET', path: '/profile/change-digital-code/page', page: common.COMMON_CONNFIRMATION_PHONE_PAGE, service :{service : "change-digital-code"} },
    { method : 'GET', path: '/profile/disable-digital-code/page', page: common.COMMON_CONNFIRMATION_PHONE_PAGE, service :{service : "disable-digital-code"} },
    { method : 'GET', path: '/profile/change-security-question/page', page: common.COMMON_CONNFIRMATION_PHONE_PAGE, service :{service : "change-security-question"} },
    { method : 'GET', path: '/profile/disable-security-question/page', page: common.COMMON_CONNFIRMATION_PHONE_PAGE, service :{service : "disable-security-question"} },
    { method : 'GET', path: '/pincode-logon', page: common.COMMON_PINCODE_LOGON_PAGE, service :{service : "pincode-logon"} },

    { method : 'GET', path: '/balance/deposit/page', page: common.COMMON_BALANCE_DEPOSIT_PAGE, service :{service : "balance-deposit"} },
    { method : 'GET', path: '/balance/history/page', page: common.COMMON_BALANCE_HISTORY_PAGE, service :{service : "balance-history"} },

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
protectedRoutes.forEach( async ({ method, path, page, service }) => {
        router.get(path,  async (req, res) => {
            if(method == 'GET') {
                let result = await authClient.checkToken(req, res);  
                  if(result?.status == 401 || result.success == false) {
                    logger.error(page, result);
                    return res.status(401).redirect("/logon");                   
                  }

                  const response = await authClient.me(req, res);                  
                  if (response?.success && response.data.accessToken && response.data?.isTelegramAuth) {
                      res.cookie('accessToken', response.data.accessToken, {
                          httpOnly: true,
                          secure: true,
                          sameSite: 'none',
                          maxAge: 10800000, // 3 часа
                      });
                      return res.status(200).redirect(req.headers['Referer'] ?? req.originalUrl);      
                  } 
                 renderPage(req, res, page, service)
            }            
         });         
});


// Обработка POST-запросов
router.post('/logout',     
    async (req, res) => {
        let result = await authClient.logout(req, res);          
        res.clearCookie('accessToken');
        res.status(200).json({ message: 'Вы вышли из системы' });
});

router.post('/logon', async (req, res) => {
    const { email, password } = req.body;
    logger.info(email+' ' + password);   
    const response = await authClient.login(req, email, password);
    if (response.success) {
        res.cookie('accessToken', response.data.token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 10800000, // 3 часа
        });
        res.status(200).json(response.data);
    } else {
        logger.error(response.error || 'Неизвестная ошибка' );   
        res.status(response.status || 500).json({ error: response.error ||  common.COMMON_HTTP_CODE_500 });
    }
});

router.post('/v1/checkCode', async (req, res) => {    
    const userId = await authClient.getUserId(req, res);                   
    if(!userId) throw(401)
    const response = await authClient.checkCode(req);
    if (response.success) {        
        res.status(200).json(response.data);
    } else {
        logger.error(response.error || 'Неизвестная ошибка' );   
        res.status(response.status || 500).json({ error: response.error ||  common.COMMON_HTTP_CODE_500 });
    }
});


router.get('/v1/two-factors', async (req, res) => {    
    const userId = await authClient.getUserId(req, res);                   
    if(!userId) throw(401)
    const response = await authClient.get2PAFactorsList(req);
    if (response.success) {        
        res.status(200).json(response.data);
    } else {
        logger.error(response.error || 'Неизвестная ошибка' );   
        res.status(response.status || 500).json({ error: response.error ||  common.COMMON_HTTP_CODE_500 });
    }
});


router.post('/registration', async (req, res) => {
    const { email, password } = req.body;
    const response = await authClient.register(req,email, password);
    if (response.success) {
        res.status(200).json(response.data);
    } else {
        logger.error(response.error || 'Неизвестная ошибка' );   
        res.status(response.status || 500).json({ error: response.error || common.COMMON_HTTP_CODE_500});
    }
});

router.get('/@me', async (req, res) => {    
    try {
        const response = await authClient.me(req, res);
        console.log(response);
        if (response?.success && response.data.accessToken) {
            res.cookie('accessToken', response.data.accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 10800000, // 3 часа
            });
            res.status(200).json(response.data);
        } else {
            res.status(200).json({ status : false});
        }    
    } catch (error) {
        res.status(200).json({ status : false, error});
    }    
});



module.exports = router;
