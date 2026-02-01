<script setup lang="ts">
const isOpen = defineModel<boolean>('isOpen', { required: true })
</script>

<template>
    <UModal
        v-model:open="isOpen"
        title="Add transaction"
        description="Modal for adding transactions"
    >
        <template #content>
            <UCard>
                <template #header>
                    <h3>Title</h3>
                </template>

                Content here

                <template #footer>
                    <UButton @click="isOpen = false">Close</UButton>
                </template>
            </UCard>
        </template>
    </UModal>
</template>
