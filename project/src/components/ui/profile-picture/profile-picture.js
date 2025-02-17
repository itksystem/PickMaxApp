/**
 Компонент загрузки файлов от пользователя по разным процессам
   параметры 
  <profile-picture 
	profile-picture-id="811e4882-476b-4ff7-9a91-20c058db769b"  -- идентификатор загружаемого файла
        process-name="review-profile-picture" -- наименования процесса для публикации события, брать из webapi.js
	allowed-types="image/png,image/jpeg,image/jpg" -- разрешенные типы файлов
	max-size="10"> -- разрешенный максимальный размер в МБ

**/


class ProfilePicture extends HTMLElement {
    constructor() {
        super();
        this.allowedTypes = this.getAttribute('allowed-types')?.split(',') || ['image/png', 'image/jpeg'];
        this.maxSizeMB = parseInt(this.getAttribute('max-size')) || 10;
        this.api = new WebAPI();
        this.common = new CommonFunctions();

        this.innerHTML = `
          <link rel="stylesheet" href="/src/pages/plugins/fontawesome-free/css/all.min.css">
          <link rel="stylesheet" href="/src/components/ui/profile-picture/css/profile-picture.css">
          <link rel="stylesheet" href="/src/pages/css/bootstrap.min.css">
            <div class="profile-picture__container">
		<div class="w-100 text-end padding-end">
		</div>
                <input type="file" class="profile-picture__input" multiple hidden />
			<button class="w-100 profile-picture__button w-25">
				<img src="/public/images/user-default.png" class="profile-photo-image profile-avatar-image">
			</button>
                <div class="profile-picture__file-list"></div>
                <div class="profile-picture__message"></div>
            </div>
        `;

        this.fileInput = this.querySelector('.profile-picture__input');
        this.uploadButton = this.querySelector('.profile-picture__button');
        this.fileList = this.querySelector('.profile-picture__file-list');
        this.messageBox = this.querySelector('.profile-picture__message');
        this.uploadButton.addEventListener('click', () => {
           this.fileInput.click();
         });

	this.fileInput.addEventListener('change', () => this.showLocalPreviews());
        this.fileId = this.getAttribute("profile-picture-id");
	this.fileInput.setAttribute("profile-picture-id", this.getAttribute("profile-picture-id") || "profile-picture");
//        this.processName = 'profileImageProcessUpload';
	this.addEventListeners();

    }
/*
    addEventListeners() {                                                           
      let o = this;
      eventBus.on(this.processName+'-success', (message) => {
	const images = document.querySelectorAll('img.profile-photo-image');
	console.log(message);
	const newImageUrl = message.url;
	images.forEach(image => {
	    image.src = newImageUrl;
  	    o.setOnline(image, true);
	});

      });
     }
*/
    showLocalPreviews() {
     const files = this.fileInput.files;
     this.fileList.innerHTML = '';
      Array.from(files).forEach((file, index) => {
            const listItem = document.createElement('div');
            listItem.className = 'profile-picture__file-item';
            listItem.setAttribute('file-id',index);
            listItem.innerHTML = `<div class="profile-picture__file-preview"></div>`;
           this.fileList.appendChild(listItem);
           let previewContainer = this.querySelector(`.profile-picture__file-item[file-id="${index}"]`) || document.createElement('div');
           let filePreviewContainer = previewContainer.querySelector(`.profile-picture__file-preview`);

           if (this.validateFile(file)) {
             const reader = new FileReader();
              reader.onload = (e) => {

                const img = document.querySelector('img.profile-photo-image');
                img.src = e.target.result;
                img.className = 'profile-picture__preview-image online'; // подставляем картинку на аватарку


                const progressContainer = document.createElement('div');
                progressContainer.className = 'profile-picture__file-progress';
                progressContainer.innerHTML = `<div class="profile-picture__file-progress-bar" id="progress-${index}"></div>`;
                filePreviewContainer.appendChild(progressContainer);
            };

            reader.readAsDataURL(file); // Читаем файл как DataURL
        }
     });
    this.uploadFiles()
   }


    displaySelectedFiles() {
        this.fileList.innerHTML = '';
        Array.from(this.fileInput.files).forEach((file, index) => {
            const listItem = document.createElement('div');
            listItem.className = 'profile-picture__file-item';
            listItem.innerHTML = `
		<div class="profile-picture__file-preview"><img src="/public/images/loaders/loading_v4.gif" class="profile-picture__file-preview-loading" ></div>
	           <div class="profile-picture__file-name">${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)</div>
        	       <div class="profile-picture__file-progress">
		       <div class="profile-picture__file-progress-bar" id="progress-${index}"></div>
                </div>
            `;
            this.fileList.appendChild(listItem);
        });
    }

    validateFile(file) {
        if (!this.allowedTypes.includes(file.type)) {
            this.showMessage(`Invalid file type: ${file.name}`, 'error');
            return false;
        }
        if (file.size > this.maxSizeMB * 1024 * 1024) {
            this.showMessage(`File size exceeds ${this.maxSizeMB}MB: ${file.name}`, 'error');
            return false;
        }
        return true;
    }

    async uploadFiles() {
        let o = this;
        const files = Array.from(this.fileInput.files);

        if (files.length === 0) {
            this.showMessage('No files selected', 'error');
            return;
        }
        files.forEach((file, index) => {
		file.fileId = o.common.uuid(); // создаем fileId		
        });

          console.log(this.processName+'-start', { detail: { files } });
//        this.dispatchEvent(new CustomEvent(this.processName+'-start',{ detail: { files } }));

        files.forEach((file, index) => {
            if (!this.validateFile(file)) return;

            const formData = new FormData();
            formData.append('file', file);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', o.api.profilePictureMethod(), true);
	    xhr.setRequestHeader('fileId', file.fileId);

            // Прогресс для каждого файла
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percent = (event.loaded / event.total) * 100;
                    const progressBar = this.querySelector(`#progress-${index}`);
                    if (progressBar) {
                        progressBar.style.width = `${percent}%`;
                    }
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    console.log(file);
                    this.showMessage(`Файлы загружены успешно.`, 'success');
		    console.log(this.processName+'-success', { detail: { file, response: xhr.response } });
//		    this.dispatchEvent(new CustomEvent(this.processName+'-success', { detail: { file, response: xhr.response } }));
                } else {
                    this.showMessage(`Файл ${file.name} ошибка загрузки!`, 'error');
                }
            };

            xhr.onerror = () => {
                this.showMessage(`Ошибка загрузки!: ${file.name}`, 'error');
            };

            xhr.send(formData);
        });
    }

    showMessage(message, type) {
        this.messageBox.textContent = message;
        this.messageBox.className = `profile-picture__message profile-picture__message--${type}`;
    }

    displayPreviews(fileUrls) {
      const previewContainer = document.createElement('div');
      previewContainer.className = 'profile-picture__previews';
 
     fileUrls.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Uploaded Image';
        img.className = 'profile-picture__preview-image';
        previewContainer.appendChild(img);
    });

    this.appendChild(previewContainer);
   }

  setOnline(previewImage = null, online = false) {
   if(!previewImage || !online) return;
    if (online) {
      previewImage.classList.add("online");
      previewImage.classList.remove("offline");
    } else {
      previewImage.classList.add("offline");
      previewImage.classList.remove("online");
    }
  }
}

customElements.define('profile-picture', ProfilePicture);
