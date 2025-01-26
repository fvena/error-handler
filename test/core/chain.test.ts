import { describe, expect, it } from "vitest";
import { HandlerError } from "../../src/core/handler-error";
import { HandlerErrorChain } from "../../src/core/error-chain";
import { ErrorSeverity } from "../../src/core/constants";

describe("HandlerErrorChain", () => {
  describe("getErrorChain", () => {
    it("should get the error chain", () => {
      // Arrange
      const rootError = new Error("Root error");
      const middleError = new HandlerError("Middle error", rootError);
      const topError = new HandlerError("Top error", middleError);

      // Act
      const chain = new HandlerErrorChain(topError).getErrorChain();

      // Assert
      expect(chain).toHaveLength(3);
      expect(chain[0]?.message).toBe("Top error");
      expect(chain[1]?.message).toBe("Middle error");
      expect(chain[2]?.message).toBe("Root error");
    });

    it("should prevent infinite loops in the error chain", () => {
      // Arrange
      // eslint-disable-next-line prefer-const -- Used to create circular reference
      let rootError!: HandlerError;
      const middleError = new HandlerError("Middle error", rootError);
      const topError = new HandlerError("Top error", middleError);

      // Create circular reference
      rootError = new HandlerError("Root error", topError);

      // Act
      const chain = new HandlerErrorChain(topError).getErrorChain();

      // Assert
      expect(chain).toHaveLength(2);
      expect(chain[0]?.message).toBe("Top error");
      expect(chain[1]?.message).toBe("Middle error");
    });
  });

  describe("getRootError", () => {
    it("should get the root cause of the error", () => {
      // Arrange
      const rootError = new Error("Root error");
      const middleError = new HandlerError("Middle error", rootError);
      const topError = new HandlerError("Top error", middleError);

      // Act
      const rootCause = new HandlerErrorChain(topError).getRootError();

      // Assert
      expect(rootCause.message).toBe("Root error");
    });

    it("should return same error if there is no cause", () => {
      // Arrange
      const error = new HandlerError("Test error");

      // Act
      const rootCause = new HandlerErrorChain(error).getRootError();

      // Assert
      expect(rootCause.message).toBe("Test error");
    });
  });

  describe("mapErrors", () => {
    it("should map the error chain", () => {
      // Arrange
      const rootError = new Error("Root error");
      const middleError = new HandlerError("Middle error", rootError);
      const topError = new HandlerError("Top error", middleError);

      // Act
      const chain = new HandlerErrorChain(topError).mapErrors((error) => error.message);

      // Assert
      expect(chain).toEqual(["Top error", "Middle error", "Root error"]);
    });
  });

  describe("getMostSevereError", () => {
    it("should return the max severity of the error chain", () => {
      // Arrange
      const rootError = new HandlerError.error("Root error");
      const middleError = new HandlerError.warning("Middle error", rootError);
      const topError = new HandlerError.debug("Top error", middleError);

      // Act
      const maxSeverity = new HandlerErrorChain(topError).getMostSevereError();

      // Assert
      expect(maxSeverity.message).toBe("Root error");
    });

    it("should return the same error if there is no cause", () => {
      // Arrange
      const error = new HandlerError("Test error");

      // Act
      const maxSeverity = new HandlerErrorChain(error).getMostSevereError();

      // Assert
      expect(maxSeverity.message).toBe("Test error");
    });

    it("should return the last error if all severities are the same", () => {
      // Arrange
      const rootError = new HandlerError.error("Root error");
      const middleError = new HandlerError.error("Middle error", rootError);
      const topError = new HandlerError.error("Top error", middleError);

      // Act
      const maxSeverity = new HandlerErrorChain(topError).getMostSevereError();

      // Assert
      expect(maxSeverity.message).toBe("Top error");
    });

    it("should return the CRITICAL error if all severities exist", () => {
      // Arrange
      const debugError = new HandlerError.debug("Debug error");
      const infoError = new HandlerError.info("Info error", debugError);
      const warningError = new HandlerError.warning("Warning error", infoError);
      const errorError = new HandlerError.error("Error error", warningError);
      const criticalError = new HandlerError.critical("Critical error", errorError);

      // Act
      const maxSeverity = new HandlerErrorChain(criticalError).getMostSevereError();

      // Assert
      expect(maxSeverity.message).toBe("Critical error");
    });
  });

  describe("serialize", () => {
    it("should serialize the error chain", () => {
      // Arrange
      const rootError = new HandlerError("Root error");
      const middleError = new HandlerError("Middle error", rootError);
      const topError = new HandlerError("Top error", middleError);

      // Act
      const serializedChain = new HandlerErrorChain(topError).serialize();

      // Assert
      expect(serializedChain).toStrictEqual([
        {
          id: topError.id,
          message: "Top error",
          metadata: undefined,
          name: "HandlerError",
          severity: ErrorSeverity.ERROR,
          timestamp: topError.timestamp.toISOString(),
        },
        {
          id: middleError.id,
          message: "Middle error",
          metadata: undefined,
          name: "HandlerError",
          severity: ErrorSeverity.ERROR,
          timestamp: middleError.timestamp.toISOString(),
        },
        {
          id: rootError.id,
          message: "Root error",
          metadata: undefined,
          name: "HandlerError",
          severity: ErrorSeverity.ERROR,
          timestamp: rootError.timestamp.toISOString(),
        },
      ]);
    });

    it("should serialize the error chain with metadata", () => {
      // Arrange
      const metadata = { key: "value", key2: { key3: "value2", key4: ["value4", "value5"] } };
      const rootError = new HandlerError("Root error", { key: "value" });
      const topError = new HandlerError("Top error", metadata, rootError);

      // Act
      const serializedChain = new HandlerErrorChain(topError).serialize();

      // Assert
      expect(serializedChain).toStrictEqual([
        {
          id: topError.id,
          message: "Top error",
          metadata: { key: "value", key2: { key3: "value2", key4: ["value4", "value5"] } },
          name: "HandlerError",
          severity: ErrorSeverity.ERROR,
          timestamp: topError.timestamp.toISOString(),
        },
        {
          id: rootError.id,
          message: "Root error",
          metadata: { key: "value" },
          name: "HandlerError",
          severity: ErrorSeverity.ERROR,
          timestamp: rootError.timestamp.toISOString(),
        },
      ]);
    });
  });
});
