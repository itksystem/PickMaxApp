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

 basketTitleOutput(totalAmount){
  return `
	<section class="outside-city delivery-option page-padding block-space">
	    <h2 class="header-title">Ваша корзина</h2>
	    <div class="w-100">
	        <div class="delivery-content">
		   <div class="delivery-content-card">
			<div class="row">		
			   <div class="col-5">		
			     <div class="delivery-content-card-info">${totalAmount}</div>
			     </br><center><small>сумма товаров</small></center>
			   </div>		
  	   	       	   <div class="col-7">		
	                     <button class="btn btn-lg btn-success float-right create-order" >Оформить заказ</button>
	   	           </div>	
  	               </div>	
 	            </div>	
                </div>
	    </div>
	</section>
`;

 }


 basketEmptyOutput(){
  return `
	<section class="outside-city delivery-option page-padding block-space">
	    <h2 class="header-title">В корзине нет товаров </h2>
	</section>
`;

 }




 basketItemCardOutput(item){
   return `
	<section class="outside-city delivery-option page-padding block-space">
	    <h2 class="header-title">${item.productName}</h2>
	    <div class="w-100">
	        <div class="delivery-content">
		   <div class="delivery-content-card">
			<div class="row">		
  	   	       	   <div class="col-6">		
		                <ul>
		                    <li>Цена : ${item.price}</li>
	        	            <li>Количество : ${item.quantity}</li>
        	        	    <li>Сумма: ${item.quantity * item.price}</li>
		                </ul>
		            </div>
			   <div class="col-6">		
				<img src="${item.mediaFiles[0].mediaKey}" style="width: 9rem;" >
 			   </div>		
  	   	        </div>		

			<div class="row">		
		           <div class="col">
				<div class="row">		
  		   	       	   <div class="col">		
	                	     <button class="btn btn-danger basket-delete-button" 
					product-id="${item.productId}" 
					quantity=${item.quantity}>Удалить</button>
				   </div>	
	  	   	      </div>	
         	          </div>
		      </div>
	           </div>
                </div>
	    </div>
	</section>

   `;
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


 showBasketPage() {
  let o = this;
  let webRequest = new WebRequest();
  let request = webRequest.get(o.api.getShopBasketMethod(),  {}, false )
     .then(function(data) {
        console.log(data);
        (data.basket?.length > 0)
	 ?  $("div.basket-container").prepend(o.basketTitleOutput(data.totalAmount)).show()
	 :  $("div.basket-container").prepend(o.basketEmptyOutput()).show();
            data.basket.forEach(item => {
              console.log(item);
              $("div.basket-container").append(o.basketItemCardOutput(item)).show();
           });
	 o.dropSectionEventHadler(); // Инициализация обработчиков кликов	
	 o.createOrderButtonEventHadler();
        })                                
     .catch(function(error) {
       console.log('showBasketOutput.Произошла ошибка =>', error);
     });
    return this;
 }

  createOrderButtonEventHadler() {
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
	<section class="outside-city delivery-option page-padding block-space">
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
	<section class="outside-city delivery-option page-padding block-space">
	    <h2 class="header-title">Ваши заказы </h2>
	</section>`;
  }

 OrdersEmptyPage(){
 return `
	<section class="outside-city delivery-option page-padding block-space">
	    <h2 class="header-title">В корзине нет товаров </h2>
	</section>`;
 }



 showOrdersPage(){
  let o = this;
  let webRequest = new WebRequest();
  $("div.orders-container").prepend(o.OrdersPageTitle()).show();
  let request = webRequest.get(o.api.getShopOrdersMethod(), o.api.getShopOrdersMethodPayload(), false )
     .then(function(data) {

	console.log(data);
        (data?.orders?.length == 0)
	 ?  $("div.orders-container").prepend(o.OrdersEmptyPage()).show()
	 :  data?.orders?.forEach(item => {
              console.log(item);
              $("div.orders-container").append(o.orderItemCardOutput(item)).show();
           });
	 o.dropSectionEventHadler(); // Инициализация обработчиков кликов	
	 o.createOrderButtonEventHadler();
        })                                
     .catch(function(error) {
       console.log('showOrdersPage.Произошла ошибка =>', error);
     });
    return this;
 }



 showProfilePageOutput(){
return `
        <!-- Поле для отражения email -->
        <div class="profile-input-group">
            <label for="login">Login</label>
            <span type="text" id="login" 
		style="font-size: 1rem; color: #7a7a7a;"
		placeholder="Введите ваше имя" readonly disable ></span>
        </div>

        <!-- Поле для ввода имени -->
        <div class="profile-input-group">
            <label for="name">Имя</label>
            <input type="text" id="firstname" placeholder="Введите ваше имя" required >
        </div>
              
        <!-- Поле для ввода отчества -->
        <div class="profile-input-group">
            <label for="patronymic">Отчество</label>
            <input type="text" id="patronymic" placeholder="Введите ваше отчество">
        </div>

        <!-- Поле для ввода фамилии -->
        <div class="profile-input-group">
            <label for="surname">Фамилия</label>
            <input type="text" id="surname" placeholder="Введите вашу фамилию" required>
        </div>
        
        <!-- Поле для ввода номера телефона -->
        <div class="profile-input-group">
            <label for="phone">Номер телефона</label>
            <input type="tel" id="phone" placeholder="7XXXXXXXXXX" required>
        </div>
        
        <!-- Поле для ввода адреса доставки -->
        <div class="profile-input-group">
            <label for="address">Адрес доставки</label>
            <input type="text" id="address" placeholder="Введите ваш адрес доставки" required>
        </div>
        
        <!-- Кнопка сохранения -->
        <div class="profile-button-container">
            <button class="profile-button"  >Сохранить</button>
        </div>
        <div class="profile-button-container">
            <a class="session-close">Выйти из магазина</a>
        </div>
`;
 }

 showProfilePage(){
  let o = this;
  let webRequest = new WebRequest();
  $("div.profile-container").prepend(o.showProfilePageOutput()).show();
  let request = webRequest.get(o.api.getShopProfileMethod(), {}, false )
     .then(function(data) {
	  console.log(data);
          const login = document.querySelector('[id="login"]');
          if (login) login.textContent = data?.profile?.login;

          const surname = document.querySelector('[id="surname"]');
          if (surname) surname.value = data?.profile?.surname;

          const firstname = document.querySelector('[id="firstname"]');
          if (firstname) firstname.value = data?.profile?.name;

          const patronymic = document.querySelector('[id="patronymic"]');
          if (patronymic) patronymic.value = data?.profile?.patronymic;

          const phone = document.querySelector('[id="phone"]');
          if (phone) phone.value = data?.profile?.phone;

          const address = document.querySelector('[id="address"]');
          if (address) address.value = data?.profile?.address;
        })                                
     .catch(function(error) {
       console.log('showOrdersPage.Произошла ошибка =>', error);
     });

    const closeSessionButton = document.querySelector('[class="session-close"]');
    if (closeSessionButton) {
        closeSessionButton.addEventListener('click', () => {
	  let request = webRequest.post(o.api.closeSessionMethod(), {}, false )
	     .then(function(data) {
		document.redirect(o.api.LOGON_URL());
        })                                
	     .catch(function(error) {
	       console.log('showOrdersPage.Произошла ошибка =>', error);
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
		alert('Профиль сохранен!');
        })                                
	     .catch(function(error) {
	       console.log('showOrdersPage.Произошла ошибка =>', error);
        });
      });
     }

    return this;
  
 }
}


