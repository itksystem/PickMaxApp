/* eslint-disable */
document.addEventListener('DOMContentLoaded', function () {

    function getBasketItemsArray(data) {
        let prop = {
            target: ".shop_orders_list",
            list: []
        };
        let sum = 0;

        // Используем метод forEach для перебора массива
        data.forEach(val => {
            sum += val.sum;

            // Создаем объект для каждого элемента корзины
            const basketItem = {
                id: val.order_id,
                order: [
                    {
                        name: `<img class="basket_product_image_v2" src="${val.card_image}">`,
                        class_name: "col-sm-2 order_product_image text-center"
                    },
                    {
                        name: `
                        <div class="row">
                            <div class="col">
                                <div class="row">
                                    <div class="col orders_sum">${val.sum} ${val.currency_type}.</div>
                                    <div class="basket_trash_icon basket_product_remove_btn" rel="${val.order_id}">
                                        <i class="fa fa-trash basket_trash_icon"></i>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col title_orders_summ">${val.title}</div>
                                </div>
                            </div>
                        </div>
                    `,
                        class_name: "col-sm-4 basket_item_date"
                    }
                ]
            };
            // Добавляем элемент в список
            prop.list.push(basketItem);
        });
        // Можно вернуть или использовать prop.list и sum по необходимости
        prop.totalSum = sum;
        return prop;
    }


    function totalSumOutput(totalSum) {
        return `
    <div class="card"">
	    <div class="row">
		        <div class="col title_orders_summ"><h2>Сумма заказа</h2></div>
		        <div class="col-6 orders_sum"><h2>${totalSum} руб.</h2></div>
		 </div>
   </div>`

    }


    function shopCreateDescriptionOutput() {
        return ` 
    <div class="row"  style="padding-top: 1rem;">
		   <div class="col w-100 text-left" ><h2>Дополнительная информация</h2></div> 
	</div>
    <div class="shop_orders_agreement">После нажатия кнопки <b>"Создать магазин"</b> наш бот пришлет вам учетные данные для управления магазином и дальнейшие инструкции.</br></br>
       Так же сообщаем, что отправить вы можете не более одного заказа на создание магазинов в день.
    </div>`
    }


    function createApplicationButtonOutput(title) {
        return `  
  <div class="row text-center">
	  <div class="col"><button class="btn btn-lg w-100 btn-green basket_item_status_pred_create_application">${title}
			 <i class="fas fa-cart-plus fa-sm mr-1"></i></button>
       </div>
   </div>`
    }
    function createApplicationShortButtonOutput(title) {
        return `  
        <button class="btn btn-lg w-100 btn-green basket_item_status_create_application "> ${title} <i class="fas fa-cart-plus fa-sm mr-1"></i></button>`
    }

    function returnToCatalogButtonOutput(title) {
        return `  
     <div class="row text-center"><div class="col w-100" style="padding:1rem;">или</div>  </div>
	  <div class="row text-center">
	  <div class="col"><button class="btn btn-lg w-100 basket_item_status_next_shopping"><i class="fa fa-plus"></i> ${title} </button></div>
	 </div>`
    }

    function deliveryFormOutput(visible = false) {
        (visible)
            ? $('.create_orders_dlg').show()
            : $('.create_orders_dlg').hide();
    }

    function applicationFormOutput(visible = false) {
        fillDeliveryFormOutput(user);
        (visible)
            ? $('.shop_application_dialog').show()
            : $('.shop_application_dialog').hide();
    }


    function fillDeliveryFormOutput(user) {
        $("#user_delivery_name").val(user.getDeliveryName());
        $("#user_delivery_phone").val(user.getDeliveryPhone());
        $("#user_delivery_address").val(user.getDeliveryAddress());
        $("#user_recipient_name").val(user.getDeliveryName());
        $("#user_recipient_phone").val(user.getDeliveryPhone());
        $("#user_recipient_address").val(user.getDeliveryAddress());
    }



    // try {
    let api = new WebAPI();
    let o = this;
    let webRequest = new WebRequest();
    let user = new CurrentUser();
    let userId = new User().getCurrentUserId();
    let shopId = new CurrentShop().getCurrentShopId();

    let data = webRequest.get(api.getShopBasketOrdersMethod(shopId, userId), {}, webRequest.SYNC);
     applicationFormOutput(true);
     deliveryFormOutput(false);
    if (data.length > 0) {
        let items = getBasketItemsArray(data);
        let basketList = new ListComponent(items).render();        
        
        $(".shop_orders_list .container").append(totalSumOutput(items.totalSum));
        $(".shop_orders_list .container").append(
            createApplicationButtonOutput(!isDemoShopShowcase() ? ` Отправить заказ в магазин ` : ` Создать магазин `));
        $(".shop_orders_list .container").append(
            !isDemoShopShowcase()
                ? returnToCatalogButtonOutput(`Продолжить выбор товаров`)
                : shopCreateDescriptionOutput()
        );

        /* Переход на продолжение покупок  */
        $('.basket_item_status_next_shopping').on('click', function () {
            redirectToAnotherPage('products/page');
        });

        /* Удаление товара */
        $('.basket_product_remove_btn').on('click', function () {
            let order_id = $(this).attr('rel');
            webRequest.delete(
                api.deleteShopBasketApplicationMethod(shopId, user.getUserId()),
                api.deleteShopBasketApplicationPayload(order_id), false)
                .then(function (data) {
                    toastr.info('Товар удален из корзины!', 'Товар', { timeOut: 5000 });
                    redirectToAnotherPage(`basket/page`);
                })
                .catch(function (error) {
                    toastr.error('Ошибка удаления товара из корзины!', 'Товар', { timeOut: 5000 });
                })
        });


        $('.basket_item_status_pred_create_application').on('click', function () {
            $('.pred-order-dialog').hide();
            applicationFormOutput(false);
            deliveryFormOutput(true);
            $('.page_title_addons').append(createApplicationShortButtonOutput(!isDemoShopShowcase() ? ` Отправить заказ ` : ` Создать магазин `))

            $('.basket_item_status_create_application').on('click', function () {
                $(this).hide();
                (!isDemoShopShowcase()
                    ?
                    webRequest.post(api.sendBasketCreateOrderMethod(shopId, userId), api.sendBasketCreateOrderMethodPayload(), webRequest.ASYNC)
                        .then(function (data) {
                            redirectToAnotherPage('application_success/' + data.order + '/' + data.application_id);
                        })
                        .catch(function (error) {
                            console.error(error);
	                    toastr.error(api.ErrorMessage500, api.OrderErrorTitle, { timeOut: 5000 });
			    redirectToAnotherPage('application_failed');
                        })
                    :       // Создаем магазин
                    webRequest.post(api.sendShopCreateMethod(), api.sendShopCreateMethodPayload(template_id), webRequest.ASYNC)
                        .then(function (data) {
                            redirectToAnotherPage('application_success/' + data.order + '/' + data.application_id);
                        })
                        .catch(function (error) {
                            console.error(error);
                           // redirectToAnotherPage('application_failed');
			   toastr.error(api.ErrorMessage500, api.OrderErrorTitle, { timeOut: 5000 });
			   redirectToAnotherPage('application_failed');	
                   })
                );
            });
        });

    } else
        $('div.shop_orders_list').append(`
            <div class="text-center">Нет заказов в корзине</div>                      
            `);
            //<div class="text-center"><img src="/main/pages/telegram/jobs/images/beaver_with_empty_basket_02.png" style="width: 15rem;"></div>                      

  

});

