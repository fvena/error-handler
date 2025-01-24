import type { ErrorFormatter, FormatterFactory, FormatterOptions } from "./types/formatter-types";

/**
 * Registry for managing error formatters.
 */
export class FormatterRegistry {
  private formatters: Map<string, FormatterFactory>;

  constructor() {
    this.formatters = new Map();
  }

  /**
   * Registers a new formatter factory with a unique name.
   *
   * @param name - The unique name of the formatter.
   * @param factory - The factory function that produces instances of the formatter.
   * @throws If the name is empty or already registered (and `overwrite` is `false`).
   */
  public register(name: string, factory: FormatterFactory): void {
    if (!name || typeof name !== "string") {
      throw new Error("Formatter name must be a non-empty string");
    }

    if (typeof factory !== "function") {
      throw new TypeError("Formatter factory must be a function");
    }

    this.formatters.set(name, factory);
  }

  /**
   * Retrieves a formatter by its name, with optional customization options.
   *
   * @param name - The name of the formatter to retrieve.
   * @param options - Optional customization options to pass to the formatter factory.
   * @returns An instance of the requested formatter.
   * @throws If the formatter is not found.
   */
  public get(name: string, options?: FormatterOptions): ErrorFormatter {
    const factory = this.formatters.get(name);

    if (!factory) {
      throw new Error(`Formatter '${name}' not found.`);
    }

    return factory(options);
  }

  /**
   * Retrieves a list of all registered formatter names.
   *
   * @returns An array of formatter names.
   */
  public list(): string[] {
    return [...this.formatters.keys()];
  }
}
