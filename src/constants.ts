/**
 * Represents the severity levels for an error.
 *
 * - `'critical'`: Indicates an issue that requires immediate attention and may cause a system failure.
 * - `'high'`: Indicates a significant issue that should be resolved promptly.
 * - `'low'`: Indicates a minor issue with minimal impact.
 * - `'medium'`: Indicates a moderate issue that has limited impact but should be addressed.
 */
export const SEVERITIES = ["critical", "high", "low", "medium"] as const;

/**
 * Represents the type of an error.
 *
 * - `'error'`: Indicates a critical or blocking issue.
 * - `'warning'`: Indicates a potential issue or something requiring attention but not immediately critical.
 */
export const ERROR_TYPES = ["error", "warning"] as const;
