<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import type { FormSubmitEvent, FormErrorEvent } from '@nuxt/ui'
import type { Database } from '~/types/database.types'
import type {
    TransactionType,
    TransactionCategory,
    TransactionCategoryName,
} from '~/types/transaction.types'
import AppTransactionTypePicker from './AppTransactionTypePicker.vue'
import { today, getLocalTimeZone, type DateValue } from '@internationalized/date'
import { categoryStyleMap } from '~/constants'
import * as z from 'zod'

const supabase = useSupabaseClient<Database>()
const { toastError, toastSuccess } = useAppToast()

const isOpen = ref(false)

const { types, categories } = useTransactionLookups()

const expenseTypeId = computed(() => types.value?.find((t) => t.name === 'Expense')?.id)

const isExpense = computed(() => state.value.type_id === expenseTypeId.value)

const buildSchema = (isExpense: boolean) =>
    z.object({
        type_id: z.number({ error: 'Select a transaction type' }),
        amount: z.number('Enter an amount').positive('Amount needs to be more than 0'),
        created_at: z.string({ error: 'Insert transaction date' }),
        description: z.string().optional(),
        category_id: isExpense ? z.number({ error: 'Select a category' }) : z.number().optional(),
    })

type Schema = z.output<ReturnType<typeof buildSchema>>

const schema = computed(() => buildSchema(isExpense.value))
const datePickerValue = ref(today(getLocalTimeZone())) as Ref<DateValue>
const inputDate = useTemplateRef('inputDate')

type FormState = {
    type_id: TransactionType['id'] | undefined
    category_id: TransactionCategory['id'] | undefined
    amount: number | undefined
    created_at: string | undefined
    description: string | undefined
}

const defaultTypeId = computed(() => types.value?.find((t) => t.name === 'Expense')?.id)

const initialState = (): FormState => ({
    type_id: defaultTypeId.value,
    category_id: undefined,
    amount: undefined,
    created_at: today(getLocalTimeZone()).toString(),
    description: undefined,
})

const state = ref<FormState>(initialState())

const resetForm = () => {
    state.value = initialState()
    datePickerValue.value = today(getLocalTimeZone())
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

watch(
    datePickerValue,
    (val) => {
        state.value.created_at = val.toString()
    },
    { immediate: true }
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

const categoryItems = computed(() =>
    (categories.value ?? []).map((c: TransactionCategory) => ({
        label: c.name,
        value: c.id,
        icon: categoryStyleMap[c.name as TransactionCategoryName]?.icon,
        color: categoryStyleMap[c.name as TransactionCategoryName]?.text,
    }))
)

const selectedCategory = computed(() =>
    categoryItems.value.find((c) => c.value === state.value.category_id)
)

const isLargeScreen = useMediaQuery('(max-width: 768px)')
</script>

<template>
    <UModal
        v-model:open="isOpen"
        scrollable
        :fullscreen="isLargeScreen"
    >
        <UButton
            icon="ph:plus-circle"
            color="primary"
            label="Add"
            size="xl"
            class="fixed bottom-6 right-4 z-10 md:static"
            :ui="{ leadingIcon: 'size-10' }"
            @click="isOpen = true"
        />
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
                    <AppTransactionTypePicker
                        v-model="state.type_id"
                        :items="types ?? []"
                    />
                </UFormField>

                <UFormField
                    label="Amount"
                    :required="true"
                    name="amount"
                    class="mb-4"
                >
                    <UInputNumber
                        v-model="state.amount"
                        autofocus
                        size="xl"
                        class="w-full"
                        :ui="{ base: 'text-4xl text-right' }"
                        :increment="false"
                        :decrement="false"
                        :step="0.01"
                        locale="sk-SK"
                        :format-options="{
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                        }"
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
                        :items="categoryItems"
                        size="xl"
                        :ui="{ content: 'min-w-fit' }"
                        placeholder="Select a category"
                    >
                        <template #leading>
                            <UIcon
                                v-if="selectedCategory"
                                :name="selectedCategory.icon"
                                :class="selectedCategory.color"
                            />
                        </template>
                        <template #item-leading="{ item }">
                            <UIcon
                                :name="item.icon"
                                :class="item.color"
                                class="size-5 self-center"
                            />
                        </template>
                    </USelect>
                </UFormField>
                <UFormField
                    label="Transaction date"
                    :required="true"
                    name="created_at"
                    class="mb-4"
                >
                    <UInputDate
                        ref="inputDate"
                        v-model="datePickerValue"
                        size="xl"
                    >
                        <template #trailing>
                            <UPopover :reference="inputDate?.inputsRef[3]?.$el">
                                <UButton
                                    color="neutral"
                                    variant="link"
                                    size="sm"
                                    icon="i-lucide-calendar"
                                    aria-label="Select a date"
                                    class="px-0"
                                />

                                <template #content>
                                    <UCalendar
                                        v-model="datePickerValue"
                                        class="p-2"
                                    />
                                </template>
                            </UPopover>
                        </template>
                    </UInputDate>
                </UFormField>

                <UFormField
                    label="Description"
                    name="description"
                    class="mb-4"
                    hint="Optional"
                >
                    <UTextarea
                        v-model="state.description"
                        class="w-full"
                        placeholder="Description"
                        :rows="2"
                    />
                </UFormField>

                <UButton
                    class="mt-4 py-4"
                    size="xl"
                    type="submit"
                    block
                    :loading="isLoading"
                >
                    Submit
                </UButton>
            </UForm>
        </template>
    </UModal>
</template>
