import { expect, test } from "vitest";
import { parseScript } from "./src";

test("empty script is valid", () => {
  const result = parseScript("");

  expect(result).toEqual({ type: "empty" });
});

test("only space script is valid", () => {
  const result = parseScript("   ");

  expect(result).toEqual({ type: "empty" });
});
