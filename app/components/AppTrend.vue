<script lang="ts" setup>
const props = defineProps({
    title: { type: String, default: '' },
    amount: { type: Number, default: 0 },
    lastAmount: { type: Number, default: 0 },
    color: { type: String, default: '' },
    loading: { type: Boolean, default: false },
})

const trendingUp = computed(() => props.amount >= props.lastAmount)
const icon = computed(() =>
    trendingUp.value ? 'heroicons:arrow-trending-up' : 'heroicons:arrow-trending-down'
)
const { currency } = useCurrency(toRef(props, 'amount'))

const percentageTrend = computed(() => {
    if (props.amount === 0 || props.lastAmount === 0) return ''

    const bigger = Math.max(props.amount, props.lastAmount)
    const lower = Math.min(props.amount, props.lastAmount)

    const ratio = ((bigger - lower) / lower) * 100

    return `${Math.ceil(ratio)} %`
})
</script>

<template>
    <div>
        <div
            class="font-bold"
            :class="{ green: trendingUp, red: !trendingUp }"
        >
            {{ title }}
        </div>
        <div class="text-2xl font-extrabold text-black dark:text-white mb-2">
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
                class="flex space-x-1 items-center"
            >
                <UIcon
                    :name="icon"
                    class="w-6 h-6"
                    :class="{ green: trendingUp, red: !trendingUp }"
                />
                <div class="text-gray-500 dark:text-gray-400">
                    {{ percentageTrend }} vs last period
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
@reference "@/assets/css/main.css";

.green {
    @apply text-green-600 dark:text-green-400;
}
.red {
    @apply text-red-600 dark:text-red-400;
}
</style>
