// Theme filters for the publication index.
export function initPublications() {
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const items = [...document.querySelectorAll('.pub')];
  const groups = [...document.querySelectorAll('[data-year-group]')];
  const apply = (theme) => {
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === theme)));
    items.forEach((li) => { li.hidden = theme !== 'all' && li.dataset.theme !== theme; });
    groups.forEach((g) => { g.hidden = ![...g.querySelectorAll('.pub')].some((li) => !li.hidden); });
  };
  buttons.forEach((b) => b.addEventListener('click', () => apply(b.dataset.filter)));
}
