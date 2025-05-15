class ProductImage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    position: relative;
                }
                .media-wrap {
                    width: 100%;
                    padding-top: 120%;
                    position: relative;
                    background-color: #f5f5f5;
                    overflow: hidden;
                }
                .image, .video {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .video {
                    display: none;
                }
                :host([video-src]) .video {
                    display: block;
                }
                .video-controls {
                    position: absolute;
                    bottom: 0.3125rem;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 0.3125rem;
                }
                .video-button {
                    background: rgba(0, 0, 0, 0.5);
                    border: none;
                    color: #fff;
                    padding: 0.15625rem 0.3125rem;
                    border-radius: 0.15625rem;
                    cursor: pointer;
                    font-size: 0.46875rem;
                }
            </style>
            <div class="media-wrap">
                <img class="image" src="" alt="" loading="lazy">
                <video class="video" muted loop preload="metadata">
                    <source src="" type="video/mp4">
                    Ваш браузер не поддерживает видео.
                </video>
                <div class="video-controls">
                    <button class="video-button play">▶️</button>
                    <button class="video-button pause">⏸️</button>
                </div>
            </div>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
        
        // Обработчики для управления видео
        this.shadowRoot.querySelector('.play').addEventListener('click', () => this.playVideo());
        this.shadowRoot.querySelector('.pause').addEventListener('click', () => this.pauseVideo());
    }

    static get observedAttributes() {
        return ['image-src', 'image-alt', 'video-src'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'image-src') {
            const img = this.shadowRoot.querySelector('.image');
            img.src = newValue || '';
            img.onerror = () => {
                img.src = '/src/pages/images/card_no_photo_image.png';
            };
        } else if (name === 'image-alt') {
            this.shadowRoot.querySelector('.image').alt = newValue || '';
        } else if (name === 'video-src') {
            const video = this.shadowRoot.querySelector('.video');
            if (newValue) {
                video.querySelector('source').src = newValue;
                video.load();
                this.setAttribute('video-src', newValue);
            } else {
                video.querySelector('source').src = '';
                video.load();
                this.removeAttribute('video-src');
            }
        }
    }

    playVideo() {
        const video = this.shadowRoot.querySelector('.video');
        if (video) video.play();
    }

    pauseVideo() {
        const video = this.shadowRoot.querySelector('.video');
        if (video) video.pause();
    }
}

customElements.define('product-image', ProductImage);

