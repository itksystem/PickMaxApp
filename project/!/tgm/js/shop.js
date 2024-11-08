var mainApplication =  new MainApp();
document.addEventListener('DOMContentLoaded', function() {
    try {
        let api = new WebAPI();
        let user = new CurrentUser();
        let shop = new CurrentShop(shopId);
	shop.setCurrentShopId(shopId);
	shop.getCurrentShopBasketCount(shopId, user.getUserId());
	  mainApplication
           .onPageClick('.shop_profile_btn', 'profile/page')
           .onPageClick('.shop_promo_btn', 'promo/page')
           .onPageClick('.shop_about_btn', 'about/page')
           .onPageClick('.shop_showcase_btn', 'products/page')
           .onPageClick('.shop_logistic_btn', 'logistic/page')
           .onPageClick('.shop_orders_btn', 'orders/page')
           .onPageClick('.shop_basket_btn', 'basket/page')
	   .messageCountBadge(shopId, user, true);

        let elementFactory = new ElementFactory();
	let contactForm = elementFactory
	    .define('x-element-contact-form-component', TelegramContactFormComponent)
	    .query('x-element-contact-form-component.shop-x-element-contact-form-component')
	    if(contactForm) 
		contactForm.feature(true).setUser(user) .renderByClass('shop-x-element-contact-form-component');	

        } catch(e) {
      console.log(e);
    }
});