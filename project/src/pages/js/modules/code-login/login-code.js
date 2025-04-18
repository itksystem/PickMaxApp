    class LoginCode extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.codeValues = [];
        this.currentPosition = 0;
        this.timeLeft = parseInt(this.getAttribute('timeout')) || 300;
        this.timerInterval = null;
        this.maskTimeouts = [];
      }

      static get observedAttributes() {
        return ['visible'];
      }

      attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'visible') {
          this.updateVisibility();
        }
      }

      connectedCallback() {
        this.render();
        this.initElements();
        this.updateVisibility();
        this.startTimer();
        this.setupEventListeners();
      }

      disconnectedCallback() {
        clearInterval(this.timerInterval);
        this.maskTimeouts.forEach(timeout => {
          if (timeout) clearTimeout(timeout);
        });
      }

      get visible() {
        return this.hasAttribute('visible');
      }

      set visible(value) {
        if (value) {
          this.setAttribute('visible', '');
        } else {
          this.removeAttribute('visible');
        }
      }

      updateVisibility() {
        const container = this.shadowRoot.querySelector('.container');
        if (container) {
          container.style.display = this.visible ? 'block' : 'none';
        }
      }


      render() {
        const appName = this.getAttribute('app-name') || 'App';
        const codeLength = parseInt(this.getAttribute('code-length')) || 5;
        
        this.codeValues = Array(codeLength).fill('');
        this.maskTimeouts = Array(codeLength).fill(null);

        // Generate code digits HTML
        const codeDigitsHTML = Array.from({ length: codeLength }, (_, i) => 
          `<div class="code-digit" data-index="${i}"></div>`
        ).join('');

        this.shadowRoot.innerHTML = `
	  <style>
.container {
  text-align: center;
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 400px;
}

h1 {
  color: #333333;
  font-size: 1.5rem;
}

#clearBtn {
  background-color: #f0f0f0;
  color: #e74c3c;
  font-size: 1rem;
  width : 80%; 	
 	
}

#clearBtn:active {
  background-color: #e0e0e0;
}


.code-display {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 1.5rem;
}

.code-digit {
  width: 50px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  transition: all 0.3s;
  position: relative;
}

.code-digit {
  background: #ddd;
}

.code-digit.active {
  border-color: #4CAF50;
}

.code-digit.masked::after {
  content: "•";
  position: absolute;
  font-size: 2rem;
}

.code-digit:not(.has-value)::after {
  display: none;
}

.virtual-keyboard {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.keyboard-row {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  gap: 8px;
}

.key {
  width: 25%;
  height: 4rem;
  font-size: 1.5rem;
  border: none;
  border-radius: 5px;
  background-color: #f0f0f0;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
}

.key:active {
  background-color: #ddd;
  transform: scale(0.95);
  transition: all 0.1s ease;
  position: relative;
  overflow: hidden;
}

.key.wide {
  width: 130px;
}

#verifyBtn {
  background-color: #4CAF50;
  color: white;
}

#backspaceBtn {
  background-color: #f0f0f0;
  color: #333;
}

#backspaceBtn svg {
  width: 24px;
  height: 16px;
}

.timer {
  color: #7c7c7c;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.message {
  margin-top: 1rem;
  min-height: 20px;
  color: #e74c3c;
  font-size: 0.8rem;
  text-align: center;
}

.message.success {
  color: #2ecc71;
}

.links {
  margin-top: 1.5rem;
}

.links a {
  color: #3498db;
  text-decoration: none;
  font-size: 0.9rem;
}

.links a:hover {
  text-decoration: underline;
}

.success-container {
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Мобильная адаптация */
@media (max-width: 360px) {
  .container {
    padding: 1.5rem;
    border-radius: 0;
    max-width: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .timer {
   color: #7c7c7c;
  }
  
  .code-digit {
    width: 40px;
    height: 50px;
    font-size: 1.5rem;
  }
  
  .key {
    width: 25%;
    height: 4rem;
    font-size: 1.3rem;
  }

 
  .key.wide {
    width: 110px;
  }

 h1 {
  color: #ddd;
  font-size: 1.5rem;
 }

 h3 {
    color: #7c7c7c;
    font-size: 1.2rem;
    font-weight: 400;
 }

}

.key:active {
  transform: scale(0.95);
  background-color: #ddd;
}


.key-press-effect {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  transform: scale(0);
  animation: ripple 0.6s linear;
  pointer-events: none;
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

/* Специфичные цвета для разных кнопок */
#verifyBtn:active {
  background-color: #3d8b40;
}

#clearBtn:active {
  background-color: #d62c1a;
  color: white;
}

#backspaceBtn:active {
  background-color: #d6d6d6;
}

.code-info-container{
 display : none;
}

 	  </style>
          <link rel="stylesheet" href="/src/pages/plugins/fontawesome-free/css/all.min.css">
          <link rel="stylesheet" href="/src/pages/css/bootstrap.min.css"> 
  	  <link type="text/css" href="/src/pages/css/buttons.css" rel="stylesheet">
          <div class="container">
            <h3>${appName}</h3>
            <div class="code-container" id="codeInputContainer">
              <div class="code-display">
                ${codeDigitsHTML}
              </div>
              <div class="timer" id="timer">Ожидание: 05:00</div>
              <div class="message" id="code-info-message"></div>
              <button type="button" class="next-action-button d-none btn btn-block btn-success btn-lg"> Понятно </button>              
              <div class="virtual-keyboard">
                <div class="keyboard-row">
                  <button class="key" data-value="1">1</button>
                  <button class="key" data-value="2">2</button>
                  <button class="key" data-value="3">3</button>
                </div>
                <div class="keyboard-row">
                  <button class="key" data-value="4">4</button>
                  <button class="key" data-value="5">5</button>
                  <button class="key" data-value="6">6</button>
                </div>
                <div class="keyboard-row">
                  <button class="key" data-value="7">7</button>
                  <button class="key" data-value="8">8</button>
                  <button class="key" data-value="9">9</button>
                </div>
                <div class="keyboard-row">
                  <button class="key wide w-100" id="clearBtn">Очистить</button>
                </div>
              </div>
            </div>            
          </div>
        `;
      }

      initElements() {
        this.codeDigits = this.shadowRoot.querySelectorAll('.code-digit');
        this.messageEl = this.shadowRoot.getElementById('code-info-message');
        this.timerEl = this.shadowRoot.getElementById('timer');
        this.codeInputContainer = this.shadowRoot.getElementById('codeInputContainer');
        this.successContainer = this.shadowRoot.getElementById('successContainer');
        this.keys = this.shadowRoot.querySelectorAll('.key[data-value]');
        this.clearBtn = this.shadowRoot.getElementById('clearBtn');
        this.virtualKeyboardContainer = this.shadowRoot.querySelector('.virtual-keyboard');
        this.nextActionButton = this.shadowRoot.querySelector('.next-action-button');

        
        this.activatePosition(0);
      }

      setupEventListeners() {
        // Clear button
        this.clearBtn.addEventListener('click', () => this.resetCodeInput());
        
        // Keyboard keys
        this.keys.forEach(key => {
          key.addEventListener('click', () => {
            const value = key.getAttribute('data-value');
            this.handleDigitInput(value);
            this.addButtonPressEffect(key);
          });
        });
      }

      handleDigitInput(digit) {
        if (this.currentPosition >= this.codeDigits.length) return;
        
        // Save value
        this.codeValues[this.currentPosition] = digit;
        const currentDigit = this.codeDigits[this.currentPosition];
        
        // Show digit
        currentDigit.textContent = digit;
        currentDigit.classList.add('has-value');
        currentDigit.classList.remove('masked');
        
        // Clear previous mask timeout if exists
        if (this.maskTimeouts[this.currentPosition]) {
          clearTimeout(this.maskTimeouts[this.currentPosition]);
        }
        
        // Set timeout to mask after 1 second
        this.maskTimeouts[this.currentPosition] = setTimeout(() => {
          currentDigit.classList.add('masked');
          currentDigit.textContent = "";
        }, 200);
        
        // Move to next position
        this.moveToNextPosition();
      }

      resetCodeInput() {
        this.codeValues.fill('');
        this.codeDigits.forEach((digit, index) => {
          digit.textContent = '';
          digit.classList.remove('has-value', 'masked');
          
          if (this.maskTimeouts[index]) {
            clearTimeout(this.maskTimeouts[index]);
            this.maskTimeouts[index] = null;
          }
        });
        
        this.activatePosition(0);
      }

      activatePosition(position) {
        // Deactivate all positions
        this.codeDigits.forEach(digit => {
          digit.classList.remove('active');
        });
        
        // Activate current position
        if (position >= 0 && position < this.codeDigits.length) {
          this.codeDigits[position].classList.add('active');
          this.currentPosition = position;
        }
      }

      moveToNextPosition() {
        const nextPosition = Math.min(this.currentPosition + 1, this.codeDigits.length);
        this.activatePosition(nextPosition);
        
        // If reached the end, try to verify code
        if (nextPosition === this.codeDigits.length) {
          this.verifyCode();
        }
      }

      moveToPrevPosition() {
        const prevPosition = Math.max(this.currentPosition - 1, 0);
        this.activatePosition(prevPosition);
      }

      addButtonPressEffect(button) {
        button.classList.add('active');
        setTimeout(() => button.classList.remove('active'), 150);
      }

      verifyCode() {
        const code = this.codeValues.join('');
        const codeLength = parseInt(this.getAttribute('code-length')) || 5;
        
        if (code.length !== codeLength) {
          this.showMessage(`Пожалуйста, введите полный ${codeLength}-значный код`);
          const emptyIndex = this.codeValues.findIndex(val => val === '');
          this.activatePosition(emptyIndex >= 0 ? emptyIndex : 0);
          return;
        }
        
        // Emit custom event with the entered code
        this.dispatchEvent(new CustomEvent('code-submitted', {
          detail: { code },
          bubbles: true,
          composed: true
        }));
        
        // For demo purposes, we'll simulate success
        clearInterval(this.timerInterval);
      }

      showMessage(text, isSuccess = false) {
	console.log(text);
        this.messageEl.textContent = text;
        this.messageEl.className = isSuccess ? 'message success' : 'message';
        
        if (isSuccess) {
          setTimeout(() => {
            this.messageEl.textContent = '';
            this.messageEl.className = 'message';
          }, 3000);
        }
      }

     showPublicMessage(text, isSuccess = false) {
        this.showMessage(text, isSuccess);
     }


      startTimer() {
        this.updateTimerDisplay();
        this.timerInterval = setInterval(() => {
          this.timeLeft--;
          this.updateTimerDisplay();
          
          if (this.timeLeft <= 0) {
            clearInterval(this.timerInterval);
            this.showMessage('Время ожидания истекло');
          }
        }, 1000);
      }

      updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timerEl.textContent = `Ожидание: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (this.timeLeft < 60) {
          this.timerEl.style.color = '#e74c3c';
        }
      }
    }

    customElements.define('login-code', LoginCode);
