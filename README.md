# AllRatesToday Currency Widget — allratestoday-widget

[![npm version](https://img.shields.io/npm/v/allratestoday-widget.svg)](https://www.npmjs.com/package/allratestoday-widget)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/AllRates-Today/allratestoday-widget/blob/main/LICENSE)
[![API key](https://img.shields.io/badge/API%20key-optional-brightgreen.svg)](https://allratestoday.com/register)

**Free embeddable currency converter and official central-bank rate widgets for React, Vue, Astro and plain HTML. No API key needed.**

## 🚀 Features

- 💱 **Currency converter**: amount, from/to selects and a swap button. Works without a key on official ECB reference rates (30 currencies). Add a free API key for real-time mid-market rates across 160+ currencies.
- 🏛️ **Official rate card**: one pair as published by a central bank or tax authority (ECB, Bank of England, RBI, HMRC, US Treasury and 100+ more), with the publication date shown.
- ⚛️ **React, Vue 3 and Astro components**, plus a framework-free `mountConverter()` / `mountOfficialRate()`.
- 🪶 **No build step, no dependencies.** The widget scripts load from allratestoday.com, so embeds pick up fixes without a package update.
- 🌓 Light and dark themes. The converter renders inside a shadow root, so your CSS and the widget's never clash.

Both widgets show an "Exchange rates by AllRatesToday" credit link. Keeping it visible is the condition for free, keyless use.

## 📦 Installation

```bash
npm install allratestoday-widget
```

React and Vue are optional peer dependencies; install only the one you use.

## 🏁 Quick start

### React

```jsx
import { CurrencyConverter, OfficialRate } from 'allratestoday-widget/react';

export default function Rates() {
  return (
    <>
      <CurrencyConverter base="USD" target="EUR" amount={100} />
      <OfficialRate bank="ecb" source="USD" target="EUR" theme="dark" />
    </>
  );
}
```

Next.js App Router: put these in a `'use client'` component.

### Vue 3

```vue
<script setup>
import { CurrencyConverter, OfficialRate } from 'allratestoday-widget/vue';
</script>

<template>
  <CurrencyConverter base="GBP" target="USD" />
  <OfficialRate bank="boe" source="GBP" target="USD" />
</template>
```

### Astro

```astro
---
import CurrencyConverter from 'allratestoday-widget/astro/CurrencyConverter.astro';
import OfficialRate from 'allratestoday-widget/astro/OfficialRate.astro';
---
<CurrencyConverter base="EUR" target="CHF" />
<OfficialRate bank="snb" source="EUR" target="CHF" />
```

The Astro components ship no client framework, just the markup and one script tag.

### Any other framework or plain JavaScript

```js
import { mountConverter } from 'allratestoday-widget';

const widget = mountConverter(document.getElementById('fx'), { base: 'USD', target: 'INR' });
await widget.ready;   // rendered
widget.destroy();     // remove it again
```

### Plain HTML (no npm)

```html
<div class="art-currency-widget" data-base="USD" data-target="EUR"></div>
<script async src="https://allratestoday.com/widget.js"></script>

<div class="art-official-rate" data-bank="ecb" data-source="USD" data-target="EUR"></div>
<script async src="https://allratestoday.com/official-rates.js"></script>
```

## 📚 Options

### Currency converter

| Prop / option | Default | Description |
|---|---|---|
| `base` | `USD` | Starting "from" currency |
| `target` | `EUR` | Starting "to" currency |
| `amount` | `1` | Starting amount |
| `theme` | `light` | `light` or `dark` |
| `apiKey` | — | Optional. Real-time rates for 160+ currencies and your own quota. Without it: ECB reference rates. |

### Official rate

| Prop / option | Default | Description |
|---|---|---|
| `bank` | `ecb` | Publisher code: `ecb`, `boe`, `rbi`, `boj`, `snb`, `hmrc`, `ustreasury`, … ([full list](https://allratestoday.com/central-bank-rates-api/institutions/)) |
| `source` | `USD` | From currency |
| `target` | `EUR` | To currency |
| `theme` | `light` | `light` or `dark` |

Changing a prop re-renders the widget. `mountConverter()` and `mountOfficialRate()` return `{ element, ready, destroy }`.

## 🔑 Get your API key

The widgets work without a key. For real-time rates in the converter, [register for a free API key](https://allratestoday.com/register). A key in front-end code is visible to visitors, so anyone can copy it and use your quota. Watch usage in your [dashboard](https://allratestoday.com/profile) and rotate the key there if needed.

## 🔗 Links

- **Website:** [allratestoday.com](https://allratestoday.com)
- [Widget demo and generator](https://allratestoday.com/widget/) · [Official rates widget](https://allratestoday.com/official-rates-widget/)
- [Download central bank rates](https://allratestoday.com/download-central-bank-rates/) — every bank's tables as Excel, CSV or JSON
- [API documentation](https://allratestoday.com/docs/) · [Register (Free)](https://allratestoday.com/register) · [Dashboard](https://allratestoday.com/profile) · [Pricing](https://allratestoday.com/pricing/)
- [Status](https://allratestoday.com/status)
- [ChatGPT app](https://chatgpt.com/plugins/plugin_asdk_app_6ae1e76098f48191a285ac3f5ab7a83b) — ask ChatGPT for live and official central bank rates
- [OpenAPI reference on Bump.sh](https://bump.sh/allratestoday/doc/allratestoday-api) — also on [SwaggerHub](https://app.swaggerhub.com/apis-docs/allratestoday/allratestoday-exchange-rate-central-bank-rates-api/2.2.0)
- [GitHub](https://github.com/AllRates-Today/allratestoday-widget)

## 📜 License

MIT
