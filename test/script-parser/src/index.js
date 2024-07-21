import { createLexer } from "nano-lexer";
import { createElementaryScriptMachine } from "./elementary-script.machine";
import { createNpmRunAllScriptMachine } from "./npm-run-all-script.machine";
import { createNpmScriptMachine } from "./npm-script.machine";
import {
  addElementaryScriptReducer,
  addNpmScriptReducer,
  identityStep,
} from "./reducers";
import { createParser } from "../../../src";

const tokenDefs = [
  {
    type: "node",
    pattern: /node/,
  },
  {
    type: "npm",
    pattern: /npm/,
  },
  {
    type: "run_sequential",
    pattern: /run-s/,
  },
  {
    type: "run_parallel",
    pattern: /run-p/,
  },
  {
    type: "npm_run_all",
    pattern: /npm-run-all/,
  },
  {
    type: "run",
    pattern: /run/,
  },
  {
    type: "parallel_option",
    pattern: /--parallel|-p/,
  },
  {
    type: "sequential_option",
    pattern: /--serial|--sequential|-s/,
  },
  {
    type: "zero_arg_option",
    pattern:
      /--aggregate-output|-c|--continue-on-error|-l|--print-label|-n|--print-name|-r|--race|--silent/,
  },
  {
    type: "number_arg_option",
    pattern: /--max-parallel/,
  },
  {
    type: "string_arg_option",
    pattern: /--npm-path/,
  },
  {
    type: "args_separator",
    pattern: /--\s+/,
  },
  {
    type: "quote_grouping",
    pattern: /"/,
  },
  {
    type: "sequential_join",
    pattern: /&&/,
  },
  {
    type: "word",
    pattern: /[^\s"]+/,
  },
  {
    type: "space",
    pattern: /\s+/,
  },
];

const runGroupReducer = (type) => () => {
  const result = {
    type,
    runs: [],
  };
  return {
    refs: [result],
    current: result,
  };
};

const parserConfig = {
  reading_script: {
    space: identityStep(),
    npm: {
      reducer: addNpmScriptReducer,
      next: createNpmScriptMachine(),
    },
    node: {
      reducer: addElementaryScriptReducer,
      next: createElementaryScriptMachine(),
    },
    run: {
      reducer: addElementaryScriptReducer,
      next: createElementaryScriptMachine(),
    },
    word: {
      reducer: addElementaryScriptReducer,
      next: createElementaryScriptMachine(),
    },
    run_sequential: {
      reducer: runGroupReducer("sequential_group"),
      next: createNpmRunAllScriptMachine(),
    },
    run_parallel: {
      reducer: runGroupReducer("parallel_group"),
      next: createNpmRunAllScriptMachine(),
    },
  },
};

export const parseScript = (input) => {
  const lexer = createLexer(tokenDefs);
  const tokens = lexer.toIterable(input);
  const parser = createParser(
    parserConfig,
    {
      initialState: "reading_script",
      endStates: new Set(["reading_script"]),
    },
    ({ refs }) => refs[0] ?? { type: "empty" },
  );
  return parser.fromIterable(tokens).parse();
};
