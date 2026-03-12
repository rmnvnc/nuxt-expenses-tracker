<script lang="ts" setup>
import type { Transaction } from '~/types/transaction.types'

const props = defineProps<{
    date: DateKey
    transactions: Transaction[]
}>()

const sum = computed(() =>
    props.transactions.reduce(
        (acc, transaction) =>
            transaction.type.name === 'Income'
                ? (acc += transaction.amount ?? 0)
                : (acc -= transaction.amount ?? 0),
        0
    )
)

const { currency } = useCurrency(sum)
</script>

<template>
    <div class="grid grid-cols-2 py-2 border-y border-default items-center">
        <p>{{ formatDate(date) }}</p>
        <div
            class="amount text-right"
            :class="sum >= 0 ? 'text-income' : 'text-expense'"
        >
            {{ currency }}
        </div>
    </div>
</template>
