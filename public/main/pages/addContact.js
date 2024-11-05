/*
const User    = require("../../../models/user");
const userController = require("../../../controllers/userController");
const db      = require("../../../smes/smes-dbconnector/dbConnector"); 
const config  = require("../../../smes/params/params.js");
const logger  = require("../../../smes/logs/logController.js");   // Подключаем лог-файлы
var   exphbs  = require("express-handlebars");              // Шаблоны
const auth    = require("../../../smes/smes-auth/auth.js");        // Работа с авторизацией, сесииями и таймлайнами
var  params   = config.getIniParams();                      // Загружаем ini-файл с настройками

exports.render = async function(request, response){ // рендерим данные на страницу
   try {
    colNames =[
        '', 'ID',
        'FINISHDATE',
        'Время присут.',
        'PERSNAME', 'WOG', 
        'locatorId',
        'CI_SC', 
        'SO','SOLUTION', 'INFORMATION','DEV','TRANSP_TYPE', 'Км.', 'FLAGS','V','R','Согласование поездки',
        'TRC','Комментарий</br>коорд-ра','Согласование</br>руководителя','Комментарий</br>руководителя',
        'Согласование</br>безопасности','Комментарий</br>безопасности',
        'area',
        'CI_ADR', 
      
        'CI_NAME1',
      
        'SRV_ID', 
        'EXPORT', 'CI_GOSB',
        '&#128206;'
      ];
    colModel = [
{name:'uid', index:'uid', width:'50', align:'center', sorttype:'nvarchar', editable:false, hidden: true},
{name:'ID', index:'ID', width:'100', align:'center', sorttype:'nvarchar', editable:false, hidden: false},
{name:'FINISHDATE', index:'FINISHDATE', width:'150', align:'center', sorttype:'nvarchar', editable:false, hidden: false},
{name:'tripTime', index:'tripTime', width:'150', align:'center', sorttype:'datetime', editable:false, hidden: false},
{name:'PERSNAME', index:'PERSNAME', width:'200', align:'left', sorttype:'nvarchar', sortable:true,stype:'select',searchoptions:{sopt:['cn'],value:':All',defaultValue:'All'}},	
{name:'WOG', index:'WOG', width:'150', align:'left', sorttype:'nvarchar', sortable:true,stype:'select',searchoptions:{sopt:['cn'],value:':All',defaultValue:'All'}},	
{name:'locatorId', index:'locatorId', width:'100', align:'center', sorttype:'nvarchar', editable:false, hidden: false},
{name:'CI_SC', index:'CI_SC', width:'150', align:'left', sorttype:'nvarchar', editable:false, hidden: false},
{name:'so_uid', index:'so_uid', width:'60', align:'center', sorttype:'nvarchar', sortable:true,
stype:'select',searchoptions:{sopt:['cn'],value:':All;1:+ (Обьект зарегистрирован);0:NO (Обьект не зарегистрирован)',defaultValue:'All'}},	
{name:'SOLUTION', index:'SOLUTION', width:'16', align:'left',  edittype:'textarea', sorttype:'text', editable:false, hidden: false},
{name:'INFORMATION', index:'INFORMATION', width:'16', align:'left', edittype:'textarea', sorttype:'text', editable:false, hidden: false},
{name:'deviation', index:'deviation', width:'25', align:'center', edittype:'varchar', sorttype:'text', editable:false, hidden: false},
{name:'TRANSP_TYPE', index:'TRANSP_TYPE', width:'100', align:'left',sorttype:'nvarchar', sortable:true,stype:'select',searchoptions:{sopt:['cn'],value:':All;1:Все с выездом;Без выезда:Без выезда;Банковский транспорт:Банковский транспорт;Личный:Личный;Общественный транспорт:Общественный транспорт;Пешком:Пешком;Прочий:Прочий;Такси:Такси',defaultValue:'All'}},	
{name:'PROBEG', index:'PROBEG', width:'50', align:'center', sorttype:'nvarchar', sortable:true,stype:'select',searchoptions:{sopt:['cn'],value:':All;-1:=0;0:>0;10:>=10;100:>=100',defaultValue:'All'}},	
{name:'FLAGS', index:'FLAGS', width:'50', align:'center', sorttype:'nvarchar',  editable:false, hidden: false},
{name:'tripView', index:'tripView', width:'20', align:'center', sorttype:'nvarchar', editable:false, hidden: false},
{name:'tripRecalculate', index:'tripRecalculate', width:'25', align:'center', sorttype:'nvarchar', editable:false, hidden: false},
{name:'Trip', index:'Trip', width:'510', align:'center', sorttype:'nvarchar', sortable:true,  editable:true, hidden: false,
stype:'select',searchoptions:{sopt:['cn'],value:'All:All;0:нет (необработанные или не попадающие под правила обработки);1:СОГЛАСОВАНО СИСТЕМОЙ;2:СОГЛАСОВАНО КООРДИНАТОРОМ (+ОБУЧЕНИЕ СИСТЕМЫ);3:СОГЛАСОВАНО КООРДИНАТОРОМ (БЕЗ ОБУЧЕНИЯ СИСТЕМЫ);4:СОГЛАСОВАНО С УЧЕТОМ ПОГРЕШНОСТИ(АНАЛИТИКА);-1:НЕ СОГЛАСОВАНО (не подтверждено геолокацией);-2:НЕ СОГЛАСОВАНО (геолокация сотрудник отключена);-3:НЕ СОГЛАСОВАНО (поездка выполнена другой датой);-4:НЕ СОГЛАСОВАНО (АНАЛИТИКА);-9999:ВСЕ НЕСОГЛАСОВАНЫЕ',defaultValue:'0'}},	
{name:'tripRecalc', index:'tripRecalc', width:'32', align:'center', sorttype:'varchar', editable:false, hidden: false},
{name:'tripComment', index:'tripComment', width:'80', align:'center', sorttype:'varchar', editable:false, hidden: false,
stype:'select',searchoptions:{sopt:['cn'],value:'All:All;1:с комментарием;0:без комментария',defaultValue:'All'}},	
{name:'chiefAgree', index:'chiefAgree', width:'80', align:'center', sorttype:'varchar', editable:false, hidden: false,
stype:'select',searchoptions:{sopt:['cn'],value:'All:All;1:согласовано;0:не согласовано',defaultValue:'All'}},	
{name:'chiefComment', index:'chiefComment', width:'80', align:'center', sorttype:'varchar', editable:false, hidden: false,
stype:'select',searchoptions:{sopt:['cn'],value:'All:All;1:с комментарием;0:без комментария',defaultValue:'All'}},	
{name:'securityAgree', index:'securityAgree', width:'130', align:'center', sorttype:'varchar', editable:false, hidden: false,
stype:'select',searchoptions:{sopt:['cn'],value:'All:All;1:согласовано;-1:не согласовано',defaultValue:'All'}},	
{name:'securityComment', index:'securityComment', width:'80', align:'center', sorttype:'varchar', editable:false, hidden: false,
stype:'select',searchoptions:{sopt:['cn'],value:'All:All;1:с комментарием;0:без комментария',defaultValue:'All'}},	
{name:'area', index:'area', width:'200', align:'left', sorttype:'nvarchar', editable:false, hidden: false},
{name:'CI_ADR', index:'CI_ADR', width:'250', align:'left', sorttype:'nvarchar', editable:false, hidden: false},
{name:'CI_NAME1', index:'CI_NAME1', width:'250', align:'left', sorttype:'nvarchar', editable:false, hidden: false},
{name:'SRV_ID', index:'SRV_ID', width:'50', align:'center', sorttype:'nvarchar', editable:false, hidden: true},
{name:'EXPORT', index:'EXPORT', width:'50', align:'center', sorttype:'nvarchar', editable:false, hidden: true},
{name:'CI_GOSB', index:'CI_GOSB', width:'150', align:'center', sorttype:'nvarchar', editable:false, hidden: false},
{name:'files', index:'files', width:'16', align:'left', edittype:'textarea', sorttype:'text', editable:false, hidden: false}
];
    response.render(
        params.router.addContactFile, {
            url: '/api/servicecalls3_json.html',
            colNames : colNames,
            colModel : colModel
        }); 
   } catch (error) {
    console.log(error);
 } 
   
  
}*/