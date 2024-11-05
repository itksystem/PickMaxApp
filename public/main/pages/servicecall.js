const User    = require("../../../models/user");
const Group   = require("../../../models/group.js");
const userController = require("../../../controllers/userController");
const groupController = require("../../../controllers/groupController");
const db      = require("../../../smes/smes-dbconnector/dbConnector"); 
const config  = require("../../../smes/params/params.js");
const logger  = require("../../../smes/logs/logController.js");   // Подключаем лог-файлы
var   exphbs  = require("express-handlebars");                    // Шаблоны
const auth    = require("../../../smes/smes-auth/auth.js");       // Работа с авторизацией, сесииями и таймлайнами
var  params   = config.getIniParams();                            // Загружаем ini-файл с настройками
var hbs = require("hbs");                          // Шаблоны
/*  */
/*const app = express();
app.engine("hbs", expressHbs( // устанавливаем настройки для файлов layout
    {
        layoutsDir: "views/layouts", 
        defaultLayout: "layout",
        extname: "hbs"
    }
))
*/
// app.set("view engine", "hbs");

/*  */

hbs.registerHelper('set-selected', function(arg1, arg2, options) {
   if(arg1 == arg2) {
      return ('selected')
   } 
});



exports.render = async function(request, response){ // рендерим данные на страницу
   try {
    params   = config.getIniParams();   
    response.render(
        params.router.servicecallFile, {

        }); 
   } catch (error) {
    console.log(error);
 } 
   
  
}