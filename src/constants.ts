/**
 * Represents the severity levels for an error.
 *
 * - `'critical'`: Indicates an issue that requires immediate attention and may cause a system failure.
 * - `'high'`: Indicates a significant issue that should be resolved promptly.
 * - `'medium'`: Indicates a moderate issue that has limited impact but should be addressed.
 * - `'low'`: Indicates a minor issue with minimal impact.
 */
export const SEVERITIES = ["critical", "high", "medium", "low"] as const;

/**
 * Represents the type of an error.
 *
 * - `'error'`: Indicates a critical or blocking issue.
 * - `'warning'`: Indicates a potential issue or something requiring attention but not immediately critical.
 */
export const ERROR_TYPES = ["error", "warning"] as const;

/**
 * Represents the types of logs that can be generated.
 *
 * - `'compact'`: A compact representation of an error, suitable for centralized logging systems.
 * - `'detail'`: Detailed information about an error.
 * - `'simple'`: A simple representation of an error.
 */
export const LOG_TYPES = ["compact", "detail", "simple"] as const;
