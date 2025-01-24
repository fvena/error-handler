import { ErrorSeverity } from "../constants";

/**
 * Represents the options for creating a new error.
 *
 * cause: The cause of the error.
 * code: Error code for the error.
 * message: The error message.
 * metadata: Additional metadata for the error.
 * name: The name of the error.
 * severity: The severity of the error.
 */
export interface ErrorOptions {
  cause?: Error;
  code?: string;
  message: string;
  metadata?: Metadata;
  name?: string;
  severity?: Severity;
}

/**
 * Represents the metadata for the error.
 */
export type Metadata = Record<string, unknown>;

/**
 * Represents the severity levels for an error.
 */
export type Severity = (typeof ErrorSeverity)[keyof typeof ErrorSeverity];
