class InputMaskValidator {
  constructor(el = null) {
   if(!el) throw('InputMaskValidator.constructor error initialize...') 
// Подключение Inputmask
	this._Input = document.getElementById(el.id);
	this._Error = document.getElementById(el.error);
	this._inputMask = new Inputmask("+7 (999) 999-9999");
// Применяем маску
	this._inputMask.mask(this._Input);

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
      _Input.classList.add('is-invalid');
      _Error.style.display = 'block';
    } else {
      // Убираем ошибку, если ввод корректен
      _Input.classList.remove('is-invalid');
      _Input.classList.add('is-valid');
      _Error.style.display = 'none';
    }
  }
}

