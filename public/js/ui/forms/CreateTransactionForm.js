/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const data = User.current();
    const callback = (err, res) => {
      res = JSON.parse(res)
      if (res && res.data) {

        if (res.data.length) {
          const select = document.querySelector(`#${this.element.id} .accounts-select`);
          select.innerHTML = '';
          res.data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.innerText = item.name;
            
            select.appendChild(option);
          })
        }
        return true
      }
      throw new Error(res.error);
    }

    Account.list(data, callback);
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    const modalId = this.element.closest('.modal').dataset.modalId;
    const callback = (err, res) => {
      if (res.success) {
        App.update();
        this.element.reset();
        App.getModal(modalId).close();
        return true;
      }
      throw new Error(res.error);
    }
    Transaction.create(data, callback);
  }
}