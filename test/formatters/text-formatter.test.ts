import { describe, expect, it } from "vitest";
import { HandlerError } from "../../src/core/handler-error";
import { TextFormatter } from "../../src/formatters/text-formatter";

describe("TextFormatter", () => {
  describe("format", () => {
    it("should format error with text", () => {
      // Arrange
      const error = new HandlerError({ message: "Test error" });
      const formatter = new TextFormatter({ showMetadata: false, showTimestamp: false });

      // Act
      const formatted = formatter.format(error);

      // Assert
      expect(formatted).toBe(`HandlerError: Test error`);
    });

    it("should format error with text with timestamp", () => {
      // Arrange
      const error = new HandlerError({ message: "Test error" });
      const formatter = new TextFormatter({ showMetadata: false, showTimestamp: true });

      // Act
      const formatted = formatter.format(error);

      // Assert
      expect(formatted).toBe(`[${error.timestamp.toISOString()}] HandlerError: Test error`);
    });

    it("should format error with text with metadata", () => {
      // Arrange
      const error = new HandlerError({ message: "Test error", metadata: { key: "value" } });
      const formatter = new TextFormatter({ showMetadata: true, showTimestamp: false });

      // Act
      const formatted = formatter.format(error);

      // Assert
      expect(formatted).toBe(`HandlerError: Test error\nMetadata: {"key":"value"}`);
    });

    it("should format error with text with all options", () => {
      // Arrange
      const error = new HandlerError({ message: "Test error", metadata: { key: "value" } });
      const formatter = new TextFormatter({ showMetadata: true, showTimestamp: true });

      // Act
      const formatted = formatter.format(error);

      // Assert
      expect(formatted).toContain(
        `[${error.timestamp.toISOString()}] HandlerError: Test error\nMetadata: {"key":"value"}`,
      );
    });
  });

  describe("formatChain", () => {
    it("should format error chain with text", () => {
      // Arrange
      const rootError = new HandlerError({ message: "Root error" });
      const middleError = new HandlerError({ cause: rootError, message: "Middle error" });
      const topError = new HandlerError({ cause: middleError, message: "Top error" });
      const formatter = new TextFormatter({ showMetadata: false, showTimestamp: false });

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

    it("should format error chain with text with timestamp", () => {
      // Arrange
      const rootError = new HandlerError({ message: "Root error" });
      const middleError = new HandlerError({ cause: rootError, message: "Middle error" });
      const topError = new HandlerError({ cause: middleError, message: "Top error" });
      const formatter = new TextFormatter({ showMetadata: false, showTimestamp: true });

      // Act
      const formatted = formatter.formatChain([topError, middleError, rootError]);

      // Assert
      expect(formatted).toBe(
        [
          `[${topError.timestamp.toISOString()}] HandlerError: Top error`,
          `└── [${middleError.timestamp.toISOString()}] HandlerError: Middle error`,
          `    └── [${rootError.timestamp.toISOString()}] HandlerError: Root error`,
        ].join("\n"),
      );
    });

    it("should format error chain with text with metadata", () => {
      // Arrange
      const rootError = new HandlerError({ message: "Root error", metadata: { key: "value" } });
      const middleError = new HandlerError({
        cause: rootError,
        message: "Middle error",
        metadata: { key: "value" },
      });
      const topError = new HandlerError({
        cause: middleError,
        message: "Top error",
        metadata: { key: "value" },
      });
      const formatter = new TextFormatter({ showMetadata: true, showTimestamp: false });

      // Act
      const formatted = formatter.formatChain([topError, middleError, rootError]);

      // Assert
      expect(formatted).toBe(
        [
          `HandlerError: Top error\nMetadata: {"key":"value"}`,
          `└── HandlerError: Middle error\nMetadata: {"key":"value"}`,
          `    └── HandlerError: Root error\nMetadata: {"key":"value"}`,
        ].join("\n"),
      );
    });

    it("should format error chain with text with all options", () => {
      // Arrange
      const rootError = new HandlerError({ message: "Root error", metadata: { key: "value" } });
      const middleError = new HandlerError({
        cause: rootError,
        message: "Middle error",
        metadata: { key: "value" },
      });
      const topError = new HandlerError({
        cause: middleError,
        message: "Top error",
        metadata: { key: "value" },
      });
      const formatter = new TextFormatter({ showMetadata: true, showTimestamp: true });

      // Act
      const formatted = formatter.formatChain([topError, middleError, rootError]);

      // Assert
      expect(formatted).toBe(
        [
          `[${topError.timestamp.toISOString()}] HandlerError: Top error\nMetadata: {"key":"value"}`,
          `└── [${middleError.timestamp.toISOString()}] HandlerError: Middle error\nMetadata: {"key":"value"}`,
          `    └── [${rootError.timestamp.toISOString()}] HandlerError: Root error\nMetadata: {"key":"value"}`,
        ].join("\n"),
      );
    });
  });
});
