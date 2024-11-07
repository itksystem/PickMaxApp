const logger     = require("./LoggerHandler"); // Работа с лог-файлами
var path   = require("path");
const _dir_html=path.resolve();
var   exphbs  = require('express-handlebars');              // Шаблоны
const version = '1.0.0'
const { DateTime } = require('luxon');
const SERVER_ERROR_MSG = 'Server error';
require('dotenv').config();



/* Страница регистрации */
exports.registration = async function (request, response){
    let _METHOD_ = 'registration';  
    try {
         response.render(_dir_html +'/html/registration.hbs', {  });    
        } catch (error) {
        logger.error(error);       
    }   
  }
  
  exports.registrationConfirm = async function (request, response){
    let _METHOD_ = 'registrationConfirm';  
    try {
         response.render(_dir_html +'/html/registration-confirm.hbs', {  });    
        } catch (error) {
        logger.error(error);       
    }   
  }
  exports.registrationSuccess = async function (request, response){
    let _METHOD_ = 'registrationSuccess';  
    try {
         response.render(_dir_html +'/html/registration-success.hbs', {  });    
        } catch (error) {
        logger.error(error);       
    }   
  }
  exports.registrationDecline = async function (request, response){
    let _METHOD_ = 'registrationDecline';  
    try {
         response.render(_dir_html +'/html/registration-decline.hbs', {  });    
        } catch (error) {
        logger.error(error);       
    }   
  }

  exports.registrationFailure = async function (request, response){
    let _METHOD_ = 'registrationFailure';  
    try {
         response.render(_dir_html +'/html/registration-failure.hbs', {  });    
        } catch (error) {
        logger.error(error);       
    }   
  }
  
/* Страница авторизации */
exports.logon = async function (request, response){
    let _METHOD_ = 'logon';  
    try {
         response.render(_dir_html +'/html/logon.hbs');    
        } catch (error) {
        logger.error(error);       
    }   
  }
  

  /* Страница завершения сессии */
exports.logout = async function (request, response){
    let _METHOD_ = 'logout';  
    try {
         response.render(_dir_html +'/html/logout.hbs', {  });    
        } catch (error) {
        logger.error(error);       
    }   
  }
  

  /* Страница доступности сервиса  */
exports.health = async function (request, response){
    let _METHOD_ = 'health';  
    try {
        
    console.log('Connection is active');
    const endTime = DateTime.local(); // Конец отсчета с учетом временной зоны сервера

    // Рассчитываем задержку
    const delay = endTime.diff(startTime, 'milliseconds').milliseconds;

    // Форматируем дату и время в формате ISO 8601
    const formattedDate = endTime.toISO();
    console.log(formattedDate);

    res.status(200).json({
      health: true,
      version: version,
      delay: delay,
      datetime: formattedDate
    });

        } catch (error) {
        logger.error(error);      
        res.status(500).json({ health: false, message: SERVER_ERROR_MSG}); 
    }   
  }
  
   /* Страница недоступности сервиса  */
exports.outService = async function (request, response){
    let _METHOD_ = 'outService';  
    try {
        response.render(_dir_html +'/html/out-service.hbs', {  });    
        } catch (error) {
        logger.error(error);       
    }   
  }

     /* Страница недоступности сервиса из-за протухания сессии */
exports.sessionClose = async function (request, response){
    let _METHOD_ = 'outService';  
    try {
        response.render(_dir_html +'/html/session-close.hbs', {  });    
        } catch (error) {
        logger.error(error);       
    }   
  }
  
  exports.showcase = async function (request, response){
    let _METHOD_ = 'showcase';  
    try {
        response.render(_dir_html +'/html/showcase.hbs', {  });    
        } catch (error) {
        logger.error(error);       
    }   
  }
  exports.profile = async function (request, response){
    let _METHOD_ = 'profile';  
    try {
        response.render(_dir_html +'/html/profile.hbs', {  });    
        } catch (error) {
        logger.error(error);       
    }   
  }
  exports.basket = async function (request, response){
    let _METHOD_ = 'basket';  
    try {
        response.render(_dir_html +'/html/basket.hbs', {  });    
        } catch (error) {
        logger.error(error);       
    }   
  }
  exports.orders = async function (request, response){
    let _METHOD_ = 'orders';  
    try {
        response.render(_dir_html +'/html/orders.hbs', {  });    
        } catch (error) {
        logger.error(error);       
    }   
  }
  exports.getOrder = async function (request, response){
    let _METHOD_ = 'getOrder';  
    try {
        response.render(_dir_html +'/html/getOrder.hbs', {  });    
        } catch (error) {
        logger.error(error);       
    }   
  }
  exports.createOrderSuccess = async function (request, response){
    let _METHOD_ = 'getOrderSuccess';  
    try {
        response.render(_dir_html +'/html/getOrderSuccess.hbs', {  });    
        } catch (error) {
        logger.error(error);       
    }   
  }
  exports.createOrderError = async function (request, response){
    let _METHOD_ = 'getOrderError';  
    try {
        response.render(_dir_html +'/html/getOrderError.hbs', {  });    
        } catch (error) {
        logger.error(error);       
    }   
  }