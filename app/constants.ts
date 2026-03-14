import type { TransactionCategoryName, TransactionTypeName } from '~/types/transaction.types'

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
    SUBSCRIPTIONS: 'Subscriptions',
    RESTAURANT: 'Restaurant',
    UTILITIES: 'Utilities',
    HEALTH: 'Health',
    SHOPPING: 'Shopping',
    TRAVEL: 'Travel',
    EDUCATION: 'Education',
    ENTERTAINMENT: 'Entertainment',
    SPORT: 'Sport',
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

export const categoryStyleMap: Record<
    TransactionCategoryName,
    { text: string; bg: string; icon: string }
> = {
    Food: {
        text: 'text-cat-food',
        bg: 'bg-cat-food-soft',
        icon: 'ph:fork-knife-fill',
    },
    Housing: {
        text: 'text-cat-housing',
        bg: 'bg-cat-housing-soft',
        icon: 'ph:house-fill',
    },
    Car: {
        text: 'text-cat-car',
        bg: 'bg-cat-car-soft',
        icon: 'ph:car-fill',
    },
    Entertainment: {
        text: 'text-cat-entertainment',
        bg: 'bg-cat-entertainment-soft',
        icon: 'ph:popcorn-fill',
    },
    Health: {
        text: 'text-cat-health',
        bg: 'bg-cat-health-soft',
        icon: 'ph:heart-fill',
    },
    Shopping: {
        text: 'text-cat-shopping',
        bg: 'bg-cat-shopping-soft',
        icon: 'ph:shopping-bag-fill',
    },
    Travel: {
        text: 'text-cat-travel',
        bg: 'bg-cat-travel-soft',
        icon: 'ph:airplane-fill',
    },
    Education: {
        text: 'text-cat-education',
        bg: 'bg-cat-education-soft',
        icon: 'ph:graduation-cap-fill',
    },
    Utilities: {
        text: 'text-cat-utilities',
        bg: 'bg-cat-utilities-soft',
        icon: 'ph:lightning-fill',
    },
    Sport: {
        text: 'text-cat-sport',
        bg: 'bg-cat-sport-soft',
        icon: 'ph:barbell-fill',
    },
    Restaurant: {
        text: 'text-cat-restaurant',
        bg: 'bg-cat-restaurant-soft',
        icon: 'ph:cooking-pot-fill',
    },
    Subscriptions: {
        text: 'text-cat-subscriptions',
        bg: 'bg-cat-subscriptions-soft',
        icon: 'ph:repeat-fill',
    },
}
