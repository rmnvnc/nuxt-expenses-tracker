import type { Database } from '~/types/database.types'

type Transaction = Database['public']['Tables']['transactions']['Row']
type DateKey = `${number}-${number}-${number}`
type GroupedTransactions = Record<DateKey, Transaction[]>

export const useFetchTransactions = () => {
    const supabase = useSupabaseClient<Database>()

    const {
        data: transactions,
        refresh,
        pending,
    } = useAsyncData<Transaction[]>(
        'transactions',
        async () => {
            const { data, error } = await supabase
                .from('transactions')
                .select()
                .limit(100)
                .order('created_at', { ascending: false })

            if (error) return []

            return data
        },
        { default: () => [] }
    )

    const stats = computed(() => {
        return transactions.value.reduce(
            (acc, t) => {
                if (t.type === 'Income') {
                    acc.income.push(t)
                    acc.incomeTotal += t.amount ?? 0
                    acc.incomeCount += 1
                } else if (t.type === 'Expense') {
                    acc.expense.push(t)
                    acc.expenseTotal += t.amount ?? 0
                    acc.expenseCount += 1
                }
                return acc
            },
            {
                income: [] as Transaction[],
                expense: [] as Transaction[],
                incomeTotal: 0,
                expenseTotal: 0,
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
        },
        pending,
        refresh,
    }
}
