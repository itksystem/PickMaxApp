class ClientAddressDialog {
    constructor() {
        this.api = new WebAPI();
        this.webRequest = new WebRequest();    
    }

    // Создание элемента радио-кнопки для адресов
    createAddressRadio(addressId, name, label, isDefault, onClick, onDelete) {
        const placement = document.createElement("div");
        placement.className = "custom-radio row";

        const radioContainer = document.createElement("div");
        radioContainer.className = "col-10";

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
             eventBus.emit("ClientAddressDialogReload", {});
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