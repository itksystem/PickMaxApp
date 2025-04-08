document.addEventListener('DOMContentLoaded', function() {
  const codeInputs = document.querySelectorAll('.code-input');
  const verifyBtn = document.getElementById('verifyBtn');
  const backspaceBtn = document.getElementById('backspaceBtn');
  const messageEl = document.getElementById('message');
  const timerEl = document.getElementById('timer');
  const resendCodeLink = document.getElementById('resendCode');
  const codeInputContainer = document.getElementById('codeInputContainer');
  const successContainer = document.getElementById('successContainer');
  const keys = document.querySelectorAll('.key[data-value]');
  
  let timeLeft = 300; // 5 минут в секундах
  let timerInterval;
  let currentInputIndex = 0;
  
  // Инициализация таймера
  startTimer();
  
  // Фокусировка на первом поле ввода
  codeInputs[0].focus();
  
  // Обработка ввода с физической клавиатуры
  codeInputs.forEach((input, index) => {
    input.addEventListener('input', function() {
      if (this.value.length === 1) {
        moveToNextInput(index);
      }
    });
    
    input.addEventListener('keydown', function(e) {
      // Разрешаем только цифры, Backspace и стрелки
      if (!/[0-9]|Backspace|ArrowLeft|ArrowRight/.test(e.key)) {
        e.preventDefault();
        return;
      }
      
      if (e.key === 'Backspace' && this.value.length === 0) {
        moveToPrevInput(index);
      }
      
      if (e.key === 'ArrowLeft') {
        moveToPrevInput(index);
      }
      
      if (e.key === 'ArrowRight') {
        moveToNextInput(index);
      }
    });
    
    input.addEventListener('focus', function() {
      currentInputIndex = index;
      // Выделяем текст при фокусе
      this.select();
    });
    
    input.addEventListener('click', function() {
      // Выделяем текст при клике
      this.select();
    });
  });
  
  // Обработка виртуальной клавиатуры
  keys.forEach(key => {
    key.addEventListener('click', function() {
      const value = this.getAttribute('data-value');
      if (currentInputIndex < codeInputs.length) {
        codeInputs[currentInputIndex].value = value;
        codeInputs[currentInputIndex].dispatchEvent(new Event('input'));
      }
    });
  });
  
  // Кнопка Backspace
  backspaceBtn.addEventListener('click', function() {
    if (currentInputIndex > 0 && codeInputs[currentInputIndex].value === '') {
      moveToPrevInput(currentInputIndex);
    }
    
    if (codeInputs[currentInputIndex].value !== '') {
      codeInputs[currentInputIndex].value = '';
    } else if (currentInputIndex > 0) {
      codeInputs[currentInputIndex - 1].value = '';
      moveToPrevInput(currentInputIndex);
    }
  });
  
  // Проверка кода
  verifyBtn.addEventListener('click', verifyCode);
  
  // Повторная отправка кода
  resendCodeLink.addEventListener('click', function(e) {
    e.preventDefault();
    resendCode();
  });
  
  // Функции перемещения между полями ввода
  function moveToNextInput(currentIndex) {
    if (currentIndex < codeInputs.length - 1) {
      codeInputs[currentIndex + 1].focus();
      currentInputIndex = currentIndex + 1;
    } else {
      // Если последнее поле, пытаемся отправить код
      verifyCode();
    }
  }
  
  function moveToPrevInput(currentIndex) {
    if (currentIndex > 0) {
      codeInputs[currentIndex - 1].focus();
      currentInputIndex = currentIndex - 1;
    }
  }
  
  // Функция проверки кода
  function verifyCode() {
    const code = Array.from(codeInputs).map(input => input.value).join('');
    
    if (code.length !== 6) {
      showMessage('Пожалуйста, введите полный 6-значный код');
      return;
    }
    
    // Здесь должен быть fetch запрос к вашему API
    fetch('/auth/verify-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': '123' // Замените на реальный ID пользователя
      },
      body: JSON.stringify({ code })
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 403) {
        throw new Error('Неверный код. Попробуйте еще раз.');
      } else if (response.status === 429) {
        throw new Error('Слишком много попыток. Попробуйте позже.');
      } else {
        throw new Error('Ошибка сервера');
      }
    })
    .then(data => {
      // Успешная проверка
      codeInputContainer.style.display = 'none';
      successContainer.style.display = 'block';
      clearInterval(timerInterval);
    })
    .catch(error => {
      showMessage(error.message);
      // Очистка полей ввода при ошибке
      if (error.message.includes('Неверный код')) {
        codeInputs.forEach(input => input.value = '');
        codeInputs[0].focus();
        currentInputIndex = 0;
      }
    });
  }
  
  // Функция повторной отправки кода
  function resendCode() {
    fetch('/auth/set-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': '123' // Замените на реальный ID пользователя
      },
      body: JSON.stringify({ code: generateRandomCode() })
    })
    .then(response => {
      if (response.ok) {
        showMessage('Новый код отправлен', 'success');
        // Сброс таймера
        clearInterval(timerInterval);
        timeLeft = 300;
        startTimer();
        // Очистка полей ввода
        codeInputs.forEach(input => input.value = '');
        codeInputs[0].focus();
        currentInputIndex = 0;
      } else {
        throw new Error('Ошибка при отправке кода');
      }
    })
    .catch(error => {
      showMessage(error.message);
    });
  }
  
  // Генерация случайного 6-значного кода
  function generateRandomCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  // Отображение сообщений
  function showMessage(text, type = 'error') {
    messageEl.textContent = text;
    messageEl.style.color = type === 'error' ? '#e74c3c' : '#2ecc71';
    
    if (type === 'success') {
      setTimeout(() => {
        messageEl.textContent = '';
      }, 3000);
    }
  }
  
  // Таймер обратного отсчета
  function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();
      
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        showMessage('Время действия кода истекло');
        verifyBtn.disabled = true;
      }
    }, 1000);
  }
  
  function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerEl.textContent = `Код действителен: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (timeLeft < 60) {
      timerEl.style.color = '#e74c3c';
    }
  }
  
  // Обработка нажатий на документе (для виртуальной клавиатуры)
  document.addEventListener('keydown', function(e) {
    // Игнорируем нажатия, если фокус в поле ввода
    if (e.target.classList.contains('code-input')) return;
    
    if (e.key >= '0' && e.key <= '9') {
      if (currentInputIndex < codeInputs.length) {
        codeInputs[currentInputIndex].value = e.key;
        codeInputs[currentInputIndex].dispatchEvent(new Event('input'));
      }
    } else if (e.key === 'Backspace') {
      backspaceBtn.click();
    } else if (e.key === 'Enter') {
      verifyBtn.click();
    }
  });
});