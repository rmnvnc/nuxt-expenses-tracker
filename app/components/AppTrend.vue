<script lang="ts" setup>
interface Props {
    title?: string
    amount?: number
    lastAmount?: number
    loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    title: '',
    amount: 0,
    lastAmount: 0,
    loading: false,
})

const trendingUp = computed(() => props.amount >= props.lastAmount)
const icon = computed(() => (trendingUp.value ? 'ph:arrow-up-bold' : 'ph:arrow-down-bold'))
const { currency } = useCurrency(toRef(() => props.amount))

const percentageTrend = computed(() => {
    if (props.lastAmount === 0) return 'N/A'

    const change = ((props.amount - props.lastAmount) / props.lastAmount) * 100

    return `${Math.abs(Math.round(change))}%`
})

const textColor = computed(() => (trendingUp.value ? 'text-income' : 'text-expense'))
</script>

<template>
    <div>
        <p class="label">
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
                class="h-6 w-full"
            />
            <div
                v-else
                class="flex space-x-1"
            >
                <UIcon
                    :name="icon"
                    class="w-6 h-6"
                    :class="textColor"
                />
                <p>{{ percentageTrend }} vs last period</p>
            </div>
        </div>
    </div>
</template>
