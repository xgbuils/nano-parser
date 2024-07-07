import { expect, test } from "vitest";
import { parseScript } from "./src";

test("simple sequential script group", () => {
  const result = parseScript("run-s clean lint build");

  expect(result).toEqual({
    type: "sequential_group",
    runs: [
      {
        type: "npm_run_script",
        name: "clean",
        args: [],
      },
      {
        type: "npm_run_script",
        name: "lint",
        args: [],
      },
      {
        type: "npm_run_script",
        name: "build",
        args: [],
      },
    ],
  });
});

test("sequential group with scripts with args", () => {
  const result = parseScript('run-s "delay 3000" lint build');

  expect(result).toEqual({
    type: "sequential_group",
    runs: [
      {
        type: "npm_run_script",
        name: "delay",
        args: ["3000"],
      },
      {
        type: "npm_run_script",
        name: "lint",
        args: [],
      },
      {
        type: "npm_run_script",
        name: "build",
        args: [],
      },
    ],
  });
});
