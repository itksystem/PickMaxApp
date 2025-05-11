class RussianPostManager {
    constructor() {
        this.api = new WebAPI();
        this.webRequest = new WebRequest();    
        this.addEventListeners();
        this.postCode = null;
        this.postAddresses = null;
    }

    // Создание элемента радио-кнопки для адресов
    createRussianPostRadio(postCode, name, label, isDefault, schedules=null, onClick, onDelete ) {
        const placement = document.createElement("div");
        placement.className = "custom-radio postal-unit p-2 mb-2 w-100";
	placement.style.display="inline-table";

        const row1 = document.createElement("div");
        row1.className = "row pl-4 pt-2";
        const row2 = document.createElement("div");
        row2.className = "row";


        const radioContainer = document.createElement("div");
        radioContainer.className = "col-9 ";

        const radioInput = document.createElement("input");
        radioInput.className = "custom-control-input";
        radioInput.type = "radio";
        radioInput.id = `radio-${postCode}`;
        radioInput.name = name;
        radioInput.checked = isDefault;
        radioInput.value = postCode;

        const radioLabel = document.createElement("label");
        radioLabel.className = "custom-control-label";
        radioLabel.setAttribute("for", `radio-${postCode}`);
        radioLabel.textContent = `${postCode}, ${label}`;

        radioContainer.appendChild(radioInput);
        radioContainer.appendChild(radioLabel);

        const buttonContainer = document.createElement("div");
        buttonContainer.className = "col-3";

        const removeButton = document.createElement("div");
        const removeIcon = document.createElement("i");
	removeIcon.className = "russian-post-logo fa-solid"
        removeIcon.style.fontSize = "0.5rem";
        removeIcon.style.width    = "3rem";
        removeIcon.style.height  = "3rem";

        removeButton.appendChild(removeIcon);
        buttonContainer.appendChild(removeButton);


        const scheduleContainer = document.createElement("div");
        scheduleContainer.className = "col";

        const scheduleSectionContainer = document.createElement("dropdown-section");
        scheduleSectionContainer.className = "w-100";

        const scheduleTitleContainer = document.createElement("span");
	scheduleTitleContainer.setAttribute("slot","title");
	scheduleTitleContainer.textContent = " Время работы"; 
	scheduleSectionContainer.appendChild(scheduleTitleContainer);

        const scheduleSection = document.createElement("ul");
        scheduleSection.className = "schedule-russian-post";

        let Mon = document.createElement("li");
        let Tue = document.createElement("li");
        let Wed = document.createElement("li");
        let Thu = document.createElement("li");
        let Fri = document.createElement("li");
        let Sat = document.createElement("li");
        let Sun = document.createElement("li");
        Mon.innerHTML = `Пнд: ${schedules.Mon}`;
        Tue.innerHTML = `Втр: ${schedules.Tue}`;
        Wed.innerHTML = `Срд: ${schedules.Wed}`;
        Thu.innerHTML = `Чтв: ${schedules.Thu}`;
        Fri.innerHTML = `Птн: ${schedules.Fri}`;
        Sat.innerHTML = `Сбт: ${schedules.Sat}`;
        Sun.innerHTML = `Вск: ${schedules.Sun}`;
	scheduleSection.appendChild(Mon);
	scheduleSection.appendChild(Tue);
	scheduleSection.appendChild(Wed);
	scheduleSection.appendChild(Thu);
	scheduleSection.appendChild(Fri);
	scheduleSection.appendChild(Sat);
	scheduleSection.appendChild(Sun);

	scheduleSectionContainer.appendChild(scheduleSection);
	scheduleContainer.appendChild(scheduleSectionContainer);

        row1.appendChild(radioContainer);
        row1.appendChild(buttonContainer);
        row2.appendChild(scheduleContainer);
	placement.appendChild(row1);
	placement.appendChild(row2);

        if (onClick) {
            radioInput.addEventListener("click", () => onClick(postCode));
        }
        if (onDelete) {
            removeButton.addEventListener("click", () => onDelete(postCode));
        }

        return placement;
    }

    createRussianPostalUnitsSection() {
        this.russianPostalUnitsContainer = 
	    DOMHelper.createElement("div", "russian-postal-unit-card-container");
        this.getElements().forEach(item => 
            this.russianPostalUnitsContainer.appendChild(item)
        );

        const elements = [
            this.russianPostalUnitsContainer,            
        ];

	this.container = DOMHelper.createDropdownSection("Почтовые отделения", elements);
        return this.russianPostalUnitsContainer;
    }

    update(query=null, latlng=null) {
  
    if (!this.russianPostalUnitsContainer) return;    
// Показываем индикатор загрузки
    this.russianPostalUnitsContainer.innerHTML = 
        '<div class="loading-spinner">Загрузка...</div>';
// Сохраняем контекст для использования в промисах
    let container = this.russianPostalUnitsContainer;

 // Используем setTimeout чтобы дать браузеру отобразить спиннер
    setTimeout(async () => {
        try {
            const elements = await this.getElements(query, latlng);
            container.innerHTML = '';
            
            if (elements.length === 0) {
                container.innerHTML = 
                    '<div class="no-results">Ничего не найдено</div>';
            } else {
                elements.forEach(item => container.appendChild(item));
            }
        } catch (error) {
            console.error('Error updating Russian Post units:', error);
            container.innerHTML = 
                '<div class="error-message">Ошибка при загрузке данных</div>';
        }
       }, 50);
    }


    // Получение адресов
    getRussianPostalUnits(query = null, latlng = null) {
        try {
	    console.log(`getRussianPostalUnits`, query, latlng)
            const response =  this.webRequest.get(
		   this.api.getDeliveryRussianPostalUnitsMethod(), 			 	
		latlng		   
		  ? { lat : latlng?.lat, lon : latlng?.lon }
		  : { query : query },
		   true);
            return response?.data || [];
        } catch (error) {
            console.error('Ошибка при получении адресов:', error);
            return [];
        }
    }

    // Получение адресов ближайших к геолокации

    async saveRussianPost() {
     try {
            const russianPost = DOMHelper.getElement('#russianPost').getObject();
            await this.webRequest.post(
                this.api.addDeliveryRussianPostMethod(),
                russianPost,
                true
            );
            DOMHelper.getElement('#russianPost').setValue('');
            toastr.success('Адрес успешно сохранен', 'Доставка', { timeOut: 3000 });
            this.reloadRussianPostDialog();
        } catch (error) {
            console.error('Ошибка при сохранении адреса:', error);
	    toastr.error('Не удалось сохранить адрес', 'Ошибка', { timeOut: 3000 });
      }
    }

    reloadRussianPostDialog() {
        if (typeof eventBus !== 'undefined') {
            eventBus.emit("reloadRussianPostDialog", {});
        }
    }

    addEventListeners() {
	let o = this;
        if (typeof eventBus === 'undefined') {
            console.error('eventBus не определен');
            return;
        }
    }


    // Установка адреса  по умолчанию
    setDefaultRussianPost() {
        try {
            const response =  this.webRequest.patch(this.api.setDefaultDeliveryRussianPostalUnitMethod(), {russianPostId}, true);
            toastr.success('Aдрес по умолчанию успешно изменен', 'Доставка', { timeOut: 3000 });
            return response;
        } catch (error) {
            toastr.error('Ошибка при установке адреса по умолчанию', 'Доставка', { timeOut: 3000 });
            return null;
        }
    }

   setRussianPostOnClick(postCode = null) {
      try {
            this.postCode = postCode;
            if(eventBus) {
             eventBus.emit(EVENT_POSTAL_UNIT_UPDATE, {postCode});
           }

         return response;
        } catch (error) {
         return null;
       }
    }


    // Удаление адресов
    deleteRussianPost(russianPostId) {
        try {
            const response = this.webRequest.delete(this.api.deleteDeliveryRussianPostalUnitMethod(), {russianPostId}, true);
            toastr.success('Aдрес успешно удален', 'Доставка', { timeOut: 3000 });
            if(eventBus) {
             eventBus.emit("reloadRussianPostDialog", {});
           }
            return response;
        } catch (error) {
            toastr.error('Ошибка при удалении адреса', 'Доставка', { timeOut: 3000 });
            return null;
        }
    }

   RussianPostAutoComplete(label, id, placeholder, required, feedbackError) {
     const container = document.createElement("div");
     container.className = "profile-input-group";

     const labelElement = Object.assign(document.createElement("label"), {
        htmlFor: id,
        className: "form-label",
        textContent: label
     });

     const autoCompleteElement = Object.assign(document.createElement("x-autocomplete"), {
        id,
        placeholder
     });

    if (required) autoCompleteElement.setAttribute("required", "required");

    const errorElement = Object.assign(document.createElement("div"), {
        id: `${id}-error`,
        className: "invalid-feedback",
        style: "display: none;",
        textContent: feedbackError
    });

    container.append(labelElement, autoCompleteElement, errorElement);
    return container;
  }

   // Отображение адресов в интерфейсе
   getElements(query = null, latlng = null) {
    try {
        const russianPostalUnits = this.getRussianPostalUnits(query, latlng);
        this.postAddresses = russianPostalUnits;
        const russianPostElements = russianPostalUnits.map(element =>
            this.createRussianPostRadio(
                element.postalCode, 
                "customRussianPost",
                element.value,
                element.isDefault ?? false,
                element.schedule,
                (postalCode)=>this.setRussianPostOnClick(element.postalCode),
            )
        );
        return russianPostElements;
    } catch (error) {
        console.error('Ошибка при получении адресов:', error);
        return [];
   }
  }
}