import type { ErrorType, Severity } from "../types";
import { ERROR_TYPES, SEVERITIES } from "../constants";

export function validateErrorType(type: ErrorType): void {
  if (!ERROR_TYPES.includes(type)) {
    throw new Error(`Invalid error type: "${type}". Must be one of: ${ERROR_TYPES.join(", ")}`);
  }
}

export function validateObject(object: Record<string, unknown>): void {
  if (typeof object !== "object") {
    throw new TypeError(`Invalid object: "${String(object)}" must be an object.`);
  }
}

export function validateSeverity(severity: Severity): void {
  if (!SEVERITIES.includes(severity)) {
    throw new Error(`Invalid severity: "${severity}". Must be one of: ${SEVERITIES.join(", ")}`);
  }
}
