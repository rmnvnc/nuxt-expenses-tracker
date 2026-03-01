<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useSupabaseClient } from '#imports'

definePageMeta({ middleware: 'guest' })

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

const emailInput = useTemplateRef('emailInputRef')

async function resetLogin() {
    state.email = undefined
    success.value = false
    await nextTick() // wait for v-if to swap back to the form
    emailInput.value?.inputRef?.focus()
}

const pending = ref(false)
const success = ref(false)

const { toastError, toastSuccess } = useAppToast()

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
            toastError({
                title: 'Error authenticating',
                description: error.message,
            })
        } else {
            toastSuccess({
                title: 'Success',
                description: 'The form has been submitted.',
            })
            success.value = true
        }
    } finally {
        pending.value = false
    }
}

onMounted(async () => {
    await nextTick()
    emailInput.value?.inputRef?.focus()
})
</script>

<template>
    <div class="mt-16">
        <UCard
            v-if="!success"
            class="max-w-[350px] m-auto text-center"
        >
            <h1 class="text-2xl mb-4">Sign in</h1>
            <p class="mb-4">We’ll email you a magic link to sign in — no password needed.</p>
            <UForm
                :schema="schema"
                :state="state"
                class="items-center"
                @submit="onSubmit"
            >
                <UFormField
                    label="Email"
                    name="email"
                    class="m-auto text-left mb-6"
                >
                    <UInput
                        ref="emailInputRef"
                        v-model="state.email"
                        class="w-full"
                        autocomplete="email"
                        inputmode="email"
                    />
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
                    size="xl"
                    class="mb-4"
                >
                    Submit
                </UButton>
            </UForm>
            <p class="text-xs text-gray-500 text-center">
                By continuing, you agree to our Terms and Privacy Policy.
            </p>
        </UCard>
        <UCard
            v-else
            class="text-center max-w-xl m-auto"
        >
            <UIcon
                name="ph:check-circle"
                class="w-16 h-16 text-green-500 mx-auto mb-4"
            />
            <h1 class="text-2xl mb-4">Check your inbox</h1>
            <p class="mb-4">
                A magic sign-in link has been sent to <b>{{ state.email }}</b
                >.<br />If you don’t see it, check your spam or promotions folder.
            </p>
            <p class="mb-4">Not your email? Sign in again with a different address.</p>
            <UButton @click="resetLogin">Change email</UButton>
        </UCard>
    </div>
</template>
