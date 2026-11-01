// Runs the real hosted widget scripts (fixtures copied from allratestoday.com)
// in jsdom, with the script loader and the API both served from local files.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM, ResourceLoader } from 'jsdom';

const fx = (f) => readFileSync(new URL(`./fixtures/${f}`, import.meta.url), 'utf8');

class Loader extends ResourceLoader {
  fetch(url) {
    const file = { '/widget.js': 'widget.js', '/official-rates.js': 'official-rates.js' }[new URL(url).pathname];
    return file ? Promise.resolve(Buffer.from(fx(file))) : Promise.reject(new Error(`unexpected ${url}`));
  }
}

const API = {
  '/api/v1/symbols': 'symbols.json',
  '/api/open/central-bank/ecb': (u) => (u.searchParams.get('source') ? 'ecb-usd-eur.json' : 'ecb.json'),
};

async function setup() {
  const dom = new JSDOM('<!doctype html><html><head></head><body><div id="app"></div></body></html>', {
    url: 'https://example.com/', runScripts: 'dangerously', resources: new Loader(), pretendToBeVisual: true,
  });
  const w = dom.window;
  w.fetch = async (input) => {
    const u = new URL(input);
    let f = API[u.pathname];
    if (typeof f === 'function') f = f(u);
    if (!f) return { ok: false, status: 404, json: async () => ({ error: 'not found' }) };
    const body = JSON.parse(fx(f));
    return { ok: true, status: 200, json: async () => body };
  };
  for (const k of ['window', 'document', 'HTMLElement', 'Element', 'SVGElement', 'Node', 'navigator']) {
    Object.defineProperty(globalThis, k, { value: w[k], configurable: true, writable: true });
  }
  // Vue checks `instanceof MathMLElement`, which jsdom lacks.
  globalThis.MathMLElement = w.MathMLElement || class MathMLElement {};
  return w;
}

const until = async (fn, ms = 3000) => {
  const end = Date.now() + ms;
  while (Date.now() < end) { const v = fn(); if (v) return v; await new Promise((r) => setTimeout(r, 20)); }
  throw new Error('timed out');
};

test('mountConverter loads widget.js once and renders the converter with credit link', async () => {
  const w = await setup();
  const { mountConverter } = await import(`../index.js?${Date.now()}`);
  const app = w.document.getElementById('app');
  const a = mountConverter(app, { base: 'USD', target: 'EUR', amount: 100, theme: 'dark' });
  const b = mountConverter(app, { base: 'GBP', target: 'JPY' });
  await Promise.all([a.ready, b.ready]);
  assert.equal(w.document.querySelectorAll('script[src$="/widget.js"]').length, 1);
  assert.equal(a.element.getAttribute('data-theme'), 'dark');
  assert.equal(a.element.getAttribute('data-api-key'), null);
  const root = a.element.shadowRoot;
  assert.ok(root, 'shadow root attached');
  const link = root.querySelector('a[href^="https://allratestoday.com"]');
  assert.match(link.textContent, /AllRatesToday/);
  const out = await until(() => { const t = root.querySelector('.result .amt')?.textContent; return t && /\d/.test(t) && t; });
  assert.match(out, /89[.,]5/); // 100 USD at the fixture's 0.8951
  a.destroy();
  assert.equal(a.element.isConnected, false);
  assert.equal(b.element.isConnected, true);
});

test('keyless converter computes cross rates from the ECB table (GBP to JPY)', async () => {
  const w = await setup();
  const { mountConverter } = await import(`../index.js?x${Date.now()}`);
  const h = mountConverter(w.document.getElementById('app'), { base: 'GBP', target: 'JPY', amount: 250 });
  await h.ready;
  const out = await until(() => { const t = h.element.shadowRoot.querySelector('.result .amt')?.textContent; return t && /\d/.test(t) && t; });
  // Fixture: 1 EUR = 0.8338 GBP = 175.68 JPY, so 250 GBP = 52,674.5 JPY.
  assert.match(out.replace(/[^\d.]/g, ''), /^52674\.5/);
});

test('mountOfficialRate renders the rate, its date and the credit link', async () => {
  const w = await setup();
  const { mountOfficialRate } = await import(`../index.js?o${Date.now()}`);
  const h = mountOfficialRate(w.document.getElementById('app'), { bank: 'ecb', source: 'USD', target: 'EUR' });
  await h.ready;
  const text = await until(() => /2026-10-30/.test(h.element.textContent) && h.element.textContent);
  assert.match(text, /0\.895/);
  assert.ok(h.element.querySelector('a[href^="https://allratestoday.com"]'));
});

test('React component mounts and remounts on prop change', async () => {
  const w = await setup();
  const React = await import('react');
  const { createRoot } = await import('react-dom/client');
  const { act } = await import('react');
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const { CurrencyConverter } = await import('../react.js');
  const root = createRoot(w.document.getElementById('app'));
  await act(async () => root.render(React.createElement(CurrencyConverter, { base: 'USD', target: 'EUR' })));
  let el = await until(() => w.document.querySelector('.art-currency-widget[data-art-init]'));
  assert.equal(el.getAttribute('data-target'), 'EUR');
  await act(async () => root.render(React.createElement(CurrencyConverter, { base: 'USD', target: 'GBP' })));
  el = await until(() => w.document.querySelector('.art-currency-widget[data-target="GBP"][data-art-init]'));
  assert.equal(w.document.querySelectorAll('.art-currency-widget').length, 1);
  await act(async () => root.unmount());
  assert.equal(w.document.querySelectorAll('.art-currency-widget').length, 0);
});

test('Vue component mounts and remounts on prop change', async () => {
  const w = await setup();
  const { createApp, h, ref, nextTick } = await import('vue');
  const { OfficialRate } = await import('../vue.js');
  const bank = ref('ecb');
  const app = createApp({ render: () => h(OfficialRate, { bank: bank.value, source: 'USD', target: 'EUR' }) });
  app.mount(w.document.getElementById('app'));
  await until(() => w.document.querySelector('.art-official-rate[data-bank="ecb"][data-art-done]'));
  bank.value = 'boe';
  await nextTick();
  await until(() => w.document.querySelector('.art-official-rate[data-bank="boe"]'));
  assert.equal(w.document.querySelectorAll('.art-official-rate').length, 1);
  app.unmount();
  assert.equal(w.document.querySelectorAll('.art-official-rate').length, 0);
});
