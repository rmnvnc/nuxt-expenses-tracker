<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const supabase = useSupabaseClient()
const { fullName, email, avatarUrl, isLoggedIn } = useUser()

const displayName = computed(() => fullName.value || email.value || 'User')
const displayAvatar = computed(
    () => avatarUrl.value || 'https://avatars.githubusercontent.com/u/81642663?v=4&size=64'
)

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
            to: '/settings',
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
        <NuxtLink to="/">Finance tracker</NuxtLink>
        <div>
            <ClientOnly>
                <div v-if="isLoggedIn">
                    {{ displayName }}
                    <UDropdownMenu :items="items">
                        <UAvatar :src="displayAvatar" />
                    </UDropdownMenu>
                </div>
            </ClientOnly>
        </div>
    </header>
</template>

<style lang="css" scoped></style>
