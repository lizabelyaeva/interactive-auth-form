// Конфигурация
const CORRECT_CREDENTIALS = {
  email: "user@example.com",
  password: "securepass123"
};

// DOM элементы
const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');

// Восстановление сохранённого email (если нужно)
const savedEmail = localStorage.getItem('savedEmail');
if (savedEmail) {
  emailInput.value = savedEmail;
}

// Фиксируем ширину и высоту полей для предотвращения "скачков" формы
fixInputSize(emailInput);
fixInputSize(passwordInput);

function fixInputSize(input) {
  const style = window.getComputedStyle(input);
  input.style.width = style.width;
  input.style.height = style.height;
}

// Показать/скрыть пароль
togglePasswordBtn.addEventListener('click', () => {
  const type = passwordInput.type === 'password' ? 'text' : 'password';
  passwordInput.type = type;
  togglePasswordBtn.setAttribute('aria-pressed', type === 'text');
});

// Обработка отправки формы
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Сброс ошибок и сообщений
  document.querySelectorAll('.error').forEach(el => {
    el.classList.remove('error');
    el.setAttribute('aria-invalid', 'false');
  });
  document.getElementById('emailError').textContent = '';
  document.getElementById('passwordError').textContent = '';

  // Получаем значения
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // Валидация
  let isValid = true;

  if (!email.includes('@')) {
    emailInput.classList.add('error');
    emailInput.setAttribute('aria-invalid', 'true');
    document.getElementById('emailError').textContent = 'Неверный формат email';
    isValid = false;
    emailInput.value = '';  // Очищаем поле email при ошибке
  }

  if (password.length < 6) {
    passwordInput.classList.add('error');
    passwordInput.setAttribute('aria-invalid', 'true');
    document.getElementById('passwordError').textContent = 'Минимум 6 символов';
    isValid = false;
    passwordInput.value = '';  // Очищаем поле пароля при ошибке
  }

  if (isValid) {
    // Если данные совпадают с правильными
    if (email === CORRECT_CREDENTIALS.email && password === CORRECT_CREDENTIALS.password) {
      form.classList.add('success');

      // Сохраняем email в localStorage (пароль не сохраняем!)
      localStorage.setItem('savedEmail', email);

      // Конфетти
      await loadConfetti();
      runConfetti();

      alert('Успешный вход! Добро пожаловать!');
    } else {
      // Неверные, но валидные данные
      document.getElementById('emailError').textContent = ' ';
      document.getElementById('passwordError').textContent = 'Неверные данные';
    }

    // В любом случае очищаем поля после отправки при валидном формате
    emailInput.value = '';
    passwordInput.value = '';
  }
});

// Функции для конфетти
function loadConfetti() {
  return new Promise((resolve, reject) => {
    if (typeof confetti === 'function') {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function runConfetti() {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
}
