<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/nuxt'
import { Analytics } from '@vercel/analytics/nuxt'
</script>

<template>
    <div class="container mx-auto max-w-4xl px-4">
        <AppHeader />
        <main>
            <slot />
        </main>
    </div>
    <SpeedInsights />
    <Analytics />
</template>
