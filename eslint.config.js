import eslintNode from "personal-style-guide/eslint/node";

export default [
  ...eslintNode,
  {
    rules: {
      "perfectionist/sort-classes": "off",
      "perfectionist/sort-modules": "off",
    },
  },
];
