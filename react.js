// React components for the AllRatesToday widgets. No JSX, so no build step.
import { createElement, useEffect, useRef } from 'react';
import { mountConverter, mountOfficialRate } from './index.js';

function useWidget(mountFn, options, deps) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return undefined;
    const handle = mountFn(ref.current, options);
    return () => handle.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/** Currency converter. Props: base, target, amount, theme, apiKey, className, style. */
export function CurrencyConverter({ base, target, amount, theme, apiKey, apiBase, className, style }) {
  const ref = useWidget(mountConverter, { base, target, amount, theme, apiKey, apiBase }, [base, target, amount, theme, apiKey, apiBase]);
  return createElement('div', { ref, className, style });
}

/** Official central-bank or tax-authority rate. Props: bank, source, target, theme, className, style. */
export function OfficialRate({ bank, source, target, theme, apiBase, className, style }) {
  const ref = useWidget(mountOfficialRate, { bank, source, target, theme, apiBase }, [bank, source, target, theme, apiBase]);
  return createElement('div', { ref, className, style });
}
