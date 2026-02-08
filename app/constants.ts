// Single source of truth - define values ONCE
const TRANSACTION_VIEW_OPTIONS = ['Yearly', 'Monthly', 'Daily'] as const
const TRANSACTION_CATEGORIES = ['Food', 'Housing', 'Car', 'Entertainment'] as const
const TRANSACTION_TYPES = ['Income', 'Expense', 'Saving', 'Investment'] as const

// Derive types from the constants (not the other way around!)
export type TransactionViewOption = (typeof TRANSACTION_VIEW_OPTIONS)[number]
export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number]
export type TransactionType = (typeof TRANSACTION_TYPES)[number]

// For Zod schemas - export the readonly tuples directly
export const transactionViewOptionsTuple = TRANSACTION_VIEW_OPTIONS
export const transactionCategoriesTuple = TRANSACTION_CATEGORIES
export const transactionTypesTuple = TRANSACTION_TYPES

// For UI components - create mutable copies
export const transactionViewOptions: TransactionViewOption[] = [...TRANSACTION_VIEW_OPTIONS]
export const transactionCategories: TransactionCategory[] = [...TRANSACTION_CATEGORIES]
export const transactionTypes: TransactionType[] = [...TRANSACTION_TYPES]
