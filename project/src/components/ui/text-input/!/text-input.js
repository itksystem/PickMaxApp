document.querySelector('form').addEventListener('submit', function (event) {
  const phoneInput = document.getElementById('phone');
  const phonePattern = /^\+7 \(\d{3}\) \d{3}-\d{4}$/; // Формат +7 (XXX) XXX-XXXX

  if (!phonePattern.test(phoneInput.value)) {
    phoneInput.classList.add('is-invalid');
    event.preventDefault();
    event.stopPropagation();
  } else {
    phoneInput.classList.remove('is-invalid');
    phoneInput.classList.add('is-valid');
  }
}, false);