const { createLogger, format, transports } = require('winston');
require('dotenv').config({ path: '.env-pickmax-service' });

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: 'pickapp-service' },
    transports: [
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' }),
        // new HttpTransport({ endpoint: 'https://example.com/logs' }), // URL для отправки логов
    ],
});

//if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple()
        )
    }));
//}

module.exports = logger;
