class RussianPostManager {
    constructor() {
        this.api = new WebAPI();
        this.webRequest = new WebRequest();    
        this.addEventListeners();
    }

    // Создание элемента радио-кнопки для адресов
    createRussianPostRadio(russianPostId, name, label, isDefault, onClick, onDelete) {
        const placement = document.createElement("div");
        placement.className = "custom-radio row";

        const radioContainer = document.createElement("div");
        radioContainer.className = "col-9";

        const radioInput = document.createElement("input");
        radioInput.className = "custom-control-input";
        radioInput.type = "radio";
        radioInput.id = `radio-${russianPostId}`;
        radioInput.name = name;
        radioInput.checked = isDefault;
        radioInput.value = russianPostId;

        const radioLabel = document.createElement("label");
        radioLabel.className = "custom-control-label";
        radioLabel.setAttribute("for", `radio-${russianPostId}`);
        radioLabel.textContent = label;

        radioContainer.appendChild(radioInput);
        radioContainer.appendChild(radioLabel);

        const buttonContainer = document.createElement("div");
        buttonContainer.className = "col-2";

        const removeButton = document.createElement("button");
        removeButton.className = "btn small-hot-button";
        removeButton.type = "button";
        removeButton.value = russianPostId;

        const removeIcon = document.createElement("i");
        removeIcon.className = "fa-solid fa-x";
        removeIcon.style.fontSize = "0.8rem";

        removeButton.appendChild(removeIcon);
        buttonContainer.appendChild(removeButton);

        placement.appendChild(radioContainer);
        placement.appendChild(buttonContainer);

        if (onClick) {
            radioInput.addEventListener("click", () => onClick(russianPostId));
        }
        if (onDelete) {
            removeButton.addEventListener("click", () => onDelete(russianPostId));
        }

        return placement;
    }

    createRussianPostesSection(data) {
        this.russianPostesContainer = DOMHelper.createElement("div", "russianPostes-card-container");
        this.getElements().forEach(item => 
            this.russianPostesContainer.appendChild(item)
        );

        const elements = [
            this.russianPostesContainer,
            this.RussianPostAutoComplete(
                "Добавить адрес",
                "russianPost",
                "Укажите адрес доставки",
                true,
                "Заполните данные для доставки товара"
            ),
            DOMHelper.createButton("Сохранить", "text-end", this.saveRussianPost.bind(this))
        ];
        return DOMHelper.createDropdownSection("Мои адреса доставки", elements);
    }


    // Получение адресов
    getRussianPostes() {
        try {
            const response =  this.webRequest.get(this.api.getDeliveryRussianPostesMethod(), {}, true);
            return response?.russianPostes || [];
        } catch (error) {
            console.error('Ошибка при получении адресов:', error);
            return [];
        }
    }

    async saveRussianPost() {
        try {
            const russianPost = DOMHelper.getElement('#russianPost').getObject();
            await this.webRequest.post(
                this.api.addDeliveryRussianPostMethod(),
                russianPost,
                true
            );
            DOMHelper.getElement('#russianPost').setValue('');
            toastr.success('Адрес успешно сохранен', 'Доставка', { timeOut: 3000 });
            this.reloadRussianPostDialog();
        } catch (error) {
            console.error('Ошибка при сохранении адреса:', error);
	    toastr.error('Не удалось сохранить адрес', 'Ошибка', { timeOut: 3000 });
        }
    }

    reloadRussianPostDialog() {
        if (typeof eventBus !== 'undefined') {
            eventBus.emit("reloadRussianPostDialog", {});
        }
    }

    addEventListeners() {
	let o = this;
        if (typeof eventBus === 'undefined') {
            console.error('eventBus не определен');
            return;
        }
        
        eventBus.on('reloadRussianPostDialog', () => {
            o.russianPostesContainer.innerHTML = '';
            o.getElements().forEach(item => 
                o.russianPostesContainer.appendChild(item)
            );
        });
    }


    // Установка адреса  по умолчанию
    setDefaultRussianPost(russianPostId) {
        try {
            const response =  this.webRequest.patch(this.api.setDefaultDeliveryRussianPostMethod(), {russianPostId}, true);
            toastr.success('Aдрес по умолчанию успешно изменен', 'Доставка', { timeOut: 3000 });
            return response;
        } catch (error) {
            console.error('Ошибка при установке адреса по умолчанию:', error);
            toastr.error('Ошибка при установке адреса по умолчанию', 'Доставка', { timeOut: 3000 });
            return null;
        }
    }

    // Удаление адресов
    deleteRussianPost(russianPostId) {
        try {
            const response = this.webRequest.delete(this.api.deleteDeliveryRussianPostMethod(), {russianPostId}, true);
            toastr.success('Aдрес успешно удален', 'Доставка', { timeOut: 3000 });
            if(eventBus) {
             console.log(eventBus)
             eventBus.emit("reloadRussianPostDialog", {});
           }

            return response;
        } catch (error) {
            console.error('Ошибка при удалении адреса:', error);
            toastr.error('Ошибка при удалении адреса', 'Доставка', { timeOut: 3000 });
            return null;
        }
    }

    RussianPostAutoComplete(label, id, placeholder, required, feedbackError) {
    const container = document.createElement("div");
    container.className = "profile-input-group";

    const labelElement = Object.assign(document.createElement("label"), {
        htmlFor: id,
        className: "form-label",
        textContent: label
    });

    const autoCompleteElement = Object.assign(document.createElement("x-autocomplete"), {
        id,
        placeholder
    });

    if (required) autoCompleteElement.setAttribute("required", "required");

    const errorElement = Object.assign(document.createElement("div"), {
        id: `${id}-error`,
        className: "invalid-feedback",
        style: "display: none;",
        textContent: feedbackError
    });

    container.append(labelElement, autoCompleteElement, errorElement);
    return container;
}

    // Отображение адресов в интерфейсе
    getElements() {
	    try {
	        const russianPostes = this.getRussianPostes();
		console.log(russianPostes);
	        const russianPostElements = russianPostes.map(element =>
	            this.createRussianPostRadio(
	                element.russianPostId,
	                "customRussianPost",
	                element.value,
	                element.isDefault,
	                this.setDefaultRussianPost.bind(this),
	                this.deleteRussianPost.bind(this)
	            )
	        );
	        return russianPostElements;
	    } catch (error) {
	        console.error('Ошибка при получении адресов:', error);
	        return [];
	    }
      }
}