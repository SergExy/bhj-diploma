/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    const callback = (err, res) => {
      if (res && res.account) {
        this.element.reset();
        App.update();
        App.getModal('createAccount').close();
        return true;
      }
      throw new Error(res.error);
    }
    Account.create(data, callback);
  }
}