class TextTimer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._timeLeft = 0;
    this._timer = null;
    this._text = '';
    this._callback = null;
    this._endTime = 0;
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    this.clearTimer();
  }

  static get observedAttributes() {
    return ['duration', 'text'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'duration') {
      this.duration = parseInt(newValue, 10) || 0;
    } else if (name === 'text') {
      this.text = newValue;
    }
  }

  clearTimer() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  startTimer() {
    this.clearTimer();
    
    if (this.duration <= 0) {
      if (this._callback) this._callback();
      return;
    }

    this._endTime = Date.now() + this.duration * 1000;
    this._timeLeft = this.duration;
    
    this.updateDisplay();
    
    this._timer = setInterval(() => {
      const now = Date.now();
      this._timeLeft = Math.max(0, Math.ceil((this._endTime - now) / 1000));
      this.updateDisplay();
      
      if (this._timeLeft <= 0) {
        this.clearTimer();
        if (this._callback) this._callback();
      }
    }, 1000);
  }

  updateDisplay() {
    const minutes = Math.floor(this._timeLeft / 60);
    const seconds = this._timeLeft % 60;
    const timeString = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-block;
            font-family: Arial, sans-serif;
          }
          .timer-text {
            color: inherit;
          }
          .timer-countdown {
            font-weight: bold;
            color: #e74c3c;
          }
        </style>
        <span class="timer-text">${this._text}</span>
        <span class="timer-countdown">${timeString}</span>
      `;
    }
  }

  render() {
    this.updateDisplay();
  }

  // Getters and setters
  get duration() {
    return this._duration || 0;
  }

  set duration(value) {
    this._duration = Math.max(0, parseInt(value, 10));
    this.startTimer();
  }

  get text() {
    return this._text;
  }

  set text(value) {
    this._text = value || '';
    this.render();
  }

  set onEnd(callback) {
    if (typeof callback === 'function') {
      this._callback = callback;
    }
  }
}

// Регистрация компонента
customElements.define('text-timer', TextTimer);
// <text-timer duration="120" text="До конца акции осталось: "></text-timer>

/*
// Создание элемента
const timer = document.createElement('text-timer');
timer.text = "До завершения осталось: ";
timer.duration = 60; // 60 секунд
timer.onEnd = () => {
  console.log('Таймер завершил работу!');
};

document.body.appendChild(timer);

// Или изменение свойств динамически
timer.duration = 30; // Перезапустит таймер с 30 секундами
timer.text = "Новый текст: ";
*/