import { HandlerError } from "../handler-error";

export function isHandlerError(error: Error): error is HandlerError {
  return error instanceof HandlerError;
}
