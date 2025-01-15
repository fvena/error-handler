import { describe, expect, it } from "vitest";
import { HandlerError } from "../src/handler-error";

describe("HandlerError", () => {
  it("should create an instance with the correct message", () => {
    const error = new HandlerError("Test error");
    expect(error.message).toBe("Test error");
    expect(error.name).toBe("HandlerError");
  });

  it("should generate a unique ID for each instance", () => {
    const error1 = new HandlerError("Error 1");
    const error2 = new HandlerError("Error 2");
    expect(error1.id).not.toBe(error2.id);
  });

  it("should allow setting context", () => {
    const error = new HandlerError("Test error");
    error.setContext("TestContext");
    expect(error.context).toBe("TestContext");
  });

  it("should allow setting metadata", () => {
    const error = new HandlerError("Test error");
    error.setMetadata({ key: "value" });
    expect(error.metadata).toEqual({ key: "value" });
  });

  it("should handle invalid metadata", () => {
    const error = new HandlerError("Test error");

    // @ts-expect-error -- Testing invalid metadata
    expect(() => error.setMetadata("invalid metadata")).toThrow();
  });
});
