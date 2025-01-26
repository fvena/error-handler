import type { Metadata, Severity } from "./types/error-types";
import type { SerializedError } from "./types/serialize-types";
import crypto from "node:crypto";
import { ErrorSeverity } from "./constants";
import { processArguments } from "./utils";

/**
 * Base error class for handling and managing errors
 */
export class HandlerError extends Error {
  public readonly id: string; // Unique identifier for the error
  public readonly timestamp: Date; // Timestamp of when the error occurred
  public readonly severity: Severity; // Severity of the error
  public readonly code?: string; // Error code for the error
  public readonly metadata?: Metadata; // Additional metadata for the error
  public override cause?: HandlerError; // The cause of the error

  /**
   * Constructs a new `HandlerError` instance.
   */
  constructor(
    message: string,
    argument2?: Error | Metadata | string,
    argument3?: Error | Metadata,
    argument4?: Error,
  ) {
    super(message);

    // Initialize basic properties
    this.id = crypto.randomUUID();
    this.name = this.constructor.name;
    this.severity = ErrorSeverity.ERROR;
    this.timestamp = new Date();

    // Parse constructor arguments
    const { cause, code, metadata } = processArguments(argument2, argument3, argument4);
    this.cause = cause;
    this.code = code;
    this.metadata = metadata;
  }

  /**
   * Creates a new `HandlerError` instance with the Critical severity.
   */
  public static critical = class CriticalHandlerError extends HandlerError {
    override readonly severity: Severity = ErrorSeverity.CRITICAL;
  };

  /**
   * Creates a new `HandlerError` instance with the Error severity.
   */
  public static error = class ErrorHandlerError extends HandlerError {
    override readonly severity: Severity = ErrorSeverity.ERROR;
  };

  /**
   * Creates a new `HandlerError` instance with the Warning severity.
   */
  public static warning = class WarningHandlerError extends HandlerError {
    override readonly severity: Severity = ErrorSeverity.WARNING;
  };

  /**
   * Creates a new `HandlerError` instance with the Info severity.
   */
  public static info = class InfoHandlerError extends HandlerError {
    override readonly severity: Severity = ErrorSeverity.INFO;
  };

  /**
   * Creates a new `HandlerError` instance with the Debug severity.
   */
  public static debug = class DebugHandlerError extends HandlerError {
    override readonly severity: Severity = ErrorSeverity.DEBUG;
  };

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
    return `[${this.severity.toUpperCase()}] ${this.name}: ${this.message}`;
  }
}
