class ClientCardsDialog {
    constructor() {
        this.api = new WebAPI();
        this.webRequest = new WebRequest();    }

    // Создание элемента радио-кнопки для карты
    createCardRadio(cardId, name, label, isDefault, onClick, onDelete) {
        const placement = document.createElement("div");
        placement.className = "custom-radio row";

        const radioContainer = document.createElement("div");
        radioContainer.className = "col-10";

        const radioInput = document.createElement("input");
        radioInput.className = "custom-control-input";
        radioInput.type = "radio";
        radioInput.id = `radio-${cardId}`;
        radioInput.name = name;
        radioInput.checked = isDefault;
        radioInput.value = cardId;

        const radioLabel = document.createElement("label");
        radioLabel.className = "custom-control-label";
        radioLabel.setAttribute("for", `radio-${cardId}`);
        radioLabel.textContent = label;

        radioContainer.appendChild(radioInput);
        radioContainer.appendChild(radioLabel);

        const buttonContainer = document.createElement("div");
        buttonContainer.className = "col-2";

        const removeButton = document.createElement("button");
        removeButton.className = "btn small-hot-button";
        removeButton.type = "button";
        removeButton.value = cardId;

        const removeIcon = document.createElement("i");
        removeIcon.className = "fa-solid fa-x";
        removeIcon.style.fontSize = "0.8rem";

        removeButton.appendChild(removeIcon);
        buttonContainer.appendChild(removeButton);

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

    // Получение списка карт
    getPaymentCards() {
        try {
            const response =  this.webRequest.get(this.api.getPaymentCardsMethod(), {}, true);
            return response?.cards || [];
        } catch (error) {
            console.error('Ошибка при получении карт:', error);
            toastr.error('Ошибка при загрузке карт', 'Платежные карты', { timeOut: 3000 });
            return [];
        }
    }

    // Установка карты по умолчанию
    setDefaultCard(cardId) {
        try {
            const response =  this.webRequest.post(this.api.setDefaultPaymentCardsMethod(cardId), {}, true);
            toastr.success('Карта по умолчанию успешно изменена', 'Платежные карты', { timeOut: 3000 });
            return response;
        } catch (error) {
            console.error('Ошибка при установке карты по умолчанию:', error);
            toastr.error('Ошибка при изменении карты по умолчанию', 'Платежные карты', { timeOut: 3000 });
            return null;
        }
    }

    // Удаление карты
    deleteCard(cardId) {
        try {
            const response = this.webRequest.delete(this.api.deletePaymentCardsMethod(cardId), {}, true);
            toastr.success('Карта успешно удалена', 'Платежные карты', { timeOut: 3000 });
            return response;
        } catch (error) {
            console.error('Ошибка при удалении карты:', error);
            toastr.error('Ошибка при удалении карты', 'Платежные карты', { timeOut: 3000 });
            return null;
        }
    }

    // Отображение карт в интерфейсе
    getElements() {
	    try {
	        const cards = this.getPaymentCards();
	        const cardElements = cards.map(card =>
	            this.createCardRadio(
	                card.cardId,
	                "customPayment",
	                `Карта ${card.maskedCardNumber}`,
	                card.isDefault,
	                this.setDefaultCard.bind(this),
	                this.deleteCard.bind(this)
	            )
	        );
	        return cardElements;
	    } catch (error) {
	        console.error('Ошибка при получении карт:', error);
	        toastr.error('Ошибка при загрузке карт', 'Платежные карты', { timeOut: 3000 });
	        return [];
	    }
      }
}