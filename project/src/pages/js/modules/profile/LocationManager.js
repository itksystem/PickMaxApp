class LocationManager {
    constructor(profileSection) {
        this.profileSection = profileSection;
        this.common = new CommonFunctions();
        this.api = new WebAPI();
        this.webRequest = new WebRequest();
        this.onChoiceRegion = this.onChoiceRegion.bind(this);
    }

    createLocationSection(data) {
        const LocationSection = DOMHelper.createDropdownSection("Мои регионы", [
            DOMHelper.regionSelector(
                `Укажите регион`,
		`myTownSelector`, this.onChoiceRegion               
            ),
        ]);
        return LocationSection;
    }

   onChoiceRegion(e){
     try {
	 console.log(e);	
	 const fiasId = e?.detail?.selectedSuggestion?.data?.fias_id || null;
	 const regionName = `${e?.detail?.selectedSuggestion?.regionName}`;
         const response =  this.webRequest.post(this.api.sendClientRegionMethod(), { fiasId, regionName}, true);
         return response;
       } catch(error) {
         console.error('Ошибка при получении регионов:', error);
        return null;
     }
  }
}                             