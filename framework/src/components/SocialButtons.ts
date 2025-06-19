export function createSocialButtons(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'social-buttons';
  container.setAttribute('role', 'group');
  container.setAttribute('aria-label', 'Социальные сети');

  const buttons = [
    { class: 'google', label: 'Google' },
    { class: 'github', label: 'GitHub' },
  ];

  buttons.forEach(({ class: className, label }) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `social-btn ${className}`;
    btn.setAttribute('aria-label', `Войти через ${label}`);
    btn.innerHTML = `<span class="icon"></span> ${label}`;
    container.appendChild(btn);
  });

  return container;
}
