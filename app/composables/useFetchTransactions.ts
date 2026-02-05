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

    const income = computed(() => transactions.value.filter((t) => t.type === 'Income'))
    const expense = computed(() => transactions.value.filter((t) => t.type === 'Expense'))

    const incomeCount = computed(() => income.value.length)
    const expenseCount = computed(() => expense.value.length)

    const incomeTotal = computed(() =>
        income.value.reduce((sum, transaction) => sum + (transaction.amount ?? 0), 0)
    )

    const expenseTotal = computed(() =>
        expense.value.reduce((sum, transaction) => sum + (transaction.amount ?? 0), 0)
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
