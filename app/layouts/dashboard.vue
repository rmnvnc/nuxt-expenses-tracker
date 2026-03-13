<script setup lang="ts">
const { profile } = useUser()
const isReady = computed(() => profile.value !== null)
</script>

<template>
    <AppHeader />
    <UMain>
        <UContainer>
            <div
                v-if="!isReady"
                class="flex items-center justify-center min-h-64"
            >
                <UIcon
                    name="ph:circle-notch-bold"
                    class="w-10 h-10 animate-spin text-muted2"
                />
            </div>
            <slot v-else />
        </UContainer>
    </UMain>
</template>
