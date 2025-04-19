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
      this.common.saveAccessToken();
      this.common.saveTelegramAccessToken();
      this.common.saveTelegramWebAppObject();
      return this;
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
  	       	    const container = document.querySelector("div.product-card-container");
		     const productCard = document.createElement('product-card');
		     productCard.setAttribute('product-id', product.productId);
		     productCard.setAttribute('like', product.like);
		     productCard.setAttribute('status', 'active');
		     productCard.setAttribute('image-src', product.mediaFiles[0]?.mediaKey || '');
		     productCard.setAttribute('image-alt', product.productName);
		     productCard.setAttribute('brand', 'Brand');
		     productCard.setAttribute('name', product.productName);
		     productCard.setAttribute('current-price', product.price);
		     productCard.setAttribute('old-price', product.price * 1.3);
		     productCard.setAttribute('currency-type', '₽');
		     productCard.setAttribute('aria-label', product.productName);
		     productCard.setAttribute('basket-count', product.basketCount);
		     container.appendChild(productCard);
                });
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
                o.page++; // Увеличиваем номер страницы
                loadProducts(o.page); // Загружаем следующую порцию товаров
            }
        });

    } catch (e) {
        console.log('initializeProductCard.catch =>', e);
    }
    return this;
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
        })                                
     .catch(function(error) {
       console.log('showBasketOutput.Произошла ошибка =>', error);
     });
    return this;
 }


/* Вывод страницы отзывов */
 showReviewsPage() {
  let o = this;
  let webRequest = new WebRequest();
  const url = window.location.pathname; // Получаем путь 
  const match = url.match(/\/reviews\/([^/]+)\/page/);
  o.productId = match ? match[1] : null;
  console.log(o.productId);

  let request = webRequest.get(o.api.getShopProductDetailsMethod(o.productId),  {}, false )
     .then(function(product) {
       const reviewsPage = new ReviewsCardPage("reviews-card-container");
       reviewsPage.ReviewsContainer(product);
       let getReviewRequest = webRequest.get(o.api.getReviewsMethod(o.productId),  {}, false )
        .then(function(data) {
           console.log(data)                        
  	   reviewsPage.render();

	 if(data.reviews.length) {
            data.reviews.forEach(item => {
		new ReviewItem("review-items-box", item);
            });
	  } else {
	    reviewsPage.ReviewsEmptyPage();
	 }
        })                    
     .catch(function(error) {
       console.log('showReviewsPage.Произошла ошибка =>', error);
     })
    })                                
    .catch(function(error) {
       console.log('showReviewsPage.Произошла ошибка =>', error);
     });       
    return this;
 }

 loader(show = false){
  let _loader = document.querySelector('custom-loader.product-mail-card-container');
  if(_loader) {
    ((show )
      ?  _loader.open()
      :  _loader.close());
    }
 }

/* Вывод страницы почтового обмена по продукту */
 showProductMailPage() {
  let o = this;
  let webRequest = new WebRequest();
  const url = window.location.pathname; // Получаем путь 
  const match = url.match(/\/products\/([^/]+)\/mails\/page/);
  o.productId = match ? match[1] : null;
  console.log(o.productId);

  let request = webRequest.get(o.api.getShopProductDetailsMethod(o.productId),  {}, false )
     .then(function(product) {
       const mailPage = new ProductMailPage("product-mail-card-container");
       mailPage.ProductMailContainer(product);
       mailPage.render();

       let getProductMailRequest = webRequest.get(o.api.getProductMailMethod(o.productId),  {}, false )
        .then(function(data) {
         console.log(data)                        
	 if(data?.mails?.length) {
 	    o.loader(true);
            data?.mails?.forEach(item => {
	      new ProductMailItem("mail-items-box", item);
            });
 	    o.loader(false);
          } else {
	      mailPage.ProductMailEmptyPage();
	   }
        })                                
     .catch(function(error) {
       console.log('showMailsPage.Произошла ошибка =>', error);
	mailPage.ProductMailEmptyPage();
        o.loader(false);
     })
    })                                
    .catch(function(error) {
       console.log('showMailsPage.Произошла ошибка =>', error);
       mailPage.ProductMailEmptyPage();
       o.loader(false);
     });       
    return this;
 }


/* Вывод страницы переписки с пользователем почтового обмена по продукту */
 showProductMailReplyPage() {
  let o = this;
  let webRequest = new WebRequest();
  const url = window.location.pathname; // Получаем путь 
  const match = url.match(/\/products\/([^/]+)\/mail-reply\/([^/]+)\/page/);
   
  o.productId = match ? match[1] : null;
  o.userId = match ? match[2] : null;
  console.log(match, o.productId,o.userId);

  let request = webRequest.get(o.api.getShopProductDetailsMethod(o.productId),  {}, false )
     .then(function(product) {
       const mailPage = new ProductMailPage("product-mail-card-container");
       mailPage.ProductMailContainer(product);
       mailPage.render();

       let getProductMailRequest = webRequest.get(o.api.getProductMailPersonalMethod(o.productId, o.userId),  {}, false )
        .then(function(data) {
         console.log(data)                        
	 if(data?.mails?.length) {
            data?.mails?.forEach(item => {
	      new ProductMailItem("mail-items-box", item);
            });
	     } else {
	      mailPage.ProductMailEmptyPage();
	   }
        })                                
     .catch(function(error) {
       console.log('showMailsPage.Произошла ошибка =>', error);
	mailPage.ProductMailEmptyPage();
     })
    })                                
    .catch(function(error) {
       console.log('showMailsPage.Произошла ошибка =>', error);
       mailPage.ProductMailEmptyPage();
     });       
    return this;
 }



/* Вывод страницы отзыва пользователя */
 showReviewsMyPage() {
  let o = this;
  let webRequest = new WebRequest();
  const url = window.location.pathname; // Получаем путь 
  const match = url.match(/\/reviews\/([^/]+)\/my\/review\/page/);
  o.productId = match ? match[1] : null;
  console.log(o.productId);

  let request = webRequest.get(o.api.getShopProductDetailsMethod(o.productId),  {}, false )
     .then(function(product) {
       const reviewsPage = new ReviewsCardPage("reviews-card-container");
       reviewsPage.ReviewsContainer(product);
       webRequest.get(o.api?.getReviewMethod(o.productId),  {}, false ).then(function(data) {
            console.log(data)                        
      	    reviewsPage.render();

	 if(data?.reviews?.length > 0) {
            data?.reviews?.forEach(item => {
		new ReviewItem("review-items-box", item);
            });
	  } else {
	    reviewsPage.ReviewsEmptyPage();
	 }
       }).catch(function(error) {
       console.log('showReviewsPage.Произошла ошибка =>', error);
      reviewsPage.ReviewsEmptyPage();
     })
    })                                
    .catch(function(error) {
       console.log('showReviewsPage.Произошла ошибка =>', error);
      reviewsPage.ReviewsEmptyPage();
     });       
     return this;
 }



 showProductDetailsPage() {
  let o = this;
  const urlParams = new URLSearchParams(window.location.search); // Получаем текущий URL
  const url = window.location.pathname; // Получаем путь 
  const match = url.match(/\/products\/([^/]+)\/page/);
  o.productId = match ? match[1] : null;
  console.log(o.productId);

  let webRequest = new WebRequest();
  let request = webRequest.get(o.api.getShopProductDetailsMethod(o.productId),  {}, false )
     .then(function(data) {
           console.log(data)
  	   const productDetailsPage = new ProductDetailsSection("product-details-card-container");
 	   productDetailsPage.ProductDetailsCardContainer(data);
  	   productDetailsPage.render();
        })                                
     .catch(function(error) {
       console.log('showBasketOutput.Произошла ошибка =>', error);
     });
    return this;

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

 showOrdersPage(){
  let o = this;
  let webRequest = new WebRequest();
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
  let request = webRequest.get(o.api.getShopOrderMethod(o.orderId), {}, false )
     .then(function(_o) {
	console.log(_o);
	 if(_o?.order) {
	     let request = webRequest.get(o.api.getShopOrderDetailsMethod(o.orderId),{}, false )
	       .then(function(data) {
		console.log(data);
	           const totalQuantity = data.items.reduce((quantity, item) => quantity + item.quantity, 0);
	  	   const ordersPage = new OrderDetailsSection("order-container");
	 	   ordersPage.OrderDetailsCardContainer(_o.order, totalQuantity, data.totalAmount);
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

  verificationCodeConfirmed(){
   let confirmForm = document.querySelector('dropdown-section.registration-confirm-form');
   if(confirmForm)	
     confirmForm.remove();
   let confirmMessage = document.querySelector('.registration-confirm-message');
   if(confirmMessage)	
     confirmMessage.innerHTML=`Электронный адрес подтвержден`;
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
	 	 profilePage.UserProfileCardContainer(data);
	  	 profilePage.render();
		 if(data?.profile?.confirmed)
			o.verificationCodeConfirmed()

              // Слушатели событий
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
   return this;
 }

  ConfirmationEmailPage(){
    let o = this;
    const confirmationEmailPage = new ConfirmationEmailSection("confirmation-email-container");
    confirmationEmailPage.ConfirmationEmailCardContainer();
    confirmationEmailPage.render();
    return this;
  }

  ConfirmationPhonePage(){
    let o = this;
    const confirmationPhonePage = new ConfirmationPhoneSection("confirmation-phone-container");
    confirmationPhonePage.ConfirmationPhoneCardContainer();
    confirmationPhonePage.render();
    return this;
  }


  BalanceHistoryPage(){
    let o = this;
    const balanceHistoryPage = new BalanceHistorySection("balance-history-card-container");
    balanceHistoryPage.BalanceHistoryCardContainer();
    balanceHistoryPage.render();
    return this;
  }

  ChangeDigitalCodePage(){
    let o = this;
    const digitalCodePage = new ChangeDigitalCodePageSection("digital-code-card-container");
    digitalCodePage.ChangeDigitalCodeCardContainer();
    digitalCodePage.render();
    return this;
  }

  DisableDigitalCodePage(){
    let o = this;
    const digitalCodePage = new DisableDigitalCodePageSection("digital-code-card-container");
    digitalCodePage.DisableDigitalCodeCardContainer();
    digitalCodePage.render();
    return this;
  }

  ChangeSecurityQuestionPage(){
    let o = this;
    const securityQuestionPage = new ChangeSecurityQuestionPageSection("security-question-card-container");
    securityQuestionPage.ChangeSecurityQuestionCardContainer();
    securityQuestionPage.render();
    return this;
  }

  DisableSecurityQuestionPage(){
    let o = this;
    const securityQuestionPage = new DisableSecurityQuestionPageSection("security-question-card-container");
    securityQuestionPage.DisableSecurityQuestionCardContainer();
    securityQuestionPage.render();
    return this;
  }


}


