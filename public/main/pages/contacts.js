const User    = require("../../../models/user");
const Group   = require("../../../models/group.js");
const userController = require("../../../controllers/userController");
const groupController = require("../../../controllers/groupController");
const db      = require("../../../smes/smes-dbconnector/dbConnector"); 
const config  = require("../../../smes/params/params.js");
const logger  = require("../../../smes/logs/logController.js");   // Подключаем лог-файлы
const exceptionController  = require("../../../smes/exception-log/bgExceptionController");
var   exphbs  = require("express-handlebars");              // Шаблоны
const auth    = require("../../../smes/smes-auth/auth.js");        // Работа с авторизацией, сесииями и таймлайнами
var  params   = config.getIniParams();                      // Загружаем ini-файл с настройками
const sessionStorage = require("../../../smes/sessionStorage/sessionStorage.js")

exports.render = async function(request, response){ // рендерим данные на страницу
    console.log('test');
    // if(auth.getAuthProcess(request, response) || params.service.mode == 'debug') {
      try {
           
   //     request.params.id=sessionStorage.getSelectedGroup();
       /* request.params.id='daaa09c1-1345-11ec-aecd-0242ac140003'; // группа
        request.params.id=(request.params.id==='undefined') ? 0 : request.params.id;
        var users=await userController.getGroupUsers(request, response, true);
        var group         =  new Group(await groupController.getGroupId(request, response, true));
        var activeUsers   =  new User(await userController.getActiveUsersCount(request, response, true));
        var blockedUsers  =  new User(await userController.getBlockedUsersCount(request, response, true));
   */
        response.render(
            params.router.contactsFile, {
     /*           groupId: group[0].group_id,
                groupName: group[0].name,
                users: users,
                activeUsers : 0,
                blockedUsers : 0 
                */
            }); 
        } catch (error) {
             console.log(error); 
             exceptionController.file(require('path').basename(__filename),error);
        } 
    
}