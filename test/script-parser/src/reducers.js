export const to = (state) => () => state;
export const toSame = (state) => state;
export const doNothingReducer = (acc) => acc;

export const identityStep = () => ({
  reducer: doNothingReducer,
  next: toSame,
});

export const createScript = (token, type) => ({
  type,
  name: token.value,
  args: [],
});

export const addScriptReducer =
  (type) =>
  ({ refs, current }, token) => {
    const result = createScript(token, type);
    if (current) {
      current.runs.push(result);
    }
    refs.push(result);
    return {
      refs,
      current: result,
    };
  };

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
