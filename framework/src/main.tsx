// import { renderHeader } from './components/Header';
// import { createSocialButtons } from './components/SocialButtons';

// document.addEventListener('DOMContentLoaded', () => {
//   // Добавляем хедер
//   const header = renderHeader();
//   document.body.prepend(header);

//   // Добавляем кнопки соцсетей в форму
//   const socialButtons = createSocialButtons();
//   const form = document.getElementById('loginForm');
//   form?.prepend(socialButtons);

//   // Простейшая валидация формы
//   form?.addEventListener('submit', (e) => {
//     e.preventDefault(); // Предотвращаем отправку формы

//     const username = (document.getElementById('username') as HTMLInputElement)?.value;
//     const password = (document.getElementById('password') as HTMLInputElement)?.value;

//     if (!username || !password) {
//       alert('Пожалуйста, заполните все поля');
//       return;
//     }

//     // Здесь может быть логика отправки данных
//     console.log('Форма успешно отправлена:', { username, password });
//   });
// });

import './styles.css';

const CORRECT_CREDENTIALS = {
  email: 'user@example.com',
  password: 'securepass123',
};

const form = document.getElementById('loginForm') as HTMLFormElement | null;
const emailInput = document.getElementById('email') as HTMLInputElement | null;
const passwordInput = document.getElementById('password') as HTMLInputElement | null;
const togglePasswordBtn = document.getElementById('togglePassword') as HTMLButtonElement | null;

if (!form || !emailInput || !passwordInput || !togglePasswordBtn) {
  console.error('Форма или её элементы не найдены в DOM');
} else {
  const savedEmail = localStorage.getItem('savedEmail');
  if (savedEmail) emailInput.value = savedEmail;

  fixInputSize(emailInput);
  fixInputSize(passwordInput);

  function fixInputSize(input: HTMLInputElement) {
    const style = window.getComputedStyle(input);
    input.style.width = style.width;
    input.style.height = style.height;
  }

  togglePasswordBtn.addEventListener('click', () => {
    const isVisible = passwordInput.type === 'text';
    passwordInput.type = isVisible ? 'password' : 'text';
    togglePasswordBtn.setAttribute('aria-pressed', String(!isVisible));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

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
    }

    if (password.length < 6) {
      passwordInput.classList.add('error');
      passwordInput.setAttribute('aria-invalid', 'true');
      if (passwordError) passwordError.textContent = 'Минимум 6 символов';
      isValid = false;
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
        if (passwordError) passwordError.textContent = 'Неверные данные';
      }

      emailInput.value = '';
      passwordInput.value = '';
    }
  });

  function loadConfetti(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof (window as any).confetti === 'function') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Не удалось загрузить конфетти'));
      document.head.appendChild(script);
    });
  }

  function runConfetti() {
    const confetti = (window as any).confetti;
    if (typeof confetti === 'function') {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  }
}
