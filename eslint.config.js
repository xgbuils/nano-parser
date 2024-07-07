import js from "@eslint/js";

export default [
  {
    ...js.configs.recommended,
    ignores: ["lib/**/*.js"],
  },
  /*{

  root: true,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  
  extends: ["eslint:recommended", "plugin:node/recommended"],
  env: {
    node: true,
  },
}*/
];

// ignorePatterns: ["lib/**/*.js"],
