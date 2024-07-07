import { createMachine } from "../../../src";
import {
  doNothingReducer,
  identityStep,
  prepareToReadNextScriptReducer,
  readScriptArgReducer,
  to,
  toSame,
} from "./reducers";

const startReadingScriptQuoteGroupedArgReducer = ({ refs, current }) => {
  current.args.push("");
  return {
    refs,
    current,
  };
};

const readScriptQuoteGroupedArgReducer = ({ refs, current }, token) => {
  current.args[current.args.length - 1] += token.value;
  return {
    refs,
    current,
  };
};

export const createElementaryScriptMachine = () =>
  createMachine(
    {
      initialState: "reading_elementary_script_args",
      endStates: new Set(["reading_script", "reading_elementary_script_args"]),
    },
    {
      space: identityStep(),
      reading_elementary_script_args: {
        space: identityStep(),
        node: {
          reducer: readScriptArgReducer,
          next: toSame,
        },
        word: {
          reducer: readScriptArgReducer,
          next: toSame,
        },
        sequential_join: {
          reducer: prepareToReadNextScriptReducer,
          next: to("reading_script"),
        },
        quote_grouping: {
          reducer: startReadingScriptQuoteGroupedArgReducer,
          next: to("reading_elementary_script_quote_grouped_arg"),
        },
      },
      reading_elementary_script_quote_grouped_arg: {
        space: {
          reducer: readScriptQuoteGroupedArgReducer,
          next: toSame,
        },
        word: {
          reducer: readScriptQuoteGroupedArgReducer,
          next: toSame,
        },
        sequential_join: {
          reducer: readScriptQuoteGroupedArgReducer,
          next: toSame,
        },
        quote_grouping: {
          reducer: doNothingReducer,
          next: to("reading_elementary_script_args"),
        },
      },
    },
  );
