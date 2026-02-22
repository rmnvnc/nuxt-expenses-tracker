<script setup lang="ts">
const { initUser } = useUser()

onMounted(async () => {
    await initUser()
})
</script>

<template>
    <UToaster>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UToaster>
</template>
