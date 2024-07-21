import { createMachine } from "../../../src";
import {
  addNpmScriptReducer,
  createNpmScript,
  doNothingReducer,
  identityStep,
  prepareToReadNextScriptReducer,
  readScriptArgReducer,
  to,
  toSame,
} from "./reducers";

const nextNpmRunAllScriptReducer = ({ refs, current }, token) => {
  const script = createNpmScript(token);
  current.runs.push(script);
  return {
    refs,
    current,
  };
};

export const createNpmRunAllScriptMachine = () =>
  createMachine(
    {
      initialState: "reading_npm_run_all_script",
      endStates: new Set(["reading_script", "reading_npm_run_all_script"]),
    },
    {
      reading_npm_run_all_script: {
        space: identityStep(),
        word: {
          reducer: nextNpmRunAllScriptReducer,
          next: toSame,
        },
        quote_grouping: {
          reducer: doNothingReducer,
          next: to("reading_npm_rum_all_grouped_script"),
        },
        sequential_join: {
          reducer: prepareToReadNextScriptReducer,
          next: to("reading_script"),
        },
      },
      reading_npm_rum_all_grouped_script: {
        space: identityStep(),
        word: {
          reducer: addNpmScriptReducer,
          next: to("reading_npm_rum_all_grouped_script_args"),
        },
      },
      reading_npm_rum_all_grouped_script_args: {
        space: identityStep(),
        word: {
          reducer: readScriptArgReducer,
          next: toSame,
        },
        quote_grouping: {
          reducer: prepareToReadNextScriptReducer,
          next: to("reading_npm_run_all_script"),
        },
      },
    },
  );
