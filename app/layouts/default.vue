<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/nuxt'
import { Analytics } from '@vercel/analytics/nuxt'

const { isLoggedIn } = useUser()

const route = useRoute()
const isDashboard = computed(() => route.path.startsWith('/dashboard'))
</script>

<template>
    <div class="container mx-auto max-w-4xl px-4">
        <AppHeader />
        <main>
            <div
                v-if="isDashboard && !isLoggedIn"
                class="flex justify-center items-center h-64"
            >
                <UIcon
                    name="ph:arrows-clockwise-light"
                    class="w-8 h-8 animate-spin text-gray-400"
                />
            </div>
            <slot v-else />
        </main>
    </div>
    <SpeedInsights />
    <Analytics />
</template>
