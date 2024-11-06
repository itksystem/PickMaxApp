const express = require('express');
const router = express.Router();
const { registration, logon, logout, health, showcase, profile, basket, orders,
    outService, getOrder, createOrderSuccess, createOrderError,
    registrationConfirm, registrationSuccess,  registrationDecline} = require('../controllers/mainController');
const authMiddleware = require('openfsm-middlewares-auth-service');
const fetch = require('node-fetch');
const AuthServiceClientHandler = require("openfsm-auth-service-client-handler");
const authClient = new AuthServiceClientHandler();

// сюда идем без проверки токена 
router.get('/registration', registration);  // регистрация
router.get('/registration-confirm', registrationConfirm);  // подтверждение кодом полученным на email
router.get('/registration-success', registrationSuccess);  // регистрация
router.get('/registration-decline', registrationDecline);  // регистрация

router.get('/logon', logon);        // отражение страницы авторизации
router.get('/logout', authMiddleware.logout, logout); // отражение страницы с завершением сеанса
router.get('/health', health);  // проверка доступности сервиса
router.get('/out-service', outService); // сервис не доступен

// сюда идем с проверкой токена
router.get('/showcase', authMiddleware.authenticateToken, showcase);  // витрина магазина
router.get('/profile', authMiddleware.authenticateToken, profile);   // профиль пользователя
router.get('/basket', authMiddleware.authenticateToken, basket);    // отражение корзины

router.get('/orders', authMiddleware.authenticateToken, orders);    // добавление в корзину
router.get('/order/:id', authMiddleware.authenticateToken, getOrder); // удаление из корзины товара
router.get('/order/create-succes', authMiddleware.authenticateToken, createOrderSuccess); // заказ создан успешно
router.get('/order/create-error', authMiddleware.authenticateToken, createOrderError); // заказ не создан


router.post('/api/auth/v1/logout', (req, res) => {
    res.clearCookie('accessToken'); // Удаляем HttpOnly cookie
    res.status(200).json({ message: 'Вы вышли из системы' });
});

router.post('/api/auth/v1/login', async function (request, response) {
    const { email, password } = request.body;
    const res = await authClient.login(email, password);
    if (res.success) {
        // Отправляем cookie с флагами HttpOnly и Secure
          response.cookie('accessToken', res.data.token, {
             httpOnly: true,
             secure: false, // Требуется HTTPS
             sameSite: 'Strict', // Дополнительная защита от CSRF
            maxAge: 3600000 // Время жизни токена (1 час)
         });
        response.status(200).json(res.data);
    } else if (res.status) {
        response.status(res.status).json(res.data);
    } else {
        response.status(500).json({ error: res.error || 'Неизвестная ошибка' });
    }
});


module.exports = router;
