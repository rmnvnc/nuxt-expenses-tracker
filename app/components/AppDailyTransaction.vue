<script lang="ts" setup>
import type { Database } from '~/types/database.types'

type Transaction = Database['public']['Tables']['transactions']['Row']

const props = defineProps<{
    date: string
    transactions: Transaction[]
}>()

const sum = computed(() =>
    props.transactions.reduce(
        (acc, transaction) =>
            transaction.type === 'Income'
                ? (acc += transaction.amount ?? 0)
                : (acc -= transaction.amount ?? 0),
        0
    )
)

const { currency } = useCurrency(sum)
</script>

<template>
    <div
        class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400"
    >
        <div class="flex items-center justify-between font-bold">
            {{ date }}
        </div>
        <div class="flex items-center justify-end space-x-2 mr-10">{{ currency }}</div>
    </div>
</template>

<style lang="css" scoped>
@reference "@/assets/css/main.css";

.green {
    @apply text-green-600 dark:text-green-400;
}
.red {
    @apply text-red-600 dark:text-red-400;
}
</style>
