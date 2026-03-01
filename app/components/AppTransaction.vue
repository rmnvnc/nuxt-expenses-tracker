<script lang="ts" setup>
import type { Database } from '~/types/database.types'

type Transaction = Database['public']['Tables']['transactions']['Row']

const supabase = useSupabaseClient<Database>()

const props = defineProps<{
    transaction: Transaction
}>()

const emit = defineEmits(['deleted'])

const { currency } = useCurrency(computed(() => props.transaction.amount ?? 0))

const isIncome = computed(() => props.transaction.type === 'Income')

const isLoading = ref(false)

const { toastError, toastSuccess } = useAppToast()

const deleteTransaction = async () => {
    isLoading.value = true
    try {
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', props.transaction.id)

        if (error) throw error

        toastSuccess({
            title: 'Transaction deleted',
        })

        emit('deleted', props.transaction.id)
    } catch (error) {
        toastError({
            title: 'Transaction delete failed',
            description: (error as Error).message,
        })
    } finally {
        isLoading.value = false
    }
}

const items = [
    [
        {
            label: 'Edit',
            icon: 'ph:note-pencil',
            onSelect() {
                console.log('Edit')
            },
        },
        {
            label: 'Delete',
            icon: 'ph:trash',
            onSelect() {
                deleteTransaction()
            },
        },
    ],
]

const icon = computed(() => (isIncome.value ? 'ph:arrow-up-bold' : 'ph:arrow-down-bold'))

const textColor = computed(() => (isIncome.value ? 'text-income' : 'text-expense'))
</script>

<template>
    <div class="grid grid-cols-3 py-4 border-b border-default">
        <div class="flex items-center justify-between space-x-4 col-span-2">
            <div class="flex items-center space-x-1">
                <div class="flex">
                    <UIcon
                        :name="icon"
                        class="w-6 h-6"
                        :class="textColor"
                    />
                </div>
                <p>{{ transaction.description }}</p>
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
            <span
                class="amount"
                :class="textColor"
                ><template v-if="!isIncome">-</template>{{ currency }}</span
            >
            <div>
                <UDropdownMenu :items="items">
                    <UButton
                        icon="ph:dots-three-outline-vertical-fill"
                        color="neutral"
                        variant="ghost"
                        :loading="isLoading"
                    />
                </UDropdownMenu>
            </div>
        </div>
    </div>
</template>
