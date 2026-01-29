<script setup lang="ts">
import { transactionViewOptions } from '~/constants'
import type { Database } from '~/types/database.types'

type Transaction = Database['public']['Tables']['transactions']['Row']
const selectedView = ref(transactionViewOptions[1])

const supabase = useSupabaseClient<Database>()

const transactions = ref<Transaction[]>([])

const { data, pending } = await useAsyncData<Transaction[]>(
    'transactions',
    async () => {
        const { data, error } = await supabase.from('transactions').select()

        if (error) return []

        return data
    },
    { default: () => [] }
)

transactions.value = data.value

const transactionsGroupByDate = computed(() => {
    let grouped = {}

    for (const transaction of transactions.value) {
        const date = new Date(transaction.created_at).toISOString().split('T')[0]

        if (!grouped[date]) {
            grouped[date] = []
        }

        grouped[date].push(transaction)
    }

    return grouped
})
</script>

<template>
    <section class="flex items-center justify-between mb-10">
        <h1 class="text-4xl font-extrabold">Summary</h1>
        <div>
            <USelect
                v-model="selectedView"
                :items="transactionViewOptions"
            />
        </div>
    </section>
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
        <AppTrend
            color="green"
            title="Income"
            :amount="4000"
            :last-amount="3000"
            :loading="false"
        />
        <AppTrend
            color="red"
            title="Expenses"
            :amount="4000"
            :last-amount="5000"
            :loading="false"
        />
        <AppTrend
            color="green"
            title="Investments"
            :amount="4000"
            :last-amount="3000"
            :loading="false"
        />
        <AppTrend
            color="green"
            title="Savings"
            :amount="4000"
            :last-amount="5000"
            :loading="true"
        />
    </section>
    <section>
        <div
            v-for="(transactionsOnDay, date) in transactionsGroupByDate"
            :key="date"
        >
            <AppDailyTransaction
                :date="date"
                :transactions="transactionsOnDay"
            />
            <AppTransaction
                v-for="transaction in transactionsOnDay"
                :key="transaction.id"
                :transaction="transaction"
            />
        </div>
    </section>
</template>
