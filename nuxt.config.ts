// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@nuxt/eslint', '@nuxt/hints', '@nuxt/ui', '@nuxtjs/supabase'],

    devtools: {
        enabled: true
    },

    css: ['~/assets/css/main.css'],
    srcDir: 'app/',

    routeRules: {
        '/': { prerender: true }
    },

    compatibilityDate: '2025-01-15',

    eslint: {
        config: {
            stylistic: {
                commaDangle: 'never',
                braceStyle: '1tbs'
            }
        }
    },

    supabase: {
        redirect: false
    }
})
