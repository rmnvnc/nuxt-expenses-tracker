import type { Tables } from '~/types/database.types'
import type { TRANSACTION_TYPES, TRANSACTION_CATEGORIES } from '~/constants'

export type TransactionTypeName = (typeof TRANSACTION_TYPES)[keyof typeof TRANSACTION_TYPES]
export type TransactionCategoryName =
    (typeof TRANSACTION_CATEGORIES)[keyof typeof TRANSACTION_CATEGORIES]

export type TransactionRow = Tables<'transactions'>
export type TransactionType = Omit<Tables<'transaction_types'>, 'name'> & {
    name: TransactionTypeName
}
export type TransactionCategory = Omit<Tables<'transaction_categories'>, 'name'> & {
    name: TransactionCategoryName
}
export type Transaction = TransactionRow & {
    type: TransactionType
    category: TransactionCategory | null
}
