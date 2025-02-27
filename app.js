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
const recoRouter = require('./routes/recoRouter');
const mailRouter = require('./routes/mailRouter');
const deliveryRouter= require('./routes/deliveryRouter');
const promClient = require('prom-client'); //сбор метрик для Prometheus

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger'); // Импортируйте конфигурацию Swagger
require('dotenv').config({ path: '.env-pickmax-service' });

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

//  метрика Prometheus
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Продолжительность HTTP-запросов в секундах',
  labelNames: ['method', 'status', 'path'],
});

// следим за метриками
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer({ method: req.method, path: req.path });
  res.on('finish', () => {
    end({ status: res.statusCode });
  });
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Маршрут /metrics
app.get('/metrics', async (req, res) => {
  try {
    const metrics = await promClient.register.metrics();
    res.set('Content-Type', promClient.register.contentType);
    res.end(metrics);
  } catch (error) {
    logger.error(error);
    res.status(500).end('Failed to load metrics');
  }
});

// Логирование запросов
app.use((req, res, next) => {
  console.log(req.url);
  next();
});


app.use(function (req, res, next) {    
    // res.setHeader("Content-Security-Policy", "*");
    // res.setHeader('X-Frame-Options', 'ALLOW-FROM https://web.telegram.org');
    res.setHeader("Content-Security-Policy", "frame-ancestors 'self' https://web.telegram.org;");
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');   
    next();
});


// Подключение маршрутов
app.use('/', mainRouter);      // вывод страниц 
  
/* BFF для warehouseService */
app.use('/api/bff/warehouse/', warehouseBffRouter);     
app.use('/api/bff/orders/',    ordersBffRouter); 
app.use('/api/bff/payment/',   paymentRouter); 
app.use('/api/bff/client/',  clientRouter); 
app.use('/api/bff/reco/',    recoRouter); 
app.use('/api/bff/mail/',   mailRouter); 
app.use('/api/bff/verification/',  mainRouter); 
app.use('/api/bff/delivery/',  deliveryRouter); 

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
