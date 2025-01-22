import { ErrorSeverity } from "./constants";

/**
 * Represents the options for creating a new error.
 *
 * code: Error code for the error.
 * message: The error message.
 * metadata: Additional metadata for the error.
 * name: The name of the error.
 * severity: The severity of the error.
 */
export interface ErrorOptions {
  code?: string;
  message: string;
  metadata?: Record<string, unknown>;
  name?: string;
  severity?: Severity;
}

/**
 * Represents the severity levels for an error.
 */
export type Severity = (typeof ErrorSeverity)[keyof typeof ErrorSeverity];
