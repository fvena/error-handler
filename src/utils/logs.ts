import type { ErrorType, HandlerErrorProperties } from "../types";
import chalk from "chalk";

/**
 * Formats the type of an error into a string with color.
 *
 * @param type - The type of the error.
 * @param data - The data to format.
 * @returns The formatted error type string.
 */
export function formatErrorType(type: ErrorType, data: string): string {
  const typeMap = {
    error: chalk.red(data),
    warning: chalk.yellow(data),
  };

  return Object.prototype.hasOwnProperty.call(typeMap, type)
    ? typeMap[type]
    : chalk.red("Unknown Error");
}

/**
 * Logs a compact representation of an error, suitable for centralized logging systems.
 *
 * @param data - The input data containing details of the error.
 *
 * @example
 * timestamp [method] SEVERITY ERROR_TYPE errorCode file: message
 */
export function logCompact(data: HandlerErrorProperties) {
  const logError = [];

  logError.push(chalk.gray(data.timestamp.toISOString()));
  if (data.method) logError.push(chalk.yellow(`[${data.method}]`));
  const severity = data.severity ? data.severity.toUpperCase() : "";
  const logErrorInfo =
    [severity, toUpperCaseFirstLetter(data.type)].filter(Boolean).join(" ") + ":";
  logError.push(formatErrorType(data.type, logErrorInfo));
  if (data.errorCode) logError.push(chalk.green(data.errorCode));
  if (data.file) logError.push(chalk.gray(data.file));
  logError.push(data.message);

  console.log(logError.filter(Boolean).join(" "));
}

/**
 * Logs detailed information about an error.
 *
 * @param data - The input data containing details of the error.
 *
 * @example
 *
 * errorName [SEVERITY ERROR_TYPE errorCode] method file: message
 *
 * Description:
 * context message
 * Received value: values
 *
 * Solution:
 * solution
 *
 * Example:
 * example
 *
 * Stack Trace:
 * ❯ method file:line
 * ❯ method file:line
 */
export function logDetail(data: HandlerErrorProperties) {
  // Log header
  const severity = data.severity ? data.severity.toUpperCase() : "";
  const type = `${toUpperCaseFirstLetter(data.type)}${data.errorCode ? ":" : ""}`;
  const errorCode = data.errorCode ? chalk.yellow(data.errorCode) : "";
  const method = data.method ? chalk.green(data.method) : "";
  const file = data.file ? chalk.gray(data.file) : "";
  const message = chalk.bold(data.message);

  const logHeaderErrorInfo = formatErrorType(
    data.type,
    `[${[severity, type, errorCode].filter(Boolean).join(" ")}]`,
  );
  const logHeaderLocation = `${[method, file].filter(Boolean).join(" ")}${method || file ? ":" : ""}`;
  const logHeader = [data.name, logHeaderErrorInfo, logHeaderLocation, message]
    .filter(Boolean)
    .join(" ");

  console.log(logHeader);

  // Log description
  console.log(chalk.bold(`\nDescription:`));
  console.log(chalk.gray(`${data.context ?? ""} ${data.message}`));
  if (data.values) {
    // eslint-disable-next-line unicorn/no-null -- null is a valid value
    console.log(`Received value: ${chalk.gray(JSON.stringify(data.values, null, 2))}`);
  }

  // Log solution
  if (data.solution) {
    console.log(chalk.bold(`\nSolution:`));
    console.log(chalk.gray(data.solution));
  }

  // Log example
  if (data.example) {
    console.log(chalk.bold(`\nExample:`));
    console.log(chalk.gray(data.example));
  }

  // Log stack trace
  if (data.stackTrace.length === 0) return;

  console.log(chalk.bold(`\nStack Trace:`));
  const formattedStack = data.stackTrace
    .map((trace) => {
      const prefix = chalk.gray(" ❯");
      const method = trace.method ? chalk.yellow(trace.method) : "<anonymous>";
      const location = chalk.gray(
        `${trace.file ?? "undefined"}:${String(trace.line ?? "unknown")}`,
      );
      return `${prefix} ${method} ${location}`;
    })
    .join("\n");

  console.log(formattedStack);
}

/**
 * Logs a simple representation of an error, suitable for quick overviews.
 *
 * @param data - The input data containing details of the error.
 *
 * @example
 * [library] ErrorType: context message solution
 * Received value: values
 */
export function logSimple(data: HandlerErrorProperties): void {
  const logError = [];

  if (data.library) {
    logError.push(chalk.yellow(`[${data.library}]`));
  }

  logError.push(formatErrorType(data.type, `${toUpperCaseFirstLetter(data.type)}:`));

  if (data.context) {
    logError.push(data.context);
  }

  logError.push(data.message);

  if (data.solution) {
    logError.push(data.solution);
  }

  if (data.values) {
    // eslint-disable-next-line unicorn/no-null -- null is a valid value
    logError.push(`\nReceived value: ${chalk.gray(JSON.stringify(data.values, null, 2))}`);
  }

  console.log(logError.filter(Boolean).join(" "));
}

function toUpperCaseFirstLetter(string_: string): string {
  return string_.charAt(0).toUpperCase() + string_.slice(1);
}
