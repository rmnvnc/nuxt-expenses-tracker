<script setup lang="ts">
const { isLoggedIn } = useUser()

const route = useRoute()
const isHome = computed(() => route.path === '/')
</script>

<template>
    <div class="container mx-auto max-w-4xl px-4">
        <AppHeader />
        <main>
            <div
                v-if="!isHome && !isLoggedIn"
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
</template>
