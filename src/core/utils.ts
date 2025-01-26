import type { Metadata } from "./types/error-types";
import { HandlerError } from "./handler-error";
import { isHandlerError } from "./guards/handler-error-guards";

export function processArguments(
  argument2?: Error | Metadata | string,
  argument3?: Error | Metadata,
  argument4?: Error,
) {
  let cause: HandlerError | undefined;
  let code: string | undefined;
  let metadata: Metadata | undefined;

  if (typeof argument2 === "string") {
    code = argument2;

    if (argument3 && !(argument3 instanceof Error)) {
      metadata = argument3;

      if (argument4 && argument4 instanceof Error) {
        cause = convertToHandlerError(argument4);
      }
    } else if (argument3 && argument3 instanceof Error) {
      cause = convertToHandlerError(argument3);
    }
  } else if (argument2 && argument2 instanceof Error) {
    cause = convertToHandlerError(argument2);
  } else if (argument2) {
    metadata = argument2;

    if (argument3 && argument3 instanceof Error) {
      cause = convertToHandlerError(argument3);
    }
  }

  return { cause, code, metadata };
}

/**
 * Sets the cause of the error.
 *
 * @param error - The error that caused this error.
 */
export function convertToHandlerError(error: Error | undefined): HandlerError | undefined {
  if (!error) return undefined;
  if (!(error instanceof Error)) return undefined;

  return isHandlerError(error) ? error : new HandlerError(error.message);
}
