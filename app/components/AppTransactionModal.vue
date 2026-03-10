<script setup lang="ts">
import type { FormSubmitEvent, FormErrorEvent } from '@nuxt/ui'
import type { Database } from '~/types/database.types'
import type { TransactionType, TransactionCategory } from '~/types/transaction.types'
import * as z from 'zod'

const supabase = useSupabaseClient<Database>()
const { toastError, toastSuccess } = useAppToast()

const isOpen = defineModel<boolean>('isOpen', { required: true })

const { types, categories } = useTransactionLookups()

const expenseTypeId = computed(() => types.value?.find((t) => t.name === 'Expense')?.id)

const isExpense = computed(() => state.value.type_id === expenseTypeId.value)

const buildSchema = (isExpense: boolean) =>
    z.object({
        type_id: z.number({ error: 'Select a transaction type' }),
        amount: z.number().positive('Amount needs to be more than 0'),
        created_at: z.string({ error: 'Insert transaction date' }),
        description: z.string().optional(),
        category_id: isExpense ? z.number({ error: 'Select a category' }) : z.number().optional(),
    })

type Schema = z.output<ReturnType<typeof buildSchema>>

const schema = computed(() => buildSchema(isExpense.value))

type FormState = {
    type_id: TransactionType['id'] | undefined
    category_id: TransactionCategory['id'] | undefined
    amount: number
    created_at: string | undefined
    description: string | undefined
}

const initialState: FormState = {
    type_id: undefined,
    category_id: undefined,
    amount: 0,
    created_at: undefined,
    description: undefined,
}

const state = ref<FormState>({ ...initialState })

const resetForm = () => {
    Object.assign(state.value, initialState)
}

watch(isOpen, () => resetForm())

watch(
    () => state.value.type_id,
    () => {
        if (!isExpense.value) {
            state.value.category_id = undefined
        }
    }
)

function onError(event: FormErrorEvent) {
    console.log('Form errors:', event.errors)
}

const isLoading = ref(false)
const emit = defineEmits(['saved'])

async function onSubmit(event: FormSubmitEvent<Schema>) {
    isLoading.value = true

    const { error } = await supabase.from('transactions').insert({
        type_id: event.data.type_id,
        category_id: event.data.category_id ?? null,
        amount: event.data.amount,
        created_at: event.data.created_at,
        description: event.data.description ?? null,
    })

    if (error) {
        toastError({
            title: 'Transaction not saved',
            description: error.message,
        })
        isLoading.value = false
        return
    }

    toastSuccess({ title: 'Transaction saved' })
    isOpen.value = false
    emit('saved')
    isLoading.value = false
}
</script>

<template>
    <UModal
        v-model:open="isOpen"
        title="Add transaction"
        scrollable
    >
        <template #body>
            <UForm
                :state="state"
                :schema="schema"
                @error="onError"
                @submit="onSubmit"
            >
                <UFormField
                    label="Transaction type"
                    name="type_id"
                    class="mb-4"
                    :required="true"
                >
                    <USelect
                        v-model="state.type_id"
                        :items="
                            (types ?? []).map((t: TransactionType) => ({
                                label: t.name,
                                value: t.id,
                            }))
                        "
                        :ui="{ content: 'min-w-fit' }"
                        placeholder="Select the transaction type"
                    />
                </UFormField>

                <UFormField
                    label="Amount"
                    :required="true"
                    name="amount"
                    class="mb-4"
                >
                    <UInput
                        v-model.number="state.amount"
                        type="number"
                        placeholder="Amount"
                    />
                </UFormField>

                <UFormField
                    label="Transaction date"
                    :required="true"
                    name="created_at"
                    class="mb-4"
                >
                    <UInput
                        v-model="state.created_at"
                        type="date"
                        placeholder="Transaction date"
                        trailing-icon="ph:calendar-blank"
                    />
                </UFormField>

                <UFormField
                    label="Description"
                    name="description"
                    class="mb-4"
                    hint="Optional"
                >
                    <UInput
                        v-model="state.description"
                        placeholder="Description"
                    />
                </UFormField>

                <UFormField
                    v-if="isExpense"
                    label="Category"
                    class="mb-4"
                    :required="true"
                    name="category_id"
                >
                    <USelect
                        v-model="state.category_id"
                        :items="
                            (categories ?? []).map((c: TransactionCategory) => ({
                                label: c.name,
                                value: c.id,
                            }))
                        "
                        :ui="{ content: 'min-w-fit' }"
                        placeholder="Select a category"
                    />
                </UFormField>

                <UButton
                    class="mt-4"
                    type="submit"
                    :loading="isLoading"
                >
                    Submit
                </UButton>
            </UForm>
        </template>
    </UModal>
</template>
