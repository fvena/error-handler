import type { SerializedErrorChain } from "./types/serialize-types";
import { SEVERITY_WEIGHTS } from "./constants";
import { HandlerError } from "./handler-error";

/**
 * Represents a chain of errors.
 */
export class HandlerErrorChain {
  private readonly _error: HandlerError; // The root error that initiates the chain.

  /**
   * Creates a new `HandlerErrorChain` instance.
   *
   * @param error - The root `HandlerError` instance to analyze.
   */
  constructor(error: HandlerError) {
    this._error = error;
  }

  /**
   * Retrieves the chain of errors starting from the root error.
   *
   * @returns An array of `HandlerError` instances representing the chain.
   */
  public getErrorChain(): HandlerError[] {
    const chain = new Set<HandlerError>([this._error]);

    let currentError = this._error;

    while (currentError.cause) {
      // Avoid infinite loops caused by circular references in the error chain.
      // Circular references would occur if an error is processed again after it has already been processed.
      if (chain.has(currentError.cause)) {
        break;
      }

      chain.add(currentError.cause);
      currentError = currentError.cause;
    }

    return [...chain];
  }

  /**
   * Retrieves the root error of the chain, which is the deepest error in the hierarchy.
   *
   * @returns The root `HandlerError` instance.
   */
  public getRootError(): HandlerError {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Guaranteed by the constructor
    return this.getErrorChain().at(-1)!;
  }

  /**
   * Applies a mapper function to each error in the chain and returns the resulting array.
   *
   * @param mapper - A function to apply to each `HandlerError` instance.
   * @returns An array of results from the mapper function.
   */
  public mapErrors<T>(mapper: (error: HandlerError) => T): T[] {
    return this.getErrorChain().map((error) => mapper(error));
  }

  /**
   * Retrieves the error with the highest severity in the chain.
   *
   * @returns The `HandlerError` instance with the maximum severity.
   */
  public getMostSevereError(): HandlerError {
    return this.getErrorChain().reduce((maxSeverity, error) => {
      const errorWeight = SEVERITY_WEIGHTS[error.severity];
      const maxWeight = SEVERITY_WEIGHTS[maxSeverity.severity];

      return errorWeight > maxWeight ? error : maxSeverity;
    });
  }

  /**
   * Serializes the chain of errors into an array of plain objects.
   *
   * @returns An array of serialized errors, each containing key properties.
   */
  public serialize(): SerializedErrorChain[] {
    return this.getErrorChain().map((error) => ({
      id: error.id,
      message: error.message,
      metadata: error.metadata,
      name: error.name,
      severity: error.severity,
      timestamp: error.timestamp.toISOString(),
    }));
  }
}
