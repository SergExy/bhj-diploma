/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    localStorage.user = JSON.stringify(user);
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    localStorage.removeItem('user');
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    const { user } = localStorage;
    return JSON.parse(user);
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(callback) {
    callback();
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login(data, callback) {
    createRequest({
      url: `http://localhost:8000/user/login`,
      method: 'POST',
      responseType: 'json',
      data,
      callback: (err, res) => {
        if (res && res.user) {
          this.setCurrent(res.user);
          App.setState('user-logged');
          App.getModal('login').close();
          return true;
        }
        console.log(res.error);
      }
    });
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data, callback) {
    // User.setCurrent(data);
    // callback();
    createRequest({
      url: `http://localhost:8000/user/register`,
      method: 'POST',
      responseType: 'json',
      data,
      callback: (err, res) => {
        if (res && res.user) {
          this.setCurrent(res.user);
          App.setState('user-logged');
          App.getModal('register').close();
          return true;
        }
        console.log(res.error);
      }
    });
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout(callback) {
    this.unsetCurrent()
    App.setState('init');
  }
}
