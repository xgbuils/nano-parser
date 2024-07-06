import { createMachine } from "../../../src";
import {
  doNothingReducer,
  identityStep,
  prepareToReadNextScriptReducer,
  readScriptArgReducer,
  to,
} from "./reducers";

const setNpmRunScriptNameReducer = ({ refs, current }, token) => {
  current.name = token.value;
  return {
    refs,
    current,
  };
};

export const createNpmScriptMachine = () =>
  createMachine(
    {
      initialState: "reading_npm_script_run_token",
      endStates: new Set([
        "reading_script",
        "reading_npm_script_args_separator",
        "reading_npm_script_args",
      ]),
    },
    {
      space: identityStep(),
      reading_npm_script_run_token: {
        space: identityStep(),
        run: {
          reducer: doNothingReducer,
          next: to("reading_npm_script_name_token"),
        },
      },
      reading_npm_script_name_token: {
        space: identityStep(),
        node: {
          reducer: setNpmRunScriptNameReducer,
          next: to("reading_npm_script_args_separator"),
        },
        word: {
          reducer: setNpmRunScriptNameReducer,
          next: to("reading_npm_script_args_separator"),
        },
      },
      reading_npm_script_args_separator: {
        space: identityStep(),
        args_separator: {
          reducer: doNothingReducer,
          next: to("reading_npm_script_args"),
        },
        sequential_join: {
          reducer: prepareToReadNextScriptReducer,
          next: to("reading_script"),
        },
      },
      reading_npm_script_args: {
        space: identityStep(),
        args_separator: {
          reducer: readScriptArgReducer,
          next: to("reading_npm_script_args"),
        },
        word: {
          reducer: readScriptArgReducer,
          next: to("reading_npm_script_args"),
        },
        sequential_join: {
          reducer: prepareToReadNextScriptReducer,
          next: to("reading_script"),
        },
      },
    },
  );
