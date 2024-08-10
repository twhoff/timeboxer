import globals from 'globals'
import js from '@eslint/js'
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin'
import react from 'eslint-plugin-react'
import prettier from 'eslint-plugin-prettier'

const tsRecommended = typescriptEslintPlugin.configs.recommended.rules
const prettierRecommended = {
    'prettier/prettier': 'error',
}

export default [
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        languageOptions: {
            globals: globals.browser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            prettier,
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
            ...prettierRecommended,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    js.configs.recommended,
    react.configs.flat.recommended,
]
