<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/nuxt'
import { Analytics } from '@vercel/analytics/nuxt'
</script>

<template>
    <UContainer>
        <AppHeader />
        <UMain>
            <slot />
        </UMain>
    </UContainer>
    <SpeedInsights />
    <Analytics />
</template>
