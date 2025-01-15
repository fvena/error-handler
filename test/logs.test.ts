import type { HandlerErrorProperties } from "../src/types";
import { describe, expect, it, vi } from "vitest";
import chalk from "chalk";
import { formatErrorType, logCompact, logDetail, logSimple } from "../src/utils/logs";

const timestamp = new Date();
const mockErrorData: HandlerErrorProperties = {
  context: undefined,
  errorCode: undefined,
  example: undefined,
  file: undefined,
  id: "TestId",
  library: undefined,
  message: "TestMessage",
  metadata: undefined,
  method: undefined,
  name: "TestName",
  severity: undefined,
  solution: undefined,
  stackTrace: [],
  timestamp: timestamp,
  type: "error",
  values: undefined,
};

describe("formatErrorType", () => {
  it("should format error type without severity", () => {
    const result = formatErrorType("error");
    expect(result).toBe(chalk.red("Error:"));
  });

  it("should format warning type without severity", () => {
    const result = formatErrorType("warning");
    expect(result).toBe(chalk.yellow("Warning:"));
  });

  it("should format error type with severity", () => {
    const result = formatErrorType("error", "high");
    expect(result).toBe(chalk.red("HIGH Error:"));
  });

  it("should format warning type with severity", () => {
    const result = formatErrorType("warning", "low");
    expect(result).toBe(chalk.yellow("LOW Warning:"));
  });
});

describe("logSimple", () => {
  it("should log simple error with all properties", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
      /* mockImplementation */
    });
    const data = {
      ...mockErrorData,
      context: "TestContext",
      library: "TestLib",
      message: "TestMessage",
      solution: "TestSolution",
      type: "error",
      values: { key: "value" },
    } as HandlerErrorProperties;

    logSimple(data);

    expect(consoleSpy).toHaveBeenCalledWith(
      `${chalk.yellow("[TestLib]")} ${chalk.red("Error:")} TestContext TestMessage TestSolution \nReceived value: ${chalk.gray('{"key":"value"}')}`,
    );

    consoleSpy.mockRestore();
  });

  it("should log simple error without optional properties", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
      /* mockImplementation */
    });
    const data = {
      ...mockErrorData,
      message: "TestMessage",
      type: "error",
    } as HandlerErrorProperties;

    logSimple(data);

    expect(consoleSpy).toHaveBeenCalledWith(`${chalk.red("Error:")} TestMessage`);

    consoleSpy.mockRestore();
  });

  it("should log simple error with some optional properties", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
      /* mockImplementation */
    });
    const data = {
      ...mockErrorData,
      context: "TestContext",
      message: "TestMessage",
      type: "error",
    } as HandlerErrorProperties;

    logSimple(data);

    expect(consoleSpy).toHaveBeenCalledWith(`${chalk.red("Error:")} TestContext TestMessage`);

    consoleSpy.mockRestore();
  });
});

describe("logCompact", () => {
  it("should log compact error with all properties", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
      /* mockImplementation */
    });
    const data = {
      ...mockErrorData,
      errorCode: "404",
      file: "testFile.ts",
      message: "TestMessage",
      method: "GET",
      type: "error",
    } as HandlerErrorProperties;

    logCompact(data);

    expect(consoleSpy).toHaveBeenCalledWith(
      `${chalk.gray(timestamp.toISOString())} ${chalk.yellow("[GET]")} ${chalk.red("Error:")} ${chalk.green("404")} ${chalk.gray("testFile.ts")} TestMessage`,
    );

    consoleSpy.mockRestore();
  });

  it("should log compact error without optional properties", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
      /* mockImplementation */
    });
    const data = {
      ...mockErrorData,
      message: "TestMessage",
      type: "error",
    } as HandlerErrorProperties;

    logCompact(data);

    expect(consoleSpy).toHaveBeenCalledWith(
      `${chalk.gray(timestamp.toISOString())} ${chalk.red("Error:")} TestMessage`,
    );

    consoleSpy.mockRestore();
  });

  it("should log compact error with some optional properties", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
      /* mockImplementation */
    });
    const data = {
      ...mockErrorData,
      message: "TestMessage",
      method: "POST",
      type: "error",
    } as HandlerErrorProperties;

    logCompact(data);

    expect(consoleSpy).toHaveBeenCalledWith(
      `${chalk.gray(timestamp.toISOString())} ${chalk.yellow("[POST]")} ${chalk.red("Error:")} TestMessage`,
    );

    consoleSpy.mockRestore();
  });
});

describe("logDetail", () => {
  it("should log detailed error with all properties", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
      /* mockImplementation */
    });
    const data = {
      ...mockErrorData,
      context: "TestContext",
      errorCode: "404",
      example: "TestExample",
      file: "testFile.ts",
      message: "TestMessage",
      method: "GET",
      severity: "high",
      solution: "TestSolution",
      stackTrace: [{ file: "testFile.ts", line: 10, method: "testMethod" }],
      values: { key: "value" },
    } as HandlerErrorProperties;

    logDetail(data);

    expect(consoleSpy).toHaveBeenCalledWith(
      `${data.name} [${chalk.red("HIGH Error:")} ${chalk.yellow("404")}] ${chalk.green("GET")}${chalk.gray(" testFile.ts")}: ${chalk.bold("TestMessage")}`,
    );
    expect(consoleSpy).toHaveBeenCalledWith(chalk.bold(`\nDescription:`));
    expect(consoleSpy).toHaveBeenCalledWith(chalk.gray(`TestContext TestMessage`));
    expect(consoleSpy).toHaveBeenCalledWith(chalk.gray(JSON.stringify(data.values)));
    expect(consoleSpy).toHaveBeenCalledWith(chalk.bold(`\nSolution:`));
    expect(consoleSpy).toHaveBeenCalledWith(chalk.gray(data.solution));
    expect(consoleSpy).toHaveBeenCalledWith(chalk.bold(`\nExample:`));
    expect(consoleSpy).toHaveBeenCalledWith(chalk.gray(data.example));
    expect(consoleSpy).toHaveBeenCalledWith(chalk.bold(`\nStack Trace:`));
    expect(consoleSpy).toHaveBeenCalledWith(
      `${chalk.gray(" ❯")} ${chalk.yellow("testMethod")} ${chalk.gray("testFile.ts:10")}`,
    );

    consoleSpy.mockRestore();
  });

  it("should log detailed error without optional properties", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
      /* mockImplementation */
    });
    const data = {
      ...mockErrorData,
      message: "TestMessage",
      type: "error",
    } as HandlerErrorProperties;

    logDetail(data);

    expect(consoleSpy).toHaveBeenCalledWith(
      `${data.name} [${chalk.red("Error:")}] : ${chalk.bold("TestMessage")}`,
    );
    expect(consoleSpy).toHaveBeenCalledWith(chalk.bold(`\nDescription:`));
    expect(consoleSpy).toHaveBeenCalledWith(chalk.gray(` TestMessage`));
    expect(consoleSpy).toHaveBeenCalledWith(chalk.gray(JSON.stringify(data.values)));
    expect(consoleSpy).toHaveBeenCalledWith(chalk.bold(`\nSolution:`));
    expect(consoleSpy).toHaveBeenCalledWith(chalk.gray(data.solution));
    expect(consoleSpy).toHaveBeenCalledWith(chalk.bold(`\nExample:`));
    expect(consoleSpy).toHaveBeenCalledWith(chalk.gray(data.example));
    expect(consoleSpy).toHaveBeenCalledWith(chalk.bold(`\nStack Trace:`));
    expect(consoleSpy).toHaveBeenCalledWith("");

    consoleSpy.mockRestore();
  });

  it("should log detailed error with some optional properties", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
      /* mockImplementation */
    });
    const data = {
      ...mockErrorData,
      context: "TestContext",
      message: "TestMessage",
      method: "POST",
      type: "error",
    } as HandlerErrorProperties;

    logDetail(data);

    expect(consoleSpy).toHaveBeenCalledWith(
      `${data.name} [${chalk.red("Error:")}] ${chalk.green("POST")}: ${chalk.bold("TestMessage")}`,
    );
    expect(consoleSpy).toHaveBeenCalledWith(chalk.bold(`\nDescription:`));
    expect(consoleSpy).toHaveBeenCalledWith(chalk.gray(`TestContext TestMessage`));
    expect(consoleSpy).toHaveBeenCalledWith(chalk.gray(JSON.stringify(data.values)));
    expect(consoleSpy).toHaveBeenCalledWith(chalk.bold(`\nSolution:`));
    expect(consoleSpy).toHaveBeenCalledWith(chalk.gray(data.solution));
    expect(consoleSpy).toHaveBeenCalledWith(chalk.bold(`\nExample:`));
    expect(consoleSpy).toHaveBeenCalledWith(chalk.gray(data.example));
    expect(consoleSpy).toHaveBeenCalledWith(chalk.bold(`\nStack Trace:`));
    expect(consoleSpy).toHaveBeenCalledWith("");

    consoleSpy.mockRestore();
  });
});
