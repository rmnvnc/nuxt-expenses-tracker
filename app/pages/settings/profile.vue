<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const { toastError, toastSuccess } = useAppToast()
const supabase = useSupabaseClient()
const { profile, refreshUser } = useUser()

const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
    email: z.email('Invalid email'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({ name: undefined, email: undefined })

const hydrateUser = () => {
    state.name = profile.value?.user_metadata?.full_name ?? undefined
    state.email = profile.value?.email ?? undefined
}

watch(profile, hydrateUser, { immediate: true })

const pending = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
    pending.value = true

    try {
        console.log(event.data)
        const { error } = await supabase.auth.updateUser({
            email: event.data.email,
            data: {
                full_name: event.data.name,
            },
        })

        if (error) {
            throw error
        }

        await refreshUser()
        hydrateUser()

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
            label="Full name"
            name="name"
        >
            <UInput v-model="state.name" />
        </UFormField>
        <UFormField
            label="Email"
            name="email"
            help="You can change your email address, but you will need to verify it again."
        >
            <UInput v-model="state.email" />
        </UFormField>

        <UButton
            type="submit"
            :loading="pending"
        >
            Save
        </UButton>
    </UForm>
</template>
