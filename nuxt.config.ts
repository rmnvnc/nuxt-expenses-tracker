// https://nuxt.com/docs/api/configuration/nuxt-config
console.log('VERCEL_URL', process.env.VERCEL_URL)
console.log('VERCEL_PROJECT_PRODUCTION_URL', process.env.VERCEL_PROJECT_PRODUCTION_URL)
console.log('VERCEL_ENV', process.env.VERCEL_ENV)
console.log('ALL', process.env)

export default defineNuxtConfig({
    modules: ['@nuxt/eslint', '@nuxt/hints', '@nuxt/ui', '@nuxtjs/supabase'],
    ssr: true,

    devtools: {
        enabled: true,
    },

    css: ['~/assets/css/main.css'],

    runtimeConfig: {
        public: {
            siteUrl:
                process.env.NUXT_PUBLIC_SITE_URL ||
                (process.env.VERCEL_URL
                    ? `https://${process.env.VERCEL_URL}`
                    : 'http://localhost:3000'),
        },
    },

    srcDir: 'app/',

    routeRules: {
        '/': { ssr: true },
        '/dashboard': { ssr: false },
        '/dashboard/**': { ssr: false },
        '/login': { ssr: false },
        '/confirm': { ssr: false },
    },

    compatibilityDate: '2025-01-15',

    eslint: {
        config: {
            stylistic: {
                commaDangle: 'never',
                braceStyle: '1tbs',
            },
        },
    },

    supabase: {
        redirect: true,
        redirectOptions: {
            login: '/login',
            callback: '/confirm',
            exclude: ['/', '/login', '/confirm'],
        },
    },
})
