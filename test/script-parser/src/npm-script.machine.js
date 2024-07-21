import { createMachine } from "../../../src";
import {
  doNothingReducer,
  identityStep,
  prepareToReadNextScriptReducer,
  to,
} from "./reducers";

const setNpmRunScriptNameReducer = ({ refs, current }, token) => {
  current.name = token.value;
  return {
    refs,
    current,
  };
};

export const readScriptRestArgReducer = ({ refs, current }, token) => {
  current.args.push(token.value);
  return {
    refs,
    current,
  };
};

const configArgPrefix = "--";

const createConfigArg = (token) => {
  const nameValue = token.value.slice(configArgPrefix.length);
  const index = nameValue.indexOf("=");
  const hasValue = index < 0;
  const name = hasValue ? nameValue : nameValue.slice(0, index);
  const value = hasValue ? true : nameValue.slice(index + 1);
  return {
    type: "config_arg",
    name,
    value,
  };
};

const createRestArg = (token) => ({
  type: "rest_arg",
  name: token.value,
});

const readArgBeforeSeparatorReducer = ({ refs, current }, token) => {
  if (token.value.startsWith(configArgPrefix)) {
    current.configArgs.push(createConfigArg(token));
  } else {
    current.args.push(createRestArg(token));
  }
  return {
    refs,
    current,
  };
};

const readArgAfterSeparatorReducer = ({ refs, current }, token) => {
  current.args.push(createRestArg(token));
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
        "reading_npm_script_args_before_separator",
        "reading_npm_script_args_after_separator",
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
          next: to("reading_npm_script_args_before_separator"),
        },
        word: {
          reducer: setNpmRunScriptNameReducer,
          next: to("reading_npm_script_args_before_separator"),
        },
      },
      reading_npm_script_args_before_separator: {
        space: identityStep(),
        word: {
          reducer: readArgBeforeSeparatorReducer,
          next: to("reading_npm_script_args_before_separator"),
        },
        args_separator: {
          reducer: doNothingReducer,
          next: to("reading_npm_script_args_after_separator"),
        },
        sequential_join: {
          reducer: prepareToReadNextScriptReducer,
          next: to("reading_script"),
        },
      },
      reading_npm_script_args_after_separator: {
        space: identityStep(),
        args_separator: {
          reducer: readArgAfterSeparatorReducer,
          next: to("reading_npm_script_args_after_separator"),
        },
        word: {
          reducer: readArgAfterSeparatorReducer,
          next: to("reading_npm_script_args_after_separator"),
        },
        sequential_join: {
          reducer: prepareToReadNextScriptReducer,
          next: to("reading_script"),
        },
      },
    },
  );
