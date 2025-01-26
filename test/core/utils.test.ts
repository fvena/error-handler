import { describe, expect, it } from "vitest";
import { HandlerError } from "../../src/core/handler-error";
import { convertToHandlerError, processArguments } from "../../src/core/utils";

describe("processArguments", () => {
  describe("when argument2 is a string", () => {
    it("should return error code", () => {
      // Arrange
      const argument2 = "ERR001";

      // Act
      const { code } = processArguments(argument2);

      // Assert
      expect(code).toBe("ERR001");
    });

    it("should return error code and metadata", () => {
      // Arrange
      const argument2 = "ERR001";
      const argument3 = { key: "value" };

      // Act
      const { code, metadata } = processArguments(argument2, argument3);

      // Assert
      expect(code).toBe("ERR001");
      expect(metadata).toEqual({ key: "value" });
    });

    it("should return error code and cause", () => {
      // Arrange
      const argument2 = "ERR001";
      const argument3 = new Error("Test cause");

      // Act
      const { cause, code } = processArguments(argument2, argument3);

      // Assert
      expect(code).toBe("ERR001");
      expect(cause).toBeInstanceOf(HandlerError);
      expect(cause?.message).toBe("Test cause");
    });

    it("should return error code, metadata and cause", () => {
      // Arrange
      const argument2 = "ERR001";
      const argument3 = { key: "value" };
      const argument4 = new Error("Test cause");

      // Act
      const { cause, code, metadata } = processArguments(argument2, argument3, argument4);

      // Assert
      expect(code).toBe("ERR001");
      expect(metadata).toEqual({ key: "value" });
      expect(cause).toBeInstanceOf(HandlerError);
      expect(cause?.message).toBe("Test cause");
    });
  });

  describe("when argument2 is a Metadata", () => {
    it("should return metadata", () => {
      // Arrange
      const argument2 = { key: "value" };

      // Act
      const { metadata } = processArguments(argument2);

      // Assert
      expect(metadata).toEqual({ key: "value" });
    });

    it("should return metadata and cause", () => {
      // Arrange
      const argument2 = { key: "value" };
      const argument3 = new Error("Test cause");

      // Act
      const { cause, metadata } = processArguments(argument2, argument3);

      // Assert
      expect(metadata).toEqual({ key: "value" });
      expect(cause).toBeInstanceOf(HandlerError);
      expect(cause?.message).toBe("Test cause");
    });
  });

  describe("when argument2 is an Error", () => {
    it("should return cause", () => {
      // Arrange
      const argument2 = new Error("Test cause");

      // Act
      const { cause } = processArguments(argument2);

      // Assert
      expect(cause).toBeInstanceOf(HandlerError);
      expect(cause?.message).toBe("Test cause");
    });
  });
});

describe("convertToHandlerError", () => {
  it("should return undefined if error is undefined", () => {
    // Arrange
    const cause = undefined as unknown as Error;

    // Act
    const error = convertToHandlerError(cause);

    // Assert
    expect(error).toBeUndefined();
  });

  it("should return a HandlerError if error is a Error", () => {
    // Arrange
    const cause = new Error("Test cause");

    // Act
    const error = convertToHandlerError(cause);

    // Assert
    expect(error).toBeInstanceOf(HandlerError);
    expect(error?.message).toBe("Test cause");
  });

  it("should return a HandlerError if error is a HandlerError", () => {
    // Arrange
    const cause = new HandlerError("Test cause");

    // Act
    const error = convertToHandlerError(cause);

    // Assert
    expect(error).toBeInstanceOf(HandlerError);
    expect(error?.message).toBe("Test cause");
  });

  it("should not set the cause if not is a Error", () => {
    // Arrange
    const cause = "Test cause" as unknown as Error;

    // Act
    const error = convertToHandlerError(cause);

    // Assert
    expect(error).toBeUndefined();
  });
});
