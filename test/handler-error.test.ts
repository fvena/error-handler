import { describe, expect, it } from "vitest";
import { HandlerError } from "../src/handler-error";
import { ErrorSeverity } from "../src/constants";

describe("HandlerError", () => {
  it("should create an error with basic properties", () => {
    // Arrange & Act
    const error = new HandlerError({ message: "Test error" });

    // Assert
    expect(error.message).toBe("Test error");
    expect(error.name).toBe("HandlerError");
    expect(error.severity).toBe(ErrorSeverity.ERROR);
    expect(error.metadata).toEqual({});
  });

  it("should create an error with custom properties", () => {
    // Arrange
    const metadata = { key: "value" };

    // Act
    const error = new HandlerError({
      code: "ERR001",
      message: "Test error",
      metadata,
      name: "CustomError",
      severity: ErrorSeverity.CRITICAL,
    });

    // Assert
    expect(error.message).toBe("Test error");
    expect(error.name).toBe("CustomError");
    expect(error.metadata).toBe(metadata);
    expect(error.code).toBe("ERR001");
    expect(error.severity).toBe(ErrorSeverity.CRITICAL);
  });

  it("should generate a unique ID for each instance", () => {
    // Arrange & Act
    const error1 = new HandlerError({ message: "Test error 1" });
    const error2 = new HandlerError({ message: "Test error 2" });

    // Assert
    expect(error1.id).not.toBe(error2.id);
  });

  it("should handle HandlerError error as cause", () => {
    // Arrange
    const cause = new HandlerError({ message: "Test cause" });

    // Act
    const error = new HandlerError({ cause, message: "Test error" });

    // Assert
    expect(error.cause).toBeInstanceOf(HandlerError);
    expect(error.cause?.message).toBe("Test cause");
  });

  it("should handle standard error as cause", () => {
    // Arrange
    const cause = new Error("Test cause");

    // Act
    const error = new HandlerError({ cause, message: "Test error" });

    // Assert
    expect(error.cause).toBeInstanceOf(HandlerError);
    expect(error.cause?.message).toBe("Test cause");
  });

  it("should throw an error for invalid cause", () => {
    // Arrange
    const cause = "Test cause" as unknown as Error;

    // Act & Assert
    expect(() => new HandlerError({ cause, message: "Test error" })).toThrowError(TypeError);
  });

  it("should serialize the error", () => {
    // Arrange
    const error = new HandlerError({ message: "Test error" });

    // Act
    const serializedError = error.serialize();

    // Assert
    expect(serializedError).toStrictEqual({
      cause: undefined,
      id: expect.any(String), // eslint-disable-line @typescript-eslint/no-unsafe-assignment -- It's a test
      message: "Test error",
      metadata: {},
      name: "HandlerError",
      severity: ErrorSeverity.ERROR,
      timestamp: expect.any(String), // eslint-disable-line @typescript-eslint/no-unsafe-assignment -- It's a test
    });
  });

  it("should return a string representation of the error", () => {
    // Arrange
    const error = new HandlerError({ message: "Test error" });

    // Act
    const errorString = error.toString();

    // Assert
    expect(errorString).toBe(`[ERROR] HandlerError: Test error (ID: ${error.id})`);
  });
});
