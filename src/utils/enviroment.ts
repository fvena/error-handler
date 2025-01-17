import type { BrowserInfo, Environment, EnvironmentInfo, ServerInfo } from "../types";
import os from "node:os";

// eslint-disable-next-line n/no-unsupported-features/node-builtins -- Node.js built-in
declare let navigator: Navigator;
declare let window: Window;

export function getBrowserInfo(): BrowserInfo | undefined {
  if (typeof globalThis === "undefined") return undefined;

  return {
    cookiesEnabled: navigator.cookieEnabled,
    language: navigator.language,
    platform: navigator.userAgent,
    screenResolution: {
      height: window.screen.height,
      width: window.screen.width,
    },
    url: globalThis.location.href,
    userAgent: navigator.userAgent,
  };
}

export function getEnvironmentInfo(): EnvironmentInfo {
  const environment = getRuntimeEnvironment();

  return {
    environment,
    ...(environment === "browser" && { browserInfo: getBrowserInfo() }),
    ...(environment === "node" && { serverInfo: getServerInfo() }),
    ...(environment === "node" && { isProduction: process.env.NODE_ENV === "production" }),
  };
}

export function getRuntimeEnvironment(): Environment {
  // Check if the runtime is a server environment
  if (typeof process !== "undefined" && !!process.versions.node) return "node";

  // Check if the runtime is a browser environment
  if (typeof globalThis !== "undefined" || typeof document !== "undefined") return "browser";

  // Other runtime environments
  return "unknown";
}

export function getServerInfo(): ServerInfo | undefined {
  if (typeof process === "undefined" || !process.versions.node) return undefined;

  return {
    cpuArch: os.arch(),
    hostname: os.hostname(),
    nodeVersion: process.version,
    osRelease: os.release(),
    osType: os.type(),
    platform: os.platform(),
    systemUptime: os.uptime(),
  };
}
