import { describe, expect, it } from "vitest";
import { HandlerError } from "../src/handler-error";
import { ErrorSeverity } from "../src/constants";

describe("HandlerError", () => {
  it("should create an error with basic properties", () => {
    const error = new HandlerError({ message: "Test error" });

    expect(error.message).toBe("Test error");
    expect(error.name).toBe("HandlerError");
    expect(error.severity).toBe(ErrorSeverity.ERROR);
    expect(error.metadata).toEqual({});
  });

  it("should create an error with custom properties", () => {
    const metadata = { key: "value" };

    const error = new HandlerError({
      code: "ERR001",
      message: "Test error",
      metadata,
      name: "CustomError",
      severity: ErrorSeverity.CRITICAL,
    });

    expect(error.message).toBe("Test error");
    expect(error.name).toBe("CustomError");
    expect(error.metadata).toBe(metadata);
    expect(error.code).toBe("ERR001");
    expect(error.severity).toBe(ErrorSeverity.CRITICAL);
  });

  it("should generate a unique ID for each instance", () => {
    const error1 = new HandlerError({ message: "Test error 1" });
    const error2 = new HandlerError({ message: "Test error 2" });
    expect(error1.id).not.toBe(error2.id);
  });
});
