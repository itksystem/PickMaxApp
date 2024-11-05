  // Определяем компонент <mobile-navbar>
  class MobileNavbar extends HTMLElement {
    constructor() {
      super();
      // Создаём Shadow DOM
      const shadow = this.attachShadow({ mode: 'open' });

      // Создаём контейнер для навигации
      const nav = document.createElement('nav');
      nav.setAttribute('class', 'mobile-navbar');

      // Перемещаем все дочерние элементы внутрь навигации
      while (this.firstChild) {
        nav.appendChild(this.firstChild);
      }

      // Добавляем навигацию в Shadow DOM
      shadow.appendChild(nav);

      // Добавляем ссылку на CSS
      const linkElem = document.createElement('link');
      linkElem.setAttribute('rel', 'stylesheet');
      linkElem.setAttribute('href', '/main/css/mobile-navbar.css');
      shadow.appendChild(linkElem);
    }
  }

  // Определяем компонент <mobile-navbar-item>
  class MobileNavbarItem extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });

      // Создаём ссылку
      const link = document.createElement('a');
      link.setAttribute('href', this.getAttribute('url') || '#');
      link.setAttribute('class', 'mobile-navbar-item');

      // Добавляем иконку
      const icon = document.createElement('i');
      const iconClass = this.getAttribute('icon') || 'fa-circle';
      icon.setAttribute('class', `fa ${iconClass}`);
      link.appendChild(icon);

      // Добавляем метку
      const label = document.createElement('span');
      label.setAttribute('class', `hide-on-small`);
      label.textContent = this.getAttribute('label') || 'Item';
      link.appendChild(label);

      // Применяем активный класс, если установлен
      if (this.hasAttribute('active')) {
        link.classList.add('active');
      }

      // Добавляем ссылку в Shadow DOM
      shadow.appendChild(link);

      // Добавляем ссылку на CSS
      const linkElem = document.createElement('link');
      linkElem.setAttribute('rel', 'stylesheet');
      linkElem.setAttribute('href', '/main/css/mobile-navbar-item.css');
      shadow.appendChild(linkElem);

      const linkElemFont = document.createElement('link');
      linkElemFont.setAttribute('rel', 'stylesheet');
      linkElemFont.setAttribute('href', '/main/plugins/fontawesome-free/css/all.min.css');
      shadow.appendChild(linkElemFont);

    }

    // Наблюдаемые атрибуты для динамического обновления
    static get observedAttributes() {
      return ['label', 'icon', 'url', 'active'];
    }

    // Обработка изменений атрибутов
    attributeChangedCallback(name, oldValue, newValue) {
      const link = this.shadowRoot.querySelector('a');
      if (name === 'url') {
        link.setAttribute('href', newValue);
      }
      if (name === 'label') {
        const label = this.shadowRoot.querySelector('span');
        label.textContent = newValue;
      }
      if (name === 'icon') {
        const icon = this.shadowRoot.querySelector('i');
        icon.className = `fa ${newValue}`;
      }
      if (name === 'active') {
        if (this.hasAttribute('active')) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    }
  }


    // Скрипт для управления активным пунктом меню
    document.addEventListener('DOMContentLoaded', () => {
      const navbar = document.querySelector('mobile-navbar');

      navbar.addEventListener('click', (event) => {
        const item = event.target.closest('mobile-navbar-item');
        if (item) {
          // Удаляем атрибут 'active' у всех пунктов
          document.querySelectorAll('mobile-navbar-item').forEach(el => el.removeAttribute('active'));
          // Добавляем атрибут 'active' к кликнутому пункту
          item.setAttribute('active', '');
        }
      });
    });



  // Регистрируем компоненты
  customElements.define('mobile-navbar', MobileNavbar);
  customElements.define('mobile-navbar-item', MobileNavbarItem);
