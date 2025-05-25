const USER_DELIVERY_ADDRESS_LOAD_MESSAGE = 'USER_DELIVERY_ADDRESS_LOAD_MESSAGE';
const EVENT_SET_DEFAULT_DELIVERY_ADDRESS = 'EVENT_SET_DEFAULT_DELIVERY_ADDRESS';
const EVENT_RELOAD_ADDRESS_DIALOG = "reloadAddressDialog";
const EVENT_BASKET_ITEM_UPDATE = "basketItemUpdated";
const EVENT_POSTAL_UNIT_UPDATE = "EVENT_POSTAL_UNIT_UPDATE";
const EVENT_TOP_HEADER_SEARCH_INPUT_CHANGE_ACTION  = "EVENT_TOP_HEADER_SEARCH_INPUT_CHANGE_ACTION";
const EVENT_TOP_HEADER_FILTER_ACTION  = "EVENT_TOP_HEADER_FILTER_ACTION";
const EVENT_TOP_HEADER_SEARCH_ACTION = "EVENT_TOP_HEADER_SEARCH_ACTION";
const QUEUE_TOP_HEADER_ACTIONS = "QUEUE_TOP_HEADER_ACTIONS"
const EVENT_PRODUCTS_PAGE_SCROLL = 'EVENT_PRODUCTS_PAGE_SCROLL'
const EVENT_PRODUCTS_PAGE_FILTERS_APPLY = 'EVENT_PRODUCTS_PAGE_FILTERS_APPLY'


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
      this.common.init();
      this.common.saveAccessToken(this.common.me);
      this.common.saveTelegramAccessToken(this.common.me);
      this.common.saveTelegramWebAppObject();
      this.webRequest = new WebRequest();
      this.categories = null;
      this.brands = null;
      this.init();	
      return this;
   }

   sendEvent(queue, o){
      if (eventBus) {
	console.log(`eventBus =>`,queue, o);
        eventBus.emit(queue, o);
      } else console.log(`!eventBus`);
    }


 init(){
   let me = this.common.me;
   if(me.isTelegramAuth == true  // для телеграмм-авторизации
	&& me.pinCodeEnabled  	//  если установлен пин-код
		&& !me.pinCodeChecked  // пин-код не введен
			&& window.location.pathname != this.api.PIN_CODE_LOGON_PAGE) // не на странице авторизации
   document.location.replace(this.api.PIN_CODE_LOGON_PAGE);
 }

 showCaseEmptyPageOutput(){
  return `
	<section class="error-page error-page-option text-center page-padding block-space">
	    <span class="error-page-title center-text">Нет запрашиваемых товаров</span>
	</section>`;
 }

 showCaseErrorPageOutput(){
  return `
	<section class="error-page error-page-option text-center page-padding block-space">
	    <span class="error-page-title center-text">Сервис товаров временно недоступен</span>
	</section>`;
 }

  
loadCategories() {
  let result = this.webRequest.get(this.api.getProductCategoriesMethod(), {}, true );
  return result.data.categories || [];
}

loadBrands() {
  let result = this.webRequest.get(this.api.getProductBrandsMethod(), {}, true );
  return result.data.brands || [];
}

getRightSidebarComponent(){
 return document.querySelector('right-sidebar') || null;
}


getSearchWord(){
 const search = document.querySelector('.search-input');
 console.log(search);
 return search.value || null;
}

saveProductPageFilters(o){
  localStorage.setItem('product-page-filters', JSON.stringify(o));
}

getProductPageFilters(){
 try{
    return JSON.parse(localStorage.getItem('product-page-filters')) || {};
    } catch(e) {
  return null;
 } 
}

filterBadge(show, value){
 const header = document.querySelector('top-header');
 const badge = header.shadowRoot.querySelector('custom-badge');
 if(show){
   badge.show();
  } else  badge.hide();

}


showCasePage() {
    try {
        const o = this;
        o.searchWord = null;
        o.categories = null;
        o.page = 1;
        o.limit = 10; // Добавлено явное указание лимита
        o.loading = false;
        o.hasMoreProducts = true;
        o.cache = new Map(); // Кэш для уже загруженных страниц
	o.saveProductPageFilters({});

        // Инициализация элементов навигации
        const initNavigation = () => {
            const me = AuthDto.loadFromLocalStorage();
            const isAuth = me.isTokenValid();
            
            const menuItems = {
                orders: MobileNavbarItem.menuItemContainer('orders'),
                basket: MobileNavbarItem.menuItemContainer('basket'),
                profile: MobileNavbarItem.menuItemContainer('profile'),
                logon: MobileNavbarItem.menuItemContainer('logon'),
                questions: MobileNavbarItem.menuItemContainer('questions')
            };

            Object.entries(menuItems).forEach(([key, item]) => {
                if (!item?.style) return;
                
                item.style.display = 
                    (key === 'logon' || key === 'questions') ? 
                    (isAuth ? 'none' : 'block') : 
                    (isAuth ? 'block' : 'none');
            });
        };

        // Debounce функция с улучшенной типизацией
        const debounce = (func, wait) => {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        };

        // Обработчик остановки скролла
        const handleScrollStop = debounce(() => {
            eventBus?.emit(QUEUE_TOP_HEADER_ACTIONS, { 
                event: EVENT_PRODUCTS_PAGE_SCROLL 
            });
        }, 100);

        // Улучшенный обработчик скролла с IntersectionObserver
        const initScrollHandlers = () => {
            // Стандартный обработчик скролла
            window.addEventListener('scroll', handleScrollStop, { passive: true });
            
            // Оптимизация с IntersectionObserver для предзагрузки
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && 
                        !o.loading && 
                        o.hasMoreProducts) {
                        o.page++;
                        loadProducts(o.page);
                    }
                });
            }, { threshold: 0.1 });
            
            // Наблюдаем за элементом-триггером внизу страницы
            const trigger = document.createElement('div');
            trigger.id = 'scroll-trigger';
            document.querySelector("div.product-card-container").appendChild(trigger);
            observer.observe(trigger);
        };

// Загрузка продуктов с кэшированием
        const loadProducts = async (page = 1) => {
	    console.log(o.loading, o.hasMoreProducts);			
	    let search  = o.searchWord;
	    let filters = o.getProductPageFilters();
	    let filterView = (filters?.categories?.length > 0 || filters?.brands?.length > 0 
			  || filters?.minPrice != null
			     || filters?.maxPrice != null )
	    console.log(`fliterView=>`,filterView);
	    o.filterBadge(filterView, '+');

            if (o.loading || !o.hasMoreProducts) return;
	    console.log(`loadProducts....`,search, filters);
            o.loading = true;
            showLoadingIndicator();
            
            try {
                const webRequest = new WebRequest();
                const data = await webRequest.post(
                    o.api.getShopProductsMethod(), 
                    { page, limit: o.limit, search, filters }, 
                    false
                );

                if (data.length === 0) {
                    o.hasMoreProducts = false;
                    if (page === 1) {
                        showEmptyPage();
                    }
                    return;
                }
                
                renderProducts(data, page === 1);
                
                if (data.length < o.limit) {
                    o.hasMoreProducts = false;
                }
                
                // Prefetch следующей страницы
                if (data.length === o.limit && !o.cache.has(`${page+1}_${search}_${filters?.categories?.join(',')}`)) {
                    prefetchNextPage(page + 1);
                }
            } catch (error) {
                console.error('Error loading products:', error);
                showErrorState(page === 1);
                toastr.error('Ошибка при получении товаров', 'Товары', { timeOut: 3000 });
            } finally {
                o.loading = false;
                hideLoadingIndicator();
            }
        };

        // Предзагрузка следующей страницы
        const prefetchNextPage = (page) => {
	    const filters = o.getProductPageFilters(); 	            
            const search = o.searchWord;
            if (o.loading) return;
            
            const webRequest = new WebRequest();
            webRequest.post(
                o.api.getShopProductsMethod(), 
                { page, limit: o.limit, search, filters }, 
                false
            ).then(data => {
            }).catch(console.error);
        };

        // Рендер продуктов
        const renderProducts = (products, clearContainer = false) => {
            if (clearContainer) {
                $("div.product-card-container").empty();
            }
            
            const fragment = document.createDocumentFragment();
            
            products.forEach(product => {
                if (product?.productId) {
                    const card = createProductCard(product);
                    fragment.appendChild(card);
                }
            });
            
            document.querySelector("div.product-card-container").appendChild(fragment);
        };

        // Создание карточки продукта
        const createProductCard = (product) => {
            const card = document.createElement('product-card');
            const attrs = {
                'product-id': product.productId,
                'like': product.like || 0,
                'status': 'active',
                'image-src': product.mediaFiles[0]?.mediaKey || '',
                'image-alt': product.productName || '',
                'brand': product.brandName || '',
                'name': product.productName || '',
                'current-price': product.price || 'цена не указана',
                'old-price': product.priceOld || '',
                'currency-type': product.charCurrency || '₽',
                'aria-label': product.productName || '',
                'basket-count': product.basketCount || 0,
                'rating': product.rating || 0,
                'comments': product.comments || 0
            };
            
            Object.entries(attrs).forEach(([key, value]) => {
                card.setAttribute(key, value);
            });
            
            return card;
        };

        // Вспомогательные функции
        const showLoadingIndicator = () => {
            $("div.product-card-container").append('<div class="loading-indicator">Загрузка...</div>');
        };

        const hideLoadingIndicator = () => {
            $(".loading-indicator").remove();
        };

        const showEmptyPage = () => {
            $("div.product-card-container").html(o.showCaseEmptyPageOutput()).show();
        };

        const showErrorPage = () => {
            $("div.product-card-container").html(o.showCaseErrorPageOutput()).show();
        };

        const showErrorState = (show) => {
            if (show) {
                showErrorPage();
            }
        };

        // Инициализация обработчиков событий
        const initEventHandlers = () => {
            eventBus?.on(QUEUE_TOP_HEADER_ACTIONS, async (message) => {
                switch (message.event) {
                    case EVENT_TOP_HEADER_SEARCH_ACTION:
                    case EVENT_TOP_HEADER_SEARCH_INPUT_CHANGE_ACTION:
                        if (message.event === EVENT_TOP_HEADER_SEARCH_INPUT_CHANGE_ACTION && message.value !== '') {
                            return;
                        }
                        resetProductList(message.value);			
                        break;
                        
                    case EVENT_PRODUCTS_PAGE_SCROLL:
                        if (o.hasMoreProducts && !o.loading) {
                            o.page++;				
                            loadProducts(o.page);
                        }
                        break;
                        
                    case EVENT_TOP_HEADER_FILTER_ACTION:
                        document.querySelector('right-sidebar')?.open();
                        break;

                    case EVENT_PRODUCTS_PAGE_FILTERS_APPLY:
                        o.hasMoreProducts = true;
		        o.loading = false;
			o.page = 1;

                        loadProducts(o.page);
                        break;
                }
            });
        };

        const resetProductList = (searchWord = null) => {
            $("div.product-card-container").empty();
            o.searchWord = searchWord;
	    const filters = o.getProductPageFilters(); 	
            o.categories = filters?.categories || [];
            o.loading = false;
            o.hasMoreProducts = true;
            o.page = 1;
            o.cache.clear(); // Очищаем кэш при новом поиске
            loadProducts(1);
        };

	const handleApplyButton = () => {
	    let filters = {};	
	    const minPrice   = document.querySelector('#min-price');
	    const maxPrice   = document.querySelector('#max-price');
	    filters.minPrice   = minPrice.value != '' ? minPrice.value : null;
	    filters.maxPrice   = maxPrice.value != '' ? maxPrice.value :  null;

	    const categories = document.querySelector('tree-selector#categories');
	    filters.categories = categories.getSelectedIdsOnly() || null; //
 
	    const brands = document.querySelector('tree-selector#brands');	
	    filters.brands = brands.getSelectedIdsOnly() || null; // 
  	    o.saveProductPageFilters(filters);	
	    this.getRightSidebarComponent().close();
	    o.sendEvent(QUEUE_TOP_HEADER_ACTIONS,{ event : EVENT_PRODUCTS_PAGE_FILTERS_APPLY, filters }); // перегрузить страницу
	}

        // Основная инициализация
        initNavigation();
        initScrollHandlers();
        initEventHandlers();
        
        // Загрузка начальных данных
        o.categories = o.loadCategories();
        document.getElementById('categories').data = o.categories;
       
        o.brands = o.loadBrands();
        document.getElementById('brands').data = o.brands;
        
        // Первоначальная загрузка продуктов
        loadProducts(o.page);

	const applyButton = document.querySelector('button.product-filters-apply-button');
        applyButton.addEventListener('click', handleApplyButton);

        // Очистка
        o.cleanupShowCase = () => {
            window.removeEventListener('scroll', handleScrollStop);
            eventBus?.off(QUEUE_TOP_HEADER_ACTIONS);
            document.getElementById('scroll-trigger')?.remove();
        };

    } catch (e) {
        console.error('Error in showCasePage:', e);
        $("div.product-card-container").html(this.showCaseEmptyPageOutput()).show();
    }
    
    return this;
}


/* Вывод страницы профиля */
 showBasketPage() {
  let o = this;
  let webRequest = new WebRequest();
  let request = webRequest.get(o.api.getShopBasketMethod(),  {}, false )
     .then(function(data) {
  	   const basketPage = new BasketSection("basket-container");
           const totalQuantity = data?.basket?.reduce((quantity, item) => quantity + item.quantity, 0);
 	   basketPage.BasketCardContainer(totalQuantity, data?.totalAmount, data);
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

  let request = webRequest.get(o.api.getShopProductDetailsMethod(o.productId),  {}, false )
     .then(function(product) {
       const reviewsPage = new ReviewsCardPage("reviews-card-container");
       reviewsPage.ReviewsContainer(product);
       let getReviewRequest = webRequest.get(o.api.getReviewsMethod(o.productId),  {}, false )
        .then(function(data) {
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

  let request = webRequest.get(o.api.getShopProductDetailsMethod(o.productId),  {}, false )
     .then(function(product) {
       const mailPage = new ProductMailPage("product-mail-card-container");
       mailPage.ProductMailContainer(product);
       mailPage.render();

       let getProductMailRequest = webRequest.get(o.api.getProductMailMethod(o.productId),  {}, false )
        .then(function(data) {
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

  let request = webRequest.get(o.api.getShopProductDetailsMethod(o.productId),  {}, false )
     .then(function(product) {
       const mailPage = new ProductMailPage("product-mail-card-container");
       mailPage.ProductMailContainer(product);
       mailPage.render();

       let getProductMailRequest = webRequest.get(o.api.getProductMailPersonalMethod(o.productId, o.userId),  {}, false )
        .then(function(data) {

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

  let request = webRequest.get(o.api.getShopProductDetailsMethod(o.productId),  {}, false )
     .then(function(product) {
       const reviewsPage = new ReviewsCardPage("reviews-card-container");
       reviewsPage.ReviewsContainer(product);
       webRequest.get(o.api?.getReviewMethod(o.productId),  {}, false ).then(function(data) {
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

  let webRequest = new WebRequest();
  let request = webRequest.get(o.api.getShopProductDetailsMethod(o.productId),  {}, false )
     .then(function(data) {
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

  let webRequest = new WebRequest();
  let request = webRequest.get(o.api.getShopOrderMethod(o.orderId), {}, false )
       .then(function(data) {
  	   const ordersPage = new OrderDetailsSection("order-container");
 	   ordersPage.OrderDetailsCardContainer(
		data.order, data.order.itemsCount, data.order.totalAmount);
  	   ordersPage.render();
            if(data?.order.items?.length != 0) {
              data?.order.items?.forEach(item => {
 		new OrderDetailsItem("order-details-body-container", 
		data?.order?.orderId, data?.order?.status, item);
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

   PINCodeLogonPage(){
    let o = this;
    const pinCodeLogonPage = new PINCodeLogonPageSection("pincode-logon-container");
    pinCodeLogonPage.PINCodeLogonPageCardContainer();
    pinCodeLogonPage.render();
    return this;
  }



}


