// Rev_01.11.2021
process.env.UV_THREADPOOL_SIZE = 128; // Увеличиваем пул потоков для DNS-запросов

const common = require("openfsm-common"); // Библиотека с общими параметрами
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const hbs = require('hbs');
const logger = require('./controllers/LoggerHandler');
const mainRouter = require('./routes/mainRouter');
const paymentRouter = require('./routes/paymentRouter');
const warehouseBffRouter = require('./routes/warehouseBffRouter');
const ordersBffRouter = require('./routes/ordersBffRouter');
const clientRouter = require('./routes/clientRouter');

const PORT = process.env.PORT || 3000;

const app = express(); // Создаем приложение Express

// Конфигурация middlewares
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Установка движка шаблонов
app.set('view engine', 'hbs');
// hbs.registerPartials(path.join(__dirname, 'html/partials'));
hbs.registerPartials(common.COMMON_PATH_TO_PARTIALS);

// Статические файлы
app.use(express.static(common.COMMON_PATH_TO_SITE));

// Логирование запросов
app.use((req, res, next) => {
  console.log(req.url);
  next();
});


// Подключение маршрутов
app.use('/', mainRouter);      // вывод страниц 
  
/* BFF для warehouseService */
app.use('/api/bff/warehouse/', warehouseBffRouter);     
app.use('/api/bff/orders/',    ordersBffRouter); 
app.use('/api/bff/payment/',   paymentRouter); 
app.use('/api/bff/client/',    clientRouter); 


// Middleware для обработки 404 ошибок
app.use((req, res, next) => {
  res.status(404).render(path.join(common.COMMON_PATH_TO_PAGES, 'page-404.hbs'));
});


// Запуск сервера   
app.listen(process.env.PORT, () => {
  console.log(`
    ******************************************
    * PickMax Service running on port ${process.env.PORT}   *
    ******************************************`);
});
