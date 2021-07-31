/* eslint-disable no-undef */

module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "prettier"],
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
    ],
    settings: {
        react: {
            version: "detected",
        },
    },
    rules: {
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "prettier/prettier": "warn",
        "react/prop-types": "off",
    },
};
