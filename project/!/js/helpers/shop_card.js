$(document).ready(function() {
    let api = new WebAPI();
    let webRequest = new WebRequest();
    let user = new CurrentUser();
    let mainApplication =  new MainApp();
     mainApplication
        .setUser(user)
	.initializeProductCard(shopId, $("#product_id").val())
//	.getProductCardMyLike(shopId, $("#product_id").val())
	.setProductCardLikeEventButton(shopId, $("#product_id").val())
	.addProductToBasketEventButton(shopId, $("#product_id").val())
	.addShowCaseReturnEventButton($("#product_id").val());
 });
