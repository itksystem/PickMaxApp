const express = require('express');
const router = express.Router();
const logger = require("../controllers/LoggerHandler"); // Работа с лог-файлами
const common = require("openfsm-common"); // Библиотека с общими параметрами
const ConfirmationServiceHandler = require("../handlers/ConfirmationServiceHandler");
const confirmationService = new ConfirmationServiceHandler();              // интерфейс для  связи с MC Confirmation
require('dotenv').config({ path: '.env-pickmax-service' });

router.post('/v1/request', async (req, res) => {
    const { confirmationType } = req.body;
    if(!confirmationType) throw(422)
    const response = await confirmationService.sendRequest(req);
    if (response.success) {
        res.status(200).json(response.data);
    } else {
        logger.error(response.error || 'Неизвестная ошибка' );   
        res.status(response.status || 500).json({ error: response.error || common.COMMON_HTTP_CODE_500});
    }
});


router.post('/v1/code', async (req, res) => {
    const { code, requestId } = req.body;
    if(!code || !requestId) throw(422)
    const response = await confirmationService.sendCode(req);
    if (response.success) {
        res.status(200).json(response.data);
    } else {
        logger.error(response.error || 'Неизвестная ошибка' );   
        res.status(response.status || 500).json({ error: response.error || common.COMMON_HTTP_CODE_500});
    }
});
module.exports = router;
