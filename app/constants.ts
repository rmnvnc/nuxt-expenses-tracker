const TRANSACTION_VIEW_OPTIONS = ['Yearly', 'Monthly', 'Daily'] as const

export type TransactionViewOption = (typeof TRANSACTION_VIEW_OPTIONS)[number]
export const transactionViewOptionsTuple = TRANSACTION_VIEW_OPTIONS
export const transactionViewOptionDefault: TransactionViewOption = 'Monthly'
export const transactionViewOptions: TransactionViewOption[] = [...TRANSACTION_VIEW_OPTIONS]

export const TRANSACTION_TYPES = {
    INCOME: 'Income',
    EXPENSE: 'Expense',
    SAVING: 'Saving',
    INVESTMENT: 'Investment',
} as const

export const TRANSACTION_CATEGORIES = {
    FOOD: 'Food',
    HOUSING: 'Housing',
    CAR: 'Car',
    ENTERTAINMENT: 'Entertainment',
} as const
