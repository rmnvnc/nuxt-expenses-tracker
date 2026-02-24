<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const supabase = useSupabaseClient()
const { fullName, email, avatarUrl, isLoggedIn } = useUser()

const displayName = computed(() => fullName.value || email.value || 'User')
const displayAvatar = computed(
    () => avatarUrl.value || 'https://avatars.githubusercontent.com/u/81642663?v=4&size=64'
)

const route = useRoute()
const isHome = computed(() => route.path === '/')

const items = computed<DropdownMenuItem[][]>(() => [
    [
        {
            label: displayName.value,
            avatar: {
                src: displayAvatar.value,
            },
            type: 'label',
        },
    ],
    [
        {
            label: 'Profile',
            icon: 'i-lucide-user',
        },
        {
            label: 'Settings',
            icon: 'i-lucide-cog',
            to: '/dashboard/settings',
        },
    ],
    [
        {
            label: 'Logout',
            icon: 'i-lucide-log-out',
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
                <div v-if="isLoggedIn">
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
                        <UAvatar :src="displayAvatar" />
                    </UDropdownMenu>
                </div>
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
