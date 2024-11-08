$(document).ready(
   function() {
  try{
    let shop = new CurrentShop(shopId);
// Инициализация пользователя и API
    let api = new WebAPI();
    let user = new CurrentUser();
    shop.setCurrentShopId(shopId);

    let shopPage = new PultShopPageComponent();
    shopPage.feature(true).getShopCategories();

    let servicePage = new PultServicePageComponent();
    servicePage.feature(false)
    .setTabClickEvent('#custom-tabs-four-services-tab', ()=>{
         console.log('setTabClickEvent.#custom-tabs-four-services-tab ()=>{}');
	 servicePage.getServiceCategories();
	});

    let adsPage = new PultAdsPageComponent();
     adsPage.feature(false)
    .setTabClickEvent('#custom-tabs-four-ads-tab', ()=>{
         console.log('setTabClickEvent.#custom-tabs-four-ads-tab ()=>{}');
	 adsPage.getAdsCategories('SALE');
	});


    let adsSalePage = new PultAdsPageComponent();
     adsSalePage.feature(true)
      .setTabClickEvent('#custom-tabs-four-ads-sale-tab', ()=>{
         console.log('setTabClickEvent.#custom-tabs-four-ads-sale-tab ()=>{}');
	 adsSalePage.getAdsCategories('SALE');
	});

    let adsBuyPage = new PultAdsPageComponent();
     adsBuyPage.feature(true)
    .setTabClickEvent('#custom-tabs-four-ads-buy-tab', ()=>{
         console.log('setTabClickEvent.#custom-tabs-four-ads-buy-tab ()=>{}');
	 adsBuyPage.getAdsCategories('BUY');
	});

    let adsChangePage = new PultAdsPageComponent();
     adsChangePage.feature(true)
    .setTabClickEvent('#custom-tabs-four-ads-change-tab', ()=>{
         console.log('setTabClickEvent.#custom-tabs-four-ads-change-tab ()=>{}');
	 adsChangePage.getAdsCategories('CHANGE');
	});

    let adsGivePage = new PultAdsPageComponent();
     adsGivePage.feature(true)
    .setTabClickEvent('#custom-tabs-four-ads-give-tab', ()=>{
         console.log('setTabClickEvent.#custom-tabs-four-ads-give-tab ()=>{}');
	 adsGivePage.getAdsCategories('GIVE');
	});


    let jobPage = new PultJobPageComponent();
      jobPage.feature(false);

    let profilePage = new PultProfilePageComponent();
        profilePage.feature(true);

    let contactsPage = new PultContactsPageComponent();
        contactsPage.feature(true);

  
// Регистрируем кастомный элемент
	customElements.define('editable-select', EditableSelect);
// Регистрируем кастомный элемент
	customElements.define('x-autocomplete',  Autocomplete);
// Регистрируем кастомный элемент
	customElements.define('x-link',  LinkElement);
// Регистрируем кастомный элемент
	customElements.define('x-element-contact-form-component', TelegramContactFormComponent);

      let contactForm = document.querySelector('x-element-contact-form-component.pult-x-element-contact-form-component');
      contactForm
	.feature(true)		
	.setTitle("Ваши данные")		
	.setUser(user)		
	.renderByClass('pult-x-element-contact-form-component');


      let locationLinkElement = document.querySelector('x-link.user-location-link');
	locationLinkElement
	 .setUrl('#')
	 .setTextContent(!user.getCity() ? 'Установите город в "Профиле"' : user.getCity())
	 .renderByClass('user-location-link');

      const userCitySelectorElement = document.querySelector('x-autocomplete.user-town-select');
	console.log(userCitySelectorElement);
	userCitySelectorElement
	.setPlaceholder('Укажите город')
        .setValue(user.getCity())
        .setValueId(user.getCityFiasId());

        userCitySelectorElement     
          .onRequest(()=>{  /* Установить тип запроса и его url с параметрами из репозитория webapi */
		 userCitySelectorElement.url = api.getCitiesMethod(userCitySelectorElement.input.value); 
	  	 userCitySelectorElement.methodType = 'GET';
	  })
	  .onLoad((result)=>{
	     result.forEach(el => {
		/* Для полученного маccива result выбрать элементы и прорисовать в выпадающем списке
                   передаем элемент, идентификатор записи (Option.value и текстовое значение option.contentText */
		     console.log(el); 	
	 	     userCitySelectorElement.dropDownListItemDraw(el.data, el.data.fias_id, el.value);
	    })
  	  })
	  .onSelect((item)=>{
	     console.log(item);
	  });

         let userCitySaveButton = new ActionButtonComponent('.user-town-button-element')
 	     .setTextButton('Установить город')
  	     .onClick((userCitySaveButton)=>{
  	         let webRequest = new WebRequest();
	         this.list = webRequest.post(
		         api.userPropertiesCitySendMethod(), 
  	   	         api.userPropertiesCitySendMethodPayload(
				userCitySelectorElement.getValue(),
				userCitySelectorElement.getValueId())
  	 	       , true)
	            .then(function(data) {
	  	       	console.log('Полученные данные:', data);  
			if(!data.result || data.result !='OK') {
  			  userCitySaveButton.onErrorNotifyText(`Ошибка при сохранении ${userCitySelectorElement.getValue()}!`);
		  	  } else {
  			 userCitySaveButton.onSuccessNotifyText(`Установлено - ${userCitySelectorElement.getValue()}!`);
			 locationLinkElement
			  .setUrl('#')
			  .setTextContent(userCitySelectorElement.getValue())
			  .renderByClass('user-location-link');
 		       }
 		     })
		    .catch(function(error) {
        	        console.error('Произошла ошибка:', error);
  	          });
  	     })


  } catch(e) {
     console.log(e);
  }
});
