// Vue 3 components for the AllRatesToday widgets. Render functions, so no build step.
import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { mountConverter, mountOfficialRate } from './index.js';

function widget(name, mountFn, propNames) {
  return defineComponent({
    name,
    props: Object.fromEntries(propNames.map((p) => [p, { type: [String, Number], default: undefined }])),
    setup(props) {
      const root = ref(null);
      let handle = null;
      const render = () => {
        if (handle) handle.destroy();
        handle = root.value ? mountFn(root.value, { ...props }) : null;
      };
      onMounted(render);
      watch(() => propNames.map((p) => props[p]), render);
      onBeforeUnmount(() => handle && handle.destroy());
      return () => h('div', { ref: root });
    },
  });
}

/** Currency converter. Props: base, target, amount, theme, apiKey. */
export const CurrencyConverter = widget('CurrencyConverter', mountConverter, ['base', 'target', 'amount', 'theme', 'apiKey', 'apiBase']);

/** Official central-bank or tax-authority rate. Props: bank, source, target, theme. */
export const OfficialRate = widget('OfficialRate', mountOfficialRate, ['bank', 'source', 'target', 'theme', 'apiBase']);
