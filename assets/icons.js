/* ─────────────────────────────────────────────────────────────────
   SUPERCELL · Tech-Hero icon suite
   ─────────────────────────────────────────────────────────────────
   Custom SVG icons. Minimalist + geometric, 24×24 viewBox,
   stroke 1.5, round caps/joins. Some icons embed a small filled
   `.core` element — colour it with --crimson-500 + a small drop-
   shadow for the "energy core" glow.

   Usage:
     <i data-icon="wrench" class="tech-icon"></i>
     <i data-icon="battery" class="tech-icon" data-size="20"></i>
     <script src="assets/icons.js"></script>
     <script>Icons.render();</script>

   Or directly:
     document.body.innerHTML += Icons.svg('shield-check', { size: 18 });

   ───────────────────────────────────────────────────────────────── */
window.Icons = (function () {
  const SIZE = 24;
  const RAW = {
    // ── Product categories ────────────────────────────────────
    'screen': `
      <rect x="6" y="2.5" width="12" height="19" rx="2.5"/>
      <line x1="6.5" y1="6" x2="17.5" y2="6"/>
      <line x1="6.5" y1="18" x2="17.5" y2="18"/>
      <circle class="core" cx="12" cy="20" r="0.6" fill="currentColor" stroke="none"/>`,

    'battery': `
      <rect x="2.5" y="7.5" width="17" height="9" rx="1.5"/>
      <path d="M20.5 10.5v3"/>
      <line x1="6.5" y1="10" x2="6.5" y2="14"/>
      <line x1="10" y1="10" x2="10" y2="14"/>
      <line x1="13.5" y1="10" x2="13.5" y2="14"/>
      <line x1="17" y1="10" x2="17" y2="14"/>
      <circle class="core" cx="6.5" cy="12" r="1.4" fill="currentColor" stroke="none"/>`,

    'flex': `
      <path d="M2 12h3.5l1.5-3 2 6 2-6 2 6 1.5-3H22"/>
      <circle class="core" cx="5.5" cy="12" r="0.9" fill="currentColor" stroke="none"/>
      <circle class="core" cx="18.5" cy="12" r="0.9" fill="currentColor" stroke="none"/>`,

    'glass': `
      <rect x="4.5" y="2.5" width="15" height="19" rx="2.5"/>
      <path d="M8 6l1.5 1.5M16 6l-1.5 1.5"/>
      <line x1="7" y1="11" x2="9" y2="11" opacity="0.6"/>`,

    // Futurist wrench with crimson energy core in the head
    'wrench': `
      <path d="M14.7 4.3a4.5 4.5 0 0 0-5.4 5.4l-7 7 2.8 2.8 7-7a4.5 4.5 0 0 0 5.4-5.4l-2.5 2.5-2.7-2.7 2.4-2.6z"/>
      <circle class="core" cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/>
      <line x1="5.5" y1="14.5" x2="6.5" y2="15.5" opacity="0.45"/>`,

    'cable': `
      <path d="M4 9a4 4 0 0 1 4-4 4 4 0 0 1 4 4v6a4 4 0 0 0 4 4 4 4 0 0 0 4-4"/>
      <line x1="4" y1="9" x2="4" y2="3"/>
      <line x1="20" y1="15" x2="20" y2="21"/>
      <circle class="core" cx="4" cy="3" r="1" fill="currentColor" stroke="none"/>
      <circle class="core" cx="20" cy="21" r="1" fill="currentColor" stroke="none"/>`,

    'gear': `
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 1.5v3.5M12 19v3.5M3.5 8l3 1.5M17.5 14.5l3 1.5M3.5 16l3-1.5M17.5 9.5l3-1.5"/>`,

    'phone': `
      <rect x="6.5" y="2" width="11" height="20" rx="2.5"/>
      <line x1="11" y1="18.5" x2="13" y2="18.5"/>`,

    // ── Shields (hero badges) ──────────────────────────────────
    'shield': `
      <path d="M12 2.5L4.5 5.2v6.6c0 4.6 3.1 7.6 7.5 9.7 4.4-2.1 7.5-5.1 7.5-9.7V5.2L12 2.5z"/>`,
    'shield-check': `
      <path d="M12 2.5L4.5 5.2v6.6c0 4.6 3.1 7.6 7.5 9.7 4.4-2.1 7.5-5.1 7.5-9.7V5.2L12 2.5z"/>
      <path d="M8.5 12l2.5 2.5L15.5 10"/>`,
    'shield-bolt': `
      <path d="M12 2.5L4.5 5.2v6.6c0 4.6 3.1 7.6 7.5 9.7 4.4-2.1 7.5-5.1 7.5-9.7V5.2L12 2.5z"/>
      <path d="M13.3 7l-4 6.2h3l-1 4 4-6.2h-3l1-4z" fill="currentColor" stroke-width="0"/>`,
    'shield-alert': `
      <path d="M12 2.5L4.5 5.2v6.6c0 4.6 3.1 7.6 7.5 9.7 4.4-2.1 7.5-5.1 7.5-9.7V5.2L12 2.5z"/>
      <line x1="12" y1="8" x2="12" y2="13"/>
      <circle cx="12" cy="16" r="0.6" fill="currentColor" stroke="none"/>`,
    'shield-x': `
      <path d="M12 2.5L4.5 5.2v6.6c0 4.6 3.1 7.6 7.5 9.7 4.4-2.1 7.5-5.1 7.5-9.7V5.2L12 2.5z"/>
      <path d="M9.5 9.5l5 5M14.5 9.5l-5 5"/>`,

    // ── Comic / energy decoratives ──────────────────────────────
    'bolt': `
      <path d="M13.5 1.5L3.5 13.5h7l-1.5 9 11-14h-7l2-7z" fill="currentColor" stroke-linejoin="round"/>`,
    'spark': `
      <path d="M12 2v6M12 16v6M2 12h6M16 12h6M5.5 5.5l4 4M14.5 14.5l4 4M5.5 18.5l4-4M14.5 9.5l4-4"/>`,
    'pulse': `
      <path d="M2 12h4l2.5-7 4 14 2.5-7H22"/>`,

    // ── UI / nav ────────────────────────────────────────────────
    'search': `
      <circle cx="11" cy="11" r="7"/>
      <path d="m21 21-4.3-4.3"/>`,
    'close': `
      <path d="M5 5l14 14M19 5L5 19"/>`,
    'arrow-right': `
      <path d="M5 12h14M13 6l6 6-6 6"/>`,
    'arrow-down': `
      <path d="M12 5v14M6 13l6 6 6-6"/>`,
    'arrow-up': `
      <path d="M12 19V5M6 11l6-6 6 6"/>`,
    'chevron-right': `
      <path d="M9 6l6 6-6 6"/>`,
    'chevron-down': `
      <path d="M6 9l6 6 6-6"/>`,
    'plus': `
      <path d="M12 5v14M5 12h14"/>`,
    'minus': `
      <path d="M5 12h14"/>`,
    'check': `
      <path d="M5 12.5L9.5 17l9.5-10"/>`,

    'whatsapp': `
      <path d="M20.5 12a8.5 8.5 0 1 1-15.7 4.6L3.5 21.5l5.1-1.3A8.5 8.5 0 0 0 20.5 12z"/>
      <path d="M9 9c.2-.6.8-.8 1.2-.3l.6 1c.4.7 0 1.2-.4 1.6.7 1.3 1.8 2.4 3.1 3.1.4-.4.9-.8 1.6-.4l1 .6c.5.4.3 1-.3 1.2-1.4.4-3-.2-4.3-1.5s-1.9-2.9-1.5-4.3z"/>`,

    'map-pin': `
      <path d="M12 21.5c-3-3.5-7-7-7-11.5a7 7 0 0 1 14 0c0 4.5-4 8-7 11.5z"/>
      <circle cx="12" cy="10" r="2.5"/>`,

    'cart': `
      <path d="M2.5 2.5h3l2.2 11.5a1.5 1.5 0 0 0 1.5 1.2h9a1.5 1.5 0 0 0 1.5-1.2L21 6H6"/>
      <circle cx="9" cy="20" r="1.2"/>
      <circle cx="18" cy="20" r="1.2"/>`,

    'receipt': `
      <path d="M5 2.5h14v19l-2.5-1.5L14 21.5l-2.5-1.5L9 21.5l-2.5-1.5L5 21.5v-19z"/>
      <line x1="8" y1="7" x2="16" y2="7"/>
      <line x1="8" y1="11" x2="16" y2="11"/>
      <line x1="8" y1="15" x2="13" y2="15"/>`,

    'wallet': `
      <rect x="2.5" y="6.5" width="19" height="13" rx="2.5"/>
      <path d="M15 13.5h3"/>
      <circle class="core" cx="16.5" cy="13.5" r="0.8" fill="currentColor" stroke="none"/>`,

    'box': `
      <path d="M3 7l9-4.5 9 4.5v10l-9 4.5L3 17V7z"/>
      <path d="M3 7l9 4.5L21 7M12 11.5v10"/>`,

    'home': `
      <path d="M3 11l9-8 9 8v10h-6v-7H9v7H3v-10z"/>`,

    'user': `
      <circle cx="12" cy="8.5" r="3.5"/>
      <path d="M4 21a8 8 0 0 1 16 0"/>`,

    'menu': `
      <path d="M4 7h16M4 12h16M4 17h16"/>`,

    'settings': `
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>`,

    'lock': `
      <rect x="4" y="11" width="16" height="10" rx="2"/>
      <path d="M8 11V8a4 4 0 0 1 8 0v3"/>
      <circle class="core" cx="12" cy="16" r="1" fill="currentColor" stroke="none"/>`,

    'eye': `
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>`,

    'eye-off': `
      <path d="M9.9 4.2A11 11 0 0 1 12 4c7 0 11 8 11 8a18 18 0 0 1-3.5 4.4M6.7 6.7A18 18 0 0 0 1 12s4 8 11 8c1.9 0 3.7-.5 5.3-1.3"/>
      <path d="M14.1 14.1a3 3 0 0 1-4.2-4.2"/>
      <line x1="2" y1="2" x2="22" y2="22"/>`,
  };

  function svg(name, opts) {
    const o = opts || {};
    const size = o.size || SIZE;
    const cls  = (o.class ? ' ' + o.class : '');
    const body = RAW[name];
    if (!body) return '';
    return `<svg class="tech-icon${cls}" viewBox="0 0 24 24" width="${size}" height="${size}" `
         + `fill="none" stroke="currentColor" stroke-width="1.5" `
         + `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }

  function render(root) {
    root = root || document;
    root.querySelectorAll('[data-icon]').forEach(el => {
      const name = el.getAttribute('data-icon');
      const size = parseFloat(el.getAttribute('data-size')) || SIZE;
      const cls  = el.getAttribute('data-class') || '';
      if (!RAW[name]) return;
      const tmp = document.createElement('div');
      tmp.innerHTML = svg(name, { size, class: cls });
      const node = tmp.firstChild;
      // Carry through any existing classes on the placeholder
      const existing = el.getAttribute('class');
      if (existing) node.setAttribute('class', node.getAttribute('class') + ' ' + existing);
      el.replaceWith(node);
    });
  }

  return { svg, render, names: () => Object.keys(RAW) };
})();

// Auto-render on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.Icons.render());
} else {
  window.Icons.render();
}
