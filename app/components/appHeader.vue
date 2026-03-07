<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const supabase = useSupabaseClient()
const { fullName, email, isLoggedIn } = useUser()

const displayName = computed(() => fullName.value || email.value || 'User')

const route = useRoute()
const isHome = computed(() => route.path === '/')
const isDashboard = computed(() => route.path.startsWith('/dashboard'))

const items = computed<DropdownMenuItem[][]>(() => [
    [
        {
            label: 'Profile',
            icon: 'ph:user',
            to: '/dashboard/settings/profile',
        },
        {
            label: 'Preferences',
            icon: 'ph:gear',
            to: '/dashboard/settings/preferences',
        },
    ],
    [
        {
            label: 'Logout',
            icon: 'ph:sign-out',
            onSelect: async () => {
                await supabase.auth.signOut()
                return navigateTo('/login')
            },
        },
    ],
])
</script>

<template>
    <header class="flex justify-between items-center my-5">
        <NuxtLink
            :to="isDashboard ? '/dashboard' : '/'"
            class="flex items-center gap-3 font-sans font-bold text-2xl"
        >
            <img
                src="/images/finflo-logo.svg"
                class="w-10 h-10"
                alt="Finflo logo"
            />
            Finflo
        </NuxtLink>
        <div>
            <ClientOnly>
                <template #fallback>
                    <UButton
                        to="/login"
                        label="Login"
                    />
                </template>
                <template v-if="isLoggedIn">
                    <UButton
                        v-if="isHome"
                        to="/dashboard"
                        label="Open dashboard"
                    />
                    <template v-else>
                        {{ displayName }}
                    </template>
                    <UDropdownMenu
                        :items="items"
                        class="ml-4"
                    >
                        <UAvatar :alt="displayName" />
                    </UDropdownMenu>
                </template>
                <UButton
                    v-else
                    to="/login"
                    label="Login"
                />
            </ClientOnly>
        </div>
    </header>
</template>

<style lang="css" scoped></style>
