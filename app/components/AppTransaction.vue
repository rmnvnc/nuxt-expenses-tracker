<script lang="ts" setup>
import type { Database } from '~/types/database.types'

type Transaction = Database['public']['Tables']['transactions']['Row']

const supabase = useSupabaseClient<Database>()

const props = defineProps<{
    transaction: Transaction
}>()

const emit = defineEmits(['deleted'])

const { currency } = useCurrency(props.transaction.amount)

const isIncome = computed(() => props.transaction.type === 'Income')

const isLoading = ref(false)

const toast = useToast()

const deleteTransaction = async () => {
    isLoading.value = true
    try {
        await supabase.from('transactions').delete().eq('id', props.transaction.id)

        toast.add({
            title: 'Transaction deleted',
            icon: 'heroicons:check-solid',
            color: 'success',
        })

        emit('deleted', props.transaction.id)
    } catch {
        toast.add({
            title: 'Transaction delete failed',
            icon: 'heroicons:exclamation-circle',
            color: 'error',
        })
    } finally {
        isLoading.value = false
    }
}

const items = [
    [
        {
            label: 'Edit',
            icon: 'heroicons:pencil-square',
            onSelect() {
                console.log('Edit')
            },
        },
        {
            label: 'Delete',
            icon: 'heroicons:x-mark',
            onSelect() {
                deleteTransaction()
            },
        },
    ],
]

const icon = computed(() =>
    isIncome.value ? 'heroicons:arrow-trending-up' : 'heroicons:arrow-trending-down'
)

const iconColor = computed(() => (isIncome.value ? 'green' : 'red'))
</script>

<template>
    <div
        class="grid grid-cols-3 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100"
    >
        <div class="flex items-center justify-between space-x-4 col-span-2">
            <div class="flex items-center space-x-1">
                <UIcon
                    :name="icon"
                    class="w-6 h-6"
                    :class="iconColor"
                />
                <div>{{ transaction.description }}</div>
            </div>
            <div>
                <UBadge
                    v-if="transaction.category"
                    color="neutral"
                    >{{ transaction.category }}</UBadge
                >
            </div>
        </div>
        <div class="flex items-center justify-end space-x-2">
            <div>{{ currency }}</div>
            <div>
                <UDropdownMenu :items="items">
                    <UButton
                        icon="heroicons:ellipsis-vertical-16-solid"
                        color="neutral"
                        variant="ghost"
                        :loading="isLoading"
                    />
                </UDropdownMenu>
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
