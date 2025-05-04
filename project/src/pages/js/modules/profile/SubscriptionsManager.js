class SubscriptionsManager {
    constructor() {
        this.api = new WebAPI();
        this.webRequest = new WebRequest();    
}

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

    createSubscriptionsSection(data) {
        // Секция для карт
         let isSubscriptionActive = false;
	 this.container =  DOMHelper.createDropdownSection("Подписка", 
	  [
            (isSubscriptionActive
                ? DOMHelper.createButton("Отключить подписку", "text-end", this.setSubscriptionDisable.bind(this))
                : DOMHelper.createButton("Включить подписку", "text-end", this.setSubscriptionEnable.bind(this))
            ),
	    DOMHelper.bottomDrawer(`content-drawer`, ``),
            DOMHelper.createLinkButton(`О подписке`,`text-end subscription-mode-button question-button`, this.onSubscriptionModeClick.bind(this)),            

	  ],
		);
	 return this.container;
    }

    onSubscriptionModeClick(){
	    this.drawer = this.container.querySelector('[drawer-id="content-drawer"]');
	    console.log(this.drawer);
    
	    if (!this.drawer) {
	        console.error('Element with drawer-id="content-drawer" not found');
	        return this;
	    }

            if(eventBus) {
                console.log(eventBus)
                eventBus.emit("ContentBottomDrawerOpen", { // Убрать двойную вложенность
		        contentId: `subscription-mode-question-help`,
		        drawerId: this.drawer.getAttribute('drawer-id')		    
               });
   	    }	
	    return this;
    }

    setSubscriptionEnable(){
new PaytureWidget({
            Key: "Merchant_Widget",
            Amount: 20,
            Product: "Payment for order No. 1",
            Domain: 2,
            CustomParams: {
                TemplateTag: "Default",
                Language: "ENG",
                Name: "Ivan Ivanov",
                Delivery: "Сustomer pickup"
            },
            ChequeParams: {
                Positions: [{
                    Quantity: 1,
                    Price: 10,
                    Tax: 2,
                    Text: "Tea"
                }, {
                    Quantity: 2,
                    Price: 5,
                    Tax: 2,
                    Text: "Pie"
                }],
                CustomerContact: "",
                Message: "Cheque Payture"
            },
            OnTransactionCompleted: function(e) {}
        })
    }

    setSubscriptionDisable(){
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