/* текущий магазин. */

class CurrentShop extends Shop{
  constructor(shop_id = null) {
  super();
  if(!shop_id) return this;
  let o = this;
  let api = new WebAPI();
  let webRequest = new WebRequest();
  let response =  webRequest.get(api.getShopMethod(shop_id), {}, true);
	console.log(response);
        o.setId(response.id);
        o.setName(response.name);
        o.setDescription(response.description);
        o.setLogistic(response.logistic);
        o.setAddress(response.address);
        o.setPhone(response.phone);
        o.setLatitude(response.latitude);
        o.setLongitude(response.longitude);
        o.setCategoryName(response.categoryName);
        o.setCategoryType(response.categoryType);
        o.setCategoryId(response.category_id);
        o.setCountry(response.country);
        o.setCountryIsoCode(response.countryIsoCode);
        o.setRegion(response.region);
        o.setCardImage(response.cardImage);
        o.setStatus(response.status);
        o.setBlocked(response.blocked);
        o.setOwnerId(response.owner_id);
        o.setTheme(response.theme);
        o.setPaymentDescription(response.payment_description);
        o.setColumns(response.columns);
        o.setMapView(response.map_view);
        o.save(response ? response : null);      
        o.setCurrentShopId(response.id);  /* Текущий магазин */
 }
}
 

