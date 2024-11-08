/*******************************************************************/
/* Управление локальным хранилищем и обьeктами в нем               */
/* Sinyagin Dmitry rel.at 10.10.2021                               */
/*******************************************************************/
"use strict";

class sessionStorageClass{

  constructor(userId, config) {
    console.log('sessionStorageClass loading....');
  }

  init(){  // инициализация хранилища
     sessionStorage.setItem("sessionStorageInitialization", true);
  }

  isInitialize(){ // проверка на инициализацию сессионного хранилища
    return (sessionStorage.getItem("sessionStorageInitialization")==true) ? true : false;
  }

  clear(){  // очистка хранилища
    sessionStorage.clear();
  }
  
  get(tag){  // получить значение из хранилища по тэгу
    return sessionStorage.getItem(tag);
  }

  set(tag, value) { // установить значение тэга в хранилище
    return sessionStorage.setItem(tag, value);
  }

  remove(tag) {
    sessionStorage.removeItem(tag);
  }

  keys(){
   return Object.keys(sessionStorage);
  }
  
  exist(tag){
  }

/* сохранение обьекта с тэгом tag */

  setObject(tag, object){
   let o = this;
   let obj = JSON.stringify(object);
   this.set(tag, obj);
  }

  getObject(tag){
   let o = this;
   let obj = this.get(tag);
   let p=JSON.parse(obj);
   return p;
  }


}

