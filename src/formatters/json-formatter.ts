import type { HandlerError } from "../core/handler-error";
import { BaseFormatter } from "../core/formatter-base";
import { isHandlerError } from "../core/guards/handler-error-guards";

/**
 * Default options for the JSON formatter.
 */
const JsonFormatterOptionsDefaults = {
  indentSize: 2,
  showMetadata: true,
  showStackTrace: true,
  showTimestamp: true,
};

export type JsonFormatterOptions = typeof JsonFormatterOptionsDefaults;

/**
 * Formatter that outputs errors in JSON format.
 */
export class JsonFormatter extends BaseFormatter<JsonFormatterOptions> {
  constructor(options?: Partial<JsonFormatterOptions>) {
    super({ ...JsonFormatterOptionsDefaults, ...options });
  }

  /**
   * Formats a single error into JSON.
   *
   * @param error - The `HandlerError` to format.
   * @param options - Partial options to override the default formatting options.
   * @returns The formatted error string in JSON format.
   * @throws If the error is not an instance of `HandlerError`.
   */
  format(error: HandlerError, options?: Partial<JsonFormatterOptions>): string {
    if (!isHandlerError(error)) {
      throw new Error("Error must be an instance of HandlerError");
    }

    const customOptions = { ...this.options, ...options };

    const formatted = {
      message: error.message,
      name: error.name,
      ...(customOptions.showStackTrace ? { stack: error.stack } : {}),
      ...(customOptions.showTimestamp ? { timestamp: error.timestamp.toISOString() } : {}),
      ...(customOptions.showMetadata ? { metadata: error.metadata } : {}),
    };

    // eslint-disable-next-line unicorn/no-null -- Allow null values in JSON output
    return JSON.stringify(formatted, null, customOptions.indentSize);
  }

  /**
   * Formats a chain of errors into JSON.
   *
   * @param errors - An array of `HandlerError` instances to format.
   * @param options - Partial options to override the default formatting options.
   * @returns The formatted error chain string in JSON format.
   */
  override formatChain(errors: HandlerError[], options?: Partial<JsonFormatterOptions>): string {
    const customOptions = { ...this.options, ...options };

    const mapError = (error: HandlerError) =>
      JSON.parse(this.format(error, customOptions)) as Record<string, unknown>;
    const chain = this.formatErrorChain(errors, mapError);

    // eslint-disable-next-line unicorn/no-null -- Allow null values in JSON output
    return JSON.stringify(chain, null, customOptions.indentSize);
  }
}
