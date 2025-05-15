class ProductVideo extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                .video-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }
                .video {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .video-controls {
                    position: absolute;
                    bottom: 10px;
                    left: 0;
                    right: 0;
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                .video-container:hover .video-controls {
                    opacity: 1;
                }
                .video-button {
                    background: rgba(0,0,0,0.5);
                    border: none;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                }
            </style>
            <div class="video-container">
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
        
        // Обработчики событий
        this.shadowRoot.querySelector('.play').addEventListener('click', () => this.play());
        this.shadowRoot.querySelector('.pause').addEventListener('click', () => this.pause());
        
        // Автопауза при скролле
        this._intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && this.isPlaying) {
                    this.pause();
                }
            });
        });
    }

    connectedCallback() {
        this._intersectionObserver.observe(this);
    }

    disconnectedCallback() {
        this._intersectionObserver.disconnect();
    }

    static get observedAttributes() {
        return ['src', 'autoplay'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'src') {
            const video = this.shadowRoot.querySelector('.video source');
            video.src = newValue || '';
            this.shadowRoot.querySelector('.video').load();
        }
        
        if (name === 'autoplay' && newValue !== null) {
            this.play();
        }
    }

    play() {
        const video = this.shadowRoot.querySelector('.video');
        video.play();
        this.isPlaying = true;
    }

    pause() {
        const video = this.shadowRoot.querySelector('.video');
        video.pause();
        this.isPlaying = false;
    }

    get src() {
        return this.getAttribute('src');
    }

    set src(value) {
        this.setAttribute('src', value);
    }

    get autoplay() {
        return this.hasAttribute('autoplay');
    }

    set autoplay(value) {
        if (value) {
            this.setAttribute('autoplay', '');
        } else {
            this.removeAttribute('autoplay');
        }
    }
}

customElements.define('product-video', ProductVideo);
