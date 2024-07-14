const { parse } = require("path");

module.exports = {
	extends: [
		"plugin:react-hooks/recommended",
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended-type-checked",
		"plugin:@typescript-eslint/stylistic-type-checked",
		"plugin:react/recommended",
		"next/core-web-vitals",
		"plugin:testing-library/react",
		"plugin:jest-dom/recommended",
		"plugin:destructuring/recommended",
		"plugin:prettier/recommended",
	],
	plugins: ["prettier", "destructuring"],
	rules: {
		"prettier/prettier": "warn",
		"@typescript-eslint/no-unused-vars": [
			"warn",
			{
				argsIgnorePattern: "^_",
				varsIgnorePattern: "^_",
				caughtErrorsIgnorePattern: "^_",
			},
		],
		"object-shorthand": "error",
		"destructuring/in-params": "off",
	},
	overrides: [
		{
			files: ["*.ts", "*.tsx"],
			parserOptions: {
				project: true,
			},
		},
	],
};
