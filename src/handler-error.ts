import type { ErrorType, Severity } from "./types";
import crypto from "node:crypto";

/**
 * Represents a customizable error with detailed context, metadata, and stack trace.
 */
export class HandlerError extends Error {
  private _context?: string; // Context in which the error occurred.
  private _description?: string; // Detailed description of the error.
  private _errorCode?: string; // Error code for the error.
  private _example?: string; // Example of how to resolve the error.
  private _file?: string; // File in which the error occurred.
  private _id: string; // Unique identifier for the error.
  private _library?: string; // Library or package that caused the error.
  private _metadata: Record<string, unknown> = {}; // Additional metadata for the error.
  private _method?: string; // Method in which the error occurred.
  private _severity: Severity = "medium"; // Severity of the error.
  private _solution?: string; // Solution to resolve the error.
  private _timestamp: number; // Timestamp of when the error occurred.
  private _type: ErrorType = "error"; // Type of error.
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
    this._timestamp = Date.now();
    this._description = message;

    Object.setPrototypeOf(this, HandlerError.prototype);
  }

  /* Getters */

  get context(): string | undefined {
    return this._context;
  }

  get description(): string | undefined {
    return this._description;
  }

  get errorCode(): string | undefined {
    return this._errorCode;
  }

  get example(): string | undefined {
    return this._example;
  }

  get file(): string | undefined {
    return this._file;
  }

  get id(): string {
    return this._id;
  }

  get library(): string | undefined {
    return this._library;
  }

  get metadata(): Record<string, unknown> {
    return this._metadata;
  }

  get method(): string | undefined {
    return this._method;
  }

  get severity(): Severity {
    return this._severity;
  }

  get solution(): string | undefined {
    return this._solution;
  }

  get timestamp(): number {
    return this._timestamp;
  }

  get type(): ErrorType {
    return this._type;
  }

  get values(): Record<string, unknown> {
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

  public setfile(file: string) {
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
    if (!["error", "info", "warning"].includes(severity)) {
      throw new Error(`Invalid severity: ${severity}`);
    }

    this._severity = severity;
    return this;
  }

  public setSolution(solution: string) {
    this._solution = solution;
    return this;
  }

  public setTimestamp(timestamp: number) {
    this._timestamp = timestamp;
    return this;
  }

  public setType(type: ErrorType) {
    if (!["error", "warning"].includes(type)) {
      throw new Error(`Invalid error type: ${type}`);
    }

    this._type = type;
    return this;
  }

  public setValues(values: Record<string, unknown>) {
    this._values = values;
    return this;
  }
}
