class InputMaskValidator {
  constructor(el = null, target = null, successCallback = null, errorCallback = null) {
   if(!el) throw('InputMaskValidator.constructor error initialize...') 
// Подключение Inputmask
	this._Input = target == null ? document.getElementById(el.id) : target.querySelector(`[id="${el.id}"]`) ;
	this._Error = target == null ? document.getElementById(el.error): target.querySelector(`[id="${el.error}"]`) ;
	this._inputMask = new Inputmask("+7 (999) 999-9999");
// Применяем маску
	this._inputMask.mask(this._Input);
	this.successCallback = successCallback;
	this.errorCallback = errorCallback;

   let o = this;	
   this._Input.addEventListener('blur', () => {
      o.validatePhoneInput(this._Input, this._Error, this._Mask);
   });
   this._Input.addEventListener('input', () => {
      o.validatePhoneInput(this._Input, this._Error, this._Mask);
   });
  }

  // Публичный метод для валидации ввода
  validatePhoneInput(_Input, _Error, _Mask) {
    const isComplete = _Input.inputmask.isComplete();
    
    if (!isComplete) {
      // Если ввод некорректен, добавляем классы и показываем сообщение
       this._Input.classList.add('is-invalid');
       this._Input.classList.remove('is-valid');
       this._Error.style.display = 'block';
       if (this.errorCallback) this.errorCallback();
    } else {
      // Убираем ошибку, если ввод корректен
       this._Input.classList.remove('is-invalid');
       this._Input.classList.add('is-valid');
       this._Error.style.display = 'none';
       if (this.successCallback) this.successCallback();
    }
  }
}

