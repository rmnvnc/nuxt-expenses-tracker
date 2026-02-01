<script setup lang="ts">
import { transactionViewOptions } from '~/constants'
import type { Database } from '~/types/database.types'

type Transaction = Database['public']['Tables']['transactions']['Row']
type DateKey = `${number}-${number}-${number}`
type GroupedTransactions = Record<DateKey, Transaction[]>
const selectedView = ref(transactionViewOptions[1])

const supabase = useSupabaseClient<Database>()

const {
    data: transactions,
    refresh,
    pending: isLoading
} = await useAsyncData<Transaction[]>(
    'transactions',
    async () => {
        const { data, error } = await supabase.from('transactions').select()

        if (error) return []

        return data
    },
    { default: () => [] }
)

const income = computed(() => transactions.value.filter((t) => t.type === 'Income'))
const expense = computed(() => transactions.value.filter((t) => t.type === 'Expense'))

const incomeCount = computed(() => income.value.length)
const expenseCount = computed(() => expense.value.length)

const incomeTotal = computed(() =>
    income.value.reduce((sum, transaction) => sum + transaction.amount, 0)
)

const expenseTotal = computed(() =>
    expense.value.reduce((sum, transaction) => sum + transaction.amount, 0)
)

const transactionsGroupByDate = computed(() => {
    const grouped: GroupedTransactions = {}

    for (const transaction of transactions.value) {
        const date = new Date(transaction.created_at).toISOString().split('T')[0] as DateKey

        if (!grouped[date]) {
            grouped[date] = []
        }

        grouped[date].push(transaction)
    }

    return grouped
})

const isOpen = ref(false)
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
            :amount="incomeTotal"
            :last-amount="3000"
            :loading="isLoading"
        />
        <AppTrend
            color="red"
            title="Expenses"
            :amount="expenseTotal"
            :last-amount="5000"
            :loading="isLoading"
        />
        <AppTrend
            color="green"
            title="Investments"
            :amount="4000"
            :last-amount="3000"
            :loading="isLoading"
        />
        <AppTrend
            color="green"
            title="Savings"
            :amount="4000"
            :last-amount="5000"
            :loading="isLoading"
        />
    </section>

    <section class="flex justify-between mb-10">
        <div>
            <h2 class="text-2xl font-extrabold">Transactions</h2>
            <div class="text-gray-500 dark:text-gray-100">
                You have {{ incomeCount }} incomes and {{ expenseCount }} expenses this period
            </div>
        </div>
        <div>
            <UButton
                icon="heroicons:plus-circle"
                color="neutral"
                variant="outline"
                label="Add"
                @click="isOpen = true"
            />
            <AppTransactionModal v-model:is-open="isOpen" />
        </div>
    </section>

    <section v-if="!isLoading">
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
                @deleted="refresh()"
            />
        </div>
    </section>
    <section v-else>
        <USkeleton
            v-for="i in 3"
            :key="i"
            class="h-8 w-full mb-2"
        />
    </section>
</template>
