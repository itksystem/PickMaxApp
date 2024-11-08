class ActionButtonComponent {
  constructor(selectorId) {
  this.selectorId = selectorId;

  this.selectorElementTextButton ='';

  this.selectElement = null;

  this.buttonElement = null;
  this.buttonSelector = `${this.selectorId.replace(/^[#.]/, '')}-button`;

  this.notifyTextElement = null;
  this.notifyTextSelector = `${this.selectorId.replace(/^[#.]/, '')}-notify`;

  this.textButton = '';
  this.notifyText = '';

  this.callback = null;

  this.selectElement = (selectorId[0] == '#')
	  ? this.getElementById(selectorId.replace(/^[#.]/, ''))
	  : this.getElementByClassName(selectorId.replace(/^[#.]/, ''));

   if (!this.selectElement) return this;

    this.selectElement.innerHTML  = this.render();      

    this.buttonElement =  this.getElementByClassName(this.buttonSelector);
    this.notifyTextElement =  this.getElementByClassName(this.notifyTextSelector);
    this.notifyTextClear();
    let o = this;
    // Добавляем обработчик изменения выбранной страны
   this.buttonElement.addEventListener("click", ()=>{
      o.notifyTextClear();
      if(o.callback) o.callback(o);
     });
    return this;
  }

  getElementByClassName(selector){
    var elements = document.getElementsByClassName(selector);
    return (elements.length > 0 ? elements[0] : null)
  }

  getElementById(selector){
    var elements = document.getElementsById(selector);
    return (elements.length > 0 ? elements[0] : null)
  }

  setTextButton(text){
   this.buttonElement.innerHTML = text;
   return this;
  }

  onClick(callback){
     this.callback = callback;
     return this;
  }

  onSuccessNotifyText(successMessage){
     this.notifyTextElement.innerHTML = successMessage;
     this.notifyTextElement.classList.remove('notify-component-error');
     this.notifyTextElement.classList.add('notify-component-success');
     return this;
  }

  onErrorNotifyText(errorMessage){
     this.notifyTextElement.innerHTML = errorMessage;
     this.notifyTextElement.classList.remove('notify-component-success');
     this.notifyTextElement.classList.add('notify-component-error');
     return this;
  }

  notifyTextClear(){
     this.notifyTextElement.innerHTML = '';
     this.notifyTextElement.classList.remove('notify-component-success');
     this.notifyTextElement.classList.remove('notify-component-error');
  }

  render(){
	return ` <div class="action-button-component">
  		     <div class="row">
			<div class="col">
				<button class="btn w-100 btn-lg btn-primary ${this.buttonSelector}" >${this.textButton}</button>
			</div>
		     </div>
		  <div class="row">
			<div class="col">
				<div class="${this.notifyTextSelector}"></div>
			</div>
		  </div>
 	   </div>`
    }
}

