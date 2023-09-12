/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    const callback = (err, res) => {
      if (res && res.user) {
        User.setCurrent(res.user);
        App.setState('user-logged');
        this.element.reset();
        App.getModal('register').close();
        return true;
      }
      throw new Error(res.error);
    }
    User.register(data, callback);
  }
}