var errors = {
  "RU": {
		"default":"Произошла ошибка. Попробуйте оплатить другой картой или повторите попытку позже",
		"ACCESS_DENIED":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"AMOUNT_ERROR":"Некорректная сумма платежа",
		"AMOUNT_EXCEED":"Недостаточно средств или превышен лимит по карте",
		"API_NOT_ALLOWED":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"CARD_EXPIRED":"Истек срок действия карты",
		"CARD_NOT_FOUND":"Карта не найдена. Попробуйте оплатить другой картой",
		"COMMUNICATE_ERROR":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"CURRENCY_NOT_ALLOWED":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"CUSTOMER_NOT_FOUND":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"DUPLICATE_CARD":"Карта уже существует. Попробуйте оплатить другой картой",
		"DUPLICATE_ORDER_ID":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"DUPLICATE_PROCESSING_ORDER_ID":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"DUPLICATE_USER":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"EMAIL_ERROR":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"EMPTY_RESPONSE":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"FRAUD_ERROR":"Превышено количество допустимых попыток. Попробуйте оплатить другой картой или повторите попытку позже",
		"FRAUD_ERROR_BIN_LIMIT":"Превышено количество допустимых попыток. Попробуйте оплатить другой картой или повторите попытку позже",
		"FRAUD_ERROR_BLACKLIST_AEROPORT":"Превышено количество допустимых попыток. Попробуйте оплатить другой картой или повторите попытку позже",
		"FRAUD_ERROR_BLACKLIST_BANKCOUNTRY":"Превышено количество допустимых попыток. Попробуйте оплатить другой картой или повторите попытку позже",
		"FRAUD_ERROR_BLACKLIST_USERCOUNTRY":"Превышено количество допустимых попыток. Попробуйте оплатить другой картой или повторите попытку позже",
		"FRAUD_ERROR_CRITICAL_CARD":"Превышено количество допустимых попыток. Попробуйте оплатить другой картой или повторите попытку позже",
		"FRAUD_ERROR_CRITICAL_CUSTOMER":"Превышено количество допустимых попыток. Попробуйте оплатить другой картой или повторите попытку позже",
		"FRAUD_ERROR_IP":"Превышено количество допустимых попыток. Попробуйте оплатить другой картой или повторите попытку позже",
		"FRAUD_INTERNAL_ERROR":"Превышено количество допустимых попыток. Попробуйте оплатить другой картой или повторите попытку позже",
		"ILLEGAL_ORDER_STATE":"Неверное состояние заказа",
		"INTERNAL_ERROR":"Произошла ошибка. Попробуйте оплатить другой картой или повторите попытку позже",
		"INVALID_PAYTUREID":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"INVALID_SIGNATURE":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"ISSUER_BLOCKED_CARD":"Карта заблокирована. Обратитесь в банк выпустивший карту",
		"ISSUER_CARD_FAIL":"Произошла ошибка. Попробуйте оплатить другой картой или повторите попытку позже",
		"ISSUER_FAIL":"Произошла ошибка. Попробуйте оплатить другой картой или повторите попытку позже",
		"ISSUER_LIMIT_AMOUNT_FAIL":"Превышен лимит по карте. Попробуйте оплатить другой картой или повторите попытку позже",
		"ISSUER_LIMIT_COUNT_FAIL":"Превышен лимит по карте. Попробуйте оплатить другой картой или повторите попытку позже",
		"ISSUER_LIMIT_FAIL":"Превышен лимит по карте. Попробуйте оплатить другой картой или повторите попытку позже",
		"ISSUER_TIMEOUT":"Произошла ошибка. Попробуйте оплатить другой картой или повторите попытку позже",
		"MERCHANT_FORWARD":"Перенаправление на другой терминал",
		"MERCHANT_RESTRICTION":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"MPI_CERTIFICATE_ERROR":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"MPI_RESPONSE_ERROR":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"ORDER_NOT_FOUND":"Заказ не найден",
		"ORDER_TIME_OUT":"Время на оплату истекло",
		"PAYMENT_ENGINE_ERROR":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"PROCESSING_ACCESS_DENIED":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"PROCESSING_ERROR":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"PROCESSING_FRAUD_ERROR":"Произошла ошибка. Попробуйте оплатить другой картой или повторите попытку позже",
		"PROCESSING_TIME_OUT":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"REFUSAL_BY_GATE":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"THREE_DS_ATTEMPTS_FAIL":"Ошибка прохождения 3DS",
		"THREE_DS_AUTH_ERROR":"Ошибка прохождения 3DS",
		"THREE_DS_ERROR":"Ошибка прохождения 3DS",
		"THREE_DS_FAIL":"Ошибка прохождения 3DS",
		"THREE_DS_NOT_ATTEMPTED":"Ошибка прохождения 3DS",
		"THREE_DS_NOTENROLLED":"Карта не вовлечена в систему 3DS",
		"THREE_DS_TIME_OUT":"Превышено время ожидания 3DS",
		"THREE_DS_USER_AUTH_FAIL":"Неверный код 3DS",
		"UNKNOWN_STATE":"Неизвестный статус заказа",
		"USER_NOT_FOUND":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"WRONG_AUTHORIZATION_CODE":"Неверный код авторизации",
		"WRONG_CARD_INFO":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"WRONG_CARDHOLDER":"Неверно указан держатель карты",
		"WRONG_CONFIRM_CODE":"Недопустимый код подтверждения",
		"WRONG_CVV":"Недопустимый CVV",
		"WRONG_EXPIRE_DATE":"Неверный срок действия карты",
		"WRONG_PAN":"Неверный номер карты",
		"WRONG_PARAMS":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"WRONG_PAY_INFO":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"WRONG_PHONE":"Неверный формат номера телефона",
		"WRONG_USER_PARAMS":"Неверные параметры пользователя",
		"OTHER_ERROR":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"AMOUNT_EXCEED_BALANCE":"Превышен лимит",
		"AUTHENTICATION_ERROR":"Произошла ошибка. Попробуйте оплатить другой картой или повторите попытку позже",
		"AUTHORIZATION_TIMEOUT":"Произошла ошибка. Попробуйте оплатить другой картой или повторите попытку позже",
		"LIMIT_EXCHAUST":"Произошла ошибка. Попробуйте оплатить другой картой или повторите попытку позже",
		"WRONG_CARD_PAN":"Неверный номер карты",
		"BUSINESS_CARD_REQUIRED":"Карта не поддерживается. Попробуйте оплатить другой",
		"BANK_IS_NOT_ALLOWED": "Карта не поддерживается. Попробуйте оплатить другой",
		"MP_WRONG_OTP": "Введен неверный проверочный код",
		"CODE_CHECK_FAILED": "Ошибка проверки второго фактора",
		"AMOUNT_LIMIT_EXCEEDED": "Превышен лимит",
		"INVALID_AMOUNT": "Некорректная сумма платежа",
		"INVALID_COUNTRY": "Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"INVALID_CURRENCY": "Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"INVALID_VERSION": "Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"MERCHANT_NOT_FOUND": "Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"GATEWAY_NOT_FOUND": "Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"CARD_NETWORK_NOT_SUPPORTED": "Карта не поддерживается. Попробуйте оплатить другой",
		"MERCHANT_DOMAIN_ERROR": "Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"INSECURE_MERCHANT_DOMAIN": "Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"WAITING_TIME_OVER": "Время ожидания истекло"
  },
	"EN": {
		"default":"Error. Try to pay with another card or try again later",
		"ACCESS_DENIED":"Error. Contact support or try again later",
		"AMOUNT_ERROR":"Incorrect payment amount",
		"AMOUNT_EXCEED":"Insufficient funds or card limit exceeded",
		"API_NOT_ALLOWED":"Error. Contact support or try again later",
		"CARD_EXPIRED":"Card expired",
		"CARD_NOT_FOUND":"Card not found. Try paying with a different card",
		"COMMUNICATE_ERROR":"Error. Contact support or try again later",
		"CURRENCY_NOT_ALLOWED":"Error. Contact support or try again later",
		"CUSTOMER_NOT_FOUND":"Error. Contact support or try again later",
		"DUPLICATE_CARD":"Card already exists. Try to pay with another card",
		"DUPLICATE_ORDER_ID":"Error. Contact support or try again later",
		"DUPLICATE_PROCESSING_ORDER_ID":"Error. Contact support or try again later",
		"DUPLICATE_USER":"Error. Contact support or try again later",
		"EMAIL_ERROR":"Error. Contact support or try again later",
		"EMPTY_RESPONSE":"Error. Contact support or try again later",
		"FRAUD_ERROR":"The number of allowed attempts has been exceeded. Try to pay with another card or try again later",
		"FRAUD_ERROR_BIN_LIMIT":"The number of allowed attempts has been exceeded. Try to pay with another card or try again later",
		"FRAUD_ERROR_BLACKLIST_AEROPORT":"The number of allowed attempts has been exceeded. Try to pay with another card or try again later",
		"FRAUD_ERROR_BLACKLIST_BANKCOUNTRY":"The number of allowed attempts has been exceeded. Try to pay with another card or try again later",
		"FRAUD_ERROR_BLACKLIST_USERCOUNTRY":"The number of allowed attempts has been exceeded. Try to pay with another card or try again later",
		"FRAUD_ERROR_CRITICAL_CARD":"The number of allowed attempts has been exceeded. Try to pay with another card or try again later",
		"FRAUD_ERROR_CRITICAL_CUSTOMER":"The number of allowed attempts has been exceeded. Try to pay with another card or try again later",
		"FRAUD_ERROR_IP":"The number of allowed attempts has been exceeded. Try to pay with another card or try again later",
		"FRAUD_INTERNAL_ERROR":"The number of allowed attempts has been exceeded. Try to pay with another card or try again later",
		"ILLEGAL_ORDER_STATE":"Invalid order status",
		"INTERNAL_ERROR":"Error. Try to pay with another card or try again later",
		"INVALID_PAYTUREID":"Error. Contact support or try again later",
		"INVALID_SIGNATURE":"Error. Contact support or try again later",
		"ISSUER_BLOCKED_CARD":"The card is blocked. Contact the bank that issued the card",
		"ISSUER_CARD_FAIL":"Error. Try to pay with another card or try again later",
		"ISSUER_FAIL":"Error. Try to pay with another card or try again later",
		"ISSUER_LIMIT_AMOUNT_FAIL":"The card limit has been exceeded. Try to pay with another card or try again later",
		"ISSUER_LIMIT_COUNT_FAIL":"The card limit has been exceeded. Try to pay with another card or try again later",
		"ISSUER_LIMIT_FAIL":"The card limit has been exceeded. Try to pay with another card or try again later",
		"ISSUER_TIMEOUT":"Error. Try to pay with another card or try again later",
		"MERCHANT_FORWARD":"Redirecting to another terminal",
		"MERCHANT_RESTRICTION":"Error. Contact support or try again later",
		"MPI_CERTIFICATE_ERROR":"Error. Contact support or try again later",
		"MPI_RESPONSE_ERROR":"Error. Contact support or try again later",
		"ORDER_NOT_FOUND":"Order not found",
		"ORDER_TIME_OUT":"Order expired",
		"PAYMENT_ENGINE_ERROR":"Error. Contact support or try again later",
		"PROCESSING_ACCESS_DENIED":"Error. Contact support or try again later",
		"PROCESSING_ERROR":"Error. Contact support or try again later",
		"PROCESSING_FRAUD_ERROR":"Error. Try to pay with another card or try again later",
		"PROCESSING_TIME_OUT":"Error. Contact support or try again later",
		"REFUSAL_BY_GATE":"Error. Contact support or try again later",
		"THREE_DS_ATTEMPTS_FAIL":"3DS passage error",
		"THREE_DS_AUTH_ERROR":"3DS passage error",
		"THREE_DS_ERROR":"3DS passage error",
		"THREE_DS_FAIL":"3DS passage error",
		"THREE_DS_NOT_ATTEMPTED":"3DS passage error",
		"THREE_DS_NOTENROLLED":"The card is not 3DS enrolled",
		"THREE_DS_TIME_OUT":"3DS timeout exceeded",
		"THREE_DS_USER_AUTH_FAIL":"Incorrect 3DS code entered",
		"UNKNOWN_STATE":"Unknown transaction status",
		"USER_NOT_FOUND":"Error. Contact support or try again later",
		"WRONG_AUTHORIZATION_CODE":"Incorrect authorisation code",
		"WRONG_CARD_INFO":"Error. Contact support or try again later",
		"WRONG_CARDHOLDER":"Invalid card holder",
		"WRONG_CONFIRM_CODE":"Invalid authorisation code",
		"WRONG_CVV":"Invalid CVV",
		"WRONG_EXPIRE_DATE":"Incorrect valid through date",
		"WRONG_PAN":"Incorrect card number",
		"WRONG_PARAMS":"Error. Contact support or try again later",
		"WRONG_PAY_INFO":"Error. Contact support or try again later",
		"WRONG_PHONE":"Incorrect telephone number",
		"WRONG_USER_PARAMS":"Incorrect user parameters",
		"OTHER_ERROR":"Error. Contact support or try again later",
		"AMOUNT_EXCEED_BALANCE":"Limit is exceeded",
		"AUTHENTICATION_ERROR":"Error. Try to pay with another card or try again later",
		"AUTHORIZATION_TIMEOUT":"Error. Try to pay with another card or try again later",
		"LIMIT_EXCHAUST":"Error. Try to pay with another card or try again later",
		"WRONG_CARD_PAN":"Invalid card number",
		"BUSINESS_CARD_REQUIRED":"The card is not supported. Try to pay with another card",
		"BANK_IS_NOT_ALLOWED": "The card is not supported. Try to pay with another card",
		"MP_WRONG_OTP": "Invalid code entered",
		"CODE_CHECK_FAILED": "Second factor check error",
		"AMOUNT_LIMIT_EXCEEDED": "Limit is exceeded",
		"INVALID_AMOUNT": "Incorrect amount",
		"INVALID_COUNTRY": "Error. Contact support or try again later",
		"INVALID_CURRENCY": "Error. Contact support or try again later",
		"INVALID_VERSION": "Error. Contact support or try again later",
		"MERCHANT_NOT_FOUND": "Error. Contact support or try again later",
		"GATEWAY_NOT_FOUND": "Error. Contact support or try again later",
		"CARD_NETWORK_NOT_SUPPORTED": "The card is not supported. Try to pay with another card",
		"MERCHANT_DOMAIN_ERROR": "Error. Contact support or try again later",
		"INSECURE_MERCHANT_DOMAIN": "Error. Contact support or try again later",
		"WAITING_TIME_OVER": "The waiting time is over"
	},
	"UA": {
		"default":"Произошла ошибка. Попробуйте оплатить другой картой или повторите попытку позже",
		"ACCESS_DENIED":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"AMOUNT_ERROR":"Некорректная сумма платежа",
		"AMOUNT_EXCEED":"Недостаточно средств или превышен лимит по карте",
		"API_NOT_ALLOWED":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"CARD_EXPIRED":"Истек срок действия карты",
		"CARD_NOT_FOUND":"Карта не найдена. Попробуйте оплатить другой картой",
		"COMMUNICATE_ERROR":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"CURRENCY_NOT_ALLOWED":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"CUSTOMER_NOT_FOUND":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"DUPLICATE_CARD":"Карта уже существует. Попробуйте оплатить другой картой",
		"DUPLICATE_ORDER_ID":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"DUPLICATE_PROCESSING_ORDER_ID":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"DUPLICATE_USER":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"EMAIL_ERROR":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"EMPTY_RESPONSE":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"FRAUD_ERROR":"Превышено количество допустимых попыток. Попробуйте оплатить другой картой или повторите попытку позже",
		"FRAUD_ERROR_BIN_LIMIT":"Превышено количество допустимых попыток. Попробуйте оплатить другой картой или повторите попытку позже",
		"FRAUD_ERROR_BLACKLIST_AEROPORT":"Превышено количество допустимых попыток. Попробуйте оплатить другой картой или повторите попытку позже",
		"FRAUD_ERROR_BLACKLIST_BANKCOUNTRY":"Превышено количество допустимых попыток. Попробуйте оплатить другой картой или повторите попытку позже",
		"FRAUD_ERROR_BLACKLIST_USERCOUNTRY":"Превышено количество допустимых попыток. Попробуйте оплатить другой картой или повторите попытку позже",
		"FRAUD_ERROR_CRITICAL_CARD":"Превышено количество допустимых попыток. Попробуйте оплатить другой картой или повторите попытку позже",
		"FRAUD_ERROR_CRITICAL_CUSTOMER":"Превышено количество допустимых попыток. Попробуйте оплатить другой картой или повторите попытку позже",
		"FRAUD_ERROR_IP":"Превышено количество допустимых попыток. Попробуйте оплатить другой картой или повторите попытку позже",
		"FRAUD_INTERNAL_ERROR":"Превышено количество допустимых попыток. Попробуйте оплатить другой картой или повторите попытку позже",
		"ILLEGAL_ORDER_STATE":"Неверное состояние заказа",
		"INTERNAL_ERROR":"Произошла ошибка. Попробуйте оплатить другой картой или повторите попытку позже",
		"INVALID_PAYTUREID":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"INVALID_SIGNATURE":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"ISSUER_BLOCKED_CARD":"Карта заблокирована. Обратитесь в банк выпустивший карту",
		"ISSUER_CARD_FAIL":"Произошла ошибка. Попробуйте оплатить другой картой или повторите попытку позже",
		"ISSUER_FAIL":"Произошла ошибка. Попробуйте оплатить другой картой или повторите попытку позже",
		"ISSUER_LIMIT_AMOUNT_FAIL":"Превышен лимит по карте. Попробуйте оплатить другой картой или повторите попытку позже",
		"ISSUER_LIMIT_COUNT_FAIL":"Превышен лимит по карте. Попробуйте оплатить другой картой или повторите попытку позже",
		"ISSUER_LIMIT_FAIL":"Превышен лимит по карте. Попробуйте оплатить другой картой или повторите попытку позже",
		"ISSUER_TIMEOUT":"Произошла ошибка. Попробуйте оплатить другой картой или повторите попытку позже",
		"MERCHANT_FORWARD":"Перенаправление на другой терминал",
		"MERCHANT_RESTRICTION":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"MPI_CERTIFICATE_ERROR":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"MPI_RESPONSE_ERROR":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"ORDER_NOT_FOUND":"Заказ не найден",
		"ORDER_TIME_OUT":"Время на оплату истекло",
		"PAYMENT_ENGINE_ERROR":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"PROCESSING_ACCESS_DENIED":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"PROCESSING_ERROR":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"PROCESSING_FRAUD_ERROR":"Произошла ошибка. Попробуйте оплатить другой картой или повторите попытку позже",
		"PROCESSING_TIME_OUT":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"REFUSAL_BY_GATE":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"THREE_DS_ATTEMPTS_FAIL":"Ошибка прохождения 3DS",
		"THREE_DS_AUTH_ERROR":"Ошибка прохождения 3DS",
		"THREE_DS_ERROR":"Ошибка прохождения 3DS",
		"THREE_DS_FAIL":"Ошибка прохождения 3DS",
		"THREE_DS_NOT_ATTEMPTED":"Ошибка прохождения 3DS",
		"THREE_DS_NOTENROLLED":"Карта не вовлечена в систему 3DS",
		"THREE_DS_TIME_OUT":"Превышено время ожидания 3DS",
		"THREE_DS_USER_AUTH_FAIL":"Неверный код 3DS",
		"UNKNOWN_STATE":"Неизвестный статус заказа",
		"USER_NOT_FOUND":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"WRONG_AUTHORIZATION_CODE":"Неверный код авторизации",
		"WRONG_CARD_INFO":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"WRONG_CARDHOLDER":"Неверно указан держатель карты",
		"WRONG_CONFIRM_CODE":"Недопустимый код подтверждения",
		"WRONG_CVV":"Недопустимый CVV",
		"WRONG_EXPIRE_DATE":"Неверный срок действия карты",
		"WRONG_PAN":"Неверный номер карты",
		"WRONG_PARAMS":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"WRONG_PAY_INFO":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"WRONG_PHONE":"Неверный формат номера телефона",
		"WRONG_USER_PARAMS":"Неверные параметры пользователя",
		"OTHER_ERROR":"Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"AMOUNT_EXCEED_BALANCE":"Превышен лимит",
		"AUTHENTICATION_ERROR":"Произошла ошибка. Попробуйте оплатить другой картой или повторите попытку позже",
		"AUTHORIZATION_TIMEOUT":"Произошла ошибка. Попробуйте оплатить другой картой или повторите попытку позже",
		"LIMIT_EXCHAUST":"Произошла ошибка. Попробуйте оплатить другой картой или повторите попытку позже",
		"WRONG_CARD_PAN":"Неверный номер карты",
		"BUSINESS_CARD_REQUIRED":"Карта не поддерживается. Попробуйте оплатить другой картой",
		"BANK_IS_NOT_ALLOWED": "Карта не поддерживается. Попробуйте оплатить другой картой",
		"MP_WRONG_OTP": "Введен неверный проверочный код",
		"CODE_CHECK_FAILED": "Ошибка проверки второго фактора",
		"AMOUNT_LIMIT_EXCEEDED": "Превышен лимит",
		"INVALID_AMOUNT": "Некорректная сумма платежа",
		"INVALID_COUNTRY": "Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"INVALID_CURRENCY": "Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"INVALID_VERSION": "Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"MERCHANT_NOT_FOUND": "Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"GATEWAY_NOT_FOUND": "Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"CARD_NETWORK_NOT_SUPPORTED": "Карта не поддерживается. Попробуйте оплатить другой картой",
		"MERCHANT_DOMAIN_ERROR": "Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"INSECURE_MERCHANT_DOMAIN": "Произошла ошибка. Обратитесь в службу поддержки или повторите попытку позже",
		"WAITING_TIME_OVER": "Время ожидания истекло"
  }
};

var answers = {
	"RU":{
		"PAY_SUCCESS_TITLE":"Оплата прошла успешно!",
		"PAY_ERROR_TITLE":"Оплата не прошла!",
		"REDIRECT_TEXT":"Через несколько секунд вы&nbsp;будете перемещены на&nbsp;страницу магазина или&nbsp;нажмите <a href=''>сюда</a> чтобы перейти без&nbsp;ожидания",
		"ADD_SUCCESS_TITLE":"Карта успешно сохранена!",
		"ADD_ERROR_TITLE":"Карта не сохранена!"
	},
	"EN":{
		"PAY_SUCCESS_TITLE":"The payment is successful!",
		"PAY_ERROR_TITLE":"The payment is unsuccessful!",
		"REDIRECT_TEXT":"Please wait a few seconds OR press <a href=''>here</a>",
		"ADD_SUCCESS_TITLE":"This card is successfully added to your  account!",
		"ADD_ERROR_TITLE":"Sorry, this card was not added to your  account!"
	},
	"UA":{
		"PAY_SUCCESS_TITLE":"Оплата прошла успешно!",
		"PAY_ERROR_TITLE":"Оплата не прошла!",
		"REDIRECT_TEXT":"Через несколько секунд вы&nbsp;будете перемещены на&nbsp;страницу магазина или&nbsp;нажмите <a href=''>сюда</a> чтобы перейти без&nbsp;ожидания",
		"ADD_SUCCESS_TITLE":"Карта успешно сохранена!",
		"ADD_ERROR_TITLE":"Карта не сохранена!"
	}
};

var templateText = {
	"RU":{
		"ProviderDescription":"Процессинговый центр",
		"MPPhoneFootnote":"Введите ваш телефон, чтобы использовать ранее сохраненную карту или сохранить новую",
		"MPOtpFootnote":"Введите код, отправленный в SMS, или укажите актуальный номер телефона. Подтвержденный номер телефона даст возможность сохранять карты или использовать ранее сохраненные карты",
		"SendOnceAgain":"Отправить ещё раз",
		"ChoosePaymentMethod":"Выберите метод оплаты",
		"Card":"Карта",
		"MobileCommerce":"Мобильная коммерция",
		"TerminalPay": "Терминалы оплаты",
		"SMSForConfirmation":"На указанный номер мобильного телефона выслано смс для подтверждения",
		"LinkedCards":"Сохраненные карты",
		"RemoveCard":"Удалить карту",
		"BankCardDetails":"Детали банковской карты",
		"CardNumber":"Номер карты",
		"CardExpiryDate":"Срок действия карты",
		"VerificationCode":"Проверочный код",
		"Cardholder":"Имя и Фамилия на карте",
		"RememberCard":"Сохранить карту",
		"MPAddCardFootnote":"Сохраните карту, чтобы больше не вводить номер и срок действия карты вручную. Карты сохраняются в связке с номером вашего телефона. Используйте сохраненную карту везде, где доступен Masterpass от Mastercard",
		"Pay":"Оплатить",
		"PayWith":"Оплатить с",
		"PayWithCard":"Оплатить картой",
		"Add": "Сохранить",
		"EmailCaption":"Получить чек",
		"PhoneCaption":"Ваш номер телефона",
		"MTS":"МТС",
		"Beeline":"Билайн",
		"Megafon":"Мегафон",
		"Tele2":"Теле2",
		"Yota":"Yota",
		"MTSTMobilStore":"Салоны связи МТС",
		"QIWITerminals":"Терминалы QIWI",
		"SetCardName":"Задайте имя карты",
		"Change":"Изменить",
		"Cancellation":"Отмена",
		"RemoveCardQuestion":"Удалить карту?",
		"DeleteAlert":"Вы действительно хотите удалить карту?",
		"ErrorAlert":"Произошла ошибка",
		"MPDeleteCardFootnote":"Карта и ее настройки автооплаты будут удалены и станут недоступны во всех сервисах, подключенных к Masterpass.",
		"Remove":"Удалить",
		"BuyByInstallments":"Купить в рассрочку",
		"PaymentBySavedCard":"Оплата сохраненной картой",
		"MPConditions":"Нажимая на кнопку «Оплатить», вы соглашаетесь с <a href='https://wallet.masterpass.ru/Terms.html' target='_blank'>условиями использования сервиса Masterpass</a>",
		"PaytureOffer":"Нажимая на кнопку «Оплатить», вы соглашаетесь с <a href='https://payture.com/termsofuse' target='_blank'>условиями использования сервиса</a>",
		"PaytureOfferAdd":"Нажимая на кнопку «Сохранить», вы соглашаетесь с <a href='https://payture.com/termsofuse' target='_blank'>условиями использования сервиса</a>",
		"PaytureFootnote":"Оплата будет произведена с помощью процессингового центра Payture",
		"ReturnDescription":"<br>Через несколько секунд вы&nbsp;будете перемещены на&nbsp;страницу магазина или&nbsp;нажмите <a href=''>сюда</a> чтобы перейти без ожидания",
		"PaymentInProcessing":"Платеж в обработке...",
		"NewCardName":"Новое имя карты",
		"Password":"Пароль",
		"MMYY":"MM/ГГ",
		"M":"М",
		"Y":"Г",
		"NewCard":"Новая карта",
		"Purchase":"Покупка",
		"OrderNumber": "Заказ №",
		"OnTheSite": " на сайте ",
		"Rub":"₽",
		"MPCardListLink":"Список карт",
		"RETURN_TITLE_SUCCESS":"Payture",
		"RETURN_TITLE_ERROR":"Payture",
		"Cancel": "Отмена",
		"PayWithHalva": "Оплата счетом ХАЛВА",
		"SMSDelay": "Повторная отправка СМС через ",
		"PaymentTypeSBPCaption": "Оплатить через СБП",
		"PaymentTypeSberCaption": "Оплатить через SberPay",
		"PaymentTypeTinkoffCaption": "Оплатить через Tinkoff Pay",
		"SberPayPhoneFieldCaption": "Номер телефона, привязанный к СберБанк Онлайн",
		"SberPaySubmitButton": "Получить пуш или СМС",
		"ReturnShop": "Вернуться в магазин",
		"LifeTimerCaption": "Осталось для оплаты",
		"PluralDays": ['день', 'дня', 'дней']
	},
	"EN":{
		"ProviderDescription":"Payment gateway",//"Processing Center",
		"MPPhoneFootnote":"To use a previously saved card or save a new one please enters your phone number",
		"MPOtpFootnote":"Enter the SMS code or indicate the current phone number. A confirmed phone number will allow you to save cards or use previously saved cards",
		"SendOnceAgain":"Send once again",
		"ChoosePaymentMethod":"Choose a payment method",
		"Card":"Card",
		"MobileCommerce":"Mobile commerce",
		"TerminalPay": "Payment terminals",
		"SMSForConfirmation":"SMS for confirmation was sent to the specified mobile phone number",
		"LinkedCards":"The linked cards",
		"RemoveCard":"Remove the card",
		"BankCardDetails":"Bank card details",
		"CardNumber":"Card number",
		"CardExpiryDate":"Card expiry date",
		"VerificationCode":"Verification code",
		"Cardholder":"Cardholder name",
		"RememberCard":"Remember the card",
		"MPAddCardFootnote":"Save the card so you no longer should enter the card number and expiration date manually. Cards are stored in conjunction with your phone number. Use your saved card wherever Mastercard by Mastercard is available.",
		"Pay":"Pay",
		"PayWith": "Pay with",
		"PayWithCard":"Pay by card",
		"Add": "Add",
		"EmailCaption":"Your email (we will send the check)",
		"PhoneCaption":"Your phone number",
		"MTS":"MTS",
		"Beeline":"Beeline",
		"Megafon":"Megafon",
		"Tele2":"Tele2",
		"Yota":"Yota",
		"MTSTMobilStore":"MTS T-Mobile store",
		"QIWITerminals":"QIWI terminals",
		"SetCardName":"Set a card name",
		"Change":"Change",
		"Cancellation":"Cancel",
		"RemoveCardQuestion":"Should we remove the card?",
		"DeleteAlert":"Should we remove the card?",
		"ErrorAlert":"An error occurred",
		"MPDeleteCardFootnote":"The card and its auto payment settings will be deleted and will become unavailable in all services connected to Masterpass.",
		"Remove":"Remove",
		"BuyByInstallments":"Buy by installments",
		"PaymentBySavedCard":"Payment by saved card",
		"MPConditions":"By clicking on the «Pay» button, you agree to the <a href='https://wallet.masterpass.ru/Terms.html' target='_blank'>Masterpass service terms of use</a>",
		"PaytureOffer":'I accept&nbsp;<a target="_blank" href="https://payture.com/en/privacy"  style="font-size:10px;text-decoration:underline;">Privacy Policy</a> and&nbsp;<a target="_blank" href="https://payture.com/en/agreement"  style="font-size:10px;text-decoration:underline;">Consent to process personal data</a>',
		"PaytureOfferAdd":'I accept&nbsp;<a target="_blank" href="https://payture.com/en/privacy"  style="font-size:10px;text-decoration:underline;">Privacy Policy</a> and&nbsp;<a target="_blank" href="https://payture.com/en/agreement"  style="font-size:10px;text-decoration:underline;">Consent to process personal data</a>',
		"PaytureFootnote":"Payment will be made through the Payture payment gateway",
		"ReturnDescription":"<br>You will be redirected to the merchant page in a few seconds or click <a href=''>here</a>",
		"PaymentInProcessing":"Payment in processing...",
		"NewCardName":"New card name",
		"Password":"Password",
		"MMYY":"MM/YY",
		"M":"M",
		"Y":"Y",
		"NewCard":"New card",
		"Purchase":"Purchase",
		"OrderNumber": "Order №",
		"OnTheSite": " on the website ",
		"Rub":"₽",
		"MPCardListLink":"List of cards",
		"RETURN_TITLE_SUCCESS":"Payture",
		"RETURN_TITLE_ERROR":"Payture",
		"Cancel": "Cancel",
		"PayWithHalva": "Pay with HALVA",
		"SMSDelay": "Re-sending SMS in ",
		"PaymentTypeSBPCaption": "Pay with SBP",
		"PaymentTypeSberCaption": "Pay with SberPay",
		"PaymentTypeTinkoffCaption": "Pay with Tinkoff Pay",
		"SberPayPhoneFieldCaption": "Phone number",
		"SberPaySubmitButton": "Recieve Push or SMS",
		"ReturnShop": "Go back to the shop",
		"LifeTimerCaption": "Time left for payment",
		"PluralDays": ['days', 'days', 'days']
	},
	"UA":{
		"ProviderDescription":"Процессинговый центр",
		"MPPhoneFootnote":"Введите ваш телефон, чтобы использовать ранее сохраненную карту или сохранить новую",
		"MPOtpFootnote":"Введите код, отправленный в SMS, или укажите актуальный номер телефона. Подтвержденный номер телефона даст возможность сохранять карты или использовать ранее сохраненные карты",
		"SendOnceAgain":"Отправить ещё раз",
		"ChoosePaymentMethod":"Выберите метод оплаты",
		"Card":"Карта",
		"MobileCommerce":"Мобильная коммерция",
		"TerminalPay": "Терминалы оплаты",
		"SMSForConfirmation":"На указанный номер мобильного телефона выслано смс для подтверждения",
		"LinkedCards":"Привязанные карты",
		"RemoveCard":"Удалить карту",
		"BankCardDetails":"Детали банковской карты",
		"CardNumber":"Номер карты",
		"CardExpiryDate":"Срок действия карты",
		"VerificationCode":"Проверочный код",
		"Cardholder":"Имя и Фамилия на карте",
		"RememberCard":"Сохранить карту",
		"MPAddCardFootnote":"Сохраните карту, чтобы больше не вводить номер и срок действия карты вручную. Карты сохраняются в связке с номером вашего телефона. Используйте сохраненную карту везде, где доступен Masterpass от Mastercard",
		"Pay":"Заплатить",
		"PayWith": "Оплатить с",
		"PayWithCard":"Оплатить картой",
		"Add": "Сохранить",
		"EmailCaption":"Получить квитанцию",
		"PhoneCaption":"Ваш номер телефона",
		"MTS":"МТС",
		"Beeline":"Билайн",
		"Megafon":"Мегафон",
		"Tele2":"Теле2",
		"Yota":"Yota",
		"MTSTMobilStore":"Салоны связи МТС",
		"QIWITerminals":"Терминалы QIWI",
		"SetCardName":"Задайте имя карты",
		"Change":"Изменить",
		"Cancellation":"Отмена",
		"RemoveCardQuestion":"Удалить карту?",
		"DeleteAlert":"Вы действительно хотите удалить карту?",
		"ErrorAlert":"Произошла ошибка",
		"MPDeleteCardFootnote":"Карта и ее настройки автооплаты будут удалены и станут недоступны во всех сервисах, подключенных к Masterpass.",
		"Remove":"Удалить",
		"BuyByInstallments":"Купить в рассрочку",
		"PaymentBySavedCard":"Оплата сохраненной картой",
		"MPConditions":"Нажимая на кнопку «Оплатить», вы соглашаетесь с <a href='https://wallet.masterpass.ru/Terms.html' target='_blank'>условиями использования сервиса Masterpass</a>",
		"PaytureOffer":"Нажимая на кнопку «Оплатить», вы соглашаетесь с <a href='https://payture.com/termsofuse' target='_blank'>условиями использования сервиса</a>",
		"PaytureOfferAdd":"Нажимая на кнопку «Сохранить», вы соглашаетесь с <a href='https://payture.com/termsofuse' target='_blank'>условиями использования сервиса</a>",
		"PaytureFootnote":"Оплата будет произведена с помощью платёжного шлюза Payture ― №1 сертифицированный провайдер платежей согласно стандартам безопасности платёжных систем Visa и Mastercard.",
		"ReturnDescription":"<br>Через несколько секунд вы&nbsp;будете перемещены на&nbsp;страницу магазина или&nbsp;нажмите <a href=''>сюда</a> чтобы перейти без ожидания",
		"PaymentInProcessing":"Платеж в обработке...",
		"NewCardName":"Новое имя карты",
		"Password":"Пароль",
		"MMYY":"MM/ГГ",
		"M":"М",
		"Y":"Г",
		"NewCard":"Новая карта",
		"Purchase":"Покупка",
		"OrderNumber": "Заказ №",
		"OnTheSite": " на сайте ",
		"Rub":"₽",
		"MPCardListLink":"Список карт",
		"RETURN_TITLE_SUCCESS":"Payture",
		"RETURN_TITLE_ERROR":"Payture",
		"Cancel": "Отмена",
		"PayWithHalva": "Оплата счетом ХАЛВА",
		"SMSDelay": "Повторна відправка СМС через ",
		"PaymentTypeSBPCaption": "Оплатить через СБП",
		"PaymentTypeSberCaption": "Оплатить через SberPay",
		"PaymentTypeTinkoffCaption": "Оплатить через Tinkoff Pay",
		"SberPayPhoneFieldCaption": "Номер телефона, привязанный к СберБанк Онлайн",
		"SberPaySubmitButton": "Получить пуш или СМС",
		"ReturnShop": "Вернуться в магазин",
		"LifeTimerCaption": "Осталось для оплаты",
		"PluralDays": ['день', 'дня', 'дней']
	}
};

var templateErrors = {
	"RU":{
		"PanErrors"       : "В номере карты допущены ошибки",
		"EmptyPan"	      : "Введите от 16 до 19 знаков номера карты",
		"EmptyDate"	      : "Укажите срок действия карты",
		"EmptyMonth"	  : "Укажите месяц, до которого действительна карта",
		"EmptyYear"	      : "Укажите год, до которого действительна карта",
		"WrongDate"	      : "Неверно указана дата",
		"WrongEmail"      : "Неверно указан E-mail",
		"WrongPhone"      : "Неверно указан телефон",
		"WrongFIO"        : "Неверно заполнено ФИО",
		"EmptyCardHolder" : "Укажите имя держателя карты",
		"EmptyCVV"	      : "Укажите проверочный код"
	},
	"EN":{
		"PanErrors"       : "Incorrect card number",
		"EmptyPan"	      : "Input from 16 to 19 digits of the card number",
		"EmptyDate"	      : "Select card expiration date",
		"EmptyMonth"	    : "Select card expiration month",
		"EmptyYear"	      : "Select card expiration year",
		"WrongDate"	      : "The date is wrong",
		"WrongEmail"      : "The E-mail is wrong",
		"WrongPhone"      : "The Phone is wrong",
		"WrongFIO"        : "The FIO is wrong",
		"EmptyCardHolder" : "Select cardholder name",
		"EmptyCVV"	      : "Select CVV"
	},
	"UA":{
		"PanErrors"       : "В номере карты допущены ошибки",
		"EmptyPan"	      : "Введите от 16 до 19 знаков номера карты",
		"EmptyDate"	      : "Укажите срок действия карты",
		"EmptyMonth"	    : "Укажите месяц, до которого действительна карта",
		"EmptyYear"	      : "Укажите год, до которого действительна карта",
		"WrongDate"	      : "Неверно указана дата",
		"WrongEmail"      : "Неверно указан E-mail",
		"WrongPhone"      : "Неверно указан телефон",
		"WrongFIO"        : "Неверно заполнено ФИО",
		"EmptyCardHolder" : "Укажите имя держателя карты",
		"EmptyCVV"	      : "Укажите проверочный код"
	}
};
