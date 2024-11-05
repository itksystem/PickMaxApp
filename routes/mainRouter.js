const express = require('express');
const router = express.Router();
const { registration, logon, logout, health, showcase, profile, basket, orders,
    outService, getOrder, createOrderSuccess, createOrderError,
    registrationConfirm, registrationSuccess,  registrationDecline} = require('../controllers/mainController');
const authMiddleware = require('openfsm-middlewares-auth-service');

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


module.exports = router;
