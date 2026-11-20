// The address is assembled only when someone asks for it.
export function initContact() {
  const link = document.querySelector('[data-email]');
  const copy = document.querySelector('[data-copy-email]');
  if (!link) return;
  const address = () => `${link.dataset.user}@${link.dataset.domain}`;
  const reveal = () => {
    link.textContent = address();
    link.href = 'mailto:' + address();
  };
  link.addEventListener('pointerenter', reveal, { once: true });
  link.addEventListener('focus', reveal, { once: true });
  link.addEventListener('click', (e) => {
    if (!link.href.startsWith('mailto:')) { e.preventDefault(); reveal(); window.location.href = 'mailto:' + address(); }
  });
  copy?.addEventListener('click', async () => {
    reveal();
    try {
      await navigator.clipboard.writeText(address());
      copy.textContent = 'Copied';
    } catch {
      copy.textContent = 'Select and copy';
    }
    setTimeout(() => (copy.textContent = 'Copy'), 2200);
  });
}
