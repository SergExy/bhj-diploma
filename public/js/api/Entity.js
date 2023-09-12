/**
 * Класс Entity - базовый для взаимодействия с сервером.
 * Имеет свойство URL, равно пустой строке.
 * */
class Entity {
  static url = '';
  /**
   * Запрашивает с сервера список данных.
   * Это могут быть счета или доходы/расходы
   * (в зависимости от того, что наследуется от Entity)
   * */
  static list(data, callback) {
    createRequest({
      url: `http://localhost:8000${this.url}${data?.account_id ? '?account_id=' + data.account_id : '/'}`,
      method: 'GET',
      callback: callback
    })
  }

  /**
   * Создаёт счёт или доход/расход с помощью запроса
   * на сервер. (в зависимости от того,
   * что наследуется от Entity)
   * */
  static create(data, callback) {
    createRequest({
      url: `http://localhost:8000${this.url}`,
      method: 'PUT',
      responseType: 'json',
      data,
      callback: callback
    })
  }

  /**
   * Удаляет информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static remove(data, callback) {
    createRequest({
      url: `http://localhost:8000${this.url}`,
      method: 'DELETE',
      responseType: 'json',
      data,
      callback: callback
    })
  }
}
