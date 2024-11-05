const User    = require("../../../models/user");
const userController = require("../../../controllers/userController");
const db      = require("../../../smes/smes-dbconnector/dbConnector"); 
const config  = require("../../../smes/params/params.js");
const logger  = require("../../../smes/logs/logController.js");   // Подключаем лог-файлы
var   exphbs  = require("express-handlebars");              // Шаблоны
const auth    = require("../../../smes/smes-auth/auth.js");        // Работа с авторизацией, сесииями и таймлайнами
var  params   = config.getIniParams();                      // Загружаем ini-файл с настройками
const exceptionController  = require("../../../smes/exception-log/bgExceptionController");

exports.render = async function(request, response){ // рендерим данные на страницу
   try {
    console.log(request.session.userId);
    request.params.id=request.session.userId;       // передача идентификатора пользователя через обьект request.params
    response.render(params.router.logoffFile, {}); 
   } catch (error) {
    console.log(error);
    exceptionController.file(require('path').basename(__filename),error);
   } 
   
  
}
