// Framework-agnostic loader for the AllRatesToday embeddable widgets.
// The scripts are served from allratestoday.com so every embed gets fixes
// without a package update. Both render a visible credit link, which is the
// condition for keyless use.

export const API_BASE = 'https://allratestoday.com';

const SCRIPTS = {
  converter: { src: '/widget.js', global: 'AllRatesTodayWidget' },
  official: { src: '/official-rates.js', global: 'AllRatesTodayOfficialRates' },
};

const pending = {};

function loadScript(kind, base = API_BASE) {
  const { src, global } = SCRIPTS[kind];
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window[global]) return Promise.resolve(window[global]);
  if (pending[kind]) return pending[kind];
  pending[kind] = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.async = true;
    s.src = base + src;
    s.onload = () => resolve(window[global] || null);
    s.onerror = () => {
      delete pending[kind];
      reject(new Error(`Failed to load ${s.src}`));
    };
    document.head.appendChild(s);
  });
  return pending[kind];
}

function setData(el, attrs) {
  for (const [name, value] of Object.entries(attrs)) {
    if (value === undefined || value === null || value === '') el.removeAttribute(`data-${name}`);
    else el.setAttribute(`data-${name}`, String(value));
  }
}

/** Attributes for a currency converter container. */
export function converterAttributes({ base, target, amount, theme, apiKey } = {}) {
  return { base, target, amount, theme, 'api-key': apiKey };
}

/** Attributes for an official-rate container. */
export function officialRateAttributes({ bank, source, target, theme } = {}) {
  return { bank, source, target, theme };
}

function mount(kind, className, attrs, container, apiBase) {
  // Fresh child per mount: widget.js attaches a shadow root, which cannot be
  // replaced, so new options mean a new element.
  const el = document.createElement('div');
  el.className = className;
  setData(el, attrs);
  container.appendChild(el);
  let destroyed = false;
  const ready = loadScript(kind, apiBase).then((w) => {
    if (w && !destroyed) w.init();
    return el;
  });
  return {
    element: el,
    ready,
    destroy() {
      destroyed = true;
      el.remove();
    },
  };
}

/**
 * Render a currency converter inside `container`.
 * Options: base, target, amount, theme ('light' | 'dark'), apiKey, apiBase.
 * Returns { element, ready, destroy }.
 */
export function mountConverter(container, options = {}) {
  return mount('converter', 'art-currency-widget', converterAttributes(options), container, options.apiBase);
}

/**
 * Render an official central-bank or tax-authority rate inside `container`.
 * Options: bank (e.g. 'ecb', 'boe', 'rbi', 'hmrc'), source, target, theme, apiBase.
 * Returns { element, ready, destroy }.
 */
export function mountOfficialRate(container, options = {}) {
  return mount('official', 'art-official-rate', officialRateAttributes(options), container, options.apiBase);
}
