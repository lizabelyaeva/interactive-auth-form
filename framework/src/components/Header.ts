export function renderHeader(): HTMLElement {
  const header = document.createElement('header');
  header.className = 'header';
  header.setAttribute('role', 'banner');
  header.setAttribute('aria-label', 'Шапка сайта');

  const h1 = document.createElement('h1');
  h1.textContent = 'Вход в систему';
  header.appendChild(h1);

  return header;
}
