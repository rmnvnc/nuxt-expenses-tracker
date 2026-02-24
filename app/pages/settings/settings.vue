<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { transactionViewOptionDefault, transactionViewOptions } from '~/constants'

const { toastError, toastSuccess } = useAppToast()
const supabase = useSupabaseClient()
const { profile, refreshUser } = useUser()

const schema = z.object({
    transactionView: z.enum(transactionViewOptions),
})

type Schema = z.output<typeof schema>

const state = ref({
    transactionView:
        profile.value?.user_metadata.preference?.transaction_view ?? transactionViewOptionDefault,
})

const pending = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
    pending.value = true

    try {
        console.log(event.data)
        const { error } = await supabase.auth.updateUser({
            data: {
                preference: {
                    transaction_view: state.value.transactionView,
                },
            },
        })

        if (error) {
            throw error
        }

        await refreshUser()

        toastSuccess({
            title: 'Success',
            description: 'Your profile has been updated.',
        })
    } catch (error: unknown) {
        toastError({
            title: 'Error updating profile',
            description: error instanceof Error ? error.message : 'Unknown error',
        })
    } finally {
        pending.value = false
    }
}
</script>

<template>
    <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
    >
        <UFormField
            label="Transaction view"
            name="transactionVie"
        >
            <USelect
                v-model="state.transactionView"
                :items="transactionViewOptions"
            />
        </UFormField>

        <UButton
            type="submit"
            :loading="pending"
        >
            Save
        </UButton>
    </UForm>
</template>
