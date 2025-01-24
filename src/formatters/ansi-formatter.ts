import type { FormatterOptions } from "../core/types/formatter-types";
import type { HandlerError } from "../core/handler-error";
import { BaseFormatter } from "../core/formatter-base";
import { isHandlerError } from "../core/guards/error-guards";
import { TextFormatter } from "./text-formatter";
import { colors, formats } from "./constants";

/**
 * Default options for the ANSI formatter.
 */
const AnsiFormatterOptionsDefaults = {
  colors: true,
  showMetadata: false,
  showTimestamp: false,
};

export type AnsiFormatterOptions = typeof AnsiFormatterOptionsDefaults;

/**
 * ANSI color formatter for terminal output
 */
export class AnsiFormatter extends BaseFormatter<AnsiFormatterOptions> {
  constructor(options?: Partial<AnsiFormatterOptions>) {
    super({ ...AnsiFormatterOptionsDefaults, ...options });
  }

  private _fallbackFormatter?: TextFormatter;

  format(error: HandlerError, options?: Partial<AnsiFormatterOptions>): string {
    if (!isHandlerError(error)) {
      throw new Error("Error must be an instance of HandlerError");
    }

    const customOptions = { ...this.options, ...options };

    if (!customOptions.colors) {
      // Perform fallback to text formatter if colors are disabled
      // We don't want to create a TextFormatter instance every time this method is called
      if (!this._fallbackFormatter) {
        this._fallbackFormatter = new TextFormatter(customOptions);
      }
      return this._fallbackFormatter.format(error, options);
    }

    let result = `${formats.bold}${colors.red}${error.name}${formats.reset}: `;
    result += error.message;

    if (customOptions.showTimestamp) {
      result = `${colors.gray}[${error.timestamp.toISOString()}]${formats.reset} ${result}`;
    }

    if (customOptions.showMetadata && Object.keys(error.metadata).length > 0) {
      result += `\n${formats.dim}Metadata: ${JSON.stringify(error.metadata)}${formats.reset}`;
    }

    return result;
  }

  override formatChain(errors: HandlerError[], options?: Partial<FormatterOptions>): string {
    const customOptions = { ...this.options, ...options };

    const mapError = (error: HandlerError, index: number) => {
      const indent = index === 0 ? "" : "    ".repeat(index - 1);
      const prefix = index === 0 ? "" : `└── `;
      return `${indent}${prefix}${this.format(error, customOptions)}`;
    };

    return this.formatErrorChain(errors, mapError).join("\n");
  }
}
