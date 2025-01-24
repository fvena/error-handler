import type { ErrorOptions, Metadata, Severity } from "./types/error-types";
import type { SerializedError } from "./types/serialize-types";
import crypto from "node:crypto";
import { ErrorSeverity } from "./constants";
import { HandlerErrorChain } from "./error-chain";

/**
 * Base error class for handling and managing errors
 */
export class HandlerError extends Error {
  public readonly id: string; // Unique identifier for the error
  public readonly timestamp: Date; // Timestamp of when the error occurred
  public readonly severity: Severity; // Severity of the error
  public readonly code?: string; // Error code for the error
  public readonly metadata: Metadata; // Additional metadata for the error
  public readonly errorChain: HandlerErrorChain; // The error chain for the error
  public override cause?: HandlerError; // The cause of the error

  /**
   * Constructs a new `HandlerError` instance.
   *
   * @param options - An object containing properties to initialize the error.
   * - `cause` (optional Error): The error that caused this error.
   * - `code` (optional string): A custom code for identifying the error type.
   * - `message` (string): The error message.
   * - `metadata` (optional Metadata): Additional contextual data.
   * - `name` (optional string): The name of the error. Defaults to the class name.
   * - `severity` (optional Severity): The severity of the error. Defaults to `ErrorSeverity.ERROR`.
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
    this.errorChain = new HandlerErrorChain(this);

    // Handle cause
    if (options.cause) {
      this.setCause(options.cause);
    }
  }

  /**
   * Sets the cause of the error.
   *
   * @param error - The error that caused this error.
   */
  private setCause(error: Error) {
    if (error instanceof HandlerError) {
      this.cause = error;
    } else if (error instanceof Error) {
      // Convert standard error to HandlerError
      this.cause = new HandlerError({
        message: error.message,
        name: error.name,
        severity: ErrorSeverity.ERROR,
      });
    } else {
      throw new TypeError("Cause must be an instance of Error or HandlerError");
    }
  }

  /**
   * Serializes the error into a plain object.
   *
   * @returns An object representing the serialized error.
   */
  public serialize(): SerializedError {
    return {
      cause: this.cause?.serialize(),
      id: this.id,
      message: this.message,
      metadata: this.metadata,
      name: this.name,
      severity: this.severity,
      timestamp: this.timestamp.toISOString(),
    };
  }

  /**
   * Returns a human-readable string representation of the error,
   *
   * @returns A string representation of the error.
   */
  override toString() {
    return `[${this.severity.toUpperCase()}] ${this.name}: ${this.message} (ID: ${this.id})`;
  }
}
