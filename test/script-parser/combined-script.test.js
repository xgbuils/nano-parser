import { expect, test } from "vitest";
import { parseScript } from "./src/index.js";

test("sequential joins & run-s", () => {
  const result = parseScript("run-s clean lint && npm run build");

  expect(result).toEqual({
    type: "sequential_group",
    runs: [
      {
        type: "sequential_group",
        runs: [
          {
            type: "npm_run_script",
            name: "clean",
            configArgs: [],
            args: [],
          },
          {
            type: "npm_run_script",
            name: "lint",
            configArgs: [],
            args: [],
          },
        ],
      },
      {
        type: "npm_run_script",
        name: "build",
        configArgs: [],
        args: [],
      },
    ],
  });
});
