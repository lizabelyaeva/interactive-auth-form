export function loadConfetti(): Promise<void> {
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

export function runConfetti(): void {
  const confetti = (window as any).confetti;
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
  }
}
