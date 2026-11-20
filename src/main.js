import '@fontsource-variable/mona-sans/wdth.css';
import '@fontsource-variable/newsreader/opsz.css';
import '@fontsource-variable/newsreader/opsz-italic.css';
import './styles/main.css';
import { Lattice } from './engine/lattice.js';
import { initScroll } from './ui/scroll.js';
import { initHero } from './ui/hero.js';
import { initLab } from './ui/lab.js';
import { initPublications } from './ui/publications.js';
import { initPath } from './ui/path.js';
import { initContact } from './ui/contact.js';
import { initGuide } from './ai/guide.js';
import { initLens } from './ai/lens.js';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('lattice');
const lattice = new Lattice(canvas, { reducedMotion: reduced });
const scroll = initScroll({ lattice, reduced });
lattice.start();
initHero({ lattice, reduced });
initLab({ reduced });
initPublications();
initPath({ lattice });
initContact();
const guide = initGuide({ lattice, scroll });
initLens({ guide });

window.__site = { lattice, scroll, guide };

// The previous site installed a caching service worker; make sure it is gone.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister())).catch(() => {});
}
