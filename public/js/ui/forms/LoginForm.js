/**
 * Класс LoginForm управляет формой
 * входа в портал
 * */
class LoginForm extends AsyncForm {
  /**
   * Производит авторизацию с помощью User.login
   * После успешной авторизации, сбрасывает форму,
   * устанавливает состояние App.setState( 'user-logged' ) и
   * закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    const callback = (err, res) => {
      if (res && res.user) {
        User.setCurrent(res.user);
        App.setState('user-logged');
        this.element.reset();
        App.getModal('login').close();
        return true;
      }
      throw new Error(res.error);
    }
    User.login(data, callback);
  }
}