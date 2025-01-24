import type { ErrorFormatter, FormatterOptions } from "./types/formatter-types";
import type { HandlerError } from "./handler-error";

/**
 * Base class for error formatters.
 */
export abstract class BaseFormatter<T extends FormatterOptions | undefined = undefined>
  implements ErrorFormatter
{
  protected options: T;

  /**
   * Constructs a new instance of the formatter with optional customization.
   *
   * @param options - Optional customization options for the formatter.
   */
  constructor(options?: T) {
    this.options = (options ?? Object.create(null)) as T;
  }

  /**
   * Formats a chain of errors using the provided formatter logic.
   *
   * @param errors - An array of `HandlerError` instances to format.
   * @param formatter - A function that formats individual errors.
   * @returns An array of formatted error strings.
   */
  protected formatErrorChain(
    errors: HandlerError[],
    formatter: (error: HandlerError, index: number) => unknown,
  ): unknown[] {
    const seen = new Set<HandlerError>();

    return errors
      .filter((error) => {
        if (seen.has(error)) return false;
        seen.add(error);
        return true;
      })
      .map((error, index) => formatter(error, index));
  }

  /**
   * Formats a single error into a string.
   *
   * @param error - The error to format.
   * @param options - Optional additional formatting options.
   * @returns The formatted error string.
   */
  public abstract format(error: Error, options?: T): string;

  /**
   * Formats a chain of errors into a string.
   *
   * @param errors - The array of errors to format.
   * @param options - Optional additional formatting options.
   * @returns The formatted error chain string.
   */
  public formatChain(errors: Error[], options?: T): string {
    // Default implementation: format each error individually
    const customOptions = { ...this.options, ...options };
    return errors.map((error) => this.format(error, customOptions)).join("\n");
  }
}
