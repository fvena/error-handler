/**
 * Represents the severity levels for an error.
 *
 * - `'critical'`: Indicates an issue that requires immediate attention and may cause a system failure.
 * - `'error'`: Indicates an issue that requires attention but does not necessarily require immediate action.
 * - `'warning'`: Indicates an issue that should be addressed but does not require immediate attention.
 * - `'debug'`: Indicates an issue that is useful for debugging but does not require immediate attention.
 * - `'info'`: Indicates an informational message.
 */
export const ErrorSeverity = {
  CRITICAL: "critical",
  DEBUG: "debug",
  ERROR: "error",
  INFO: "info",
  WARNING: "warning",
} as const;

/**
 * Represents the types of logs that can be generated.
 *
 * - `'compact'`: A compact representation of an error, suitable for centralized logging systems.
 * - `'detail'`: Detailed information about an error.
 * - `'simple'`: A simple representation of an error.
 */
export const LOG_TYPES = ["compact", "detail", "simple"] as const;
