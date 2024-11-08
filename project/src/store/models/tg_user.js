/*  Telegram-пользователь. */
/* eslint-disable */
class User {

    constructor() {
     this.storageKey  = 'TgUser.';
     this.storageCurrentUserIdKey = 'userId';
     return this;
    }


  get() { /* Получить обьект Пользователь */
    if(!this.getUserId()) return null;
     return JSON.parse(localStorage.getItem(this.storageKey+this.getUserId()));
  }

  save() { /* сохранить в local storage обьект Пользователь */
    if(!this.getUserId()) return null;
     localStorage.setItem(this.storageKey+this.getUserId(), JSON.stringify(this));
  }

  unset(){ /* Удалить пользователя из local storage */
    if(!this.getUserId()) return null;
    localStorage.removeItem(this.storageKey+this.getUserId());
    return this;
  }

  getUserIdInitialized(){
    return (this.getUserId() !== null); 
  }

  setUserId(value = null){
    this.userId = value;
    return this;
  }

  getUserId(){
    return this.userId;
  }

  setFirstName(value = null){
    this.firstName = value;
    return this;
  }

  getFirstName(){
     return this.firstName;
  }

  setLastName(value = null){
     this.lastName = value;
     return this;
  }

  getLastName(){
     return this.lastName;
  }

  setUserName(value = null){
     this.userName = value ;
     return this;
  }

  getUserName(){
     return this.userName;
  }

  setShopId(value = null){
     this.shopId = value ;
     return this;
  }

  getShopId(){
    return this.shopId;
  }


  getSessionId(){
    return this.sessionId;
  }

  setSessionId(value = null){
    this.sessionId = value;
    return this;
  }

  setCityFiasId(value = null){
    this.cityFiasId = value;
    return this;
  }

  getCityFiasId(){
    return this.cityFiasId;
  }

  setCity(value = null){
    this.city = value;
    return this;
  }

  getCity(){
    return this.city;
  }

  setDeliveryName(deliveryName = null){
    this.deliveryName = deliveryName;
    return this;
  }

  getDeliveryName(){
    return this.deliveryName;
  }

  setDeliveryAddress(deliveryAddress = null){
    this.deliveryAddress = deliveryAddress;
    return this;
  }

  getDeliveryAddress(){
    return this.deliveryAddress;
  }

  setDeliveryPhone(deliveryPhone = null){
    this.deliveryPhone = deliveryPhone;
    return this;
  }

  getDeliveryPhone(){
    return this.deliveryPhone;
  }
                      

 getCurrentUserId() { /* Получить обьект Текущий Пользователь */  
   return JSON.parse(localStorage.getItem(this.storageCurrentUserIdKey));
 }

 saveCurrentUserId(id) { /* сохранить в local storage обьект Текущий Пользователь */
   localStorage.setItem(this.storageCurrentUserIdKey, id);
 }

 unsetCurrentUserId(){ /* Удалить обьект Текущий Пользователь из local storage */  
  localStorage.removeItem(this.storageCurrentUserIdKey);
  return this;
 }

  

 }

