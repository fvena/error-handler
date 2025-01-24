import { ErrorSeverity } from "../constants";

/**
 * Represents the metadata for the error.
 */
export type Metadata = Record<string, unknown>;

/**
 * Represents the severity levels for an error.
 */
export type Severity = (typeof ErrorSeverity)[keyof typeof ErrorSeverity];
