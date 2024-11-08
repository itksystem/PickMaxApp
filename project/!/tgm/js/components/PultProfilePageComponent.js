class PultProfilePageComponent extends PultPageComponent {
  constructor() {    
    super();
    console.log('PultProfilePageComponent =>')
    this.config = {}
    this.type = null;
    this.api = new WebAPI();
    return this;
  }

  /* Включить фичу   */ 
  featureElementRemove(){
     $(this.type 
	? '#custom-tabs-four-profile-tab.'+this.type.toLowerCase()
	: '#custom-tabs-four-profile-tab'
      ).remove(); /* Удалить таб */
     $(this.type 
	? '#custom-tabs-four-profile.'+this.type.toLowerCase()
	: '#custom-tabs-four-profile'
      ).remove(); /* Удалить таб */
  }

  /* Включить фичу   */ 
  featureElementShow(){
     $(this.type 
	? '#custom-tabs-four-profile-tab.'+this.type.toLowerCase()
	: '#custom-tabs-four-profile-tab'
      ).removeClass('d-none'); 
     $(this.type 
	? '#custom-tabs-four-profile.'+this.type.toLowerCase()
	: '#custom-tabs-four-profile'
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
