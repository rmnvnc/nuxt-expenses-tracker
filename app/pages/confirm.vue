<script lang="ts" setup>
definePageMeta({ middleware: 'guest' })
</script>

<template>
    <UCard class="max-w-xl m-auto mt-16">
        <div class="text-center">
            <UIcon
                name="ph:check-circle"
                class="w-16 h-16 text-green-500 mx-auto mb-4"
            />
            <h2 class="text-2xl mb-4">Signing in...</h2>
            <p>Wait a moment while we sign you in and redirect you to the app.</p>
        </div>
    </UCard>
</template>

<style scoped></style>
