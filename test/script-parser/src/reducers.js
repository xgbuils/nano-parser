export const to = (state) => () => state;
export const toSame = (state) => state;
export const doNothingReducer = (acc) => acc;

export const identityStep = () => ({
  reducer: doNothingReducer,
  next: toSame,
});

export const createScript = (token, type, extra) => ({
  type,
  name: token.value,
  args: [],
  ...extra,
});

export const createElementaryScript = (token) =>
  createScript(token, "elementary_script");

export const createNpmScript = (token) =>
  createScript(token, "npm_run_script", {
    configArgs: [],
  });

const addScriptReducer =
  (createScript) =>
  ({ refs, current }, token) => {
    const result = createScript(token);
    if (current) {
      current.runs.push(result);
    }
    addScriptReducer;
    refs.push(result);
    return {
      refs,
      current: result,
    };
  };

export const addElementaryScriptReducer = addScriptReducer(
  createElementaryScript,
);

export const addNpmScriptReducer = addScriptReducer(createNpmScript);

export const readScriptArgReducer = ({ refs, current }, token) => {
  current.args.push(token.value);
  return {
    refs,
    current,
  };
};

export const prepareToReadNextScriptReducer = ({ refs, current }) => {
  refs.pop();
  const result =
    refs.length > 0
      ? refs[refs.length - 1]
      : {
          type: "sequential_group",
          runs: [current],
        };
  refs.push(result);
  return {
    refs,
    current: result,
  };
};
