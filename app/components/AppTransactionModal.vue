<script setup lang="ts">
import type { FormSubmitEvent, FormErrorEvent } from '@nuxt/ui'
import { transactionCategories, transactionTypes } from '~/constants'
import * as z from 'zod'

type Schema = z.output<typeof schema>

const isOpen = defineModel<boolean>('isOpen', { required: true })

const defaultSchema = z.object({
    type: z.enum(transactionTypes),
    amount: z.number().positive('Amount needs to be more than 0'),
    created_at: z.string(),
    description: z.string().optional(),
})

const incomeSchema = z.object({
    type: z.literal('Income'),
})
const expenseSchema = z.object({
    type: z.literal('Expense'),
    category: z.enum(transactionCategories),
})
const investmentSchema = z.object({
    type: z.literal('Investment'),
})
const savingSchema = z.object({
    type: z.literal('Saving'),
})

const schema = z.intersection(
    z.discriminatedUnion('type', [incomeSchema, expenseSchema, investmentSchema, savingSchema]),
    defaultSchema
)

const initialState = {
    type: undefined,
    amount: 0,
    created_at: undefined,
    description: undefined,
    category: undefined,
}

const state = ref({
    ...initialState,
})

const resetForm = () => {
    Object.assign(state.value, initialState)
}

watch(isOpen, (newValue) => {
    if (newValue) {
        resetForm()
    }
})

function onError(event: FormErrorEvent) {
    console.log('Form errors:', event)
    console.log('Errors object:', event.errors)
}

const isLoading = ref(false)
const emit = defineEmits(['saved'])

const supabase = useSupabaseClient()
const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
    isLoading.value = true

    const { error } = await supabase.from('transactions').upsert({ ...event.data })

    if (error) {
        toast.add({
            title: 'Transaction not saved',
            description: error.message,
            icon: 'heroicons:x-circle',
            color: 'error',
        })
        isLoading.value = false
        return
    }

    toast.add({ title: 'Transaction saved', icon: 'heroicons:check-circle' })
    isOpen.value = false
    emit('saved')
    isLoading.value = false
}
</script>

<template>
    <UModal
        v-model:open="isOpen"
        title="Add transaction"
        description="Modal for adding transactions"
        scrollable
    >
        <template #content>
            <UCard>
                <template #header>
                    <h3>Title</h3>
                </template>
                <UForm
                    :state="state"
                    :schema="schema"
                    @error="onError"
                    @submit="onSubmit"
                >
                    <UFormField
                        label="Transaction type"
                        name="type"
                        class="mb-4"
                        :required="true"
                    >
                        <USelect
                            v-model="state.type"
                            :items="transactionTypes"
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
                            icon="heroicons:calendar-days"
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
                        v-if="state.type === 'Expense'"
                        label="Category"
                        class="mb-4"
                        :required="true"
                        name="category"
                    >
                        <USelect
                            v-model="state.category"
                            :items="transactionCategories"
                            :ui="{ content: 'min-w-fit' }"
                        />
                    </UFormField>
                    <UButton
                        class="mt-4"
                        type="submit"
                        :loading="isLoading"
                        >Submit</UButton
                    >
                </UForm>
            </UCard>
        </template>
    </UModal>
</template>
