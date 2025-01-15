import type { StackFrame } from "../src/types";
import { describe, expect, it } from "vitest";
import { formatStack, getRelativePath } from "../src/utils/stack";

const currentWorkingDirection = process.cwd();
const errorStackMock =
  "Error: Test error\n" +
  `    at function3 (file://${currentWorkingDirection}/function3.js:13:10)\n` +
  `    at function2 (file://${currentWorkingDirection}/function2.js:8:12)\n` +
  `    at function1 (file://${currentWorkingDirection}/function1.js:19:20)\n` +
  `    at ${currentWorkingDirection}/index.js:10:15\n` +
  "    at ModuleJob.run (node:internal/modules/esm/module_job:268:25)\n" +
  "    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:543:26)\n" +
  "    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:116:5)\n" +
  "    at moduleFunction (${currentWorkingDirection}/node_modules/module.js:5:3)\n" +
  "    at taskFunction (internal/pro∫cess/task_queues.js:2:1)";

const errorStack: StackFrame[] = [
  {
    col: 10,
    file: "function3.js",
    line: 13,
    method: "function3",
  },
  {
    col: 12,
    file: "function2.js",
    line: 8,
    method: "function2",
  },
  {
    col: 20,
    file: "function1.js",
    line: 19,
    method: "function1",
  },
  {
    col: 15,
    file: "index.js",
    line: 10,
    method: undefined,
  },
];

describe("formatStack", () => {
  it("should filter out frames from node_modules and internal modules", () => {
    const formattedStack = formatStack(errorStackMock);

    expect(formattedStack).toHaveLength(4);
  });

  it("should handle cases where file is equal to raw gracefully", () => {
    const mockStack = "Error: Test error\n" + `    at ${currentWorkingDirection}/index.js:10:15`;

    const formattedStack = formatStack(mockStack);

    /* eslint-disable @typescript-eslint/no-non-null-assertion -- necessary in test cases */
    expect(formattedStack).toHaveLength(1);
    expect(formattedStack[0]!.file).toBe("index.js");
    /* eslint-enable @typescript-eslint/no-non-null-assertion */
  });

  it("should correctly get the stack trace from the error", () => {
    const formattedStack = formatStack(errorStackMock);

    expect(formattedStack).toEqual(errorStack);
  });
});

describe("getRelativePath", () => {
  it("should convert file URLs to relative paths", () => {
    const fileUrl = `file://${currentWorkingDirection}/src/utils/stack.ts`;
    const relativePath = getRelativePath(fileUrl);

    expect(relativePath).toBe("src/utils/stack.ts");
  });

  it("should convert absolute paths to relative paths", () => {
    const absolutePath = `${currentWorkingDirection}/src/utils/stack.ts`;
    const relativePath = getRelativePath(absolutePath);

    expect(relativePath).toBe("src/utils/stack.ts");
  });

  it("should handle invalid URLs gracefully", () => {
    const invalidUrl = "invalid://path";
    const result = getRelativePath(invalidUrl);

    expect(result).toBe(invalidUrl);
  });

  it("should handle Windows paths correctly", () => {
    const windowsPath = `file:///${currentWorkingDirection}/src/utils/stack.ts`;
    const relativePath = getRelativePath(windowsPath);

    if (process.platform === "win32") {
      expect(relativePath).toBe("src/utils/stack.ts");
    } else {
      expect(relativePath).toBe("src/utils/stack.ts");
    }
  });
});
