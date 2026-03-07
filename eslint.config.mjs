// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import eslintConfigPrettier from 'eslint-config-prettier/flat'

export default withNuxt([
    {
        ignores: ['app/types/database.types.ts'],
    },
    {
        rules: {
            // formatting nech rieši Prettier
            '@stylistic/indent': 'off',
            '@stylistic/quotes': 'off',
            '@stylistic/semi': 'off',
            '@stylistic/comma-dangle': 'off',
            'vue/html-indent': 'off',
            'vue/html-self-closing': 'off',
            'vue/no-multiple-template-root': 'off',
        },
    },
    eslintConfigPrettier,
])
