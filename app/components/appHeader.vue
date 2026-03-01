<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const supabase = useSupabaseClient()
const { fullName, email, isLoggedIn } = useUser()

const displayName = computed(() => fullName.value || email.value || 'User')

const route = useRoute()
const isHome = computed(() => route.path === '/')

const items = computed<DropdownMenuItem[][]>(() => [
    [
        {
            label: 'Profile',
            icon: 'ph:user',
        },
        {
            label: 'Settings',
            icon: 'ph:gear',
            to: '/dashboard/settings',
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
        <NuxtLink to="/dashboard">Finance tracker</NuxtLink>
        <div>
            <ClientOnly>
                <template #fallback>
                    <USkeleton class="h-8 w-14" />
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
