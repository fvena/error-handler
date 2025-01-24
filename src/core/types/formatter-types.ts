/**
 * Interface for error formatters
 */
export interface ErrorFormatter {
  format(error: Error, options?: FormatterOptions): string;
  formatChain(errors: Error[], options?: FormatterOptions): string;
}

/**
 * Options for error formatting
 */
export type FormatterOptions = Record<string, unknown>;

/**
 * Factory function for creating error formatters
 */
export type FormatterFactory = (options?: FormatterOptions) => ErrorFormatter;
