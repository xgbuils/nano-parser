import { createLexer } from "nano-lexer";

const tokenDefs = [
  {
    type: "Operation",
    pattern: /\+/,
  },
  {
    type: "Operation",
    pattern: /-/,
  },
  {
    type: "Identifier",
    pattern: /[a-z]\w+/,
  },
  {
    type: "NumberLiteral",
    pattern: /\d+/,
  },
  {
    type: "Space",
    pattern: /\s+/,
  },
];

export const createMachine =
  ({ initialState, endStates }, config) =>
  () => ({
    initialState,
    endStates,
    config,
  });

export const createParser = (config, { initialState, endStates }, end) => {
  let state = initialState;
  const configStack = [];
  let currentConfig = { config, initialState, endStates };

  const reducer = (acc, token) => {
    let action;
    while (true) {
      action = currentConfig.config[state]?.[token.type];
      if (action) {
        break;
      } else if (!currentConfig.endStates.has(state)) {
        throw new Error(
          `Machine with initial state "${initialState}" does not have a end state "${state}"`,
        );
      }
      currentConfig = configStack.pop();
    }
    state = action.next(state);
    const result = action.reducer(acc, token);
    if (!state) {
      throw new Error(`state ${JSON.stringify(state)} is invalid`);
    } else if (typeof state === "object") {
      configStack.push(currentConfig);
      currentConfig = state;
      state = state.initialState;
    }
    return result;
  };

  return {
    fromIterable: (tokens) => {
      return {
        parse: () => {
          return end(tokens.reduce(reducer, { refs: [] }));
        },
      };
    },
  };
};
