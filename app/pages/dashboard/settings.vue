<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items = ref<NavigationMenuItem[][]>([
    [
        {
            label: 'Profile',
            to: '/dashboard/settings/profile',
        },
        {
            label: 'Preferences',
            to: '/dashboard/settings/preferences',
        },
    ],
])
</script>

<template>
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-6 lg:gap-8">
        <aside class="lg:col-span-1">
            <UNavigationMenu
                orientation="vertical"
                :items="items"
            />
        </aside>

        <main class="lg:col-span-5 min-w-0">
            <NuxtPage />
        </main>
    </div>
</template>
