<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items = ref<NavigationMenuItem[][]>([
    [
        {
            label: 'Avatar',
            to: '/settings/avatar',
        },
        {
            label: 'Profile',
            to: '/settings/profile',
        },
        {
            label: 'Settings',
            to: '/settings/settings',
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
