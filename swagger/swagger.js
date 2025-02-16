const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pickmax application API',
      version: '1.0.0',
      description: 'API documentation for Pickmax application',
    },
     servers: [
      {
        url: 'http://localhost:3000'        
      },
      {
        url: 'http://pickmax.ru'        
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  
  apis: ['./swagger/*.js','./routes/*.js'], // Укажите путь к вашим файлам с роутами
};

const specs = swaggerJsdoc(options);
module.exports = specs;

