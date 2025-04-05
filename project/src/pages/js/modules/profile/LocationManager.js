class LocationManager {
    constructor(profileSection) {
        this.profileSection = profileSection;
    }

    createLocationSection(data) {
        const LocationSection = DOMHelper.createDropdownSection("Мои регионы", [
            DOMHelper.regionSelector(
                `Укажите регион`,
		`myTownSelector`,                
            ),
        ]);
        return LocationSection;
    }
}                             