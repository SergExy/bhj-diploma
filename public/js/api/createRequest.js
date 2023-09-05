/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const { url, data, method, responseType, callback } = options;
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if (xhr.readyState === xhr.DONE) {
            callback(null, xhr.response);
        }
    }

    try {
        xhr.open(method, url);

        xhr.responseType = responseType;
        if (responseType === 'json') {
            xhr.setRequestHeader('Content-Type', 'application/json');
        }
        
        xhr.send(JSON.stringify(data));
    } catch (err) {
        callback(err);
    }

};
