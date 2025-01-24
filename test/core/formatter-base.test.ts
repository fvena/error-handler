import type { FormatterOptions } from "../../src/core/types/formatter-types";
import { describe, expect, it } from "vitest";
import { HandlerError } from "../../src/core/handler-error";
import { BaseFormatter } from "../../src/core/formatter-base";

interface TestFormatterOptions extends FormatterOptions {
  testName: string;
}

const error = new HandlerError({ message: "Test error" });
const error1 = new HandlerError({ message: "First error" });
const error2 = new HandlerError({ message: "Second error" });
const defaultOptions: TestFormatterOptions = {
  testName: "TestFormatter",
};

describe("BaseFormatter", () => {
  it("should format error with formatter without properties", () => {
    // Arrange
    class TestFormatter extends BaseFormatter {
      format(error: HandlerError): string {
        return `TestFormatter: ${error.message}`;
      }
    }

    // Act
    const formatter = new TestFormatter();

    // Assert
    expect(formatter).toBeInstanceOf(BaseFormatter);
    expect(formatter.format(error)).toBe("TestFormatter: Test error");
  });

  it("format error with formatter with default properties", () => {
    // Arrange
    class TestFormatter extends BaseFormatter<TestFormatterOptions> {
      constructor(options?: TestFormatterOptions) {
        super({ ...defaultOptions, ...options });
      }

      format(error: HandlerError): string {
        return `${this.options.testName}: ${error.message}`;
      }
    }

    // Act
    const formatter = new TestFormatter();

    // Assert
    expect(formatter).toBeInstanceOf(BaseFormatter);
    expect(formatter.format(error)).toBe("TestFormatter: Test error");
  });

  it("should format error with formatter with custom properties", () => {
    // Arrange
    class TestFormatter extends BaseFormatter<TestFormatterOptions> {
      constructor(options?: TestFormatterOptions) {
        super({ ...defaultOptions, ...options });
      }

      format(error: HandlerError): string {
        return `${this.options.testName}: ${error.message}`;
      }
    }

    // Act
    const formatter = new TestFormatter({ testName: "CustomFormatter" });

    // Assert
    expect(formatter).toBeInstanceOf(BaseFormatter);
    expect(formatter.format(error)).toBe("CustomFormatter: Test error");
  });

  it("should format error with formatter with custom properties in format method", () => {
    // Arrange
    class TestFormatter extends BaseFormatter<TestFormatterOptions> {
      constructor(options?: TestFormatterOptions) {
        super({ ...defaultOptions, ...options });
      }

      format(error: HandlerError, options?: TestFormatterOptions): string {
        const customOptions = { ...this.options, ...options };
        return `${customOptions.testName}: ${error.message}`;
      }
    }

    // Act
    const formatter = new TestFormatter();

    // Assert
    expect(formatter).toBeInstanceOf(BaseFormatter);
    expect(formatter.format(error, { testName: "CustomFormatter" })).toBe(
      "CustomFormatter: Test error",
    );
  });

  it("should format chain of errors with default implement", () => {
    // Arrange
    class TestFormatter extends BaseFormatter<TestFormatterOptions> {
      constructor(options?: TestFormatterOptions) {
        super({ ...defaultOptions, ...options });
      }

      format(error: HandlerError): string {
        return `${this.options.testName}: ${error.message}`;
      }
    }

    // Act
    const formatter = new TestFormatter();
    const errors = [error, error, error];

    // Assert
    expect(formatter.formatChain(errors)).toBe(
      "TestFormatter: Test error\nTestFormatter: Test error\nTestFormatter: Test error",
    );
  });

  it("should format chain of errors with custom formatter", () => {
    // Arrange
    class TestFormatter extends BaseFormatter<TestFormatterOptions> {
      constructor(options?: TestFormatterOptions) {
        super({ ...defaultOptions, ...options });
      }

      format(error: HandlerError): string {
        return `${this.options.testName}: ${error.message}`;
      }

      override formatChain(errors: Error[], options?: TestFormatterOptions): string {
        const customOptions = { ...this.options, ...options };
        return errors
          .map((error, index) => `${customOptions.testName}: ${error.message} ${String(index)}`)
          .join("\n");
      }
    }

    // Act
    const formatter = new TestFormatter();
    const errors = [error, error1, error2];

    // Assert
    expect(formatter.formatChain(errors, { testName: "CustomFormatter" })).toBe(
      "CustomFormatter: Test error 0\nCustomFormatter: First error 1\nCustomFormatter: Second error 2",
    );
  });
});
