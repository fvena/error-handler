import type { ErrorType, HandlerErrorProperties, Severity } from "../types";
import chalk from "chalk";

/**
 * Formats the type of an error into a string with color.
 *
 * @param type - The type of the error.
 * @param severity - The severity of the error.
 * @returns The formatted error type string.
 */
export function formatErrorType(type: ErrorType, severity?: Severity): string {
  const severityString = severity ? `${severity.toUpperCase()} ` : "";
  const typeMap = {
    error: chalk.red(`${severityString}Error:`),
    warning: chalk.yellow(`${severityString}Warning:`),
  };

  return Object.prototype.hasOwnProperty.call(typeMap, type)
    ? typeMap[type]
    : chalk.red(`${severityString}Unknown Error:`);
}

/**
 * Logs a compact representation of an error, suitable for centralized logging systems.
 *
 * @param data - The input data containing details of the error.
 */
export function logCompact(data: HandlerErrorProperties) {
  const logError = [];

  logError.push(chalk.gray(data.timestamp.toISOString()));
  if (data.method) logError.push(chalk.yellow(`[${data.method}]`));
  logError.push(formatErrorType(data.type, data.severity));
  if (data.errorCode) logError.push(chalk.green(data.errorCode));
  if (data.file) logError.push(chalk.gray(data.file));
  logError.push(data.message);

  console.log(logError.join(" "));
}

/**
 * Logs detailed information about an error.
 *
 * @param data - The input data containing details of the error.
 */
export function logDetail(data: HandlerErrorProperties) {
  const severity = formatErrorType(data.type, data.severity);
  const errorCode = data.errorCode ? chalk.yellow(` ${data.errorCode}`) : "";
  const method = data.method ? chalk.green(data.method) : "";
  const file = data.file ? chalk.gray(` ${data.file}`) : "";
  const message = chalk.bold(data.message);

  // Log header
  console.log(`${data.name} [${severity}${errorCode}] ${method}${file}: ${message}`);

  // Log values
  console.log(chalk.bold(`\nDescription:`));
  console.log(chalk.gray(`${data.context ?? ""} ${data.message}`));
  if (data.values) {
    console.log(chalk.gray(JSON.stringify(data.values)));
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
      const location = chalk.gray(`${trace.file ?? "undefine"}:${String(trace.line)}`);
      return `${prefix} ${method} ${location}`;
    })
    .join("\n");

  console.log(formattedStack);
}

/**
 * Logs a simple representation of an error, suitable for quick overviews.
 *
 * @param data - The input data containing details of the error.
 */
export function logSimple(data: HandlerErrorProperties): void {
  const logError = [];

  if (data.library) {
    logError.push(chalk.yellow(`[${data.library}]`));
  }

  logError.push(formatErrorType(data.type));

  if (data.context) {
    logError.push(data.context);
  }

  logError.push(data.message);

  if (data.solution) {
    logError.push(data.solution);
  }

  if (data.values) {
    logError.push(`\nReceived value: ${chalk.gray(JSON.stringify(data.values))}`);
  }

  console.log(logError.join(" "));
}
