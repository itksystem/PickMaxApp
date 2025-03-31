class ClientSubscriptionsDialog {
    constructor() {
        this.api = new WebAPI();
        this.webRequest = new WebRequest();    }

    // Создание элемента радио-кнопки для подпискиы
    createSubscribeCheckbox(SubscribeId, name, label, isDefault, onClick) {
        const placement = document.createElement("div");
        placement.className = "custom-checkbox row";

        const checkboxContainer = document.createElement("div");
        checkboxContainer.className = "col-10";

        const checkboxInput = document.createElement("input");
        checkboxInput.className = "custom-control-input";
        checkboxInput.type = "checkbox";
        checkboxInput.id = `checkbox-${SubscribeId}`;
        checkboxInput.name = name;
        checkboxInput.checked = isDefault;
        checkboxInput.value = SubscribeId;

        const checkboxLabel = document.createElement("label");
        checkboxLabel.className = "custom-control-label";
        checkboxLabel.setAttribute("for", `checkbox-${SubscribeId}`);
        checkboxLabel.textContent = label;

        checkboxContainer.appendChild(checkboxInput);
        checkboxContainer.appendChild(checkboxLabel);


        placement.appendChild(checkboxContainer);


        if (onClick) {
            checkboxInput.addEventListener("click", () => onClick(SubscribeId, checkboxInput.checked));
        }

        return placement;
    }

    // Получение подписок
    getSubscriptions() {
        try {
            const response =  this.webRequest.get(this.api.getSubscriptionsMethod(), {}, true);
            return response?.subscriptions || [];
        } catch (error) {
            console.error('Ошибка при получении подписки:', error);
            return [];
        }
    }

    // Установка активности подписики
    setSubscribe(subscriptionId, status) {
        try {
            const response =  this.webRequest.patch(this.api.updateSubscriptionMethod(), {subscriptionId : subscriptionId, status : status}, true);
            toastr.success('подписка по умолчанию успешно изменена', 'Подписки', { timeOut: 3000 });
            return response;
        } catch (error) {
            console.error('Ошибка при установке подпискиы по умолчанию:', error);
            toastr.error('Ошибка при изменении подпискиы по умолчанию', 'Подписки', { timeOut: 3000 });
            return null;
        }
    }

    // Удаление активности подписки
    deleteSubscribe(SubscribeId) {
        try {
            const response = this.webRequest.delete(this.api.deleteSubscriptionMethod(SubscribeId), {}, true);
            toastr.success('подписка успешно удалена', 'Подписки', { timeOut: 3000 });
            return response;
        } catch (error) {
            console.error('Ошибка при удалении подписки:', error);
            toastr.error('Ошибка при удалении подписки', 'Подписки', { timeOut: 3000 });
            return null;
        }
    }

    // Отображение подписки в интерфейсе
    getElements() {
	    try {
	        const subscriptions = this.getSubscriptions();
	        const subscriptionElements = subscriptions.map(subscription =>
	            this.createSubscribeCheckbox(
	                subscription.subscriptionId,
	                "customSubscribe",
	                subscription.subscriptionName,
	                subscription.isSubscribed,
	                this.setSubscribe.bind(this)
	            )
	        );
	        return subscriptionElements;
	    } catch (error) {
	        console.error('Ошибка при получении подписки:', error);
	        toastr.error('Ошибка при загрузке подписок', 'Подписки', { timeOut: 3000 });
	        return [];
	    }
      }
}