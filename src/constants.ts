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
