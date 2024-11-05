const logger     = require("./LoggerHandler"); // Работа с лог-файлами
var path   = require("path");
const _dir_html=path.resolve();
var   exphbs  = require('express-handlebars');              // Шаблоны


/* Страница регистрации */
exports.registration = async function (request, response){
    let _METHOD_ = 'registration';  
    try {
         response.render(_dir_html +'/html/registration.hbs', {  });    
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
         response.render(_dir_html +'/logout.hbs', {  });    
        } catch (error) {
        logger.error(error);       
    }   
  }
  

  /* Страница доступности сервиса  */
exports.health = async function (request, response){
    let _METHOD_ = 'health';  
    try {
        response.status(200).json(); 
        } catch (error) {
        logger.error(error);       
    }   
  }
  
   /* Страница недоступности сервиса  */
exports.outService = async function (request, response){
    let _METHOD_ = 'health';  
    try {
        response.status(200).json(); 
        } catch (error) {
        logger.error(error);       
    }   
  }
  
  exports.showcase = async function (request, response){
    let _METHOD_ = 'health';  
    try {
        response.status(200).json(); 
        } catch (error) {
        logger.error(error);       
    }   
  }
  exports.profile = async function (request, response){
    let _METHOD_ = 'health';  
    try {
        response.status(200).json(); 
        } catch (error) {
        logger.error(error);       
    }   
  }
  exports.basket = async function (request, response){
    let _METHOD_ = 'health';  
    try {
        response.status(200).json(); 
        } catch (error) {
        logger.error(error);       
    }   
  }
  exports.orders = async function (request, response){
    let _METHOD_ = 'health';  
    try {
        response.status(200).json(); 
        } catch (error) {
        logger.error(error);       
    }   
  }
  exports.getOrder = async function (request, response){
    let _METHOD_ = 'health';  
    try {
        response.status(200).json(); 
        } catch (error) {
        logger.error(error);       
    }   
  }
  exports.createOrderSuccess = async function (request, response){
    let _METHOD_ = 'health';  
    try {
        response.status(200).json(); 
        } catch (error) {
        logger.error(error);       
    }   
  }
  exports.createOrderError = async function (request, response){
    let _METHOD_ = 'health';  
    try {
        response.status(200).json(); 
        } catch (error) {
        logger.error(error);       
    }   
  }