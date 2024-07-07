import { expect, test } from "vitest";
import { parseScript } from "./src";

test("npm run script zero args", () => {
  const result = parseScript("npm run build");

  expect(result).toEqual({
    type: "npm_run_script",
    name: "build",
    args: [],
  });
});

test("npm run script several args", () => {
  const result = parseScript("npm run build -- foo bar");

  expect(result).toEqual({
    type: "npm_run_script",
    name: "build",
    args: ["foo", "bar"],
  });
});
