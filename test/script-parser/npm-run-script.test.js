import { expect, test } from "vitest";
import { parseScript } from "./src";

test("npm run script zero args", () => {
  const result = parseScript("npm run build");

  expect(result).toEqual({
    type: "npm_run_script",
    name: "build",
    configArgs: [],
    args: [],
  });
});

test("npm run script with config args but without rest args", () => {
  const result = parseScript("npm run build --foo --fizz=buzz --bar=");

  expect(result).toEqual({
    type: "npm_run_script",
    name: "build",
    configArgs: [
      {
        type: "config_arg",
        name: "foo",
        value: true,
      },
      {
        type: "config_arg",
        name: "fizz",
        value: "buzz",
      },
      {
        type: "config_arg",
        name: "bar",
        value: "",
      },
    ],
    args: [],
  });
});

test("npm run script with rest args but without config args", () => {
  const result = parseScript("npm run build -- foo bar");

  expect(result).toEqual({
    type: "npm_run_script",
    name: "build",
    configArgs: [],
    args: [
      {
        type: "rest_arg",
        name: "foo",
      },
      {
        type: "rest_arg",
        name: "bar",
      },
    ],
  });
});
