/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (!element) throw new Error('Элемент отсутсвует');
    this.element = element;
    this.lastOptions = {};
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const removeAccount = document.querySelector('.remove-account');
    const removeTransaction = document.querySelectorAll('.transaction__remove');

    removeAccount.onclick = (e) => {
      e.preventDefault();
      if (!this.lastOptions.account_id) return false;
      this.removeAccount();
    }

    removeTransaction.forEach(el => {
      el.onclick = (e) => {
        e.preventDefault();
        const id = el.dataset.id;
        removeTransaction(id);
      }
    })
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    const isRemove = confirm('Удалить счет?');
    if (isRemove) {
      const data = { id: this.lastOptions.account_id };
      const callback = (err, res) => {
        if (res && res.success) {
          this.lastOptions = {};
          this.clear();
          App.update();
          return true;
        }
        throw new Error('Ошибка удаления');
      }
      Account.remove(data, callback);
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    const isRemove = confirm('Удалить транзакцию?');
    if (!isRemove) {
      return false;
    }

    const data = { id: id };
    const callback = (err, res) => {
      if (res && res.success) {
        App.update();
        return true;
      }
      throw new Error('Не удалось удалить транзакцию');
    };
    Transaction.remove(data, callback);
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    this.lastOptions = options;
    const id = options?.account_id;
    if (!id) {
      return false;
    }

    const callbackName = (err, res) => {
      res = JSON.parse(res);
      if (res && res.success) {
        const { data } = res;
        this.renderTitle(data.name);
        return true;
      }
      throw new Error(res.error);
    }
    Account.get(id, callbackName);

    const callbackList = (err, res) => {
      res = JSON.parse(res);
      if (res && res.data) {
        const { data } = res;
        if (!data.length) {
          this.renderTransactions([]);
          throw new Error('Транзакции отсутствуют')
        };
        this.renderTransactions(data);
        return true;
      }
      throw new Error(res.error);
    }
    Transaction.list({ account_id: id }, callbackList);
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.lastOptions = {};
    this.renderTitle('Название счёта');
    this.renderTransactions([]);
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    const titleEl = document.querySelector('.content-header .content-title');
    titleEl.innerText = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    date = new Date(date);

    const getFullMonth = (M) => {
      switch (M) {
        case 1:
          return 'января'
        case 2:
          return 'февраля'
        case 3:
          return 'марта'
        case 4:
          return 'апреля'
        case 5:
          return 'мая'
        case 6:
          return 'июня'
        case 7:
          return 'июля'
        case 8:
          return 'августа'
        case 9:
          return 'сентября'
        case 10:
          return 'октября'
        case 11:
          return 'ноября'
        case 12:
          return 'декабря'

        default:
          break;
      }
    }

    const dd = date.getDate();
    const MM = date.getMonth();
    const YY = date.getFullYear();

    const HH = date.getHours();
    const mm = date.getMinutes();

    return `${dd} ${getFullMonth(MM)} ${YY} г. в ${HH.toString().padStart(2, '0')}:${mm}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    const createEl = options => {
      const { tagName, className, id, text, data } = options;
      const element = document.createElement(tagName);
      if (Array.isArray(className)) {
        className.forEach(classItem => {
          element.classList.add(classItem);
        })
      } else {
        element.classList.add(className);
      }
      if (id) {
        element.id = id;
      }
      if (text) {
        element.innerHTML = text;
      }
      if (data) {
        for (const key in data) {
          element.dataset[key] = data[key];
        }
      }
      return element;
    };

    const content = document.querySelector('.content-wrapper .content');

    const { account_id, created_at, id, name, sum, type, user_id } = item;

    const transEl = createEl({
      tagName: 'div',
      className: ['transaction', `transaction_${type.toLowerCase()}`, 'row'],
    });

    const detailsEl = createEl({
      tagName: 'div',
      className: ['col-md-7', 'transaction__details'],
    });
    const iconEl = createEl({
      tagName: 'div',
      className: 'transaction__icon',
    });
    const iconSpanEl = createEl({
      tagName: 'span',
      className: ['fa', 'fa-money', 'fa-2x'],
    });
    iconEl.appendChild(iconSpanEl);
    detailsEl.appendChild(iconEl);

    const infoEl = createEl({
      tagName: 'div',
      className: 'transaction__info',
    });
    const infoTitle = createEl({
      tagName: 'h4',
      className: 'transaction__title',
      text: name
    });
    const date = this.formatDate(created_at);
    const infoDateEl = createEl({
      tagName: 'div',
      className: 'transaction__date',
      text: date,
    });
    infoEl.appendChild(infoTitle);
    infoEl.appendChild(infoDateEl);
    detailsEl.appendChild(infoEl);

    const sumWrapEl = createEl({
      tagName: 'div',
      className: 'col-md-3'
    });
    const sumEl = createEl({
      tagName: 'div',
      className: 'transaction__summ',
      text: sum
    });
    const sumCurrencyEl = createEl({
      tagName: 'span',
      className: 'currency',
      text: '₽'
    });
    sumEl.appendChild(sumCurrencyEl);
    sumWrapEl.appendChild(sumEl);

    const controlsEl = createEl({
      tagName: 'div',
      className: ['transaction__controls', 'col-md-2']
    });
    const removeEl = createEl({
      tagName: 'button',
      className: ['btn', 'btn-danger', 'transaction__remove'],
      data: { id: id },
    });
    const removeIconEl = createEl({
      tagName: 'i',
      className: ['fa', 'fa-trash'],
    });

    removeEl.onclick = (e) => {
      e.preventDefault();
      this.removeTransaction(id);
    }
    removeEl.appendChild(removeIconEl);
    controlsEl.appendChild(removeEl);

    transEl.appendChild(detailsEl);
    transEl.appendChild(sumWrapEl);
    transEl.appendChild(controlsEl);

    content.appendChild(transEl);
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    const content = document.querySelector('.content-wrapper .content');
    content.innerHTML = '';
    data.reverse().forEach(item => {
      this.getTransactionHTML(item);
    })
  }
}