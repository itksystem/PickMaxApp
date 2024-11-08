class globalMessages {
    const 
	language  = 'RU';
       _language_ = {
		    RU  : 'RU',
		    ENG : 'ENG'
		};
     const  
           WebApi = {
                WEBAPI_OBJECT_SAVE : {
			path : '/object/save/:id',
			method : "POST",
			scopes : "ObjectSaveScope"
		 } 	
			
	   }
	  	
     const  
	   glob = {
		SAVED_TRACK_INFO_MESSAGE : 1, 
		SAVED_TRACK_INFO_IMAGE   : 2,
		TRASH_SAVED_TRACK_INFO_MESSAGE : 3, 
		TRASH_SAVED_TRACK_INFO_ERROR_MESSAGE : 4, 
		TRASH_SAVED_TRACK_INFO_MESSAGE_TITLE : 5,

		OBJECT_MANAGE_TITLE	 : 1001,
		OBJECT_SAVE_TITLE	 : 1002,

		SAVE_BUTTON		 : 2001,
		CLOSE_BUTTON		 : 2002,
		CREATE_BUTTON		 : 2003,

		OBJECT_SAVE_SUCCESS_DESCRIPTION : 3001,
		OBJECT_SAVE_ERROR_DESCRIPTION   : 3002,

	        UNKNOW_GLOBAL_VALUE      : 99999
	    }

           _messages_= { 
                    RU: {
                        1 : 'Данный трек был сохранен в системе при расчете маршрутного листа или оператором. </br>Вы его мoжете модифицировать, и сохранить другой трек,более соответствующий маршруту абонента. </br> Система будет обучаться и в дальнейшем подбирать более вероятные маршруты. </br>',
                        2 : "hxgl0OKHF3Yn4HKsFgPKQqneYWKT0LWyMsvr0UI1TMkY6ISgyseMBmoapsHziqfi5DZkqUkmJgdDjc7Is2DPOK7SVbb7fZmIEr84eGQlLz8RhkfiKs93nWBpGq3ZCVnL8t0jKPW3c4urPrJgfuQ6Vs6nDFdxFfLD762T2AloLnTIVTnQFcYghneNWH3oKkyDX3c3xBaXSn2zVX1ZkCzW5AyNRG9XjGaN2jEgMPcyKaW4cb6jHph4Q1HIYtHyd7M",
			3 : 'Сохраненный трек удален!',
			4 : 'При удалении сохраненного трека возникла ошибка!',
			5 : 'Удаление сохраненного трека',
		// Титлы
			1001: 'Управление обьектом',
			1002: 'Сохранение данных обьекта',
		// кнопки
			2001 : "Сохранить",
			2002 : "Закрыть",
			2003 : "Создать",
		// описание
			3001 : "Успешное сохранение данных по обьекту!",
			3002 : "При сохранении данных по обьекту произошла ошибка!",

			
			99999 : "UNKNOW_GLOBAL_VALUE"
                   },
        	    ENG: {
		        1   : "This track was saved in the system when calculating the itinerary or by the operator. </br>You can modify it and save another track that is more appropriate to the subscriber's route. </br> The system will be trained and will select more likely routes in the future. </br>",
                        2   : "hxgl0OKHF3Yn4HKsFgPKQqneYWKT0LWyMsvr0UI1TMkY6ISgyseMBmoapsHziqfi5DZkqUkmJgdDjc7Is2DPOK7SVbb7fZmIEr84eGQlLz8RhkfiKs93nWBpGq3ZCVnL8t0jKPW3c4urPrJgfuQ6Vs6nDFdxFfLD762T2AloLnTIVTnQFcYghneNWH3oKkyDX3c3xBaXSn2zVX1ZkCzW5AyNRG9XjGaN2jEgMPcyKaW4cb6jHph4Q1HIYtHyd7M",
			3   : 'Saved track removed!',
			4   : 'Saved track remove error!',
			1001: 'Object manage',
			1002: 'Save data object',

			2001 : "Save",
			2002 : "Close",
			2003 : "Create",

			3001 : "Save data object success!",
			3002 : "Save data object with error!",

			99999 : "UNKNOW_GLOBAL_VALUE"

               }
        };
        
    
        constructor() {
           return this;
        }
    
       getLanguage(){return this.language}  //  Текущая языковая локализция

       setLanguage(language = 'RU'){
        try{
           this.language = language;
           return this;
           }catch(e){
             console.log(e);
         }
        return this;
       }
    
       get(i){
	   console.log(i);
	   console.log(this._messages_.RU[i]);
           return (this.language == this._language_.RU ? this._messages_.RU[i] : this._messages_.ENG[i]);
       }
    }
    