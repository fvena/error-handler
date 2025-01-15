import type { HandlerError } from "./handler-error";
import { ERROR_TYPES, LOG_TYPES, SEVERITIES } from "./constants";

export type ErrorType = (typeof ERROR_TYPES)[number];

export type HandlerErrorProperties = ClassProperties<HandlerError>;
export type LogType = (typeof LOG_TYPES)[number];
export type Severity = (typeof SEVERITIES)[number];
export interface StackFrame {
  col?: number;
  file?: string;
  line?: number;
  method?: string;
}

type ClassProperties<C> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type -- This is a valid type
  [Key in keyof C as C[Key] extends Function ? never : Key]: C extends Record<Key, C[Key]>
    ? C[Key]
    : C[Key] | undefined;
};
