import { describe, expect, it } from "vitest";
import { HandlerError } from "../../src/core/handler-error";
import { AnsiFormatter } from "../../src/formatters/ansi-formatter";
import { colors, formats } from "../../src/formatters/constants";

describe("AnsiFormatter", () => {
  describe("format", () => {
    it("should format error with ANSI colors", () => {
      // Arrange
      const error = new HandlerError({ message: "Test error" });
      const formatter = new AnsiFormatter();

      // Act
      const formatted = formatter.format(error);

      // Assert
      expect(formatted).toBe(
        `${formats.bold}${colors.red}HandlerError${formats.reset}: Test error`,
      );
    });

    it("should format error without ANSI colors", () => {
      // Arrange
      const error = new HandlerError({ message: "Test error" });
      const formatter = new AnsiFormatter({ colors: false });

      // Act
      const formatted = formatter.format(error);

      // Assert
      expect(formatted).toBe(`HandlerError: Test error`);
    });

    it("should format error with ANSI colors with timestamp", () => {
      // Arrange
      const error = new HandlerError({ message: "Test error" });
      const formatter = new AnsiFormatter({ showTimestamp: true });

      // Act
      const formatted = formatter.format(error);

      // Assert
      expect(formatted).toBe(
        `${colors.gray}[${error.timestamp.toISOString()}]${formats.reset} ${formats.bold}${colors.red}HandlerError${formats.reset}: Test error`,
      );
    });

    it("should format error with ANSI colors with metadata", () => {
      // Arrange
      const error = new HandlerError({ message: "Test error", metadata: { key: "value" } });
      const formatter = new AnsiFormatter({ showMetadata: true });

      // Act
      const formatted = formatter.format(error);

      // Assert
      expect(formatted).toBe(
        `${formats.bold}${colors.red}HandlerError${formats.reset}: Test error\n${formats.dim}Metadata: {"key":"value"}${formats.reset}`,
      );
    });

    it("should format error with ANSI colors with all options", () => {
      // Arrange
      const error = new HandlerError({ message: "Test error", metadata: { key: "value" } });
      const formatter = new AnsiFormatter({ showMetadata: true, showTimestamp: true });

      // Act
      const formatted = formatter.format(error);

      // Assert
      expect(formatted).toBe(
        `${colors.gray}[${error.timestamp.toISOString()}]${formats.reset} ${formats.bold}${colors.red}HandlerError${formats.reset}: Test error\n${formats.dim}Metadata: {"key":"value"}${formats.reset}`,
      );
    });
  });

  describe("formatChain", () => {
    it("should format error chain with ANSI colors", () => {
      // Arrange
      const rootError = new HandlerError({ message: "Root error" });
      const middleError = new HandlerError({ cause: rootError, message: "Middle error" });
      const topError = new HandlerError({ cause: middleError, message: "Top error" });
      const formatter = new AnsiFormatter();

      // Act
      const formatted = formatter.formatChain([topError, middleError, rootError]);

      // Assert
      expect(formatted).toBe(
        [
          `${formats.bold}${colors.red}HandlerError${formats.reset}: Top error`,
          `└── ${formats.bold}${colors.red}HandlerError${formats.reset}: Middle error`,
          `    └── ${formats.bold}${colors.red}HandlerError${formats.reset}: Root error`,
        ].join("\n"),
      );
    });

    it("should format error chain without ANSI colors", () => {
      // Arrange
      const rootError = new HandlerError({ message: "Root error" });
      const middleError = new HandlerError({ cause: rootError, message: "Middle error" });
      const topError = new HandlerError({ cause: middleError, message: "Top error" });
      const formatter = new AnsiFormatter({ colors: false });

      // Act
      const formatted = formatter.formatChain([topError, middleError, rootError]);

      // Assert
      expect(formatted).toBe(
        [
          `HandlerError: Top error`,
          `└── HandlerError: Middle error`,
          `    └── HandlerError: Root error`,
        ].join("\n"),
      );
    });

    it("should format error chain with ANSI colors with timestamp", () => {
      // Arrange
      const rootError = new HandlerError({ message: "Root error" });
      const middleError = new HandlerError({ cause: rootError, message: "Middle error" });
      const topError = new HandlerError({ cause: middleError, message: "Top error" });
      const formatter = new AnsiFormatter({ showTimestamp: true });

      // Act
      const formatted = formatter.formatChain([topError, middleError, rootError]);

      // Assert
      expect(formatted).toBe(
        [
          `${colors.gray}[${topError.timestamp.toISOString()}]${formats.reset} ${formats.bold}${colors.red}HandlerError${formats.reset}: Top error`,
          `└── ${colors.gray}[${middleError.timestamp.toISOString()}]${formats.reset} ${formats.bold}${colors.red}HandlerError${formats.reset}: Middle error`,
          `    └── ${colors.gray}[${rootError.timestamp.toISOString()}]${formats.reset} ${formats.bold}${colors.red}HandlerError${formats.reset}: Root error`,
        ].join("\n"),
      );
    });
  });
});
