// This configuration only applies to the package manager root.
/** @type {import("eslint").Linter.Config} */
module.exports = {
  ignorePatterns: ["apps/**", "packages/**"],
  extends: ["@workspace/eslint-config/library.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  rules: {
    // Disable env var strictness in CI, warn locally
    "turbo/no-undeclared-env-vars": process.env.CI ? "off" : "warn",

    // Disable explicit-any rule in CI, warn locally
    "@typescript-eslint/no-explicit-any": process.env.CI ? "off" : "warn",
  },
};
