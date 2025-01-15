import type { StackFrame } from "../types";
import path from "node:path";
import { URL } from "node:url";
import { parseStack } from "error-stack-parser-es/lite";

/**
 * Formats a stack trace into a cleaned and human-readable array of `StackFrame` objects.
 *
 * - Filters out frames from `node_modules` and internal Node.js modules.
 * - Converts absolute file paths into relative paths based on the current working directory.
 *
 * @param stack - The raw stack trace string.
 * @returns An array of formatted `StackFrame` objects.
 */
export function formatStack(stack: string): StackFrame[] {
  try {
    const parsedStack = parseStack(stack);

    return parsedStack
      .filter(
        (frame) =>
          !frame.file?.includes("node_modules") &&
          !frame.file?.includes("internal") &&
          frame.file !== frame.raw, // Library bug, if not find file, file is equal to raw
      )
      .map((frame) => ({
        col: frame.col,
        file: frame.file ? getRelativePath(frame.file) : undefined,
        line: frame.line,
        method: frame.function,
      }));
  } catch (error) {
    console.error("Error parsing stack:", error);
    return [];
  }
}

/**
 * Converts an absolute file path or a file URL to a relative path based on the current working directory.
 *
 * @param filePath - The absolute file path or file URL to be converted.
 * @returns The relative path from the current working directory to the given file path.
 * @throws Will throw an error if the input is not a valid URL or absolute path.
 *
 * @example
 * ```typescript
 * const relativePath = getRelativePath("file:///Users/fvena/Sites/handler-error/src/utils/stack.ts");
 * console.log(relativePath); // Outputs the relative path based on the current working directory
 * ```
 */
export function getRelativePath(filePath: string): string {
  try {
    let absolutePath: string;

    if (filePath.startsWith("file://")) {
      const parsedUrl = new URL(filePath);
      absolutePath = decodeURIComponent(parsedUrl.pathname);

      // Remove leading slash on Windows
      if (process.platform === "win32" && absolutePath.startsWith("/")) {
        absolutePath = absolutePath.slice(1);
      }
    } else if (path.isAbsolute(filePath)) {
      absolutePath = filePath;
    } else {
      throw new Error(`File path is not a valid URL or absolute path: ${filePath}`);
    }

    return path.relative(process.cwd(), absolutePath);
  } catch {
    return filePath;
  }
}
