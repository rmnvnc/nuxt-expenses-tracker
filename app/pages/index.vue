<script setup lang="ts">
import { useSelectedTimePeriod } from '~/composables/useSelectedTimePeriod'
import { transactionViewOptions } from '~/constants'

const selectedView = ref(transactionViewOptions[1])
const isOpen = ref(false)

const { current, previous } = useSelectedTimePeriod(selectedView)

const isLoading = computed(() => {
    return pendingCurrent.value || pendingPrevious.value
})

const {
    refresh: refreshCurrent,
    transactions: {
        grouped: { byDate: transactionsGroupByDate },
        incomeTotal,
        incomeCount,
        expenseCount,
        expenseTotal,
    },
    pending: pendingCurrent,
} = useFetchTransactions(current)

const {
    transactions: { incomeTotal: prevIncomeTotal, expenseTotal: prevExpenseTotal },
    pending: pendingPrevious,
    refresh: refreshPrevious,
} = useFetchTransactions(previous)

const refresh = async () => {
    await Promise.all([refreshCurrent(), refreshPrevious()])
}
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
            :last-amount="prevIncomeTotal"
            :loading="isLoading"
        />
        <AppTrend
            color="red"
            title="Expenses"
            :amount="expenseTotal"
            :last-amount="prevExpenseTotal"
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
            <AppTransactionModal
                v-model:is-open="isOpen"
                @saved="refresh()"
            />
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
