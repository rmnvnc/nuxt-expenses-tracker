<template>
    <section class="flex items-center justify-between mb-10">
        <h1 class="text4xl font-extrabold">Summary</h1>
        <div>
            <USelectMenu
                v-model="value"
                :items="items"
            />
        </div>
    </section>
</template>

<script setup lang="ts">
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const value = ref('Backlog')
</script>
