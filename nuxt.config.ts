// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxt/eslint',
        '@nuxt/hints',
        '@nuxt/ui',
        '@nuxtjs/turnstile',
        '@nuxtjs/supabase',
        '@vite-pwa/nuxt',
    ],
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
                // { rel: 'manifest', href: '/favicons/site.webmanifest' },
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
        '/dashboard': { ssr: false, appLayout: 'dashboard' },
        '/dashboard/**': { ssr: false, appLayout: 'dashboard' },
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
    pwa: {
        registerType: 'autoUpdate',
        srcDir: 'app/',
        devOptions: {
            enabled: true,
            type: 'module',
        },
        manifest: {
            name: 'Finflo',
            short_name: 'Finflo',
            start_url: '/dashboard',
            theme_color: '#6366f1',
            background_color: '#0d0f14',
            display: 'standalone',
            icons: [
                {
                    src: '/favicons/web-app-manifest-192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                    purpose: 'any maskable',
                },
                {
                    src: '/favicons/web-app-manifest-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any maskable',
                },
            ],
        },
        workbox: {
            navigateFallback: null,
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

    turnstile: {
        siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY,
    },
})
