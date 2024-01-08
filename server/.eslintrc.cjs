module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	overrides: [
		{
			env: {
				node: true,
			},
			files: [".eslintrc.{js,cjs}"],
			parserOptions: {
				sourceType: "script",
			},
		},
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	plugins: ["@typescript-eslint"],
	rules: {
		indent: ["error", "tab"],
		"linebreak-style": ["error", "unix"],
		quotes: ["error", "double"],
		semi: ["error", "always"],
		"prettier/prettier": [
			"error",
			{
				bracketSameLine: false,
				parser: "flow",
				trailingComma: "es5",
				tabWidth: 2,
				semi: true,
				singleQuote: false,
				jsxSingleQuote: false,
				bracketSpacing: true,
				arrowParens: "always",
				singleAttributePerLine: true,
				printWidth: 120,
				embeddedLanguageFormatting: "auto",
				useTabs: true,
				endOfLine: "auto",
			},
		],
	},
};
