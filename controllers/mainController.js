const logger = require("./LoggerHandler"); // Работа с лог-файлами
const common =  require("openfsm-common"); // Библиотека с общими параметрами
const version = '1.0.0'
const { DateTime } = require('luxon');

var hbs = require("hbs");                          // Шаблоны
require('dotenv').config();



hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});



/* Страница регистрации */
exports.registration = async function (request, response){
    let _METHOD_ = 'registration';  
    try {
         response.render(common.COMMON_REGISTRATION_PAGE, {});    
        } catch (error) {
        logger.error(error);       
        response.render(common.COMMON_404_PAGE, {});
    }   
  }
  
  exports.registrationConfirm = async function (request, response){
    let _METHOD_ = 'registrationConfirm';  
    try {
         response.render(common.COMMON_REGISTRATION_CONFIRM_PAGE, {});
        } catch (error) {
        logger.error(error);       
        response.render(common.COMMON_404_PAGE, {});
    }   
  }
  exports.registrationSuccess = async function (request, response){
    let _METHOD_ = 'registrationSuccess';  
    try {
         response.render(common.COMMON_REGISTRATION_SUCCESS_PAGE, {});   
        } catch (error) {
        logger.error(error);       
        response.render(common.COMMON_404_PAGE, {});
    }   
  }
  exports.registrationDecline = async function (request, response){
    let _METHOD_ = 'registrationDecline';  
    try {
        response.render(common.COMMON_REGISTRATION_DECLINE_PAGE, {});   
        } catch (error) {
        logger.error(error);  
        response.render(common.COMMON_404_PAGE, {});     
    }   
  }

  exports.registrationFailure = async function (request, response){
    let _METHOD_ = 'registrationFailure';  
    try {
        response.render(common.COMMON_REGISTRATION_FAILURE_PAGE, {});   
        } catch (error) {
        logger.error(error);      
        response.render(common.COMMON_404_PAGE, {}); 
    }   
  }
  
/* Страница авторизации */
exports.logon = async function (request, response){
    let _METHOD_ = 'logon';  
    try {
        response.render(common.COMMON_REGISTRATION_LOGON_PAGE, {});    
        } catch (error) {
        logger.error(error);  
        response.render(common.COMMON_404_PAGE, {});     
    }   
  }
  

  /* Страница завершения сессии */
exports.logout = async function (request, response){
    let _METHOD_ = 'logout';  
    try {
        response.render(common.COMMON_REGISTRATION_LOGOUT_PAGE, {});   
        } catch (error) {
        logger.error(error);     
        response.render(common.COMMON_404_PAGE, {});  
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
        res.status(500).json({ health: false, message: common.COMMON_HTTP_CODE_500}); 
    }   
  }
  
   /* Страница недоступности сервиса  */
exports.outService = async function (request, response){
    let _METHOD_ = 'outService';  
    try {
        response.render(common.COMMON_REGISTRATION_OUT_SERVICE_PAGE, {});     
        } catch (error) {
        logger.error(error);       
        response.render(common.COMMON_404_PAGE, {});
    }   
  }

     /* Страница недоступности сервиса из-за протухания сессии */
exports.sessionClose = async function (request, response){
    let _METHOD_ = 'outService';  
    try {
        response.render(common.COMMON_REGISTRATION_SESSION_CLOSE_PAGE, {});   
        } catch (error) {
        logger.error(error);       
        response.render(common.COMMON_404_PAGE, {});
    }   
  }

  exports.app = async function (request, response){
    let _METHOD_ = 'showcase';  
    try {
        response.render(common.COMMON_REGISTRATION_APP_PAGE, {});   
        } catch (error) {
        logger.error(error);       
        response.render(common.COMMON_404_PAGE, {});
    }   
  }
  
  exports.showcase = async function (request, response){
    let _METHOD_ = 'showcase';  
    try {
        response.render(common.COMMON_REGISTRATION_SHOWCASE_PAGE, { service : "showcase"});       
        } catch (error) {
        logger.error(error);   
        response.render(common.COMMON_404_PAGE, {});    
    }   
  }
  exports.profile = async function (request, response){
    let _METHOD_ = 'profile';  
    try {
        response.render(common.COMMON_REGISTRATION_PROFILE_PAGE, {});   
        } catch (error) {
        logger.error(error);    
        response.render(common.COMMON_404_PAGE, {});   
    }   
  }
  exports.basket = async function (request, response){
    let _METHOD_ = 'basket';  
    try {
        response.render(common.COMMON_REGISTRATION_BASKET_PAGE, {});   
        } catch (error) {
        logger.error(error);       
        response.render(common.COMMON_404_PAGE, {});
    }   
  }
  exports.orders = async function (request, response){
    let _METHOD_ = 'orders';  
    try {
        response.render(common.COMMON_REGISTRATION_ORDERS_PAGE, {});   
        } catch (error) {
        logger.error(error);       
        response.render(common.COMMON_404_PAGE, {});
    }   
  }
  exports.getOrder = async function (request, response){
    let _METHOD_ = 'getOrder';  
    try {
        response.render(common.COMMON_REGISTRATION_GET_ORDER_PAGE, {});      
        } catch (error) {
        logger.error(error);      
        response.render(common.COMMON_404_PAGE, {}); 
    }   
  }
  exports.createOrderSuccess = async function (request, response){
    let _METHOD_ = 'getOrderSuccess';  
    try {
        response.render(common.COMMON_REGISTRATION_GET_ORDER_SUCCESS_PAGE, {});     
        } catch (error) {
        logger.error(error);   
        response.render(common.COMMON_404_PAGE, {});    
    }   
  }
  exports.createOrderError = async function (request, response){
    let _METHOD_ = 'getOrderError';  
    try {
        response.render(common.COMMON_REGISTRATION_GET_ORDER_SUCCESS_PAGE, {});     
        } catch (error) {
        logger.error(error);       
        response.render(common.COMMON_404_PAGE, {});
    }   
  }

  exports.page = async function (request, response, page, service){     
    try {
        response.render(page, service);     
        } catch (error) {
        logger.error(error);       
        response.render(common.COMMON_404_PAGE, {});
    }   
  }