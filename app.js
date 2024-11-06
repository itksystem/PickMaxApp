
// Rev_01.11.2021
process.env.UV_THREADPOOL_SIZE = 128;        //  By default, Node has 4 workers to resolve DNS queries. If your DNS query takes long-ish time, requests will block on the DNS phase, and the symptom is exactly ESOCKETTIMEDOUT or ETIMEDOUT.
const http=require('http');                                // Подключаем WebSocket ...
const express    = require("express");                     // подключение express
const bodyParser = require('body-parser');

const logger     = require("./controllers/LoggerHandler"); // Работа с лог-файлами
const router    = express.Router();
const mainRouter = require("./routes/mainRouter");
const middleware = require("openfsm-middlewares-auth-service");   // подключаем наш middleware
const PORT = process.env.PORT || 3000;

const app        = express();	                             // создаем объект приложения	
app.use(bodyParser.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser()); // Подключаем cookie-parser для работы с cookies

session          = require('express-session');
flash            = require('connect-flash')


app.use(function(request, response, next){
  console.log(request.url);  
  next();
});

app.use('/', mainRouter);

app.listen(PORT, () => {   // Запуск сервера
  logger.info(`Server is running on http://localhost:${PORT}`);
});

