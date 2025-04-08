document.addEventListener('DOMContentLoaded', function() {
  const codeDigits = document.querySelectorAll('.code-digit');
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
  let currentPosition = 0;
  const codeValues = Array(codeDigits.length).fill('');
  let maskTimeouts = [];
 // Получаем кнопку очистки
  const clearBtn = document.getElementById('clearBtn');
 // Обработчик кнопки "Очистить"
  clearBtn.addEventListener('click', resetCodeInput);

// Обработчики для специальных кнопок
[backspaceBtn, verifyBtn, clearBtn].forEach(btn => {
  btn?.addEventListener('click', function() {
    this.classList.add('active');
    setTimeout(() => this.classList.remove('active'), 150);
  });
});


  // Функция сброса ввода кода (уже есть в предыдущей версии, но показываю для ясности)
  function resetCodeInput() {
  // Очищаем массив значений
  codeValues.fill('');

  
  // Очищаем отображение каждой цифры
   codeDigits.forEach((digit, index) => {
    digit.textContent = '';
    digit.classList.remove('has-value', 'masked');
    
    // Очищаем таймеры маскировки
    if (maskTimeouts[index]) {
      clearTimeout(maskTimeouts[index]);
      maskTimeouts[index] = null;
     }
   });
  
  // Активируем первую позицию
    activatePosition(0);
  
  // Сбрасываем фокус (если нужно)
  codeDigits[0].focus();
}
  
  // Инициализация таймера
  startTimer();
  
  // Активируем первую позицию
  activatePosition(0);
  
  // Обработка кликов по виртуальной клавиатуре
  keys.forEach(key => {
    key.addEventListener('click', function() {
      const value = this.getAttribute('data-value');
      handleDigitInput(value);
    // Добавляем класс активного состояния
    this.classList.add('active');
    setTimeout(() => this.classList.remove('active'), 150);
    });
  });
  

  // Кнопка Backspace
  backspaceBtn?.addEventListener('click', handleBackspace);
  
  // Проверка кода
  verifyBtn?.addEventListener('click', verifyCode);
  
  // Повторная отправка кода
  resendCodeLink?.addEventListener('click', function(e) {
    e.preventDefault();
    resendCode();
  });
  
  // Обработка ввода цифры
  function handleDigitInput(digit) {
    if (currentPosition >= codeDigits.length) return;
    
    // Сохраняем значение
    codeValues[currentPosition] = digit;
    const currentDigit = codeDigits[currentPosition];
    
    // Показываем цифру
    currentDigit.textContent = digit;
    currentDigit.classList.add('has-value');
    currentDigit.classList.remove('masked');
    
    // Сбрасываем предыдущий таймаут маскировки, если есть
    if (maskTimeouts[currentPosition]) {
      clearTimeout(maskTimeouts[currentPosition]);
    }
    
    // Устанавливаем таймаут на маскировку через 1 секунду
    maskTimeouts[currentPosition] = setTimeout(() => {
      currentDigit.classList.add('masked');
      currentDigit.textContent="";
    }, 1000);
    
    // Переходим к следующей позиции
    moveToNextPosition();
  }


  
  // Обработка Backspace
  function handleBackspace() {
    // Если текущая позиция пустая, идем назад
    if (codeValues[currentPosition] === '' && currentPosition > 0) {
      moveToPrevPosition();
    }
    
    // Очищаем текущую позицию
    if (currentPosition >= 0 && currentPosition < codeDigits.length) {
      clearPosition(currentPosition);
      
      // Если не в начале, остаемся на текущей позиции
      // Если в начале, остаемся на первой позиции
      if (currentPosition > 0) {
        moveToPrevPosition();
      }
    }
  }
  
  // Очистка позиции
  function clearPosition(position) {
    codeValues[position] = '';
    const digit = codeDigits[position];
    digit.textContent = '';
    digit.classList.remove('has-value', 'masked');
    
    // Очищаем таймаут маскировки
    if (maskTimeouts[position]) {
      clearTimeout(maskTimeouts[position]);
      maskTimeouts[position] = null;
    }
  }
  
  // Активация позиции
  function activatePosition(position) {
    // Деактивируем все позиции
    codeDigits.forEach(digit => {
      digit.classList.remove('active');
    });
    
    // Активируем текущую позицию
    if (position >= 0 && position < codeDigits.length) {
      codeDigits[position].classList.add('active');
      currentPosition = position;
    }
  }
  
  // Перемещение к следующей позиции
  function moveToNextPosition() {
    const nextPosition = Math.min(currentPosition + 1, codeDigits.length);
    activatePosition(nextPosition);
    
    // Если достигли конца, пытаемся отправить код
    if (nextPosition === codeDigits.length) {
      verifyCode();
    }
  }
  
  // Перемещение к предыдущей позиции
  function moveToPrevPosition() {
    const prevPosition = Math.max(currentPosition - 1, 0);
    activatePosition(prevPosition);
  }
  
// Модифицируем обработчики кликов для всех кнопок
function addButtonPressEffect(button) {
  button.addEventListener('click', function(e) {
    // Создаем эффект нажатия
    const effect = document.createElement('span');
    effect.className = 'key-press-effect';
    
    // Позиционируем эффект относительно места нажатия
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;
    
    button.appendChild(effect);
    
    // Удаляем эффект после завершения анимации
    setTimeout(() => {
      effect.remove();
    }, 600);
  });
}


// Применяем эффект ко всем кнопкам
document.querySelectorAll('.key').forEach(button => {
  addButtonPressEffect(button);
});


  // Проверка кода
  function verifyCode() {
    const code = codeValues.join('');
    
    if (code.length !== 5) {
      showMessage('Пожалуйста, введите полный 5-значный код');
      // Активируем первую пустую позицию
      const emptyIndex = codeValues.findIndex(val => val === '');
      activatePosition(emptyIndex >= 0 ? emptyIndex : 0);
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
        resetCodeInput();
      }
    });
  }
  
  // Сброс ввода кода
  function resetCodeInput() {
    codeValues.fill('');
    codeDigits.forEach((digit, index) => {
      digit.textContent = '';
      digit.classList.remove('has-value', 'masked');
      if (maskTimeouts[index]) {
        clearTimeout(maskTimeouts[index]);
        maskTimeouts[index] = null;
      }
    });
    activatePosition(0);
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
        showMessage('Новый код отправлен', true);
        // Сброс таймера
        clearInterval(timerInterval);
        timeLeft = 300;
        startTimer();
        // Сброс полей ввода
        resetCodeInput();
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
  function showMessage(text, isSuccess = false) {
    messageEl.textContent = text;
    messageEl.className = isSuccess ? 'message success' : 'message';
    
    if (isSuccess) {
      setTimeout(() => {
        messageEl.textContent = '';
        messageEl.className = 'message';
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
});