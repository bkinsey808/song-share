module.exports = {
	extends: [
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
		"@typescript-eslint/consistent-type-definitions": ["error", "type"],
		"@typescript-eslint/no-misused-promises": [
			"error",
			{
				checksVoidReturn: {
					attributes: false,
				},
			},
		],
		"object-shorthand": "error",
		"destructuring/in-params": "off",
		"no-case-declarations": "off",
		"no-shadow": "error",
		"react/prefer-read-only-props": "error",
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
