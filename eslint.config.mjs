// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt([
    {
        rules: {
            '@stylistic/indent': 'off',
            '@stylistic/comma-dangle': 'off'
        }
    }
])
