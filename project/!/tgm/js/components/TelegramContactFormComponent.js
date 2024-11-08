/*******************************************************************/
/* Компонент отображения контактных данных клиента в Telegram	   */
/* Sinyagin Dmitry rel.at 27.07.2024                               */
/*******************************************************************/

class TelegramContactFormComponent extends HTMLElement {
  constructor() {
    super();
    this.config = {
      feature: false,
      console: true
    };
    this.elementClassName = 'TelegramContactFormComponent';
    const _METHOD_ = `constructor`;
    this.logger(_METHOD_);
    return this;
  }

  setUser(user=null){
    this.user = user;
    this.contactData = {
      firstName:    (!this.user ? 'Не установлено' : user.getFirstName()), // Замените на реальные данные
      lastName:     (!this.user ? 'Не установлено' : user.getLastName()), // Замените на реальные данные
      telegramNick: (!this.user ? 'Не установлено' : user.getUserName()) // Замените на реальные данные
    };
    return this;
  }

  logger(method, ...args) {
    if (this.config.console) {
      console.log(`${this.elementClassName}.${!method ? '' : method}`, ...args);
    }
    return this;
  }

  /* Включить фичу */
  feature(flag = false) {
    this.config.feature = flag;
    // Добавьте логику для обработки флага
    return this;
  }

  /* Установить заголовок */
 setTitle(title= null) {
    this.config.title = title;
    return this;
  }


 renderByClass(elementClassName) {
   const _METHOD_ = `renderByClass`;
   if(this.config.feature) {
    this.logger(_METHOD_);
 // Создаем контейнер для контактной информации
    const container = document.createElement('div');
    container.className = 'contact-info';

    // Добавляем элементы с контактной информацией
    container.innerHTML = (this.config.title
	   ? `
	   <div class="row">
                <div class="col w-100"><h2>${this.config.title}</h2></div> 
           </div>`
	  : ``) +(this.contactData.firstName 
			? `<div class="card w-100"><div class="row input-group"><div class="col">Имя: ${this.contactData.firstName}</div></div>` : ``)
		+(this.contactData.lastName 
			? `<div class="row input-group"><div class="col">Фамилия: ${this.contactData.lastName}</div></div>` : `` )
		+(this.contactData.telegramNick 
			? `<div class="row input-group"><div class="col">Telegram-контакт: <a href="https://t.me/${this.contactData.telegramNick}">@${this.contactData.telegramNick}</a></div></div></div>` : `` )
		
    // Добавляем контейнер в компонент
    this.appendChild(container);
   }
   return this;
 }



}