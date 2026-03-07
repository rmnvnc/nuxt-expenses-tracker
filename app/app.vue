<script setup lang="ts"></script>

<template>
    <UToaster>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UToaster>
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
