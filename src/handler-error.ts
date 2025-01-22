import type { ErrorOptions, Severity } from "./types";
import crypto from "node:crypto";
import { ErrorSeverity } from "./constants";

/**
 * Base error class for handling errors.
 */
export class HandlerError extends Error {
  public readonly id: string; // Unique identifier for the error.
  public readonly timestamp: Date; // Timestamp of when the error occurred.
  public readonly severity: Severity; // Severity of the error.
  public readonly code?: string; // Error code for the error.
  public readonly metadata: Record<string, unknown> = {}; // Additional metadata for the error.

  /**
   * Creates a new `HandlerError` instance.
   *
   * @param message - The error message.
   */
  constructor(options: ErrorOptions) {
    super(options.message);

    // Initialize basic properties
    this.id = crypto.randomUUID();
    this.name = options.name ?? this.constructor.name;
    this.timestamp = new Date();
    this.severity = options.severity ?? ErrorSeverity.ERROR;
    this.code = options.code;
    this.metadata = options.metadata ?? {};
  }
}
