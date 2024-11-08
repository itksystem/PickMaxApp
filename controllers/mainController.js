const logger = require("./LoggerHandler"); // Работа с лог-файлами
const common =  require("openfsm-common"); // Библиотека с общими параметрами
const version = '1.0.0'
const { DateTime } = require('luxon');

var hbs = require("hbs");                          // Шаблоны
require('dotenv').config();



hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

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

  exports.renderPage = async function (request, response, page, service){     
    try {
        response.render(page, service);     
        } catch (error) {
        logger.error(error);       
        response.render(common.COMMON_404_PAGE, {});
    }   
  }