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
    <div class="grid grid-cols-6 gap-8">
        <UNavigationMenu
            orientation="vertical"
            :items="items"
        />
        <div class="col-span-4">
            <NuxtPage />
        </div>
    </div>
</template>
