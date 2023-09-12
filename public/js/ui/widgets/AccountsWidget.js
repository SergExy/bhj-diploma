/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (!element) {
      return false;
    }
    this.element = element;
    this.registerEvents();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const createEL = document.querySelector('.create-account');

    createEL.onclick = (e) => {
      e.preventDefault();
      App.getModal('createAccount').open();
    }
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if (User.current()) {
      const data = User.current();
      const callback = (err, res) => {
        res = JSON.parse(res)
        if (res && res.data) {

          if (Array.isArray(res.data)) {
            this.clear();
            this.renderItem(res.data);
          }
          return true;
        }
        throw new Error(res.error);
      }

      Account.list(data, callback);
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accounts = document.querySelectorAll('.account');
    accounts.forEach(el => el.remove());
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    const prevAct = document.querySelector('.active.account');
    if (prevAct) prevAct.classList.remove('active');
    element.classList.toggle('active');
    const id = element.dataset.accountId;
    App.showPage('transactions', { account_id: id });
    App.getPage('transactions').registerEvents();
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    const li = document.createElement('li');
    li.classList.add('account');
    li.dataset.accountId = item.id;
    const aBtn = document.createElement('a');
    aBtn.innerHTML = `<span>${item.name}</span> / <span>${item.sum} ₽</span>`;
    aBtn.href = '#';
    aBtn.onclick = (e) => {
      e.preventDefault();
      this.onSelectAccount(li);
    }

    li.appendChild(aBtn);
    return li;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data) {
    const accPanel = document.querySelector('.accounts-panel');
    data.forEach(item => {
      const element = this.getAccountHTML(item);
      accPanel.appendChild(element);
    })
  }
}
