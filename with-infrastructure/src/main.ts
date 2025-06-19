import './styles.css';

const CORRECT_CREDENTIALS = {
  email: 'user@example.com',
  password: 'securepass123',
};

// DOM элементы с типами
const form = document.getElementById('loginForm') as HTMLFormElement | null;
const emailInput = document.getElementById('email') as HTMLInputElement | null;
const passwordInput = document.getElementById('password') as HTMLInputElement | null;
const togglePasswordBtn = document.getElementById('togglePassword') as HTMLButtonElement | null;

if (!form || !emailInput || !passwordInput || !togglePasswordBtn) {
  console.error('Форма или её элементы не найдены в DOM');
} else {
  // Восстановление сохранённого email
  const savedEmail = localStorage.getItem('savedEmail');
  if (savedEmail) {
    emailInput.value = savedEmail;
  }

  // Фикс ширины/высоты полей
  fixInputSize(emailInput);
  fixInputSize(passwordInput);

  function fixInputSize(input: HTMLInputElement) {
    const style = window.getComputedStyle(input);
    input.style.width = style.width;
    input.style.height = style.height;
  }

  // Переключение пароля
  togglePasswordBtn.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePasswordBtn.setAttribute('aria-pressed', String(type === 'text'));
  });

  // Обработка формы
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Очистка ошибок
    document.querySelectorAll('.error').forEach((el) => {
      el.classList.remove('error');
      el.setAttribute('aria-invalid', 'false');
    });

    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    if (emailError) emailError.textContent = '';
    if (passwordError) passwordError.textContent = '';

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    let isValid = true;

    if (!email.includes('@')) {
      emailInput.classList.add('error');
      emailInput.setAttribute('aria-invalid', 'true');
      if (emailError) emailError.textContent = 'Неверный формат email';
      isValid = false;
      emailInput.value = '';
    }

    if (password.length < 6) {
      passwordInput.classList.add('error');
      passwordInput.setAttribute('aria-invalid', 'true');
      if (passwordError) passwordError.textContent = 'Минимум 6 символов';
      isValid = false;
      passwordInput.value = '';
    }

    if (isValid) {
      if (email === CORRECT_CREDENTIALS.email && password === CORRECT_CREDENTIALS.password) {
        form.classList.add('success');
        localStorage.setItem('savedEmail', email);

        try {
          await loadConfetti();
          runConfetti();
        } catch (err) {
          console.error('Ошибка загрузки конфетти:', err);
        }

        alert('Успешный вход! Добро пожаловать!');
      } else {
        if (emailError) emailError.textContent = ' ';
        if (passwordError) passwordError.textContent = 'Неверные данные';
      }

      emailInput.value = '';
      passwordInput.value = '';
    }
  });

  // Подгрузка конфетти
  function loadConfetti(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof (window as any).confetti === 'function') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src =
        'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Не удалось загрузить конфетти'));
      document.head.appendChild(script);
    });
  }

  function runConfetti() {
    const confetti = (window as any).confetti;
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }
}
