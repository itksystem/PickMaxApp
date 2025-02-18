class ProfilePicture extends HTMLElement {
    constructor() {
        super();
        this.allowedTypes = this.getAttribute('allowed-types')?.split(',') || ['image/png', 'image/jpeg','image/gif'];
        this.maxSizeMB = parseInt(this.getAttribute('max-size')) || 10;
        this.api = new WebAPI();
        this.common = new CommonFunctions();

        let o = this; 
        let webRequest = new WebRequest();
        let request = webRequest.get(o.api.profilePictureMethod(), {}, true );
       console.log(request);

        this.innerHTML = `
          <link rel="stylesheet" href="/src/pages/plugins/fontawesome-free/css/all.min.css">
          <link rel="stylesheet" href="/src/components/ui/profile-picture/css/profile-picture.css">
          <link rel="stylesheet" href="/src/pages/css/bootstrap.min.css">
            <div class="profile-picture__container">
		<div class="w-100 text-end padding-end">
		</div>
                <input type="file" class="profile-picture__input" accept="image/png,image/jpeg,image/gif" hidden />
			<button class="w-100 profile-picture__button w-25">
			 <img src="${request?.url || "/public/images/user-default.png"}" 
  	 		  class="${(request?.url) ? "profile-picture__preview-image online" : "profile-photo-image profile-avatar-image"}">
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
    }


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

                const img = document.querySelector('img.profile-photo-image') || document.querySelector('img.profile-picture__preview-image') ;
                img.src = e.target.result;
                img.className = 'profile-picture__preview-image online'; // подставляем картинку на аватарку
            };

            reader.readAsDataURL(file); // Читаем файл как DataURL
        }
     });
    this.uploadFiles()
   }

    validateFile(file) {
        if (!this.allowedTypes.includes(file.type)) {
	    toastr.error(`Invalid file type: ${file.name}`, `Ошибка`, {timeOut: 3000});
            return false;
        }
        if (file.size > this.maxSizeMB * 1024 * 1024) {
	    toastr.error(`File size exceeds ${this.maxSizeMB}MB: ${file.name}`, `Ошибка`, {timeOut: 3000});
            return false;
        }
        return true;
    }

    async uploadFiles() {
        let o = this;
        const files = Array.from(this.fileInput.files);

        if (files.length === 0) {
	    toastr.error(`No files selected`, `Ошибка`, {timeOut: 3000});
            return;
        }
        files.forEach((file, index) => {
	   file.fileId = o.common.uuid(); // создаем fileId		
        });

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
		    toastr.success(`Файлы загружены успешно.`, `Успешно`, {timeOut: 3000});
                } else {
		    toastr.error(`Файл ${file.name} ошибка загрузки!`, `Успешно`, {timeOut: 3000});
                }
            };

            xhr.onerror = () => {
 	        toastr.error(`Ошибка загрузки!: ${file.name}`, `Успешно`, {timeOut: 3000});
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
