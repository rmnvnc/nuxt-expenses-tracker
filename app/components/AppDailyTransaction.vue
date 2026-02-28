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
    <div class="grid grid-cols-2 py-4 border-b border-default items-center">
        <p>{{ date }}</p>
        <div
            class="amount text-right"
            :class="sum >= 0 ? 'text-income' : 'text-expense'"
        >
            {{ currency }}
        </div>
    </div>
</template>
