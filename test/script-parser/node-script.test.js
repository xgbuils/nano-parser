import { expect, test } from "vitest";
import { parseScript } from "./src";

test("zero param node script", () => {
  const result = parseScript("node");

  expect(result).toEqual({
    type: "elementary_script",
    name: "node",
    args: [],
  });
});

test("one param node script", () => {
  const result = parseScript("node src/index.js");

  expect(result).toEqual({
    type: "elementary_script",
    name: "node",
    args: ["src/index.js"],
  });
});

test("two params node script", () => {
  const result = parseScript("node src/index.js --option=6");

  expect(result).toEqual({
    type: "elementary_script",
    name: "node",
    args: ["src/index.js", "--option=6"],
  });
});