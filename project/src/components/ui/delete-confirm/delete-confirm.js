// delete-confirm.js - отдельный веб-компонент для подтверждения удаления
class DeleteConfirm extends HTMLElement {
  static DEFAULT_COUNTDOWN = 5;
  static CIRCLE_RADIUS = 15;
  static ACTION_TITLE  = 'Отменить';

  constructor() {
    super();
    this.countdown = DeleteConfirm.DEFAULT_COUNTDOWN;
    this.circumference = 2 * Math.PI * DeleteConfirm.CIRCLE_RADIUS;
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.delete-trigger').addEventListener('click', this.startCountdown.bind(this));
    this.shadowRoot.querySelector('.cancel-delete').addEventListener('click', this.cancelDelete.bind(this));
  }

  render() {
    this.shadowRoot.innerHTML = `
          <link rel="stylesheet" href="/src/pages/plugins/fontawesome-free/css/all.min.css">
          <link rel="stylesheet" href="/src/pages/css/bootstrap.min.css"> 
  	  <link type="text/css" href="/src/pages/css/buttons.css" rel="stylesheet">

      <style>
        :host {
          display: inline-block;
        }
        .delete-container {
          position: relative;
	  display: inline-flex;
        }
        .delete-trigger {
          cursor: pointer;
          color: #000000;
        }
        .confirm-delete {
          display: none;
          align-items: center;
          gap: 10px;
          position: absolute;
          top: 0;
          left: 0;
          background: white;
          padding: 5px;
          border-radius: 4px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          z-index: 10;
	  position: relative;
        }
        .countdown-circle {
          width: 2rem;
          height: 2rem;
        }
        .countdown-bg {
          fill: none;
          stroke: #e9ecef;
          stroke-width: 5;
        }
        .countdown-progress {
          fill: none;
          stroke: #888888;
          stroke-width: 5;
          stroke-linecap: round;
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
        }
        .countdown-text {
          font-size: 10px;
          fill: #495057;
        }
        .cancel-delete {
          color: #0077e1;
          font-size: 0.8rem;
          text-decoration: none;
        }
      </style>
      <div class="delete-container">
        <div class="delete-trigger">
          <slot name="trigger">
            <i class="fa-solid fa-trash-alt"></i>
          </slot>
        </div>
      <div class="confirm-delete">	
            <div class="row">	
		<div class="col-4">
	          <svg class="countdown-circle" viewBox="0 0 40 40">
	            <circle class="countdown-bg" cx="20" cy="20" r="15"></circle>
	            <circle class="countdown-progress" cx="20" cy="20" r="15"></circle>
	            <text class="countdown-text" x="20" y="22" text-anchor="middle">${this.countdown}</text>
	          </svg>
	        </div>
		<div class="col-8">
		  <button type="button" class="btn btn-block btn-outline-dark cancel-delete">${DeleteConfirm.ACTION_TITLE}</button>
	        </div>
	  </div>
        </div>
      </div>
    `;
  }

  startCountdown() {
    const trigger = this.shadowRoot.querySelector('.delete-trigger');
    const confirm = this.shadowRoot.querySelector('.confirm-delete');
    const countdownText = this.shadowRoot.querySelector('.countdown-text');
    const countdownCircle = this.shadowRoot.querySelector('.countdown-progress');

    trigger.style.display = 'none';
    confirm.style.display = 'flex';
    countdownCircle.style.strokeDasharray = this.circumference;
    countdownCircle.style.strokeDashoffset = 0;

    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += 0.01;
      this.countdown -= 0.01;
      countdownText.textContent = Math.round(this.countdown);
      countdownCircle.style.strokeDashoffset = 
        (elapsed / DeleteConfirm.DEFAULT_COUNTDOWN) * this.circumference;

      if (this.countdown <= 0) {
        clearInterval(interval);
        this.dispatchEvent(new CustomEvent('delete-confirmed'));
      }
    }, 10);

    this.interval = interval;
  }

  cancelDelete(e) {
    e.preventDefault();
    clearInterval(this.interval);
    this.reset();
  }

  reset() {
    this.countdown = DeleteConfirm.DEFAULT_COUNTDOWN;
    this.shadowRoot.querySelector('.delete-trigger').style.display = 'block';
    this.shadowRoot.querySelector('.confirm-delete').style.display = 'none';
    this.shadowRoot.querySelector('.countdown-progress').style.strokeDashoffset = 1;
    this.shadowRoot.querySelector('.countdown-text').textContent = this.countdown;
  }
}

customElements.define('delete-confirm', DeleteConfirm);
