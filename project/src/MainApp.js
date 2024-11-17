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
  
 showCaseOutput() {
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
                console.error('initializeProductCard.Произошла ошибка =>', error);
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
        console.error('initializeProductCard.catch =>', e);
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
	       console.error('showBasketOutput.Произошла ошибка =>', error);
	     });
        });
    });
 } 

 showBasketOutput() {
  let o = this;
  let webRequest = new WebRequest();
  const urlParams = new URLSearchParams(window.location.search); // Получаем текущий URL
  let request = webRequest.get(o.api.getShopBasketMethod(),  {}, false )
     .then(function(data) {
        console.log(data);
	$("div.basket-container").prepend(o.basketTitleOutput(data.totalAmount)).show();
        data.basket.forEach(item => {
              console.log(item);
              $("div.basket-container").append(o.basketItemCardOutput(item)).show();
           });
	 o.dropSectionEventHadler(); // Инициализация обработчиков кликов	
	 o.createOrderButtonEventHadler();
        })                                
     .catch(function(error) {
       console.error('showBasketOutput.Произошла ошибка =>', error);
     });
    return this;
 }


createOrderButtonEventHadler() {
    let o = this;
    // Находим все кнопки с классом 'create-order'
    document.querySelectorAll('.create-order').forEach(button => {
        button.addEventListener('click', function() {
            let webRequest = new WebRequest();
            // Отправляем POST-запрос
            webRequest.post(o.api.createOrderMethod(), {}, false)
                .then(function(data) {
                    if (data && data.orderId) {
                        // Перенаправляем на страницу доставки с orderId
                        window.location.href = `/orders/delivery/${data.orderId}`;
                    } else {
                        console.error('Ответ не содержит orderId:', data);
                        alert('Не удалось создать заказ. Попробуйте снова.');
                    }
                })
                .catch(function(error) {
                    console.error('createOrderButtonEventHadler.Произошла ошибка =>', error);
                    window.location.href = '/orders/create-error';
                });
        });
    });
  }


}

