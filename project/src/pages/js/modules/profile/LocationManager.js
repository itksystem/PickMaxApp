class LocationManager extends EventTarget {
    constructor(profileSection) {
        super();
        this.profileSection = profileSection;
        this.common = new CommonFunctions();
        this.api = new WebAPI();
        this.webRequest = new WebRequest();
        this.regions = [];
	this.selectedRegions = [];
        
        // Привязка контекста
        this.onChoiceRegion = this.onChoiceRegion.bind(this);
        this.onRemoveRegion = this.onRemoveRegion.bind(this);
    }
    /**
     * Создает секцию выбора локации
     */
    createLocationSection() {
        let container =  DOMHelper.createDropdownSection("Мои регионы", [
            DOMHelper.regionSelector(
                "Укажите регион",
                "myTownSelector",
                this.onChoiceRegion,
		this.onRemoveRegion
            ),
        ]);
	return container;
    }

    /**
     * Обработчик выбора региона
     */
    async onChoiceRegion(event) {
        console.log('onChoiceRegion');
        try {
            if (!event?.detail?.selectedSuggestion) {
                throw new Error('Некорректные данные региона');
            }

            const fiasId = event.detail.selectedSuggestion.data?.fias_id || null;
            const regionName = event.detail.selectedSuggestion.regionName || "Неизвестный регион";

            const response = await this.webRequest.post(
                this.api.sendClientRegionMethod(),
                { fiasId, regionName },
                true
            );
        } catch (error) {
            console.log('Ошибка при выборе региона:', error);
            throw error;
        }
    }

    /**
     * Обработчик удаления региона
     */
    async onRemoveRegion(event) {
        console.log('onRemoveRegion', event);
        try {
            if (!event?.detail.value) {
                throw new Error('Некорректные данные региона');
            }

            const fiasId = event?.detail.value || null;
            console.log(this.webRequest);
            const response = await this.webRequest.delete(
                this.api.deleteClientRegionMethod(),{ fiasId }, true
            );
        } catch (error) {
            console.log('Ошибка при выборе региона:', error);
            throw error;
        }
    }

 }
