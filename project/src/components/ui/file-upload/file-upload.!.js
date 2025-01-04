class FileUpload extends HTMLElement {
    constructor() {
        super();
        this.allowedTypes = this.getAttribute('allowed-types')?.split(',') || ['image/png', 'image/jpeg'];
        this.maxSizeMB = parseInt(this.getAttribute('max-size')) || 10;

        this.innerHTML = `
	      <link rel="stylesheet" href="/src/pages/plugins/fontawesome-free/css/all.min.css">
	      <link rel="stylesheet" href="/src/components/ui/file-upload/css/file-upload.css">
	      <link rel="stylesheet" href="/src/pages/css/bootstrap.min.css">
            <div class="file-upload__container">
                <input type="file" class="file-upload__input" />
                <button class="file-upload__button">Upload</button>
                <div class="file-upload__progress">
                    <div class="file-upload__progress-bar"></div>
                </div>
                <div class="file-upload__message"></div>
            </div>
        `;

        this.fileInput = this.querySelector('.file-upload__input');
        this.uploadButton = this.querySelector('.file-upload__button');
        this.progressBar = this.querySelector('.file-upload__progress-bar');
        this.messageBox = this.querySelector('.file-upload__message');

        this.uploadButton.addEventListener('click', () => this.uploadFile());
    }

    validateFile(file) {
        if (!this.allowedTypes.includes(file.type)) {
            this.showMessage('Invalid file type', 'error');
            return false;
        }
        if (file.size > this.maxSizeMB * 1024 * 1024) {
            this.showMessage(`File size exceeds ${this.maxSizeMB}MB`, 'error');
            return false;
        }
        return true;
    }

    uploadFile() {
        const file = this.fileInput.files[0];
        if (!file) {
            this.showMessage('No file selected', 'error');
            return;
        }
        if (!this.validateFile(file)) return;

        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/bff/reco/v1/review/811e4882-476b-4ff7-9a91-20c058db769b/upload', true);

        xhr.upload.onprogress = (event) => {
	 console.log(event);
            if (event.lengthComputable) {
                const percent = (event.loaded / event.total) * 100;
                this.progressBar.style.width = `${percent}%`;
		console.log(percent);
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                this.showMessage('File uploaded successfully', 'success');
            } else {
                this.showMessage('File upload failed', 'error');
            }
            this.progressBar.style.width = '0%';
        };

        xhr.onerror = () => {
            this.showMessage('Upload error', 'error');
            this.progressBar.style.width = '0%';
        };

        xhr.send(formData);
    }

    showMessage(message, type) {
        this.messageBox.textContent = message;
        this.messageBox.className = `file-upload__message file-upload__message--${type}`;
    }
}

customElements.define('file-upload', FileUpload);
