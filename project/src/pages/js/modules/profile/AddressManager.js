class AddressManager {
    constructor() {
        this.api = new WebAPI();
        this.webRequest = new WebRequest();    
        this.addEventListeners();
    }

    // Создание элемента радио-кнопки для адресов
    createAddressRadio(addressId, name, label, isDefault, onClick, onDelete) {
        const placement = document.createElement("div");
        placement.className = "custom-radio row";

        const radioContainer = document.createElement("div");
        radioContainer.className = "col-9";

        const radioInput = document.createElement("input");
        radioInput.className = "custom-control-input";
        radioInput.type = "radio";
        radioInput.id = `radio-${addressId}`;
        radioInput.name = name;
        radioInput.checked = isDefault;
        radioInput.value = addressId;

        const radioLabel = document.createElement("label");
        radioLabel.className = "custom-control-label";
        radioLabel.setAttribute("for", `radio-${addressId}`);
        radioLabel.textContent = label;

        radioContainer.appendChild(radioInput);
        radioContainer.appendChild(radioLabel);

        const buttonContainer = document.createElement("div");
        buttonContainer.className = "col-2";

        const removeButton = document.createElement("button");
        removeButton.className = "btn small-hot-button";
        removeButton.type = "button";
        removeButton.value = addressId;

        const removeIcon = document.createElement("i");
        removeIcon.className = "fa-solid fa-x";
        removeIcon.style.fontSize = "0.8rem";

        removeButton.appendChild(removeIcon);
        buttonContainer.appendChild(removeButton);

        placement.appendChild(radioContainer);
        placement.appendChild(buttonContainer);

        if (onClick) {
            radioInput.addEventListener("click", () => onClick(addressId));
        }
        if (onDelete) {
            removeButton.addEventListener("click", () => onDelete(addressId));
        }

        return placement;
    }

    createAddressesSection(data) {
        this.addressesContainer = DOMHelper.createElement("div", "addresses-card-container");
        this.getElements().forEach(item => 
            this.addressesContainer.appendChild(item)
        );

        const elements = [
            this.addressesContainer,
            this.AddressAutoComplete(
                "Добавить адрес",
                "address",
                "Укажите адрес доставки",
                true,
                "Заполните данные для доставки товара"
            ),
            DOMHelper.createButton("Сохранить", "text-end", this.saveAddress.bind(this))
        ];
        return DOMHelper.createDropdownSection("Мои адреса доставки", elements);
    }


    // Получение адресов
    getAddresses() {
        try {
            const response =  this.webRequest.get(this.api.getDeliveryAddressesMethod(), {}, true);
            return response?.addresses || [];
        } catch (error) {
            console.error('Ошибка при получении адресов:', error);
            return [];
        }
    }

    async saveAddress() {
        try {
            const address = DOMHelper.getElement('#address').getObject();
            await this.webRequest.post(
                this.api.addDeliveryAddressMethod(),
                address,
                true
            );
            DOMHelper.getElement('#address').setValue('');
            toastr.success('Адрес успешно сохранен', 'Доставка', { timeOut: 3000 });
            this.reloadAddressDialog();
        } catch (error) {
            console.error('Ошибка при сохранении адреса:', error);
	    toastr.error('Не удалось сохранить адрес', 'Ошибка', { timeOut: 3000 });
        }
    }

    reloadAddressDialog() {
        if (typeof eventBus !== 'undefined') {
            eventBus.emit("reloadAddressDialog", {});
        }
    }

    addEventListeners() {
	let o = this;
        if (typeof eventBus === 'undefined') {
            console.error('eventBus не определен');
            return;
        }
        
        eventBus.on('reloadAddressDialog', () => {
            o.addressesContainer.innerHTML = '';
            o.getElements().forEach(item => 
                o.addressesContainer.appendChild(item)
            );
        });
    }


    // Установка адреса  по умолчанию
    setDefaultAddress(addressId) {
        try {
            const response =  this.webRequest.patch(this.api.setDefaultDeliveryAddressMethod(), {addressId}, true);
            toastr.success('Aдрес по умолчанию успешно изменен', 'Доставка', { timeOut: 3000 });
            return response;
        } catch (error) {
            console.error('Ошибка при установке адреса по умолчанию:', error);
            toastr.error('Ошибка при установке адреса по умолчанию', 'Доставка', { timeOut: 3000 });
            return null;
        }
    }

    // Удаление адресов
    deleteAddress(addressId) {
        try {
            const response = this.webRequest.delete(this.api.deleteDeliveryAddressMethod(), {addressId}, true);
            toastr.success('Aдрес успешно удален', 'Доставка', { timeOut: 3000 });
            if(eventBus) {
             console.log(eventBus)
             eventBus.emit("reloadAddressDialog", {});
           }

            return response;
        } catch (error) {
            console.error('Ошибка при удалении адреса:', error);
            toastr.error('Ошибка при удалении адреса', 'Доставка', { timeOut: 3000 });
            return null;
        }
    }

    AddressAutoComplete(label, id, placeholder, required, feedbackError) {
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
	        const addresses = this.getAddresses();
		console.log(addresses);
	        const addressElements = addresses.map(element =>
	            this.createAddressRadio(
	                element.addressId,
	                "customAddress",
	                element.value,
	                element.isDefault,
	                this.setDefaultAddress.bind(this),
	                this.deleteAddress.bind(this)
	            )
	        );
	        return addressElements;
	    } catch (error) {
	        console.error('Ошибка при получении адресов:', error);
	        return [];
	    }
      }
}