class CountrySelectComponent {
  constructor(selectorId) {
  this.selectorId = selectorId;
  this.selectElement = null;
  this.selectedCountry = null;
  this.api = new WebAPI();
  this.countries = null;

    if(selectorId[0] == '#') {
        this.selectElement = this.getElementById(selectorId.replace(/^[#.]/, ''));
     } else {
	this.selectElement = this.getElementByClassName(selectorId.replace(/^[#.]/, ''));
    }	
     this.selectElementInputSelector = `${selectorId.replace(/^[#.]/, '')}-input`;

   if (!this.selectElement) return this;
     this.countryLoad();
     this.selectElement.innerHTML  = this.render();
     this.selectElementInput = this.getElementByClassName(this.selectElementInputSelector);


    // Добавляем обработчик изменения выбранной страны
    this.selectElementInput.addEventListener("change", () => {
      this.selectedCountry = this.selectElementInput.value;
      this.onCountrySelect(this.selectedCountry);
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


  getSelectedCountryId(){ return this.selectElementInput.value; }
  getSelectedCountryName(){ 
	var selectedOption = this.selectElementInput.options[this.selectElementInput.selectedIndex];
        var selectedText = selectedOption.textContent || selectedOption.innerText;
	return selectedText; 
  }


  countryLoad(){
    let o = this;
    try{
       let webRequest = new WebRequest();
       this.list = webRequest
           .get(o.api.getCountriesMethod(), {}, false)
           .then(function(data) {
              console.log(data);
              o.countries  = data;
    	      o.countryComponentWithDraw(data);
	      o.callback(o);	
           })
          .catch(function(error) {
             console.log('countryLoad.catch.error =>', e)        
         });
       } catch(e) {
       console.log('countryLoad.catch.error =>', e)
    }
     return this;
  }  

  countryComponentWithDraw(countries){
      try{
	let o = this;
	this.selectElementInput.innerHTML = "";
	countries.forEach(function(country) {
           var option = document.createElement("option");
              option.text = country.country_name;
              option.value = country.country_id;
              o.selectElementInput.add(option);
         }); 
       } catch(e) {
         console.log('countryComponentWithDraw.catch.error =>', e)
     }
  }

  onLoad(callback){
     this.callback=callback;
     return this;
  }

  setDefaultValue(value){
     this.selectedCountry = value;
     return this;
  }

 changeSelection(value) {
   try{
    var selectElement = this.selectElementInput;
    var optionToSelect = selectElement.querySelector(`option[value='${value}']`);
    console.log('changeSelection => ',optionToSelect);
       	selectElement.querySelectorAll("option").forEach(function(option) {
             option.selected = false;
      	});
        optionToSelect.selected = true;
       } catch(e) {
      console.log('countryComponentWithDraw.catch.error =>', e)
     }

    return this;
 }


  onCountrySelect(country) {
    // Этот метод будет вызываться при выборе страны
    console.log("Выбранная страна:", country);
    // Здесь можно добавить дополнительные действия при выборе страны
    return this;
  }

  render(){
	return `<select class="form-control ${this.selectElementInputSelector} select-country-component" style="height: calc(1.55rem + 15px); font-size: 1rem; padding-left: 0.5rem;"></select>`
}

}

