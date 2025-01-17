import type { HandlerError } from "./handler-error";
import { ERROR_TYPES, LOG_TYPES, SEVERITIES } from "./constants";

export interface BrowserInfo {
  cookiesEnabled: boolean;
  language: string;
  platform: string;
  screenResolution: {
    height: number;
    width: number;
  };
  url: string;
  userAgent: string;
}
export type Environment = "browser" | "node" | "unknown";

export interface EnvironmentInfo {
  browserInfo?: BrowserInfo;
  environment: Environment;
  isProduction?: boolean;
  serverInfo?: ServerInfo;
}
export type ErrorType = (typeof ERROR_TYPES)[number];
export interface HandlerErrorOptions {
  getEnvironmentInfo?: boolean;
}
export type HandlerErrorProperties = ClassProperties<HandlerError>;

export type LogType = (typeof LOG_TYPES)[number];

export interface ServerInfo {
  cpuArch: string;
  hostname: string;
  nodeVersion: string;
  osRelease: string;
  osType: string;
  platform: string;
  systemUptime: number;
}

export type Severity = (typeof SEVERITIES)[number];

export interface StackFrame {
  col?: number;
  file?: string;
  line?: number;
  method?: string;
}

type ClassProperties<C> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- any is required here
  [Key in keyof C as C[Key] extends (...arguments_: any[]) => any ? never : Key]: C extends Record<
    Key,
    C[Key]
  >
    ? C[Key]
    : C[Key] | undefined;
};
