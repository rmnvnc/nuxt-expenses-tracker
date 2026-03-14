<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/nuxt'
import { Analytics } from '@vercel/analytics/nuxt'
import { sk } from '@nuxt/ui/locale'
</script>

<template>
    <NuxtPwaManifest />
    <UApp :locale="sk">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
    <SpeedInsights />
    <Analytics />
</template>

<style>
.page-enter-active,
.page-leave-active {
    transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
    opacity: 0;
}
</style>
