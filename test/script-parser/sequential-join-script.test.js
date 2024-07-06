import { expect, test } from "vitest";
import { parseScript } from "./src";

test("sequential join (node && node)", () => {
  const result = parseScript("node src/index.js && node src/test.js");

  expect(result).toEqual({
    type: "sequential_group",
    runs: [
      {
        type: "elementary_script",
        name: "node",
        args: ["src/index.js"],
      },
      {
        type: "elementary_script",
        name: "node",
        args: ["src/test.js"],
      },
    ],
  });
});

test("sequential join (node && eslint)", () => {
  const result = parseScript("node src/index.js && eslint");

  expect(result).toEqual({
    type: "sequential_group",
    runs: [
      {
        type: "elementary_script",
        name: "node",
        args: ["src/index.js"],
      },
      {
        type: "elementary_script",
        name: "eslint",
        args: [],
      },
    ],
  });
});

test("sequential join (npm && node && eslint)", () => {
  const result = parseScript("npm run build && node src/index.js && eslint .");

  expect(result).toEqual({
    type: "sequential_group",
    runs: [
      {
        type: "npm_run_script",
        name: "build",
        args: [],
      },
      {
        type: "elementary_script",
        name: "node",
        args: ["src/index.js"],
      },
      {
        type: "elementary_script",
        name: "eslint",
        args: ["."],
      },
    ],
  });
});

test("sequential join (eslint && npm && node)", () => {
  const result = parseScript(" eslint && npm run build && node src/index.js");

  expect(result).toEqual({
    type: "sequential_group",
    runs: [
      {
        type: "elementary_script",
        name: "eslint",
        args: [],
      },
      {
        type: "npm_run_script",
        name: "build",
        args: [],
      },
      {
        type: "elementary_script",
        name: "node",
        args: ["src/index.js"],
      },
    ],
  });
});

test("sequential join (babel && node)", () => {
  const result = parseScript(
    'babel src --out-dir dist --ignore "**__tests__/*.js" && node ./clean.js',
  );

  expect(result).toEqual({
    type: "sequential_group",
    runs: [
      {
        type: "elementary_script",
        name: "babel",
        args: ["src", "--out-dir", "dist", "--ignore", "**__tests__/*.js"],
      },
      {
        type: "elementary_script",
        name: "node",
        args: ["./clean.js"],
      },
    ],
  });
});