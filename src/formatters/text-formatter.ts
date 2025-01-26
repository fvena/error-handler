import type { HandlerError } from "../core/handler-error";
import { BaseFormatter } from "../core/formatter-base";
import { isHandlerError } from "../core/guards/handler-error-guards";

/**
 * Default options for the text formatter.
 */
export const TextFormatterOptionsDefaults = {
  indentSize: 2,
  showMetadata: true,
  showTimestamp: true,
};

export type TextFormatterOptions = typeof TextFormatterOptionsDefaults;

/**
 * Simple text formatter
 */
export class TextFormatter extends BaseFormatter<TextFormatterOptions> {
  constructor(options?: Partial<TextFormatterOptions>) {
    super({ ...TextFormatterOptionsDefaults, ...options });
  }

  format(error: HandlerError, options?: Partial<TextFormatterOptions>): string {
    if (!isHandlerError(error)) {
      throw new Error("Error must be an instance of HandlerError");
    }

    const customOptions = { ...this.options, ...options };

    let result = `${error.name}: ${error.message}`;

    if (customOptions.showTimestamp) {
      result = `[${error.timestamp.toISOString()}] ${result}`;
    }

    if (customOptions.showMetadata) {
      const metadata = error.metadata;

      if (Object.keys(metadata).length > 0) {
        result += `\nMetadata: ${JSON.stringify(metadata)}`;
      }
    }

    return result;
  }

  override formatChain(errors: HandlerError[], options?: Partial<TextFormatterOptions>): string {
    const customOptions = { ...this.options, ...options };

    const mapError = (error: HandlerError, index: number) => {
      const indent = index === 0 ? "" : "    ".repeat(index - 1);
      const prefix = index === 0 ? "" : `└── `;
      return `${indent}${prefix}${this.format(error, customOptions)}`;
    };

    return this.formatErrorChain(errors, mapError).join("\n");
  }
}
