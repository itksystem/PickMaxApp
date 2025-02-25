const express = require('express');
const router = express.Router();
const logger = require("../controllers/LoggerHandler"); // ������ � ���-�������
const common = require("openfsm-common"); // ���������� � ������ �����������
const { health, renderPage } = require('../controllers/mainController');
const authMiddleware = require('openfsm-middlewares-auth-service');

const AuthServiceClientHandler = require("openfsm-auth-service-client-handler");
const authClient = new AuthServiceClientHandler();              // ��������� ���  ����� � MC AuthService
const WarehouseServiceClientHandler = require("openfsm-warehouse-service-client-handler");
const warehouseClient = new WarehouseServiceClientHandler();   // ��������� ���  ����� � MC WarehouseService
const CommonFunctionHelper = require("openfsm-common-functions")
const commonFunction= new CommonFunctionHelper();
require('dotenv').config({ path: '.env-pickmax-service' });