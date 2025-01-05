class FileUpload extends HTMLElement {
    constructor() {
        super();
        this.allowedTypes = this.getAttribute('allowed-types')?.split(',') || ['image/png', 'image/jpeg'];
        this.maxSizeMB = parseInt(this.getAttribute('max-size')) || 10;
        this.api = new WebAPI();
        this.common = new CommonFunctions();

        this.innerHTML = `
          <link rel="stylesheet" href="/src/pages/plugins/fontawesome-free/css/all.min.css">
          <link rel="stylesheet" href="/src/components/ui/file-upload/css/file-upload.css">
          <link rel="stylesheet" href="/src/pages/css/bootstrap.min.css">
            <div class="file-upload__container">
		<div class="w-100 text-end padding-end">
		</div>
                <input type="file" class="file-upload__input" multiple hidden />
			<button class="btn btn-outline-primary btn-block file-upload__button w-25">
				<i class="fa-solid fa-paperclip"></i>
			</button>
                <div class="file-upload__file-list"></div>
                <div class="file-upload__message"></div>
            </div>
        `;

        this.fileInput = this.querySelector('.file-upload__input');
        this.uploadButton = this.querySelector('.file-upload__button');
        this.fileList = this.querySelector('.file-upload__file-list');
        this.messageBox = this.querySelector('.file-upload__message');
        this.uploadButton.addEventListener('click', () => {
           this.fileInput.click();
         });

	this.fileInput.addEventListener('change', () => this.showLocalPreviews());
        this.fileId = this.getAttribute("file-upload-id");
	this.fileInput.setAttribute("file-upload-id", this.getAttribute("file-upload-id") || "file-upload");
    }

    showLocalPreviews() {
     const files = this.fileInput.files;
     this.fileList.innerHTML = '';
      Array.from(files).forEach((file, index) => {
            const listItem = document.createElement('div');
            listItem.className = 'file-upload__file-item';
            listItem.setAttribute('file-id',index);
            listItem.innerHTML = `<div class="file-upload__file-preview"></div>`;
           this.fileList.appendChild(listItem);
           let previewContainer = this.querySelector(`.file-upload__file-item[file-id="${index}"]`) || document.createElement('div');
           let filePreviewContainer = previewContainer.querySelector(`.file-upload__file-preview`);

           if (this.validateFile(file)) {
             const reader = new FileReader();
              reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = file.name;
                img.className = 'file-upload__preview-image';
                filePreviewContainer.appendChild(img);

                const progressContainer = document.createElement('div');
                progressContainer.className = 'file-upload__file-progress';
                progressContainer.innerHTML = `<div class="file-upload__file-progress-bar" id="progress-${index}"></div>`;
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
            listItem.className = 'file-upload__file-item';
            listItem.innerHTML = `
		<div class="file-upload__file-preview"><img src="/public/images/loaders/loading_v4.gif" class="file-upload__file-preview-loading" ></div>
	           <div class="file-upload__file-name">${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)</div>
        	       <div class="file-upload__file-progress">
		       <div class="file-upload__file-progress-bar" id="progress-${index}"></div>
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

        console.log( { detail: { files } });
        this.dispatchEvent(new CustomEvent('file-upload-start', { detail: { files } }));

        files.forEach((file, index) => {
            if (!this.validateFile(file)) return;

            const formData = new FormData();
            formData.append('file', file);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', o.api.reviewFilesUploadMethod(o.fileId), true);
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
		    console.log({ detail: { file, response: xhr.response } });
		    this.dispatchEvent(new CustomEvent('review-file-upload-success', { detail: { file, response: xhr.response } }));
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
        this.messageBox.className = `file-upload__message file-upload__message--${type}`;
    }

    displayPreviews(fileUrls) {
    const previewContainer = document.createElement('div');
    previewContainer.className = 'file-upload__previews';

    fileUrls.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Uploaded Image';
        img.className = 'file-upload__preview-image';
        previewContainer.appendChild(img);
    });

    this.appendChild(previewContainer);
   }
}

customElements.define('file-upload', FileUpload);
