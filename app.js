
// Rev_01.11.2021
process.env.UV_THREADPOOL_SIZE = 128;        //  By default, Node has 4 workers to resolve DNS queries. If your DNS query takes long-ish time, requests will block on the DNS phase, and the symptom is exactly ESOCKETTIMEDOUT or ETIMEDOUT.
                                            //  Try increasing your uv thread pool size

const http=require('http');                   // Подключаем WebSocket ...
const ws=require('ws');                       //
const wss = new ws.Server({noServer: true});  //  
var wsServer = null;
const express    = require("express");   // подключение express
const swaggerUi  = require("swagger-ui-express");
const app        = express();	           // создаем объект приложения	
const logger     = require("./smes/logs/logController.js"); // Работа с лог-файлами
const auth       = require("./smes/smes-auth/auth.js");     // Работа с авторизацией, сесииями и таймлайнами
const config     = require("./smes/params/params.js");
const socketController  = require("./controllers/socketsController");
const accessController  = require("./controllers/accessController");
const db      = require("./smes/smes-dbconnector/dbConnector"); 
const AuthController =  require("./controllers/telegramAuthController").Auth;
const auditMiddleware = require('./middleware/auditMiddleware'); // подключаем наш middleware

const telegramController = require("./controllers/telegramController");

/* Socket IO initialization */
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
let global=require("./smes/global/global")


var clients = [];
/*  Pages, load objects*/
const page={
    // "main"        :  require("./public/main/pages/main"),
    "contacts"    :  require("./public/main/pages/contacts.js"),
    "profile"     :  require("./public/main/pages/profile.js"),
    "addContact"  :  require("./public/main/pages/addContact.js"),
    "error404"    :  require("./public/main/pages/404.js"),
    "error500"    :  require("./public/main/pages/500.js")
}

/************************************************************************/                            
var  params = config.getIniParams(); // загружаем ini-файл с настройками
var  url    = require("url");
var  path   = require("path");
var  fs     = require('fs');
const hbs   = require("hbs");

/* Контроллеры и роуты */
const mainController= require("./controllers/mainController.js");
const mainRouter    = express.Router();
const modalRouter    = require("./routes/modalRouter");
const userRouter    = require("./routes/userRouter");
const contactsRouter    = require("./routes/contactsRouter");
const groupRouter   = require("./routes/groupRouter");
const orgRouter     = require("./routes/orgRouter");
const objectRouter  = require("./routes/objectRouter");
const tripRouter    = require("./routes/tripRouter");
const profileRouter = require("./routes/profileRouter");
const servicecallRouter = require("./routes/servicecallRouter");
const uiRouter      = require("./routes/uiRouter");
const accessRouter  = require("./routes/accessRouter");
const serviceRouter  = require("./routes/serviceRouter");
const geozoneRouter  = require("./routes/geozoneRouter");
const subscriptionsRouter  = require("./routes/subscriptionsRouter");
const errorRouter  = require("./routes/errorRouter");
const fluxRouter  = require("./routes/fluxRouter");
const socketsRouter  = require("./routes/socketsRouter");
const functionsRouter = require("./routes/functionsRouter");
const rolesRouter = require("./routes/rolesRouter");
const licensesRouter = require("./routes/licensesRouter");
const telegramRouter = require("./routes/telegramRouter");
const pushRouter = require("./routes/pushRouter");
const smmRouter = require("./routes/smmRouter");
//const hookRouter = require("./routes/TgWebhookRouter");


/* ссылки на маршруты */
const _dir_html=path.resolve()+ "/public";
console.log('_dir_html=>'+_dir_html);
bodyParser       = require('body-parser');
session          = require('express-session');
flash            = require('connect-flash')
var MySQLStore  = require('express-mysql-session')(session);

var options = {
	host: params.db.host,
	port: params.db.port,
	user: params.db.user,
	password: params.db.password,
	database: params.db.database,
 	clearExpired: true,  // Whether or not to automatically check for and clear expired sessions:
	checkExpirationInterval: parseInt(params.main.checkExpirationInterval),	// How frequently expired sessions will be cleared; milliseconds:900000,
	expiration: parseInt(params.main.idleMaxTimeout),// The maximum age of a valid session; milliseconds:86400000
	createDatabaseTable: true,// Whether or not to create the sessions database table, if one does not already exist:
	connectionLimit: 1,// Number of connections when creating a connection pool:
	endConnectionOnClose: true,// Whether or not to end the database connection when the store is closed.
	// The default value of this option depends on whether or not a connection was passed to the constructor.
	// If a connection object is passed to the constructor, the default value for this option is false.
	createDatabaseTable: true,
	schema: {
		tableName: 'service_sessions',
		columnNames: {
			session_id: 'session_id',
			expires: 'session_expires',
			data: 'data'
		}
	}
};



var sessionStore = new MySQLStore(options);
 
app.set("view engine", "hbs"); 
app.use(bodyParser.json({limit: '50mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))

hbs.registerPartials(_dir_html + "/main/views/partials");
const urlencodedParser = bodyParser.urlencoded({extended: false}); // создаем парсер для данных application/x-www-form-urlencoded


app.disable('x-powered-by');        // отключаем выявления приложений на базе Express
var helmet = require('helmet');     // используем helpmet для защиты от ряда атак
app.use(helmet());                  // включаем helpmet - плагин для блокировки некоторых видов атак
app.use(flash())                    // включаем flash-роутер

app.use(express.static(__dirname + "/public"));

app.use(
  session({
    secret: '3409mk340kmq3423u-3=0923jk212lam30664ecefr4',
    resave: false,
    saveUninitialized: false,
    expires: new Date(Date.now() + parseInt(params.main.idleMaxTimeout)), // длительность сессии
    store: sessionStore, 
    maxAge: 0, 
    cookie: {}
    })
);

const swaggerDocument = require('./swagger/swagger.json');
var options = {}

app.use(function (req, res, next) {
  res = config.setHeadersForLogging(req, res);    // настройка заголовков для ответов
  next();
});

app.use('/api-docs', function(req, res, next){
    swaggerDocument.host = req.get('host');
    req.swaggerDoc = swaggerDocument;
    next();
}, swaggerUi.serveFiles(swaggerDocument, options), swaggerUi.setup());

  app.use(function (req, res, next) {
      res.setHeader('Content-Security-Policy', "*"); 
      res.setHeader('X-Frame-Options', 'ALLOW-FROM https://web.telegram.org');
    next();
  });

app.use(function (req, res, next) {  // middleware для промежуточных действий
   
   next();
});



  /* Подклчючаем роутеры */
app.use("/push",    pushRouter);       //  роутер для работы с webpush
app.use("/modal",    modalRouter);       //  роутер загрузки модальных окон
app.use("/user",     userRouter);       //  роутер пользователей
app.use("/contacts",    contactsRouter);       //  роутер контактов
app.use("/smm",    smmRouter);       //  роутер smm
app.use("/groups",   groupRouter);     //  роутер групп
app.use("/org",      orgRouter);       //  роутер организаций
app.use("/object",   objectRouter);    //  роутер обьектов
app.use("/objects",   objectRouter);    //  роутер раздела обьектов
app.use("/services",   serviceRouter);   //  роутер сервисов портала
app.use("/functions",   functionsRouter);   //  роутер функции портала
app.use("/trip",     tripRouter);      //  роутер маршрутов
app.use("/profile",  profileRouter);   //  роутер пользователей
app.use("/servicecalls",  servicecallRouter);   //  роутер пользователей
app.use("/ui",       uiRouter);        //  роутер событий интерфейса 
app.use("/access",   accessRouter);    //  роутер доступа
app.use("/geozones", geozoneRouter);   //  роутер событий геозон
app.use("/subscriptions",   subscriptionsRouter);       //  роутер акция и подписок
app.use("/error",   errorRouter);       //  роутер http-ошибок
app.use("/flux",     fluxRouter);       //  роутер статистики
app.use("/sockets",  socketsRouter);    //  роутер сокетов
app.use("/roles",  rolesRouter);    //  роутер ролей
app.use("/licenses",  licensesRouter);    //  роутер licenses

//app.use("/hook",  hookRouter);    //  роутер webhook

app.use(auditMiddleware); // сбор лога
app.use("/telegram",  telegramRouter);    //  роутер telegram



/* upload photos */

/* ****************************************** */
// запрос о текущей сессии для Web "/"
app.get('/main/@me',async function (request, response, next) {
  const _METHOD_ = `server.js.app.get('/main/@me')`;
  var me = {};
  let userId = null;
  try{
    let auth =  new AuthController(request);    
      params = config.getIniParams() // загружаем ini-файл с настройками
      userId = await auth.getUserId();
      logger.audit(`${_METHOD_} => `, request);           
//    if(userId) {
       let city = await db.querySQL(params[params.dbtype.provider].query.getCity, [ userId ]); 
       let user = await db.querySQL(params[params.dbtype.provider].query.getTelegramUserProfile, [ userId ]); 
       if (request.sessionID)  me.sessionID = request.sessionID;
       if (request.session.userId)  me.userId = request.session.userId;
       if (request.session.telegram_user_id)     me.telegram = {};
       if (request.session.telegram_shop_id)     me.telegram.shop_id = request.session.telegram_shop_id;
       if (request.session.telegram_user_id)     me.telegram.user_id = request.session.telegram_user_id;
       if (request.session.telegram_username)    me.telegram.username = request.session.telegram_username;
       if (request.session.telegram_first_name)  me.telegram.first_name = request.session.telegram_first_name;
       if (request.session.telegram_last_name)   me.telegram.last_name = request.session.telegram_last_name;
       if(user.length > 0) { // доставка  
         me.delivery = {};
         me.delivery.address = user[0].address;
         me.delivery.name    = user[0].user_delivery_name;
         me.delivery.phone   = user[0].user_delivery_phone;
       }
        if (city.length > 0) me.city = city[0].city;
        if (city.length > 0) me.city_fias_id = city[0].city_fias_id ;        
         response.status(200).send(me);
      // } 
       /*else {
        response.status(401).send({error_message : params.https_codes[401] });              
       }   */    
     }catch(error){
      response.status(500).send({error_message : params.https_codes[500], detail : error });              
  }

});


// определяем обработчик для маршрута "/"
app.use('/',function (request, response, next) {
  try {
  var  params = config.getIniParams();  // обновлям ini-файл с настройками
  if(params.main.underConstruction==1 && request.url != params.router.underConstruction) {
            response.redirect(params.router.underConstruction)
   } else
  if(!(auth.getAuthProcess(request, response))
      && request.url != params.router.logon
         && request.url != params.router.logoff
           && request.url != params.router.auth 
         ) {
           params = config.getIniParams(); // загружаем ini-файл с настройками
           response.sendFile(_dir_html + params.router.logonFile);
      } 
    else 
      next();
  } catch (error) {
  page.error500.render(request, response);
 }
});

app.get(params.router.logon, function(request, response){           // маршрут - форма входа
  try {
    auth.logoff(request, response);
    params=config.getIniParams();                                    // Обновляем параметры считывая их с ini-файла
    if(params.main.underConstruction==1) {
            response.redirect(params.router.underConstruction)
          }  else  {
      params = config.getIniParams(); // загружаем ini-файл с настройками
      response.sendFile(_dir_html + params.router.logonFile);
    }
      } catch (error) {
    page.error500.render(request, response);
   }
  });

app.get(params.router.closeTimeout, function(request, response){     // маршрут - сессия неактивна 
 try { 
     auth.logoff(request, response);
     response.sendFile(_dir_html + params.router.closeTimeoutFile);
   } catch (error) {
  page.error500.render(request, response);
 }
});

app.get(params.router.underConstruction, function(request, response){ // маршут - технические работы 
  try{
      auth.logoff(request, response);
      response.sendFile(_dir_html + params.router.underConstructionFile);
    } catch (error) {
  page.error500.render(request, response);
 }
});


app.get(params.router.help, function(request, response){
  try {
  if(auth.getAuthProcess(request, response)) {
    response.send('Вывод HELP...'+auth.getUserId(request, response));      
  } else        
  response.redirect(params.router.logon);
} catch (error) {
  page.error500.render(request, response);
 }
});


app.get(params.router.main, async function(request, response){
 try{ 
  if(auth.getAuthProcess(request, response)) {
        params = config.getIniParams(); // загружаем ini-файл с настройками
        let access = await accessController.FindPermissionByTag(request.session.userId, 'service_article_servicecalls')
        if(request.session.telegram_shop_id && request.session.telegram_user_id) {
             response.status(200).redirect(params.router.telegram_shop+""+request.session.telegram_shop_id)
        } 
        else 
          response.status(200).redirect(
            access
            ? params.router.servicecalls
            : params.router.noaccess
            );        
       } else {       
       response.status(403).redirect(params.router.logon);
     }
    } catch (error) {
   page.error500.render(request, response);
  }
});


app.get(params.router.contacts, function(request, response){
try {  
  if(auth.getAuthProcess(request, response)) {
       // page.contacts.render(request, response);
       mainController.pageOutput(request, response);
     } else {    
    response.redirect(params.router.logon);
  }
   } catch (error) {
  page.error500.render(request, response);
 }
});


app.post(params.router.auth, urlencodedParser, async function(request, response){    // отправляем ответ
try {
  if(params.main.underConstruction==1) 
      response.redirect(params.router.underConstruction)
  else  
    if(request.body.id) { 
      let authResult=await auth.logon(request, response, {username:request.body.id,password:request.body.password})
        if(authResult==1) {
             logger.audit('Авторизация успешна! userId=>'+request.session.userId+' token=>'+request.session.token, request);              
             response.send(JSON.stringify({userId:request.session.userId,token:request.session.token, code: authResult}));
        }  else if (authResult==-1) {
             logger.audit('Нет подключения к БД!', request);              
             response.send(JSON.stringify({userId:null,token:null, code: authResult}));
        }
        else {
          logger.audit('Нет авторизации!', request);              
          response.send(JSON.stringify({userId:null,token:null, code: authResult}));
      }
    } 
  } catch (error) {
    page.error500.render(request, response);
}
});

app.get(params.router.logoff, function(request, response){
  try {
    auth.logoff(request, response);
    response.redirect(params.router.logon);
      } catch (error) {
         page.error500.render(request, response);
    }
});


app.use(function(request, response, next) {
  if(auth.getAuthProcess(request, response) && request.originalUrl == '/') {
        response.redirect(params.router.main)
  } else {
        var err = new Error('Not Found');
        err.status = 404;
        mainController.pageOutput(request, response);
  }
});

/* SocketIO*/

io.on('connection', (socket) => {
  global.socket = socket;
  socket.on('chat message', (msg) => { console.log('message: ' + msg);  });
  socket.on('user:auth', (msg) => {   
    try {
      if(!msg) return;
        let json = JSON.parse(msg);
        socketController.save(json.userId, socket.id );
        socket.emit('user:auth', msg); 
        } catch (error) {
        console.log('catch user:auth ' + error);  
      } 
    });

    socket.on('user:refresh', (msg) => {   
      socketController.update(socket.id);
     });

    socket.on("disconnect", (reason) => { 
      socketController.delete(socket.id);
      console.log(`disconnect ${socket.id} due to ${reason}`);
  });
  
});

 server.listen(3000, () => {
   console.log('Socket listening on *:3000');
 });

 global.io =io;

 // отправка push по расписанию
 setInterval(()=>{  socketController.sendFromDatabaseQueue(); }, 20000); 