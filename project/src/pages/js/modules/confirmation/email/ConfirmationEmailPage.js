class ConfirmationEmailSection extends PageBuilder {
    constructor(containerId) {
        super(containerId);
        this.api = new WebAPI();
        this.common = new CommonFunctions();
        let webRequest = new WebRequest();
        let request = webRequest.get(this.api.getShopProfileMethod(), {}, true )
        this.profile = request.profile;
    }

    /**
     * Generates the ConfirmationEmail section module.
     */
    ConfirmationEmailCardContainer(totalQuantity = 0, totalAmount = 0) {
        let o = this;
        const ConfirmationEmailContainer = document.createElement("div");
        ConfirmationEmailContainer.className = "card card-container";

        const ConfirmationEmailContainerHeader = document.createElement("div");
        ConfirmationEmailContainerHeader.className = "card-header";
        ConfirmationEmailContainerHeader.innerHTML = `<h3 class="card-title">Подтверждение почты</h3>`;

        const ConfirmationEmailContainerContent = document.createElement("div");
        ConfirmationEmailContainerContent.className = "card-body";
        ConfirmationEmailContainerContent.innerHTML = `<div class="confirmation-email-body-container"></div>`;

        ConfirmationEmailContainer.appendChild(ConfirmationEmailContainerHeader);
        ConfirmationEmailContainer.appendChild(ConfirmationEmailContainerContent);

        const ConfirmationEmailBodyContainer = document.createElement("div");
        ConfirmationEmailBodyContainer.innerHTML = `
  	   <div class="confirmation-email-empty-text text-center" style="padding: 1rem 0; font-size: 0.9rem;"> Введите код полученный на указаный вами электронный адрес </br> <b>${this.profile.email}</b></div> 
	   <div class="text-center w-100" style="padding: 1rem 0 2rem 0;"><confirmation-code></confirmation-code></div>
	   <div class="confirmation-email-button-container"> <button href="/profile/page" class="btn btn-lg btn-success w-100 create-order-btn disabled">Подтвердить</button></div> `;
        ConfirmationEmailContainer.appendChild(ConfirmationEmailBodyContainer);
        this.addModule("ConfirmationEmail", ConfirmationEmailContainer);
    }


/* Обновление данных корзины */
 ConfirmationEmailUpdate(message) {
  let o = this;
  let webRequest = new WebRequest();
  let request = webRequest.get(o.api.getShopConfirmationEmailMethod(),  {}, false )
     .then(function(data) {
           console.log(data)
	   if(data.ConfirmationEmail.length == 0) 
	   window.location.href = window.location.pathname;
           o.totalQuantity = data?.ConfirmationEmail?.reduce((quantity, item) => quantity + item.quantity, 0);
           o.totalAmount = data?.totalAmount;
      // Динамически обновляем значения в DOM
           let quantityElement = document.querySelector(".confirmation-email-itog-quantity-sum");
           let amountElement = document.querySelector(".confirmation-email-itog-sum");
           if (quantityElement) quantityElement.textContent = o.totalQuantity;
           if (amountElement) amountElement.textContent = `${o.totalAmount} ?`;

   	// Находим все элементы с классом .confirmation-email-card-price
   	    const priceElements = document.querySelectorAll('.confirmation-email-card-price');

 	 // Перебираем найденные элементы и выводим их содержимое
	     priceElements.forEach((priceElement, index) => {
               priceElement.textContent = ``;
	    });

	  // обновляем записи

   	     data.ConfirmationEmail.forEach(item => {
              o.updateConfirmationEmailPrice(item.productId, `${item.quantity*item.price} ?`); 
            });


        })                                
     .catch(function(error) {
       console.log('showConfirmationEmailOutput.Произошла ошибка =>', error);
     });
    return this;
 }

/**
 * Обновляет значение цены в компоненте confirmation-email-button
 * @param {string} productId - Идентификатор продукта (значение атрибута product-id).
 * @param {string} amount - Новая сумма для отображения (например, "950 ?").
 */
  updateConfirmationEmailPrice(productId, amount) {
    // Находим элемент с классом confirmation-email-card-price внутри компонента
     const priceElement = document.querySelector(`.confirmation-email-card-price[for="${productId}"]`);
     if (priceElement) {
    // Обновляем значение внутри элемента
       priceElement.textContent = amount;
     } else {
       console.error('Элемент .confirmation-email-card-price не найден внутри компонента confirmation-email-button');
    }    
 }

/**
* Attaches a click handler to the "Create Order" button.
*/
  attachCreateOrderButtonHandler(button) {
    const o = this;

    button.addEventListener("click", function () {
     console.log("Кнопка 'Создать заказ' нажата");

     // Блокируем кнопку
     button.disabled = true;
     button.textContent = "Создание...";

     const webRequest = new WebRequest();
     o.referenceId = o.common.uuid();

     webRequest
       .post(o.api.createOrderMethod(), { referenceId: o.referenceId }, false)
       .then((data) => {
        console.log("Заказ успешно создан:", data);
        const order = new OrderDto(data.order);
        if (!order) throw new Error("Object order is null");
          order.saveToLocalStorage(o.referenceId);
              window.location.href = `/orders/delivery/${o.referenceId}`;
                })
                .catch((error) => {
                    console.error("Ошибка при создании заказа:", error);

                    if (error.status === 409) {
                        window.location.href = "/orders/payment/availability-error";
                    } else {
                        window.location.href = "/orders/create-error";
                    }
                })
                .finally(() => {
                    // Разблокируем кнопку независимо от результата
                    button.disabled = false;
                    button.textContent = "Создать заказ";
                });
        });
    }
}






