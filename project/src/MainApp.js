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
	    product-id ="${product.product_id}"
	    status = "active"
            href="${o.api.getShopProductMethod(null, product.product_id)}"
            image-src="${product.media[0].media_key}"
            image-alt="${product.product_name}"
            brand="Brand"
            name="${product.product_name}"
            current-price="${product.price}"
            old-price="${product.price*1.30}"
            currency-type="руб."
            aria-label="${product.product_name}"
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
 basketItemCardOutput1(item){
   return `
	<section class="outside-city delivery-option page-padding block-space">
	    <h2 class="header-title">${item.product_name}</h2>
	    <div class="w-100">
	        <div class="delivery-content">
	                <ul>
	                    <li>Цена : ${item.price}</li>
	                    <li>Количество : ${item.quantity}</li>
        	            <li>Сумма: ${item.quantity * item.price}</li>
	                </ul>
	            </div>
	    </div>
	</section>
   `;
 }

 basketItemCardOutput(item){
   return `
        <section class="city-delivery delivery-option page-padding block-space">
            <h2>${item.product_name}</h2>
             <div class="flex-container">
                <div class="delivery-content">
		             <p>Состав:</p>
			     <ul class="ul-icon-list">
			        <li> Цена : ${item.price}</li>
		        	<li> Количество : ${item.quantity}</li>
			        <li> Сумма: ${item.quantity * item.price}</li>
			    </ul>
		     </div>
  	       </div>
       	</section>
   `;
 }

  dropSectionEventHadler(){
  document.querySelectorAll('.toggle-content').forEach(button => {
    button.addEventListener('click', function() {
        // Используем 'this' для ссылки на кнопку, по которой кликнули
        const collapse = this.closest('.header').nextElementSibling.querySelector('.collapse');
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
         console.log(isExpanded);
        // Показать или скрыть контент
        collapse.style.display = isExpanded ? 'none' : 'block';
        this.setAttribute('aria-expanded', !isExpanded);

        // Найти родительский элемент <section> и добавить класс
        let  section = this.closest('.faq-item');
        if (!section)  section = this.closest('section');
        if (section) {
            if (isExpanded) {
                section.classList.remove('dropdown-open');
            } else {
                section.classList.add('dropdown-open');
            }
        }
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
        data.basket.items.forEach(item => {
              console.log(item);
              $("div.basket-container").append(o.basketItemCardOutput1(item)).show();
           });
           o.dropSectionEventHadler(); // Инициализация обработчиков кликов	
        })
     .catch(function(error) {
       console.error('showBasketOutput.Произошла ошибка =>', error);
     });
    return this;
 }


}

