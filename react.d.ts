import type { CSSProperties, ReactElement } from 'react';
import type { ConverterOptions, OfficialRateOptions } from './index.js';

interface Common { className?: string; style?: CSSProperties }
export declare function CurrencyConverter(props: ConverterOptions & Common): ReactElement;
export declare function OfficialRate(props: OfficialRateOptions & Common): ReactElement;
