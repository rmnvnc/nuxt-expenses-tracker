// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@nuxt/eslint', '@nuxt/hints', '@nuxt/ui', '@nuxtjs/supabase'],
    ssr: true,

    devtools: {
        enabled: true,
    },

    app: {
        pageTransition: { name: 'page', mode: 'out-in' },
        head: {
            link: [
                {
                    rel: 'icon',
                    type: 'image/png',
                    href: '/favicons/favicon-96x96.png',
                    sizes: '96x96',
                },
                { rel: 'icon', type: 'image/svg+xml', href: '/favicons/favicon.svg' },
                { rel: 'shortcut icon', href: '/favicons/favicon.ico' },
                {
                    rel: 'apple-touch-icon',
                    sizes: '180x180',
                    href: '/favicons/apple-touch-icon.png',
                },
                { rel: 'manifest', href: '/favicons/site.webmanifest' },
            ],
            meta: [{ name: 'apple-mobile-web-app-title', content: 'Finflo' }],
        },
    },

    css: ['~/assets/css/main.css'],

    ui: {
        colorMode: false,
    },

    runtimeConfig: {
        public: {
            siteUrl:
                process.env.VERCEL_ENV === 'production'
                    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
                    : 'http://localhost:3000',
        },
    },

    srcDir: 'app/',

    routeRules: {
        '/': { prerender: true },
        '/dashboard': { ssr: false },
        '/dashboard/**': { ssr: false },
        '/login': { ssr: false },
        '/confirm': { ssr: false },
        '/dashboard/settings': { redirect: '/dashboard/settings/profile' },
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
            saveRedirectToCookie: true,
        },
    },
})
