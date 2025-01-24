import type { Severity } from "./error-types";

/**
 * Represents the serialized error.
 */
export interface SerializedError {
  cause?: SerializedError;
  id: string;
  message: string;
  metadata: Record<string, unknown>;
  name: string;
  severity: Severity;
  timestamp: string;
}

/**
 * Represents the serialized error chain.
 */
export type SerializedErrorChain = Omit<SerializedError, "cause">;
