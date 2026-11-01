export declare const API_BASE: string;

export type Theme = 'light' | 'dark';

export interface ConverterOptions {
  /** Starting "from" currency, e.g. "USD". */
  base?: string;
  /** Starting "to" currency, e.g. "EUR". */
  target?: string;
  /** Starting amount. */
  amount?: number | string;
  theme?: Theme;
  /** Optional AllRatesToday API key: real-time rates for 150+ currencies. Without one the widget uses ECB reference rates. */
  apiKey?: string;
  /** Override the API origin (testing or self-hosting). */
  apiBase?: string;
}

export interface OfficialRateOptions {
  /** Publisher code: "ecb", "boe", "rbi", "hmrc", "ustreasury", ... */
  bank?: string;
  source?: string;
  target?: string;
  theme?: Theme;
  apiBase?: string;
}

export interface WidgetHandle {
  element: HTMLDivElement;
  /** Resolves once the widget script has loaded and rendered. */
  ready: Promise<HTMLDivElement>;
  /** Remove the widget from the page. */
  destroy(): void;
}

export declare function converterAttributes(options?: ConverterOptions): Record<string, string | number | undefined>;
export declare function officialRateAttributes(options?: OfficialRateOptions): Record<string, string | undefined>;
export declare function mountConverter(container: HTMLElement, options?: ConverterOptions): WidgetHandle;
export declare function mountOfficialRate(container: HTMLElement, options?: OfficialRateOptions): WidgetHandle;
