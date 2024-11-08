$(document).ready(function() {
// Если продукт новый - создаем ему карточку
    let api = new WebAPI();
    let webRequest = new WebRequest();
    let productId = $("#product_id").val();
    let categoryId = $("#category_id").val();
    let user = new CurrentUser();

    let _JOBS_SHOP_ADD_TITLE_ = `Добавить вакансию`; 
    let _PRODUCT_SHOP_ADD_TITLE_ = `Добавить товар`; 
    let _JOBS_SHOP_EDIT_TITLE_ = `Редактировать вакансию`; 
    let _PRODUCT_SHOP_EDIT_TITLE_ = `Редактировать товар`; 
    const _NEW_PRODIUCT_ = 0;

    let mainApplication =  new MainApp();
    mainApplication.setUser(user);

    if(productId == _NEW_PRODIUCT_ ){
        mainApplication.pageTitle( (categoryId === `'JOBS'`) ? _JOBS_SHOP_ADD_TITLE_ :_PRODUCT_SHOP_ADD_TITLE_ );
	productId = generateUUID(); 
	$("#product_id").val(productId)
       } else {
        mainApplication.pageTitle( (categoryId === `'JOBS'`) ? _JOBS_SHOP_EDIT_TITLE_ :_PRODUCT_SHOP_EDIT_TITLE_ );
    }

    let data = webRequest.get(api.getShopProductInfoMethod(shopId, productId), {}, webRequest.SYNC);

    mainApplication.shopCardMediaGalleryOutput(shopId, productId);
    if(data){
       mainApplication.setProductCardDescription(data.description)
       mainApplication.setProductCardImage(data.card_image);
    }
    mainApplication.setProductCardBlockingEventButton(shopId, productId);
    mainApplication.saveProductCardEventButton(productId);
});
