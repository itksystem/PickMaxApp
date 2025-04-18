class DOMHelper {
  /**
   * Создает секцию dropdown с заголовком и содержимым
   * @param {string} title - Заголовок секции
   * @param {HTMLElement[]} children - Дочерние элементы
   * @returns {HTMLElement} Созданная секция
   */
  static createDropdownSection(title, children = []) {
    const section = this.createElement("dropdown-section", '', `<span slot="title">${title}</span>`);
    
    if (children.length === 0) {
      const noInfoContainer = this.createElement("div", "no-info-container");
      noInfoContainer.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      `;

      const warningIcon = this.createElement("span", "", "⚠️");
      warningIcon.style.fontSize = "18px";

      const noInfoText = this.createElement("p", "", "Нет информации");
      noInfoText.style.margin = "0";

      noInfoContainer.append(warningIcon, noInfoText);
      section.appendChild(noInfoContainer);
    } else {
      children.forEach(child => section.appendChild(child));
    }
    
    return section;
  }

  /**
   * Находит элемент по селектору
   * @param {string} selector - CSS селектор
   * @returns {HTMLElement|null} Найденный элемент или null
   */
  static getElement(selector) {
    return selector ? document.querySelector(selector) : null;
  }

  /**
   * Создает HTML элемент
   * @param {string} tag - Тег элемента
   * @param {string} className - CSS классы
   * @param {string} innerHTML - Внутренний HTML
   * @returns {HTMLElement} Созданный элемент
   */
  static createElement(tag, className = '', innerHTML = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
  }

  /**
   * Создает кнопку
   * @param {string} label - Текст кнопки
   * @param {string} extraClass - Дополнительные классы
   * @param {Function} onClick - Обработчик клика
   * @returns {HTMLElement} Контейнер с кнопкой
   */
  static createButton(label, extraClass = '', onClick = null) {
    const placement = this.createElement("div", "width-100 text-end");
    const button = this.createElement("button", `profile-button btn btn-primary ${extraClass}`, label);
    if (onClick) button.addEventListener("click", onClick);
    placement.append(button);
    return placement;
  }

  /**
   * Создает кнопку-ссылку
   * @param {string} label - Текст ссылки
   * @param {string} extraClass - Дополнительные классы
   * @param {Function} onClick - Обработчик клика
   * @returns {HTMLElement} Контейнер с ссылкой
   */
  static createLinkButton(label, extraClass = '', onClick = null) {
    const placement = this.createElement("div", "width-100 text-start");
    const button = this.createElement("a", extraClass, label);
    if (onClick) button.addEventListener("click", onClick);
    placement.append(button);
    return placement;
  }

  /**
   * Создает элемент подтверждения
   * @param {string} label - Текст сообщения
   * @param {string} extraClass - Дополнительные классы
   * @returns {HTMLElement} Элемент подтверждения
   */
  static createConfirmationLabel(label = null, extraClass = '') {
    const placement = this.createElement("div", `registration-confirm-message width-100 text-end ${extraClass}`);
    placement.innerHTML = label || '';
    return placement;
  }

  /**
   * Создает элемент профиля с полем ввода
   * @param {string} label - Подпись поля
   * @param {string} id - ID поля
   * @param {string} placeholder - Плейсхолдер
   * @param {boolean} required - Обязательное поле
   * @param {string} feedbackError - Текст ошибки
   * @param {string} value - Значение поля
   * @param {string} addClass - Дополнительные классы
   * @returns {HTMLElement} Контейнер поля
   */
  static createProfileItem(label, id, placeholder, required = false, feedbackError = '', value = null, addClass = null) {
    const container = this.createElement("div", "profile-item-container");
    const labelElement = this.createElement("label", "form-label", label);
    labelElement.setAttribute("for", id);
    
    const inputElement = this.createElement("input", `form-control ${addClass || ''}`);
    inputElement.type = "text";
    inputElement.id = id;
    inputElement.placeholder = placeholder;
    if (value) inputElement.value = value;
    inputElement.required = required;
    inputElement.disabled = !required;
    
    const errorElement = this.createElement("div", "invalid-feedback", feedbackError);
    errorElement.id = `${id}-error`;
    errorElement.style.display = "none";

    container.append(labelElement, inputElement, errorElement);
    return container;
  }

  /**
   * Создает элемент баланса профиля
   * @param {string} label - Подпись поля
   * @param {string} id - ID поля
   * @param {string} placeholder - Плейсхолдер
   * @param {boolean} required - Обязательное поле
   * @param {string} feedbackError - Текст ошибки
   * @param {string} value - Значение поля
   * @param {string} addClass - Дополнительные классы
   * @returns {HTMLElement} Контейнер поля
   */
  static createProfileBalanceItem(label, id, placeholder, required = false, feedbackError = '', value = null, addClass = null) {
    const container = this.createElement("div", "profile-item-container");
    const inputElement = this.createElement("div", addClass || '');
    inputElement.id = id;
    inputElement.placeholder = placeholder;
    if (value) inputElement.textContent = value;
    inputElement.required = required;
    inputElement.disabled = !required;
    
    const errorElement = this.createElement("div", "invalid-feedback", feedbackError);
    errorElement.id = `${id}-error`;
    errorElement.style.display = "none";

    container.append(inputElement, errorElement);
    return container;
  }

  /**
   * Создает селектор региона
   * @param {string} label - Подпись
   * @param {string} id - ID элемента
   * @param {Function} onChoiceRegion - Обработчик выбора региона
   * @param {Function} onRemoveRegion - Обработчик удаления региона
   * @returns {HTMLElement} Элемент селектора
   */
  static regionSelector(label, id, onChoiceRegion = null, onRemoveRegion = null) {
    const selector = this.createElement("region-selector", '', label);
    selector.id = id;
    
    if (onChoiceRegion) document.addEventListener('region-selected', onChoiceRegion);
    if (onRemoveRegion) document.addEventListener('chip-removed', onRemoveRegion);
    
    return selector;
  }

  /**
   * Создает нижнюю панель
   * @param {string} drawerId - ID панели
   * @param {string} actionId - ID действия
   * @returns {HTMLElement} Элемент панели
   */
  static bottomDrawer(drawerId, actionId) {
    const selector = this.createElement("content-bottom-drawer");
    if (drawerId) selector.setAttribute("drawer-id", drawerId);
    if (actionId) selector.setAttribute("action-id", actionId);
    return selector;
  }

  /**
   * Создает горизонтальную линию
   * @param {string} extraClass - Дополнительные классы
   * @returns {HTMLElement} Элемент hr
   */
  static createHL(extraClass = '') {
    return this.createElement("hr", `width-100 text-end ${extraClass}`);
  }

  /**
   * Создает перенос строки
   * @param {string} extraClass - Дополнительные классы
   * @returns {HTMLElement} Элемент br
   */
  static createBR(extraClass = '') {
    return this.createElement("br", extraClass);
  }

  /**
   * Создает радио-кнопку
   * @param {string} cardId - ID карточки
   * @param {string} name - Имя группы
   * @param {string} label - Подпись
   * @param {boolean} isDefault - Выбрана по умолчанию
   * @param {Function} onClick - Обработчик клика
   * @returns {HTMLElement} Контейнер радио-кнопки
   */
  static createRadio(cardId, name, label, isDefault, onClick) {
    const placement = this.createElement("div", "custom-radio row mt-2 ml-0");
    const radioContainer = this.createElement("div", "col-12");

    const radioInput = this.createElement("input", "custom-control-input");
    radioInput.type = "radio";
    radioInput.id = `radio-${cardId}`;
    radioInput.name = name;
    radioInput.checked = isDefault;
    radioInput.value = cardId;

    const radioLabel = this.createElement("label", "custom-control-label");
    radioLabel.setAttribute("for", `radio-${cardId}`);
    radioLabel.textContent = label;

    radioContainer.append(radioInput, radioLabel);
    placement.appendChild(radioContainer);

    if (onClick) radioInput.addEventListener("click", () => onClick(cardId));

    return placement;
  }

  /**
   * Создает радио-кнопку с кнопкой удаления
   * @param {string} cardId - ID карточки
   * @param {string} name - Имя группы
   * @param {string} label - Подпись
   * @param {boolean} isDefault - Выбрана по умолчанию
   * @param {string} paySystem - Платежная система
   * @param {Function} onClick - Обработчик клика
   * @param {Function} onDelete - Обработчик удаления
   * @returns {HTMLElement} Контейнер радио-кнопки
   */
  static createRadio2(cardId, name, label, isDefault, paySystem, onClick, onDelete) {
    const placement = this.createElement("div", "custom-radio row mt-2 ml-0");
    
    // Радио-кнопка и лейбл
    const radioContainer = this.createElement("div", "col-9");
    const radioInput = this.createElement("input", "custom-control-input");
    radioInput.type = "radio";
    radioInput.id = `radio-${cardId}`;
    radioInput.name = name;
    radioInput.checked = isDefault;
    radioInput.value = cardId;

    const radioLabel = this.createElement("label", "custom-control-label");
    radioLabel.setAttribute("for", `radio-${cardId}`);
    radioLabel.textContent = label;

    radioContainer.append(radioInput, radioLabel);

    // Кнопка удаления
    const buttonContainer = this.createElement("div", "col-2");
    if (onDelete) {
      const removeButton = this.createElement("button", "btn small-hot-button");
      removeButton.type = "button";
      removeButton.value = cardId;

      const removeIcon = this.createElement("i", "fa-solid fa-x");
      removeIcon.style.fontSize = "0.8rem";

      removeButton.appendChild(removeIcon);
      buttonContainer.appendChild(removeButton);
      removeButton.addEventListener("click", () => onDelete(cardId));
    }

    placement.append(radioContainer, buttonContainer);
    if (onClick) radioInput.addEventListener("click", () => onClick(cardId));

    return placement;
  }

  /**
   * Создает текстовое поле
   * @param {string} textBoxId - ID поля
   * @param {string} extraClass - Дополнительные классы
   * @returns {HTMLTextAreaElement} Текстовое поле
   */
  static createTextBox(textBoxId, extraClass = '') {
    const textarea = this.createElement("textarea", extraClass);
    textarea.id = textBoxId;
    return textarea;
  }

  /**
   * Создает span элемент
   * @param {string} text - Текст
   * @param {string} extraClass - Дополнительные классы
   * @returns {HTMLSpanElement} Элемент span
   */
  static spanBox(text, extraClass = '') {
    const span = this.createElement("span", extraClass);
    if (text) span.textContent = text;
    return span;
  }

  /**
   * Создает div элемент
   * @param {string} text - Текст
   * @param {string} extraClass - Дополнительные классы
   * @returns {HTMLDivElement} Элемент div
   */
  static divBox(text, extraClass = '') {
    const div = this.createElement("div", extraClass);
    if (text) div.textContent = text;
    return div;
  }

  /**
   * Создает заголовок
   * @param {string} text - Текст заголовка
   * @returns {HTMLSpanElement} Элемент заголовка
   */
  static Header(text) {
    const header = this.createElement("span", "w-100 text-decoration-underline fs-8");
    if (text) header.textContent = text;
    return header;
  }

  /**
   * Загружает контент по URL
   * @param {string} url - URL для загрузки
   * @param {number} timeout - Таймаут в мс (по умолчанию 5000)
   * @returns {Promise<string>} Загруженный контент или сообщение об ошибке
   */
  static async fetchContent(url, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('text/html')) {
        throw new Error(`Invalid content type: ${contentType || 'unknown'}`);
      }
      
      return await response.text();
    } catch (error) {
      console.error('Failed to fetch content:', error);
      const errorMessage = error.name === 'AbortError' 
        ? 'Превышено время ожидания загрузки' 
        : error.message;
        
      return `
        <div class="error-message alert alert-danger">
          <strong>Ошибка загрузки контента</strong>
          <p>${errorMessage}</p>
          <p>URL: ${url}</p>
        </div>
      `;
    }
  }

  /**
   * Загружает и отображает статический текст
   * @param {string} contentId - ID контента
   * @param {string} extraClass - Дополнительные классы
   * @param {Object} options - Опции
   * @param {boolean} options.sanitize - Санитизировать HTML
   * @param {boolean} options.allowHTML - Разрешить HTML
   * @returns {Promise<HTMLElement>} Элемент с контентом
   */
static staticText(contentId, extraClass = '', options = {}) {
  const { sanitize = true, allowHTML = true } = options;
  const placement = this.createElement("div", `static-content ${extraClass}`);
  
  if (!contentId) {
    console.warn('staticText: contentId не указан');
    placement.innerHTML = '<div class="alert alert-warning">Не указан идентификатор контента</div>';
    return placement;
  }

  try {
    placement.innerHTML = '<div class="content-loader">Загрузка...</div>';
    const contentUrl = `/public/help/${contentId}.html`;

    // Синхронный запрос (будет блокировать поток!)
    const xhr = new XMLHttpRequest();
    xhr.open('GET', contentUrl, false); // false означает синхронный запрос
    xhr.send(null);

    if (xhr.status !== 200) {
      throw new Error(`HTTP ${xhr.status}: ${xhr.statusText}`);
    }

    let text = xhr.responseText;

    if (!text) throw new Error('Получен пустой ответ от сервера');

    if (sanitize && typeof DOMPurify !== 'undefined') {
      text = DOMPurify.sanitize(text);
    }

    allowHTML ? placement.innerHTML = text : placement.textContent = text;
    return placement;
  } catch (error) {
    console.error(`staticText: ошибка загрузки "${contentId}"`, error);
    placement.innerHTML = `
      <div class="alert alert-danger">
        <strong>Ошибка загрузки контента</strong>
        <p>${error.message}</p>
        <p>Идентификатор: ${contentId}</p>
      </div>
    `;
    return placement;
  }
}

}