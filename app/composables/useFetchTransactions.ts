import type { Transaction } from '~/types/transaction.types'
import type { Database } from '~/types/database.types'

export type DateKey = `${number}-${number}-${number}`
type GroupedTransactions = Record<DateKey, Transaction[]>

export const useFetchTransactions = (
    period: Ref<{ from: Date; to: Date }>,
    selectedView: MaybeRef<string>,
    scope: 'current' | 'previous'
) => {
    const supabase = useSupabaseClient<Database>()

    const fromIso = computed(() => period.value.from.toISOString())
    const toIso = computed(() => period.value.to.toISOString())
    const fromKey = computed(() => fromIso.value.slice(0, 10))
    const toKey = computed(() => toIso.value.slice(0, 10))
    const viewKey = computed(() => unref(selectedView) ?? '')
    const key = computed(
        () => `transactions:${scope}:${viewKey.value}:${fromKey.value}:${toKey.value}`
    )

    const {
        data: transactions,
        refresh,
        pending,
    } = useAsyncData<Transaction[]>(
        key,
        async () => {
            const { data, error } = await supabase
                .from('transactions')
                .select(
                    `
                    *,
                    type:transaction_types(id, name),
                    category:transaction_categories(id, name)
                `
                )
                .gte('created_at', fromIso.value)
                .lte('created_at', toIso.value)
                .order('created_at', { ascending: false })
                .limit(300)

            if (error) return []

            return data as Transaction[]
        },
        {
            default: () => [],
            watch: [fromKey, toKey, viewKey],
        }
    )

    const stats = computed(() => {
        return transactions.value.reduce(
            (acc, t) => {
                if (t.type.name === 'Income') {
                    acc.income.push(t)
                    acc.incomeTotal += t.amount ?? 0
                    acc.incomeCount += 1
                } else if (t.type.name === 'Expense') {
                    acc.expense.push(t)
                    acc.expenseTotal += t.amount ?? 0
                    acc.expenseCount += 1
                    if (t.category?.name === 'Saving') {
                        acc.savingTotal += t.amount ?? 0
                    } else if (t.category?.name === 'Investment') {
                        acc.investmentTotal += t.amount ?? 0
                    }
                }
                return acc
            },
            {
                income: [] as Transaction[],
                expense: [] as Transaction[],
                incomeTotal: 0,
                expenseTotal: 0,
                investmentTotal: 0,
                savingTotal: 0,
                incomeCount: 0,
                expenseCount: 0,
            }
        )
    })

    const income = computed(() => stats.value.income)
    const expense = computed(() => stats.value.expense)

    const incomeCount = computed(() => stats.value.incomeCount)
    const expenseCount = computed(() => stats.value.expenseCount)

    const incomeTotal = computed(() => stats.value.incomeTotal)
    const expenseTotal = computed(() => stats.value.expenseTotal)

    const investmentTotal = computed(() => stats.value.investmentTotal)
    const savingTotal = computed(() => stats.value.savingTotal)

    const transactionsGroupByDate = computed(() => {
        const grouped: GroupedTransactions = {}

        for (const transaction of transactions.value) {
            const date = transaction.created_at.slice(0, 10) as DateKey

            if (!grouped[date]) {
                grouped[date] = []
            }

            grouped[date].push(transaction)
        }

        return grouped
    })

    return {
        transactions: {
            all: transactions,
            grouped: {
                byDate: transactionsGroupByDate,
            },
            income,
            expense,
            incomeCount,
            expenseCount,
            incomeTotal,
            expenseTotal,
            investmentTotal,
            savingTotal,
        },
        pending,
        refresh,
    }
}
