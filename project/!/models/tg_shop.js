/*  Telegram-магазин */
/*  Синягин Д.В. 15.06.2024 */

class Shop {
    constructor() {
        this.storageKey = "shop.";
        this.storageCurrentShopIdKey = 'shopId';
        this.api = new WebAPI();
        this.shop = {};
        return this;
    }

    /* сеттеры */
    setId(value) { this.shop.id = value; return this; }
    setName(value) { this.shop.name = value; return this; }
    setDescription(value) { this.shop.description = value; return this; }
    setLogistic(value) { this.shop.logistic = value; return this; }
    setAddress(value) { this.shop.address = value; return this; }
    setPhone(value) { this.shop.phone = value; return this; }
    setLatitude(value) { this.shop.latitude = value; return this; }
    setLongitude(value) { this.shop.longitude = value; return this; }
    setCategoryName(value) { this.shop.categoryName = value; return this; }
    setCategoryType(value) { this.shop.categoryType = value; return this; }
    setCategoryId(value) { this.shop.categoryId = value; return this; }
    setCountry(value) { this.shop.country = value; return this; }
    setCountryIsoCode(value) { this.shop.countryIsoCode = value; return this; }
    setRegion(value) { this.shop.region = value; return this; }
    setCardImage(value) { this.shop.cardImage = value; return this; }
    setStatus(value) { this.shop.status = value; return this; }
    setBlocked(value) { this.shop.blocked = value; return this; }
    setOwnerId(value) { this.shop.ownerId = value; return this; }
    setTheme(value) { this.shop.theme = value; return this; }
    setPaymentDescription(value) { this.shop.paymentDescription = value; return this; }
    setColumns(value) { this.shop.columns = value; return this; }
    setMapView(value) { this.shop.mapView = value; return this; }

    /* геттеры */
    getId() { return this.shop.id; }
    getName() { return this.shop.name; }
    getDescription() { return this.shop.description; }
    getLogistic() { return this.shop.logistic; }
    getAddress() { return this.shop.address; }
    getPhone() { return this.shop.phone; }
    getLatitude() { return this.shop.latitude; }
    getLongitude() { return this.shop.longitude; }
    getCategoryName() { return this.shop.categoryName; }
    getCategoryType() { return this.shop.categoryType; }
    getCategoryId() { return this.shop.categoryId; }
    getCountry() { return this.shop.country; }
    getCountryIsoCode() { return this.shop.countryIsoCode; }
    getRegion() { return this.shop.region; }
    getCardImage() { return this.shop.cardImage; }
    getStatus() { return this.shop.status; }
    getBlocked() { return this.shop.blocked; }
    getOwnerId() { return this.shop.ownerId; }
    getTheme() { return this.shop.theme; }
    getPaymentDescription() { return this.shop.paymentDescription; }
    getColumns() { return this.shop.columns; }
    getMapView() { return this.shop.mapView; }

    get() { /* Получить обьект Пользователь */
     if(!this.getId()) return null;
        return JSON.parse(localStorage.getItem(this.storageKey + this.getId()));
    }

    save() { /* сохранить в local storage обьект Пользователь */
     if(!this.getId()) return null;
        localStorage.setItem(this.storageKey + this.getId(), JSON.stringify(this.shop));
        return this;
    }

   setCurrentShopId(shop_id = null) { /* Текущий магазин */
     if(!shop_id) return null;
        localStorage.setItem(this.storageCurrentShopIdKey, shop_id);
    return this;
  }
   getCurrentShopId() { /* Текущий магазин */
        return localStorage.getItem(this.storageCurrentShopIdKey);
  }

   getCurrentShopBasketCount(shop_id = null, user_id = null) { /* Получить текущее значение товаров в корзине магазина c бэка */
    console.log('getCurrentShopBasketCount=>', shop_id, user_id);
    if(!shop_id || !user_id) return null;
    let webRequest = new WebRequest();
    let data = webRequest.get(
    this.api.getCurrentShopBasketCountMethod(shop_id, user_id), {}, true);
    $('.basket-counter').html(data.count);
    return data.count;
  }



}
