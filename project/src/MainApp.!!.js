class MainApp {
   constructor() {
    this.config = {
      feature: true,
      console: true
    };
      this.api = new WebAPI();
      this.page = 1; // Номер текущей страницы
      this.limit = 10; // Количество товаров для загрузки за раз
      this.loading = false; // Флаг, чтобы предотвратить повторную загрузку данных   
      this.common = new CommonFunctions();
      console.log(this);
      return this;
   }

 showCaseCardOutput(product){
   let o = this;
   return `
        <product-card
	    product-id ="${product.productId}"
	    status = "active"                        
            href="${o.api.getShopProductMethod(null, product.productId)}"
            image-src="${product.mediaFiles[0].mediaKey}"
            image-alt="${product.productName}"
            brand="Brand"
            name="${product.productName}"
            current-price="${product.price}"
            old-price="${product.price*1.30}"
            currency-type="руб."
            aria-label="${product.productName}"
            basket-count="${product.basketCount}"
        </product-card>
`
  }

 showCaseEmptyPageOutput(){
  return `
	<section class="error-page error-page-option text-center page-padding block-space">
	    <span class="error-page-title center-text">Сервис товаров временно недоступен</span>
	</section>`;
 }

  
 showCasePage() {
    try {
        let o = this;
        let webRequest = new WebRequest();
        const urlParams = new URLSearchParams(window.location.search); // Получаем текущий URL
        const active = urlParams.get('active'); // Извлекаем значение параметра 'active'

        
        function loadProducts(page) { // Функция загрузки товаров с пагинацией
            if (o.loading) return;    // Предотвращаем повторную загрузку
            o.loading = true;
            
            let request = webRequest.post(
                o.api.getShopProductsMethod(o.page, o.limit), 
                {}, 
                false
            )
            .then(function(data) {
                data.forEach(product => {
                    $("div.product-card-container").append(o.showCaseCardOutput(product)).show();
                });
                
                $('.fotorama').fotorama(); // переинициализация картинок
                
                o.loading = false; // Сбрасываем флаг загрузки
            })
            .catch(function(error) {
                console.log('initializeProductCard.Произошла ошибка =>', error);
		$("div.product-card-container").append(o.showCaseEmptyPageOutput()).show();
		toastr.error('Ошибка при получении товаров', 'Товары', {timeOut: 3000});
                o.loading = false; // Сбрасываем флаг загрузки при ошибке
            });
        }

        // Изначально загружаем первую порцию товаров
        loadProducts(o.page);

        // Обработчик прокрутки страницы для догрузки товаров
        $(window).on('scroll', function() {
            if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
                console.log(o.page);
                o.page++; // Увеличиваем номер страницы
                loadProducts(o.page); // Загружаем следующую порцию товаров
            }
        });

    } catch (e) {
        console.log('initializeProductCard.catch =>', e);
    }
    return this;
 }


  dropSectionEventHadler(){
   let o = this;
   document.querySelectorAll('.basket-delete-button').forEach(button => {
    button.addEventListener('click', function() {
        const productId = this.getAttribute('product-id');
        const quantity = this.getAttribute('quantity');
	let webRequest = new WebRequest();
	let request = webRequest.post(o.api.removeFromBasketMethod(),  {productId : productId, quantity :  Number(quantity)}, false )
	   .then(function(data) {
	        console.log(data);
		window.location.reload()
	        })
	     .catch(function(error) {
	       console.log('showBasketOutput.Произошла ошибка =>', error);
	     });
        });
    });
 } 

/* Вывод страницы профиля */
 showBasketPage() {
  let o = this;
  let webRequest = new WebRequest();
  let request = webRequest.get(o.api.getShopBasketMethod(),  {}, false )
     .then(function(data) {
           console.log(data)
  	   const basketPage = new BasketSection("basket-container");
           const totalQuantity = data?.basket?.reduce((quantity, item) => quantity + item.quantity, 0);
 	   basketPage.BasketCardContainer(totalQuantity, data?.totalAmount);
  	   basketPage.render();
            data.basket.forEach(item => {
		new BasketItem("basket-body-container", item);
           });
	 o.dropSectionEventHadler(); // Инициализация обработчиков кликов	
//	 o.createOrderButtonEventHadler();
        })                                
     .catch(function(error) {
       console.log('showBasketOutput.Произошла ошибка =>', error);
     });
    return this;
 }

  _createOrderButtonEventHadler() {
    let o = this;
    console.log(o); //
    o.referenceId = o.common.uuid(); // создаем referenceId
                                        
    document.querySelectorAll('.create-order').forEach(button => {
      button.addEventListener('click', function() {
        let webRequest = new WebRequest();
          webRequest.post(o.api.createOrderMethod(), {referenceId : o.referenceId }, false)
           .then(function(data) {
	     console.log(data);
   	      let order = new OrderDto(data.order);
  	       console.log(data.order);
	       order.saveToLocalStorage(o.referenceId);
	       if(!order) throw('Object order is null ', order)
	         window.location.href = `/orders/delivery/${o.referenceId}`; //перешли на доставку
              }).catch(function(error) {
             console.log('createOrderButtonEventHadler.Произошла ошибка =>', error);
	     if(error.status == 409 ) {	
       		 window.location.href = '/orders/payment/availability-error';
 	     } else
            window.location.href = '/orders/create-error';
          });
        });
      });
    }

  showOrderDeliveryOutput(){
   let o = this;
   let webRequest = new WebRequest();
   const url = window.location.pathname; // Получаем путь, например, /delivery/12345
   const match = url.match(/^\/orders\/delivery\/([^/]+)$/);
   o.referenceId = match ? match[1] : null;
   let order = new OrderDto();
   order.loadFromLocalStorage(this.referenceId);
   console.log(order);

   const options = document.querySelectorAll('.option');
   const confirmButton = document.getElementById('delivery-confirm-button');
   const backButton = document.getElementById('delivery-back-button');
   let selectedOption = null;

   options.forEach(option => {
     option.addEventListener('click', () => {
       if (selectedOption) {
            selectedOption.classList.remove('selected');
            }
       option.classList.add('selected');
       selectedOption = option;
       confirmButton.disabled = false;
      });
   });

   confirmButton.addEventListener('click', () => {
    let api = new WebAPI();
    if (selectedOption) {
       order.setDeliveryId(selectedOption.dataset.type);
       order.saveToLocalStorage(o.referenceId);
       window.location.href = `/orders/payment/${this.referenceId}`; //перешли на платежи
      }
    });

    backButton.addEventListener('click', () => {
        // Возврат на предыдущую страницу
        window.location.href = '/orders/page';
    });

  return this;
 }

 showPaymentPageOutput() {
    const o = this;
    const webRequest = new WebRequest();
    const url = window.location.pathname; // Получаем путь, например, /delivery/12345
    const match = url.match(/^\/orders\/payment\/([^/]+)$/);
    o.referenceId = match ? match[1] : null;

    if (!o.referenceId) {
        console.log("Invalid URL: referenceId not found");
        return;
    }

    const order = new OrderDto();
    order.loadFromLocalStorage(o.referenceId);
    console.log(order);

    const paymentAmount = document.querySelector('[name="payment-amount"]');
    if (paymentAmount) paymentAmount.textContent = order.getTotalAmount();

    const paymentAmountButton = document.querySelector('[name="payment-amount-button"]');
    if (paymentAmountButton) paymentAmountButton.textContent = order.getTotalAmount();

    const cardNumber = document.querySelector('[name="CardNumber"]');
    if (cardNumber) cardNumber.value = '2202002200002222';

    const dateTo = document.querySelector('[name="DateTo"]');
    if (dateTo) dateTo.value = '12/28';

    const confirmButton = document.querySelector('[name="Payment-button"]');
    if (confirmButton) {
        confirmButton.addEventListener('click', () => {
            const secureCode = document.querySelector('[name="SecureCode"]');
             if (secureCode) {
                let result = o.getPaymentResult(order)
                  .then(function(paymentResult) {
                   (paymentResult.status === true)
                     ? window.location.href = `/orders/payment/success/${o.referenceId}`
                     : window.location.href = `/orders/payment/failed/${o.referenceId}`
                   })
                .catch(function(error) {
                  console.log('createOrderButtonEventHadler.Произошла ошибка =>', error);
                  window.location.href = `/orders/payment/failed/${o.referenceId}`;
              });
            } 
        });
    }

    const backButton = document.querySelector('[name="Payment-Cancel-Button"]');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = '/orders/page';
        });
    }

    return this;
 }


 getPaymentResult(order) {
    let o = this;
    let webRequest = new WebRequest();
    if (!o.api || typeof o.api.sendPaymentMethod !== 'function') {
        console.log('API метод sendPaymentMethod не найден');
        return Promise.reject('API метод sendPaymentMethod не найден');
    }
     const form = document.querySelector('#payForm'); // Найти форму по ID или другому селектору
     const formData = new FormData(form); // Создать объект FormData
	
     // Собрать все данные в объект
     const paymentDetails = {};
       formData.forEach((value, key) => {
           paymentDetails[key] = value;
       });


    order.paymentDetails = paymentDetails;
    return webRequest.post(o.api.sendPaymentMethod(), order, false)
        .then(function(paymentDetails) {
            console.log(paymentDetails);
            return paymentDetails;
        })
        .catch(function(error) {
            console.log('Ошибка при отправке платежа:', error.message || error);
            window.location.href = '/orders/create-error';
        });
  }




 orderItemCardOutput(item){
   return `
	<section class="outside-city delivery-option page-padding block-space card">
	      <div class="row">		
                <div class="col-5  d-flex align-items-center float-start">		
		   <span style="font-size: 1rem">Заказ № ${item.orderId} <small>от ${item.createdAt}</small></span>		   
                </div>
                <div class="col-2  d-flex align-items-center float-start">
		  <span style="font-size: 1rem"> ${item.itemsCount}</span>		
                </div>
                <div class="col-2  d-flex align-items-center float-start">
		  <span style="font-size: 1rem"> ${item.totalAmount}</span>		
                </div>
                <div class="col-3  d-flex align-items-center float-end">
		  <div class="btn btn-lg ${this.common.ORDER_STATUS[item.status].class}"> ${this.common.ORDER_STATUS[item.status].description}</div>		
                </div>
            </div>
	    
	    <div class="w-100">
	        <div class="delivery-content">
		   <div class="delivery-content-card">
			<div class="row">		
  	   	       	   <div class="col-6">		
		                <ul>
		                </ul>
		            </div>
			   <div class="col-6">		

 			   </div>		
  	   	        </div>		
	           </div>
                </div>
	    </div>
	</section>

   `;
 }


 OrdersPageTitle(){
 return `
	<section class="outside-city delivery-option page-padding block-space card">
	    <h2 class="header-title text-center">Ваши заказы </h2>
	</section>`;
  }

 OrdersEmptyPage(){
 return `
	<section class="outside-city delivery-option page-padding block-space card">
	    <h2 class="header-title text-center">В корзине нет товаров </h2>
	</section>`;
 }



 showOrdersPage(){
  let o = this;
  let webRequest = new WebRequest();
  $("div.orders-container").prepend(o.OrdersPageTitle()).show();
  let request = webRequest.get(o.api.getShopOrdersMethod(), o.api.getShopOrdersMethodPayload(), false )
     .then(function(data) {
	console.log(data);
  	   const ordersPage = new OrdersSection("orders-container");
 	   ordersPage.OrdersCardContainer(data.orders?.length);
  	   ordersPage.render();

            if(data?.orders?.length != 0) {
              data?.orders?.forEach(item => {
 		new OrderItem("orders-body-container", item);
             });
          }
//	 o.dropSectionEventHadler(); // Инициализация обработчиков кликов	
//	 o.createOrderButtonEventHadler();
        })                                
     .catch(function(error) {
       console.log('showOrdersPage.Произошла ошибка =>', error);
     });
    return this;
 }


 showOrderInfoPage(){
  let o = this;
  const url = window.location.pathname; // Получаем путь, например, /delivery/12345
  const match = url.match(/\/orders\/(\d+)\/page/);
  o.orderId = match ? match[1] : null;
  console.log(o.orderId);

  let webRequest = new WebRequest();
  $("div.order-container").prepend(o.OrdersPageTitle()).show();
  let request = webRequest.get(o.api.getShopOrderMethod(o.orderId), {}, false )
     .then(function(_o) {
	console.log(_o);
	 if(_o?.order) {
	     let request = webRequest.get(o.api.getShopOrderDetailsMethod(o.orderId),{}, false )
	       .then(function(data) {
		console.log(data);
	           const totalQuantity = data.items.reduce((quantity, item) => quantity + item.quantity, 0);
	  	   const ordersPage = new OrderDetailsSection("order-container");
	 	   ordersPage.OrderDetailsCardContainer(
	  	   _o.order, totalQuantity, data.totalAmount);
	  	   ordersPage.render();
	            if(data?.items?.length != 0) {
	              data?.items?.forEach(item => {
	 		new OrderDetailsItem("order-details-body-container", item);
	             });
	          }
	        }) 
	     .catch(function(error) {
	       console.log('showOrderInfoPage.Произошла ошибка =>', error);
	     });
	   }
        }) 
     .catch(function(error) {
       console.log('showOrderInfoPage.Произошла ошибка =>', error);
     });

    return this;
 }



 setProfileValueElement(elementSelector, value) {
    const el = document.querySelector(elementSelector);
    if (el) el.textContent = value;
    if (el) el.value = value;
 }

 showProfilePage(){
  let o = this;
  let webRequest = new WebRequest();
  let request = webRequest.get(o.api.getShopProfileMethod(), {}, false )
     .then(function(data) {
	  console.log(data);
	  if(!data) {
	       toastr.error('Ой! Что то пошло не так...', 'Профиль клиента', {timeOut: 3000});
	  } else {

	  	 const profilePage = new ProfileSection("profile-card-container");
	 	 profilePage.ProfileCardContainer();
	  	 profilePage.render();

	  	 o.setProfileValueElement('[id="login"]', data.profile?.login ?? '') 
	  	 o.setProfileValueElement('[id="surname"]', data?.profile?.surname ?? '') 
	  	 o.setProfileValueElement('[id="firstname"]', data?.profile?.name ?? '') 
	  	 o.setProfileValueElement('[id="patronymic"]', data?.profile?.patronymic ?? '') 
	  	 o.setProfileValueElement('[id="phone"]', data?.profile?.phone ?? '') 
	  	 o.setProfileValueElement('[id="address"]', data?.profile?.address ?? 'адрес') 

              // Слушатели событий
		var validator = new InputMaskValidator({ id : 'phone', error : 'phone-error'});
	      //	
		const autocomplete = document.getElementById('address');
		 autocomplete
		        .setUrl('/api/bff/client/v1/suggest/address?query=') // Установите URL для поиска
			.setPlaceholder('Введите данные для доставки - город, улицу, дом, квартиру...')
		        .onRequest(() => {
			   console.log('Запрос к API отправлен');
		        })
		        .onLoad((response) => {
		            console.log('Данные загружены', response);
		            if(!response.data) { 
				autocomplete.hideItemsBlock() 
			     } else {
		              (response?.data?.length == 0)
			        ? autocomplete.hideItemsBlock()
		                : response.data.forEach(item => {
		                   autocomplete.dropDownListItemDraw(item, item.fiasId, item.value);
		           });
			  }	
		        })
		        .onSelect((item) => {
	            console.log('Выбран элемент', item);
	        });
            }
        })                                
     .catch(function(error) {
       console.log('showProfilePage.Произошла ошибка =>', error);
       toastr.error('Ой! Что то пошло не так...', 'Профиль клиента', {timeOut: 3000});
     });

    const closeSessionButton = document.querySelector('[class="session-close"]');
    if (closeSessionButton) {
        closeSessionButton.addEventListener('click', () => {
	  let request = webRequest.post(o.api.closeSessionMethod(), {}, false )
	     .then(function(data) {
		document.location.replace(o.api.LOGON_URL());
        })                                
	     .catch(function(error) {
	       console.log('showProfilePage.Произошла ошибка =>', error);
	       toastr.error('Ой! Что то пошло не так...', 'Профиль клиента', {timeOut: 3000});
        });
      });
     }

    const saveProfileButton = document.querySelector('[class="profile-button"]');
    if (saveProfileButton) {
        saveProfileButton.addEventListener('click', () => {
	  let request = webRequest.post(o.api.saveShopProfileMethod(), 
		{                                          
		  surname : surname.value,
		  name : firstname.value,
		  patronymic : patronymic.value,
		  phone : phone.value,
		  address : address.value
		},
	 	  false )
	     .then(function(data) {
	       toastr.success('Профиль сохранен', 'Профиль', {timeOut: 3000});
        })                                
	     .catch(function(error) {
	       console.log('showProfilePage.Произошла ошибка =>', error);
	       toastr.error('Ой! Что то пошло не так...', 'Профиль клиента', {timeOut: 3000});
        });
      });
     }

    return this;
  
 }
}


