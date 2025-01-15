import type { ErrorType, Severity, StackFrame } from "./types";
import crypto from "node:crypto";
import { formatStack } from "./utils/stack";
import { validateErrorType, validateSeverity, validateTimestamp } from "./utils/validations";

/**
 * Represents a customizable error with detailed context, metadata, and stack trace.
 */
export class HandlerError extends Error {
  // Identification properties
  private _id: string; // Unique identifier for the error.
  private _file?: string; // File in which the error occurred.
  private _library?: string; // Library or package that caused the error.
  private _method?: string; // Method in which the error occurred.
  private _timestamp: Date; // Timestamp of when the error occurred.

  // Description properties
  private _context?: string; // Context in which the error occurred.
  private _description?: string; // Detailed description of the error.
  private _solution?: string; // Solution to resolve the error.

  // Categorization properties
  private _errorCode?: string; // Error code for the error.
  private _severity: Severity = "medium"; // Severity of the error.
  private _type: ErrorType = "error"; // Type of error.

  // Additional properties
  private _example?: string; // Example of how to resolve the error.
  private _metadata: Record<string, unknown> = {}; // Additional metadata for the error.
  private _stackTrace: StackFrame[] = []; // Stack trace of the error.
  private _values: Record<string, unknown> = {}; // Values associated with the error.

  /**
   * Creates a new `HandlerError` instance.
   *
   * @param message - The error message.
   */
  constructor(message: string) {
    super(message);

    this._id = crypto.randomUUID();
    this.name = this.constructor.name;
    this._timestamp = new Date();
    this._description = message;

    if (this.stack) {
      this._stackTrace = formatStack(this.stack);
      this._method = this._stackTrace[0]?.method ?? undefined;
      this._file = this._stackTrace[0]?.file ?? undefined;
    }

    // Ensures the prototype chain is correctly set to HandlerError.
    Object.setPrototypeOf(this, HandlerError.prototype);
  }

  /* Getters */

  get context() {
    return this._context;
  }

  get description() {
    return this._description;
  }

  get errorCode() {
    return this._errorCode;
  }

  get example() {
    return this._example;
  }

  get file() {
    return this._file;
  }

  get id() {
    return this._id;
  }

  get library() {
    return this._library;
  }

  get metadata() {
    return this._metadata;
  }

  get method() {
    return this._method;
  }

  get severity() {
    return this._severity;
  }

  get solution() {
    return this._solution;
  }

  get stackTrace() {
    return this._stackTrace;
  }

  get timestamp() {
    return this._timestamp;
  }

  get type() {
    return this._type;
  }

  get values() {
    return this._values;
  }

  /* Setters */

  public setContext(context: string) {
    this._context = context;
    return this;
  }

  public setDescription(description: string) {
    this._description = description;
    return this;
  }

  public setErrorCode(errorCode: string) {
    this._errorCode = errorCode;
    return this;
  }

  public setExample(example: string) {
    this._example = example;
    return this;
  }

  public setFile(file: string) {
    this._file = file;
    return this;
  }

  public setId(id: string) {
    this._id = id;
    return this;
  }

  public setLibrary(library: string) {
    this._library = library;
    return this;
  }

  public setMetadata(metadata: Record<string, unknown>) {
    this._metadata = metadata;
    return this;
  }

  public setMethod(method: string) {
    this._method = method;
    return this;
  }

  public setSeverity(severity: Severity) {
    validateSeverity(severity);
    this._severity = severity;
    return this;
  }

  public setSolution(solution: string) {
    this._solution = solution;
    return this;
  }

  public setTimestamp(timestamp: Date) {
    validateTimestamp(timestamp);
    this._timestamp = timestamp;
    return this;
  }

  public setType(type: ErrorType) {
    validateErrorType(type);
    this._type = type;
    return this;
  }

  public setValues(values: Record<string, unknown>) {
    this._values = values;
    return this;
  }

  /* Methods */
  public toJSON() {
    return {
      context: this._context,
      description: this._description,
      errorCode: this._errorCode,
      example: this._example,
      file: this._file,
      id: this._id,
      library: this._library,
      message: this.message,
      metadata: this._metadata,
      method: this._method,
      name: this.name,
      severity: this._severity,
      solution: this._solution,
      stackTrace: this._stackTrace,
      timestamp: this._timestamp,
      type: this._type,
      values: this._values,
    };
  }
}
