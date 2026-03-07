import type { Database } from '~/types/database.types'
import type { TransactionType, TransactionCategory } from '~/types/transaction.types'

export const useTransactionLookups = () => {
    const supabase = useSupabaseClient<Database>()

    const { data: types } = useAsyncData<TransactionType[]>(
        'transaction-types',
        async () => {
            const { data } = await supabase.from('transaction_types').select('*')
            return (data ?? []) as TransactionType[]
        },
        { default: () => [] as TransactionType[] }
    )

    const { data: categories } = useAsyncData<TransactionCategory[]>(
        'transaction-categories',
        async () => {
            const { data } = await supabase.from('transaction_categories').select('*')
            return (data ?? []) as TransactionCategory[]
        },
        { default: () => [] as TransactionCategory[] }
    )

    return { types, categories }
}
