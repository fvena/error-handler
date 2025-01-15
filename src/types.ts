import { ERROR_TYPES, SEVERITIES } from "./constants";

export type ErrorType = (typeof ERROR_TYPES)[number];
export type Severity = (typeof SEVERITIES)[number];

export interface StackFrame {
  col?: number;
  file?: string;
  line?: number;
  method?: string;
}
