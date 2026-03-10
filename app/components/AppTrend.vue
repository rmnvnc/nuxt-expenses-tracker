<script lang="ts" setup>
import type { TransactionTypeName } from '~/types/transaction.types'

import { variantStyleMap } from '~/constants'

interface Props {
    title?: string
    amount?: number
    lastAmount?: number
    loading?: boolean
    variant?: TransactionTypeName
}

const props = withDefaults(defineProps<Props>(), {
    title: '',
    amount: 0,
    lastAmount: 0,
    loading: false,
    variant: 'Income',
})

const currentStyle = computed(() => variantStyleMap[props.variant])
const textColor = computed(() => currentStyle.value.text)
const bgColor = computed(() => currentStyle.value.bg)
const borderColor = computed(() => currentStyle.value.border)

const trend = computed<'up' | 'down' | 'same' | 'none'>(() => {
    if (props.lastAmount === 0) return 'none'
    if (props.amount > props.lastAmount) return 'up'
    if (props.amount < props.lastAmount) return 'down'
    return 'same'
})

const trendColor = computed(() => {
    switch (trend.value) {
        case 'up':
            return 'text-income'
        case 'down':
            return 'text-expense'
        case 'same':
        case 'none':
            return 'text-muted2'
        default:
            return 'text-muted2'
    }
})

const icon = computed(() => {
    switch (trend.value) {
        case 'up':
            return 'ph:arrow-up-bold'
        case 'down':
            return 'ph:arrow-down-bold'
        case 'same':
            return 'ph:equals-bold'
        case 'none':
            return 'ph:minus-bold'
        default:
            return 'ph:minus-bold'
    }
})

const trendLabel = computed(() => {
    if (trend.value === 'none') return 'No previous data'
    if (trend.value === 'same') return 'No change vs last period'

    const change = ((props.amount - props.lastAmount!) / props.lastAmount!) * 100
    const roundedChange = Math.abs(Math.round(change))

    return `${roundedChange}% vs last period`
})

const { currency } = useCurrency(toRef(() => props.amount))
</script>

<template>
    <UCard :class="[bgColor, borderColor]">
        <p class="label mb-2">
            {{ title }}
        </p>
        <div
            class="text-2xl amount mb-2"
            :class="textColor"
        >
            <USkeleton
                v-if="loading"
                class="h-8 w-full"
            />
            <div v-else>{{ currency }}</div>
        </div>
        <div>
            <USkeleton
                v-if="loading"
                class="h-[27px] w-full"
            />
            <div
                v-else
                class="flex space-x-1 items-center"
            >
                <UIcon
                    :name="icon"
                    class="w-4 h-4"
                    :class="trendColor"
                />
                <p>{{ trendLabel }}</p>
            </div>
        </div>
    </UCard>
</template>
