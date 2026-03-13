<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/nuxt'
import { Analytics } from '@vercel/analytics/nuxt'
</script>

<template>
    <AppHeader />
    <UMain>
        <UContainer>
            <slot />
        </UContainer>
    </UMain>
    <SpeedInsights />
    <Analytics />
</template>
