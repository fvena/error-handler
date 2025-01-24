import { describe, expect, it } from "vitest";
import { HandlerError } from "../../src/core/handler-error";
import { FormatterRegistry } from "../../src/core/formatter-registry";
import { BaseFormatter } from "../../src/core/formatter-base";

class TestFormatter extends BaseFormatter {
  format(error: HandlerError): string {
    return `TestFormatter: ${error.message}`;
  }
}

class TestFormatter2 extends BaseFormatter {
  format(error: HandlerError): string {
    return `TestFormatter2: ${error.message}`;
  }
}

describe("FormatterRegistry", () => {
  it("should register and get formatters", () => {
    // Arrange
    const formatters = new FormatterRegistry();

    // Act
    formatters.register("test", () => new TestFormatter());
    formatters.register("test2", () => new TestFormatter2());

    // Assert
    expect(formatters.get("test")).toBeInstanceOf(TestFormatter);
    expect(formatters.get("test2")).toBeInstanceOf(TestFormatter2);
  });

  it("should throw error if formatter name is not a string", () => {
    // Arrange
    const formatters = new FormatterRegistry();

    // Act & Assert
    /* eslint-disable @typescript-eslint/no-explicit-any, unicorn/no-null, @typescript-eslint/no-unsafe-argument -- Testing invalid input */
    expect(() => {
      formatters.register(null as any, () => new TestFormatter());
    }).toThrowError("Formatter name must be a non-empty string");
    /* eslint-enable */
  });

  it("should throw error if formatter is not a function", () => {
    // Arrange
    const formatters = new FormatterRegistry();

    // Act & Assert
    /* eslint-disable @typescript-eslint/no-explicit-any, unicorn/no-null, @typescript-eslint/no-unsafe-argument -- Testing invalid input */
    expect(() => {
      formatters.register("test", null as any);
    }).toThrowError("Formatter factory must be a function");
    /* eslint-enable */
  });

  it("should overwrite if formatter is already registered", () => {
    // Arrange
    const formatters = new FormatterRegistry();
    formatters.register("test", () => new TestFormatter());
    formatters.register("test", () => new TestFormatter2());

    // Act & Assert
    expect(formatters.get("test")).toBeInstanceOf(TestFormatter2);
  });

  it("should throw error if formatter is not registered", () => {
    // Arrange
    const formatters = new FormatterRegistry();

    // Act & Assert
    expect(() => formatters.get("test")).toThrowError("Formatter 'test' not found.");
  });

  it("should list registered formatters", () => {
    // Arrange
    const formatters = new FormatterRegistry();
    formatters.register("test", () => new TestFormatter());
    formatters.register("test2", () => new TestFormatter2());

    // Act
    const list = formatters.list();

    // Assert
    expect(list).toEqual(["test", "test2"]);
  });

  it("should format error using registered formatters", () => {
    // Arrange
    const error = new HandlerError({ message: "Test error" });
    const formatters = new FormatterRegistry();
    formatters.register("test", () => new TestFormatter());

    // Act
    const formatter = formatters.get("test");

    // Assert
    expect(formatter.format(error)).toBe("TestFormatter: Test error");
  });

  it("should format chain of errors using registered formatters", () => {
    // Arrange
    const rootError = new HandlerError({ message: "Root error" });
    const middleError = new HandlerError({ cause: rootError, message: "Middle error" });
    const topError = new HandlerError({ cause: middleError, message: "Top error" });

    const formatters = new FormatterRegistry();
    formatters.register("test", () => new TestFormatter());

    // Act
    const formatter = formatters.get("test");

    // Assert
    expect(formatter.formatChain([topError, middleError, rootError])).toBe(
      "TestFormatter: Top error\nTestFormatter: Middle error\nTestFormatter: Root error",
    );
  });
});
