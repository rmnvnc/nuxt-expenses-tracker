<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useSupabaseClient } from '#imports'

useRedirectIfAuthenticated()

const supabase = useSupabaseClient()
const config = useRuntimeConfig()
const schema = z.object({
    email: z.email('Invalid email'),
    // password: z.string('Password is required').min(8, 'Must be at least 8 characters'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
    email: undefined,
    // password: undefined,
})

const pending = ref(false)
const success = ref(false)

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
    success.value = false
    pending.value = true

    console.log(event.data)

    try {
        const { error } = await supabase.auth.signInWithOtp({
            email: event.data.email,
            options: {
                emailRedirectTo: `${config.public.siteUrl}/confirm`,
            },
        })

        if (error) {
            toast.add({
                title: 'Error authenticating',
                icon: 'i-heroicons-exlamation-circle',
                description: error.message,
                color: 'error',
            })
        } else {
            toast.add({
                title: 'Success',
                description: 'The form has been submitted.',
                color: 'success',
            })
            success.value = true
        }
    } finally {
        pending.value = false
    }
}
</script>

<template>
    <UForm
        v-if="!success"
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
    >
        <UFormField
            label="Email"
            name="email"
        >
            <UInput v-model="state.email" />
        </UFormField>

        <!-- <UFormField
            label="Password"
            name="password"
        >
            <UInput
                v-model="state.password"
                type="password"
            />
        </UFormField> -->

        <UButton
            type="submit"
            :loading="pending"
            :disabled="pending"
        >
            Submit
        </UButton>
    </UForm>
    <UCard v-else>
        <div class="text-center">
            <UIcon
                name="i-heroicons-check-circle"
                class="w-16 h-16 text-green-500 mx-auto mb-4"
            />
            <h2 class="text-2xl font-bold mb-2">Check your email</h2>
            <p class="text-gray-600">
                We've sent you a magic link to sign in. Please check your inbox.
            </p>
        </div>
    </UCard>
</template>
