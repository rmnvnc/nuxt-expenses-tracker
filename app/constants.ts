import type { TransactionTypeName } from '~/types/transaction.types'

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

export const variantStyleMap: Record<
    TransactionTypeName,
    { text: string; bg: string; border: string; icon: string }
> = {
    Income: {
        text: 'text-income',
        bg: 'bg-income-soft',
        border: 'ring-income-border',
        icon: 'ph:arrow-up-bold',
    },
    Expense: {
        text: 'text-expense',
        bg: 'bg-expense-soft',
        border: 'ring-expense-border',
        icon: 'ph:arrow-down-bold',
    },
    Saving: {
        text: 'text-saving',
        bg: 'bg-saving-soft',
        border: 'ring-saving-border',
        icon: 'ph:piggy-bank-bold',
    },
    Investment: {
        text: 'text-investment',
        bg: 'bg-investment-soft',
        border: 'ring-investment-border',
        icon: 'ph:chart-line-up-bold',
    },
}
