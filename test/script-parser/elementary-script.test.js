import { expect, test } from "vitest";
import { parseScript } from "./src";

test("zero param eslint script", () => {
  const result = parseScript("eslint");

  expect(result).toEqual({
    type: "elementary_script",
    name: "eslint",
    args: [],
  });
});

test("one param rimraf script", () => {
  const result = parseScript("rimraf dist");

  expect(result).toEqual({
    type: "elementary_script",
    name: "rimraf",
    args: ["dist"],
  });
});

test("one param with script named 'run'", () => {
  const result = parseScript("run potato");

  expect(result).toEqual({
    type: "elementary_script",
    name: "run",
    args: ["potato"],
  });
});

test("multiple args babel script", () => {
  const result = parseScript(
    'babel src --out-dir dist --ignore "**/__tests__/*.js"',
  );

  expect(result).toEqual({
    type: "elementary_script",
    name: "babel",
    args: ["src", "--out-dir", "dist", "--ignore", "**/__tests__/*.js"],
  });
});
