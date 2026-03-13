<script setup lang="ts">
import { useSelectedTimePeriod } from '~/composables/useSelectedTimePeriod'
import { transactionViewOptionDefault, transactionViewOptions } from '~/constants'
import type { TransactionViewOption } from '~/constants'

const { profile } = useUser()

const selectedView = ref<TransactionViewOption>(
    profile.value?.user_metadata.preference?.transaction_view ?? transactionViewOptionDefault
)
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
        investmentTotal,
        savingTotal,
    },
    pending: pendingCurrent,
} = useFetchTransactions(current, selectedView, 'current')

const {
    transactions: {
        incomeTotal: prevIncomeTotal,
        expenseTotal: prevExpenseTotal,
        investmentTotal: prevInvestmentTotal,
        savingTotal: prevSavingTotal,
    },
    pending: pendingPrevious,
    refresh: refreshPrevious,
} = useFetchTransactions(previous, selectedView, 'previous')

const refresh = async () => {
    await Promise.all([refreshCurrent(), refreshPrevious()])
}
</script>

<template>
    <div>
        <section class="flex items-center justify-between my-10">
            <h1>Summary</h1>
            <div>
                <USelect
                    v-model="selectedView"
                    :items="transactionViewOptions"
                />
            </div>
        </section>
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <AppTrend
                title="Income"
                :amount="incomeTotal"
                :last-amount="prevIncomeTotal"
                :loading="isLoading"
                variant="Income"
            />
            <AppTrend
                title="Expenses"
                :amount="expenseTotal"
                :last-amount="prevExpenseTotal"
                :loading="isLoading"
                variant="Expense"
            />
            <AppTrend
                title="Investments"
                :amount="investmentTotal"
                :last-amount="prevInvestmentTotal"
                :loading="isLoading"
                variant="Investment"
            />
            <AppTrend
                title="Savings"
                :amount="savingTotal"
                :last-amount="prevSavingTotal"
                :loading="isLoading"
                variant="Saving"
            />
        </section>

        <section class="flex justify-between mb-10">
            <div>
                <h2>Transactions</h2>
                <p>
                    You have {{ incomeCount }} incomes and {{ expenseCount }} expenses this period
                </p>
            </div>
            <div>
                <UButton
                    icon="ph:plus-circle"
                    color="primary"
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
            <template
                v-for="(transactionsOnDay, date) in transactionsGroupByDate"
                :key="date"
            >
                <AppDailyTransaction
                    :date="date"
                    :transactions="transactionsOnDay"
                />
                <div class="divide-y divide-default">
                    <AppTransaction
                        v-for="transaction in transactionsOnDay"
                        :key="transaction.id"
                        :transaction="transaction"
                        @deleted="refresh()"
                    />
                </div>
            </template>
        </section>
        <section v-else>
            <USkeleton
                v-for="i in 3"
                :key="i"
                class="h-8 w-full mb-2"
            />
        </section>
    </div>
</template>
