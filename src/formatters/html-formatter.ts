import type { HandlerError } from "../core/handler-error";
import { BaseFormatter } from "../core/formatter-base";
import { isHandlerError } from "../core/guards/handler-error-guards";

/**
 * Default options for the HTML formatter.
 */
const HtmlFormatterOptionsDefaults = {
  showMetadata: true,
  showStackTrace: false,
  showTimestamp: true,
};

export type HtmlFormatterOptions = typeof HtmlFormatterOptionsDefaults;

/**
 * Lowercase the first letter of a string.
 *
 * @param string_ - The string to lowercase.
 * @returns The string with the first letter lowercased.
 */
function lowercaseFirstLetter(string_: string) {
  if (!string_) return string_;
  return string_.charAt(0).toLowerCase() + string_.slice(1);
}

function escapeHTML(input: string): string {
  const map: Record<string, string> = {
    '"': "&quot;",
    "&": "&amp;",
    "'": "&#039;",
    "/": "&#x2F;",
    "<": "&lt;",
    ">": "&gt;",
    "`": "&#x60;",
  };

  return input.replaceAll(/[&<>"'`/]/g, (char) => map[char] ?? "");
}

/**
 * HTML formatter for web display
 */
export class HtmlFormatter extends BaseFormatter<HtmlFormatterOptions> {
  constructor(options?: Partial<HtmlFormatterOptions>) {
    super({ ...HtmlFormatterOptionsDefaults, ...options });
  }

  format(error: HandlerError, options?: Partial<HtmlFormatterOptions>): string {
    if (!isHandlerError(error)) {
      throw new Error("Error must be an instance of HandlerError");
    }

    const customOptions = { ...this.options, ...options };

    return `
      <div class="error ${lowercaseFirstLetter(error.name)}">
        <h3 class="error-title">${error.name}</h3>
        <p class="error-message">${escapeHTML(error.message)}</p>
        ${customOptions.showTimestamp ? `<div class="error-timestamp">${error.timestamp.toISOString()}</div>` : ""}
        ${customOptions.showMetadata && error.metadata ? `<div class="error-metadata"><pre>${escapeHTML(JSON.stringify(error.metadata))}</pre></div>` : ""}
        ${customOptions.showStackTrace && error.stack ? `<pre class="error-stack">${error.stack}</pre>` : ""}
      </div>
    `;
  }

  override formatChain(errors: HandlerError[], options?: Partial<HtmlFormatterOptions>): string {
    const customOptions = { ...this.options, ...options };

    const mapError = (error: HandlerError) => this.format(error, customOptions);
    const chain = this.formatErrorChain(errors, mapError);

    return `<div class="error-chain">${chain.join("\n")}</div>`;
  }
}
