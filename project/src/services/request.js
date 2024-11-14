class WebRequest {
  constructor() {    
    this.config = {}
    this.SYNC = true;
    this.ASYNC = false;
    this.tgInitData = (window.Telegram 
		? (window.Telegram.WebApp 
			? window.Telegram.WebApp.initData : '')
		: '');

    return this
  }


 delete(url = '', params = {}, sync = false) {
    const traceId = generateUUID();
    const dataToSend = typeof params === 'string' ? params : JSON.stringify(params);
                 
    const headers = {
        'Content-Type': 'application/json',
        'x-trace-id': traceId,
        'x-tg-init-data': this.tgInitData
    };

    const options = {
        method: 'DELETE',
        headers: headers,
        body: dataToSend
    };

    if (sync) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, false); // false для синхронного вызова
        for (const [key, value] of Object.entries(headers)) {
            xhr.setRequestHeader(key, value);
        }
        xhr.send(dataToSend);

        if (xhr.status === 401) {
            location.replace('/logon');
        } else if (xhr.status >= 200 && xhr.status < 300) {
            return Promise.resolve(xhr.responseText);
        } else {
            return Promise.reject(xhr.statusText);
        }
    } else {
        return fetch(url, options)
            .then(response => {
                if (response.status === 401) {
                    location.replace('/logon');
                }
                if (!response.ok) {
                    return response.text().then(text => Promise.reject(text));
                }
                return response.json();
            })
            .catch(error => Promise.reject(error));
    }
  }


 post(url = '', params = {}, sync = false) {
    const shopId = localStorage.getItem('shopId');
    const traceId = generateUUID();
    const dataToSend = typeof params === 'string' ? params : JSON.stringify(params);

    const headers = {
        'Content-Type': 'application/json',
        'x-trace-id': traceId,
        'x-tg-init-data': this.tgInitData
    };

    const options = {
        method: 'POST',
        headers: headers,
        body: dataToSend
    };

    if (sync) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, false); // false для синхронного вызова
        for (const [key, value] of Object.entries(headers)) {
            xhr.setRequestHeader(key, value);
        }
        xhr.send(dataToSend);

        if (xhr.status === 401) {
            location.replace('/logon');
        } else if (xhr.status >= 200 && xhr.status < 300) {
            return Promise.resolve(JSON.parse(xhr.responseText));
        } else {
            return Promise.reject({
                status: xhr.status,
                message: xhr.statusText || 'An error occurred'
            });
        }
    } else {
        return fetch(url, options)
            .then(response => {
                if (response.status === 401) {
                    location.replace('/logon');
                }
                if (!response.ok) {
                    return response.text().then(text => Promise.reject({
                        status: response.status,
                        message: text || 'An error occurred'
                    }));
                }
                return response.json();
            })
            .catch(error => Promise.reject({
                status: error.status || 'Unknown',
                message: error.message || error
            }));
    }
}

 get(url = '', params = {}, sync = false) {
    // Создаем строку параметров из объекта params
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    const shopId = localStorage.getItem('shopId');
    const traceId = generateUUID();
    const headers = {
                'Content-Type': 'application/json',
		'x-trace-id': traceId,
	        'x-tg-init-data': this.tgInitData
            };

  if (sync) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', fullUrl, false); // третий параметр 'false' делает запрос синхронным
    if (headers) {
      for (let [key, value] of Object.entries(headers)) {
        xhr.setRequestHeader(key, value);
      }
    }
    xhr.send(null);

    if (xhr.status === 200) {
      return JSON.parse(xhr.responseText);
    } else 
    if (xhr.status === 401) {
      location.replace('/logon');
    } else {
      console.error('Ошибка HTTP: ' + xhr.status);
      return null;
    }
  } else {
    let options = {
      method: 'GET'
    };
    options.headers = headers;
    return fetch(fullUrl, options)
      .then(response => {
        if (!response.ok) {
         if (response.status === 401) {
            location.replace('/logon');
          } else
          throw new Error('Ошибка HTTP: ' + response.status);
        }
        return response.json();
      })
      .catch(error => {
        console.error('Ошибка:', error);
        return null;
      });
  }
}


uploadFile(url, file, sync = false) {
    const shopId = localStorage.getItem('shopId');
    const traceId = generateUUID();
    const headers = {
		'x-trace-id': traceId,
	        'x-tg-init-data': this.tgInitData
            };

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, !sync); // Устанавливаем метод и режим (синхронный или асинхронный)
         if (headers) {
          for (let [key, value] of Object.entries(headers)) {
           xhr.setRequestHeader(key, value);
          }
        }


        // Обработка ответа
        xhr.onload = function() {
            if (xhr.status === 200) {
		xhr.then(xhr.responseText);
            } else {
               reject({
                    status: xhr.status,
                    message: xhr.statusText || 'Ошибка HTTP',
                    text: JSON.parse(xhr.responseText).error_message || ''
                }); // Ошибка с кодом и сообщением
            }
        };

        xhr.then = function(response) {
                resolve(JSON.parse(response)); // Успешный ответ
        }
        // Обработка ошибок
        xhr.onerror = function() {
	 reject({
                status: xhr.status || 'Network Error',
                message: 'Ошибка при отправке файла.',
                text: JSON.parse(xhr.responseText).error_message || ''
            });
        };

       // Отправляем запрос
        xhr.send(file);
    });
}



}
