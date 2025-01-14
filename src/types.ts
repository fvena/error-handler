/**
 * Represents the type of an error.
 *
 * - `'error'`: Indicates a critical or blocking issue.
 * - `'warning'`: Indicates a potential issue or something requiring attention but not immediately critical.
 */
export type ErrorType = "error" | "warning";

/**
 * Represents the available types of logs for errors.
 *
 * - `'detail'`: Detailed log format.
 * - `'compact'`: Compact log format for systems like centralized compact.
 * - `'simple'`: Minimal log format for quick overviews.
 */
export type LogType = "compact" | "detail" | "simple";

/**
 * Represents the severity levels for an error.
 *
 * - `'critical'`: Indicates an issue that requires immediate attention and may cause a system failure.
 * - `'high'`: Indicates a significant issue that should be resolved promptly.
 * - `'medium'`: Indicates a moderate issue that has limited impact but should be addressed.
 * - `'low'`: Indicates a minor issue with minimal impact.
 */
export type Severity = "critical" | "high" | "low" | "medium";
