class PultContactsPageComponent extends PultPageComponent {
  constructor() {    
    super();
    console.log('PultContactsPageComponent =>')
    this.config = {}
    this.type = null;
    this.api = new WebAPI();
    return this;
  }

  /* Включить фичу   */ 
  featureElementRemove(){
     $(this.type 
	? '#custom-tabs-four-contacts-tab.'+this.type.toLowerCase()
	: '#custom-tabs-four-contacts-tab'
      ).remove(); /* Удалить таб */
     $(this.type 
	? '#custom-tabs-four-contacts.'+this.type.toLowerCase()
	: '#custom-tabs-four-contacts'
      ).remove(); /* Удалить таб */
  }

  /* Включить фичу   */ 
  featureElementShow(){
     $(this.type 
	? '#custom-tabs-four-contacts-tab.'+this.type.toLowerCase()
	: '#custom-tabs-four-contacts-tab'
      ).removeClass('d-none'); 
     $(this.type 
	? '#custom-tabs-four-contacts.'+this.type.toLowerCase()
	: '#custom-tabs-four-contacts'
      ).removeClass('d-none'); 
  }



  /* Включить фичу   */ 
  feature(flag = false){
    this.config.feature = flag;    
    (!flag
	 ? this.featureElementRemove()
	 : this.featureElementShow()
     );

    console.log('this.config.feature=',this.config.feature);
    return this;
  }
}
