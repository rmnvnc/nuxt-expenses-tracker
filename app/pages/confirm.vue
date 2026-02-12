<script lang="ts" setup>
useRedirectIfAuthenticated()
</script>

<template>
    <UCard>
        <div class="text-center">
            <UIcon
                name="i-heroicons-check-circle"
                class="w-16 h-16 text-green-500 mx-auto mb-4"
            />
            <h2 class="text-2xl font-bold mb-2">Signing in...</h2>
            <p class="text-gray-600">
                Wait a moment while we sign you in and redirect you to the app.
            </p>
        </div>
    </UCard>
</template>

<style scoped></style>
