<script setup lang="ts">
import type { TransactionType, TransactionTypeName } from '~/types/transaction.types'
import { variantStyleMap } from '~/constants'

const props = defineProps<{
    items: TransactionType[]
}>()

const modelValue = defineModel<TransactionType['id'] | undefined>({ required: true })

const { emitFormChange, emitFormInput, emitFormBlur, id } = useFormField()

function selectValue(value: TransactionType['id']) {
    modelValue.value = value
    emitFormInput()
    emitFormChange()
}

const getVariant = (name: TransactionTypeName) => variantStyleMap[name]
</script>

<template>
    <div
        :id="id"
        class="grid grid-cols-2 gap-4"
    >
        <button
            v-for="item in props.items"
            :key="item.id"
            type="button"
            :class="[
                'rounded-lg p-2 text-left ring-1 transition cursor-pointer',
                getVariant(item.name).bg,
                modelValue === item.id
                    ? ['ring-2 shadow-sm', getVariant(item.name).border]
                    : 'ring-default/50 hover:ring-default opacity-30',
            ]"
            @click="selectValue(item.id)"
            @blur="emitFormBlur"
        >
            <div class="flex items-center align-middle gap-2">
                <div class="size-8 items-center justify-center flex">
                    <UIcon
                        :name="getVariant(item.name).icon"
                        class="size-6"
                        :class="getVariant(item.name).text"
                    />
                </div>
                <div
                    class="font-semibold"
                    :class="getVariant(item.name).text"
                >
                    {{ item.name }}
                </div>
            </div>
        </button>
    </div>
</template>
