class CommonFunctions {
   constructor() {
   console.log(`CommonFunctions loading...`);
   return this;
   }


/**
 * Сохраняете telegramWebAppObject в localStorage.
 * @param {object}  - объект window.Telegram.WebApp Телеграмма
 */
 saveTelegramWebAppObject() {
    try {
     let telegramWebAppObject = window.Telegram.WebApp; //нужно получить объект window.Telegram.WebApp Телеграмма
     this.removeTelegramWebAppObject();
     if(telegramWebAppObject?.initDataUnsafe?.user?.id )	
       localStorage.setItem('telegramWebAppObject', (telegramWebAppObject?.initDataUnsafe ?  JSON.stringify(telegramWebAppObject) : NULL));
    } catch (error) {
        console.error('Ошибка при сохранении токена в localStorage:', error);
    }
 }

/**
 * Получает telegramWebAppObject из localStorage
 * @param {object}  - объект window.Telegram.WebApp Телеграмма
 */
 getTelegramWebAppObject() {
    try {
        const telegramWebAppObject = localStorage.getItem('telegramWebAppObject');
        if (!telegramWebAppObject) return null;
        return JSON.parse(telegramWebAppObject);
    } catch (error) {
        console.error('Error retrieving access token:', error);
        return null;
    }
}

/**
 * Получает telegramWebAppObject из localStorage
 * @param {object}  - объект window.Telegram.WebApp Телеграмма
 */
 removeTelegramWebAppObject() {
    try {
        localStorage.removeItem('telegramWebAppObject');
    } catch (error) {
        console.error('Ошибка при удалении Telegram.WebApp из localStorage:', error);
    }
 }


/**
 * Сохраняет telegramToken в localStorage.
 * @param {string} token - Токен доступа (accessToken).
 */
 saveTelegramAccessToken() {
    try {
        let webRequest = new WebRequest();
        let api = new WebAPI();
//	this.removeAccessToken();
        let request = webRequest.get(api.getTelegramMeMethod(), {}, true );
        console.log(request);
        const token = (!request.telegramToken) ?  null : request.telegramToken;
        if(token)
          localStorage.setItem('telegramToken', token);
    } catch (error) {
        console.error('Ошибка при сохранении токена в localStorage:', error);
    }
 }



/**
 * Сохраняет accessToken в localStorage.
 * @param {string} token - Токен доступа (accessToken).
 */
 saveAccessToken() {
    try {
        let webRequest = new WebRequest();
        let api = new WebAPI();
	this.removeAccessToken();
        let request = webRequest.get(api.getMeMethod(), {}, true );
        console.log(request);
        const token = (!request.accessToken) ?  null : request.accessToken;
        if(token)
          localStorage.setItem('accessToken', token);
    } catch (error) {
        console.error('Ошибка при сохранении токена в localStorage:', error);
    }
 }

/**
 * Удаляет accessToken из localStorage.
 */
  removeAccessToken() {
    try {
        localStorage.removeItem('accessToken');
    } catch (error) {
        console.error('Ошибка при удалении токена из localStorage:', error);
    }
  }

/**
 * Получает accessToken из localStorage и проверяет его срок действия.
 * @returns {string | null} - Токен доступа (accessToken) или null, если токен отсутствует или истёк.
 */

 getAccessToken() {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) return null;

        // Проверяем срок действия токена
        if (this.checkTokenExpiration(token)) {
            return token;
        }
        console.warn('Access token expired, removing...');
        if (typeof this.removeAccessToken === 'function') {
            this.removeAccessToken(); // Удаляем истёкший токен
        } else {
            localStorage.removeItem('accessToken'); // Альтернативное удаление
        }
        return null;
    } catch (error) {
        console.error('Error retrieving access token:', error);
        return null;
    }
}

  

/**
 * Проверяет срок действия JWT токена.
 * @param {string} token - JWT токен.
 * @returns {boolean} - true, если токен действителен, false, если истёк.
 */
 checkTokenExpiration(token) {
    try {
        if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
            throw new Error(`Invalid token: ${token}`);
        }

        // Декодируем payload токена (вторая часть JWT)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Исправляем URL-safe base64
        const payload = JSON.parse(atob(base64));

        // Проверяем срок действия (exp - expiration time)
        if (typeof payload.exp === 'number') {
            const currentTime = Math.floor(Date.now() / 1000); // Текущее время в секундах
            return payload.exp > currentTime; // true, если токен не истёк
        } 
        
        throw new Error('Token does not contain "exp" field.');
    } catch (error) {
        console.error('Token expiration check error:', error.message);
        return false;
    }
}


 uuid() {
  var d = new Date().getTime();//Timestamp
  var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16;//random number between 0 and 16
      if(d > 0){//Use timestamp until depleted
          r = (d + r)%16 | 0;
          d = Math.floor(d/16);
      } else {//Use microseconds since page-load if supported
          r = (d2 + r)%16 | 0;
          d2 = Math.floor(d2/16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
 }


ORDER_STATUS = {
  NEW: { class: 'order_item_status_new', description: "Новый заказ" },
  RESERVED: { class: 'order_item_status_confirmed', description: "Зарезервирован" },
  PAID: { class: 'order_item_status_paid', description: "Заказ оплачен" },
  DELIVERY: { class: 'order_item_status_done', description: "Передан в доставку" },
  DONE: { class: 'order_item_status_done', description: "Заказ доставлен" },

  DECLINE: { class: 'order_item_status_done', description: "Заказа отменен" },
  COURIER_SEARCH: { class: 'order_item_status_confirmed', description: "Поиск курьера" },
}


}
