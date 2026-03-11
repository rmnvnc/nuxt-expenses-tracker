<script lang="ts" setup>
import { categoryStyleMap, variantStyleMap } from '~/constants'
import type { Database } from '~/types/database.types'
import type { Transaction } from '~/types/transaction.types'

const supabase = useSupabaseClient<Database>()

const props = defineProps<{
    transaction: Transaction
}>()

const emit = defineEmits(['deleted'])

const { currency } = useCurrency(computed(() => props.transaction.amount ?? 0))

// const isIncome = computed(() => props.transaction.type.name === 'Income')
const transactionStyle = computed(() => variantStyleMap[props.transaction.type.name])
const categoryStyle = computed(() =>
    props.transaction.category?.name ? categoryStyleMap[props.transaction.category.name] : undefined
)
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
        // {
        //     label: 'Edit',
        //     icon: 'ph:note-pencil',
        //     onSelect() {
        //         console.log('Edit')
        //     },
        // },
        {
            label: 'Delete',
            icon: 'ph:trash',
            onSelect() {
                deleteTransaction()
            },
        },
    ],
]

const icon = computed(() => transactionStyle.value.icon)
const iconColor = computed(() => transactionStyle.value.text)

const textColor = computed(() =>
    props.transaction.type.name === 'Income' ? 'text-income' : 'text-expense'
)
</script>

<template>
    <div class="grid grid-cols-3 py-4 ml-8">
        <div class="flex items-center justify-between space-x-4 col-span-2">
            <div class="flex items-center space-x-1">
                <div class="flex mr-2">
                    <UIcon
                        :name="icon"
                        class="w-5 h-5"
                        :class="iconColor"
                    />
                </div>
                <UBadge
                    v-if="categoryStyle"
                    size="lg"
                    :icon="categoryStyle.icon"
                    class="rounded-full gap-2"
                    :class="[categoryStyle.text, categoryStyle.bg]"
                    >{{ transaction.category?.name }}</UBadge
                >
            </div>
        </div>
        <div class="flex items-center justify-end space-x-2">
            <span
                class="amount"
                :class="textColor"
                ><template v-if="transaction.type.name != 'Income'">-</template>{{ currency }}</span
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
