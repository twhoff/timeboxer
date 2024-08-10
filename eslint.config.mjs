import globals from 'globals'
import js from '@eslint/js'
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin'
import react from 'eslint-plugin-react'
import typescriptParser from '@typescript-eslint/parser'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

const tsRecommended = typescriptEslintPlugin.configs.recommended.rules

export default [
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        languageOptions: {
            globals: globals.browser,
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            react,
            '@typescript-eslint': typescriptEslintPlugin,
        },
        rules: {
            ...tsRecommended,
            indent: ['error', 4],
            semi: ['error', 'never'],
            'jsx-quotes': ['error', 'prefer-double'],
            quotes: ['error', 'single', { avoidEscape: true }],
            'no-unused-vars': 'error',
            'no-nested-ternary': 'error',
            'react/jsx-filename-extension': [
                'warn',
                { extensions: ['.jsx', '.tsx'] },
            ],
            'react/react-in-jsx-scope': 'off',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    js.configs.recommended,
    react.configs.flat.recommended,
    eslintPluginPrettierRecommended, // Add Prettier recommended config here
]
