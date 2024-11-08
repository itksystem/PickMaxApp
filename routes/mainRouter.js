const express = require('express');
const router = express.Router();
const common =  require("openfsm-common"); // Библиотека с общими параметрами
const { health, page } = require('../controllers/mainController');
const authMiddleware = require('openfsm-middlewares-auth-service');
const fetch = require('node-fetch');
const AuthServiceClientHandler = require("openfsm-auth-service-client-handler");
const authClient = new AuthServiceClientHandler();

// сюда идем без проверки токена 
router.get('/registration',  async function (request, response) { page(request, response, common.COMMON_REGISTRATION_PAGE,{} ); });
router.get('/registration-confirm',  async function (request, response) { page(request, response, common.COMMON_REGISTRATION_CONFIRM_PAGE,{} ); });
router.get('/registration-success',  async function (request, response) { page(request, response, common.COMMON_REGISTRATION_SUCCESS_PAGE,{} ); });
router.get('/registration-decline',  async function (request, response) { page(request, response, common.COMMON_REGISTRATION_DECLINE_PAGE,{} ); });
router.get('/page-404',  async function (request, response) { page(request, response, common.COMMON_404_PAGE,{} ); });


router.get('/logon',  async function (request, response) { page(request, response, common.COMMON_LOGON_PAGE,{} ); });
router.get('/logout',  authMiddleware.logout, async function (request, response) { page(request, response, common.COMMON_LOGOUT_PAGE,{} ); });
router.get('/health', health);  // проверка доступности сервиса
router.get('/out-service',  async function (request, response) { page(request, response, common.COMMON_OUT_SERVICE_PAGE,{} ); });
router.get('/session-close',  async function (request, response) { page(request, response, common.COMMON_SESSION_CLOSE_PAGE,{} ); });

// Защищенная зона 
router.get('/app', authMiddleware.authenticateTokenExternal,  async function (request, response) { page(request, response, common.COMMON_APP_PAGE,{} ); });
router.get('/showcase', authMiddleware.authenticateTokenExternal,  async function (request, response) { page(request, response, common.COMMON_SHOWCASE_PAGE,{} ); });
router.get('/profile', authMiddleware.authenticateTokenExternal,  async function (request, response) { page(request, response, common.COMMON_PROFILE_PAGE,{} ); });
router.get('/basket', authMiddleware.authenticateTokenExternal,  async function (request, response) { page(request, response, common.COMMON_BASKET_PAGE,{} ); });
router.get('/orders', authMiddleware.authenticateTokenExternal,  async function (request, response) { page(request, response, common.COMMON_ORDERS_PAGE,{} ); });
router.get('/orders/:id', authMiddleware.authenticateTokenExternal,  async function (request, response) { page(request, response, common.COMMON_GET_ORDER_PAGE,{} ); });
router.get('/orders/create-succes', authMiddleware.authenticateTokenExternal,  async function (request, response) { page(request, response, common.COMMON_GET_ORDER_SUCCESS_PAGE,{} ); });
router.get('/orders/create-error', authMiddleware.authenticateTokenExternal,  async function (request, response) { page(request, response, common.COMMON_GET_ORDER_ERROR_PAGE,{} ); });


router.post('/logout', (req, res) => {
    res.clearCookie('accessToken'); // Удаляем HttpOnly cookie
    res.status(200).json({ message: 'Вы вышли из системы' });
});

router.post('/logon', async function (request, response) {
    const { email, password } = request.body;
    const res = await authClient.login(email, password);
    if (res.success) {
        // Отправляем cookie с флагами HttpOnly и Secure
          response.cookie('accessToken', res.data.token, {
             httpOnly: true,
             secure: false,      // Требуется HTTPS
             sameSite: 'Strict', // Дополнительная защита от CSRF
            maxAge: 3600000*3 // Время жизни токена (1 час)
         });
        response.status(200).json(res.data);
    } else if (res.status) {
        response.status(res.status).json(res.data);
    } else {
        response.status(500).json({ error: res.error || 'Неизвестная ошибка' });
    }
});

router.post('/registration', async function (request, response) {
    const { email, password } = request.body;
    const res = await authClient.register(email, password);
    if (res.success) {
         response.status(200).json(res.data);
    } else if (res.status) {
        response.status(res.status).json(res.data);
    } else {
        response.status(500).json({ error: res.error || 'Неизвестная ошибка' });
    }
});

module.exports = router;
