class DOMHelper {
   static  createDropdownSection(title, children = []) {
        const section = this.createElement("dropdown-section", '', `<span slot="title">${title}</span>`);
         if (children.length === 0) {
// Создаем контейнер для текста и иконки
	     const noInfoContainer = document.createElement('div');
	        noInfoContainer.style.display = 'flex';
	        noInfoContainer.style.alignItems = 'center';
	        noInfoContainer.style.justifyContent = 'center';
	        noInfoContainer.style.gap = '8px'; // Расстояние между иконкой и текстом

	        // Добавляем иконку предупреждения
	        const warningIcon = document.createElement('span');
	        warningIcon.innerHTML = '⚠️'; // Используем эмодзи или можно вставить SVG
	        warningIcon.style.fontSize = '18px'; // Размер иконки

	        // Добавляем текст
	        const noInfoText = document.createElement('p');
	        noInfoText.textContent = 'Нет информации';
        	noInfoText.style.margin = '0'; // Убираем отступы у параграфа

	        // Собираем контейнер
	        noInfoContainer.appendChild(warningIcon);
	        noInfoContainer.appendChild(noInfoText);
	
	        // Добавляем контейнер в секцию
	        section.appendChild(noInfoContainer);
           } else {
          children.forEach(child => section.appendChild(child));
        }
        return section;
    }

    static getElement(id = null) {
	if(!id) return null;
        let result = document.querySelector(id);
	return result ?? null;
    }

    static createElement(tag, className = '', innerHTML = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    }

    static createButton(label, extraClass = '', onClick = null) {
        const placement = this.createElement("div", "width-100 text-end", "");
        const button = this.createElement("button", `profile-button btn btn-primary ${extraClass}`, label);
        placement.append(button);
        if (onClick) button.addEventListener("click", onClick);
        return placement;
    }

    static createLinkButton(label, extraClass = '', onClick = null) {
        const placement = this.createElement("div", "width-100 text-start", "");
        const button = this.createElement("a", `${extraClass}`, label);
        placement.append(button);
        if (onClick) button.addEventListener("click", onClick);
        return placement;
    }


    static createConfirmationLabel(label = null, extraClass = '') {
        const placement = this.createElement("div", "width-100 text-end", "");
        placement.className = `registration-confirm-message ${extraClass}`;
        placement.innerHTML = label || '';
        return placement;
    }

    static createProfileItem(label, id, placeholder, required = false, feedbackError = '', value = null, addClass = null) {
        const container = this.createElement("div", "profile-item-container");
        const labelElement = this.createElement("label", "form-label", label);
        labelElement.setAttribute("for", id);
        
        const inputElement = this.createElement("input", `form-control ${addClass}`);
        inputElement.type = "text";
        inputElement.id = id;
        inputElement.placeholder = placeholder;
        if(value) inputElement.value = value;

        if (required) inputElement.setAttribute("required", "required");
        if (!required) inputElement.setAttribute("disabled", "disabled");
        
        const errorElement = this.createElement("div", "invalid-feedback", feedbackError);
        errorElement.id = `${id}-error`;
        errorElement.style.display = "none";

        container.append(labelElement, inputElement, errorElement);
        return container;
    }

    static createProfileBalanceItem(label, id, placeholder, required = false, feedbackError = '', value = null, addClass = null) {
        const container = this.createElement("div", "profile-item-container");
        const inputElement = this.createElement("div", `${addClass}`);
        inputElement.type = "text";
        inputElement.id = id;
        inputElement.placeholder = placeholder;
        if(value) inputElement.innerText = value;

        if (required) inputElement.setAttribute("required", "required");
        if (!required) inputElement.setAttribute("disabled", "disabled");
        
        const errorElement = this.createElement("div", "invalid-feedback", feedbackError);
        errorElement.id = `${id}-error`;
        errorElement.style.display = "none";

        container.append(inputElement, errorElement);
        return container;
    }

    static regionSelector(label, id, onChoiceRegion = null, onRemoveRegion = null) {
        const placement = this.createElement("div", "width-100 text-end", "");
        const selector = this.createElement("region-selector", ``, label);
        selector.id = id;
        placement.append(selector);
	if(onChoiceRegion) document.addEventListener('region-selected', onChoiceRegion);
       	if(onRemoveRegion) document.addEventListener('chip-removed', onRemoveRegion);
        return selector;
    }

    static bottomDrawer(drawerId, actionId) {
        const placement = this.createElement("div", "width-100 text-end", ``);
        const selector = this.createElement("content-bottom-drawer", ``, ``);
        if (drawerId) selector.setAttribute("drawer-id", drawerId);
        if (actionId) selector.setAttribute("action-id", actionId);
        placement.append(selector);
        return selector;
    }

    static createHL(extraClass = '') {
        const placement = this.createElement("hr", `width-100 text-end ${extraClass}`, ``);
        return placement;
    }

    static createBR(extraClass = '') {
        const placement = this.createElement("br", `${extraClass}`, ``);
        return placement;
    }


    static createRadio(cardId, name, label, isDefault, onClick) {
        const placement = this.createElement("div");
        placement.className = "custom-radio row  mt-2 ml-0";

        const radioContainer =this.createElement("div");
        radioContainer.className = "col-12";

        const radioInput = this.createElement("input");
        radioInput.className = "custom-control-input";
        radioInput.type = "radio";
        radioInput.id = `radio-${cardId}`;
        radioInput.name = name;
        radioInput.checked = isDefault;
        radioInput.value = cardId;

        const radioLabel = this.createElement("label");
        radioLabel.className = "custom-control-label";
        radioLabel.setAttribute("for", `radio-${cardId}`);
        radioLabel.textContent = label;

        radioContainer.appendChild(radioInput);
        radioContainer.appendChild(radioLabel);

        placement.appendChild(radioContainer);

        if (onClick) {
            radioInput.addEventListener("click", () => onClick(cardId));
        }

        return placement;
    }


    static createRadio2(cardId, name, label, isDefault, paySystem, onClick, onDelete) {
        const placement = this.createElement("div");
        placement.className = "custom-radio row  mt-2 ml-0";

        const radioContainer =this.createElement("div");
        radioContainer.className = "col-9";

        const radioInput = this.createElement("input");
        radioInput.className = "custom-control-input";
        radioInput.type = "radio";
        radioInput.id = `radio-${cardId}`;
        radioInput.name = name;
        radioInput.checked = isDefault;
        radioInput.value = cardId;

        const radioLabel = this.createElement("label");
        radioLabel.className = "custom-control-label";
        radioLabel.setAttribute("for", `radio-${cardId}`);
        radioLabel.textContent = label;

        radioContainer.appendChild(radioInput);
        radioContainer.appendChild(radioLabel);

        const buttonContainer = this.createElement("div");
        buttonContainer.className = "col-2";

        const removeButton = this.createElement("button");
        removeButton.className = "btn small-hot-button";
        removeButton.type = "button";
        removeButton.value = cardId;

        const removeIcon = this.createElement("i");
        removeIcon.className = "fa-solid fa-x";
        removeIcon.style.fontSize = "0.8rem";

        if (onDelete) {
          removeButton.appendChild(removeIcon);
          buttonContainer.appendChild(removeButton);
         }

        placement.appendChild(radioContainer);
        placement.appendChild(buttonContainer);

        if (onClick) {
            radioInput.addEventListener("click", () => onClick(cardId));
        }
        if (onDelete) {
            removeButton.addEventListener("click", () => onDelete(cardId));
        }

        return placement;
    }


    static createTextBox(textBoxId,  extraClass =``) {
        const placement = this.createElement("textarea",  `${extraClass}`, ``);
        placement.id = textBoxId;
        return placement;
    }

    static spanBox(text, extraClass =``) {
        const placement = this.createElement("span", `${extraClass}`, ``);
        if(text) placement.innerText = text;
        return placement;
    }

    static divBox(text, extraClass =``) {
        const placement = this.createElement("div", `${extraClass}`, ``);
        if(text) placement.innerText = text;
        return placement;
    }

    static Header(text) {
        const placement = this.createElement("span", "w-100 text-decoration-underline fs-8", ``);	
        if(text) placement.innerText = text;
        return placement;
    }


}
