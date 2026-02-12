<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const items = ref<DropdownMenuItem[][]>([
    [
        {
            label: user.value?.email || 'User',
            avatar: {
                src: 'https://avatars.githubusercontent.com/u/81642663?v=4&size=64',
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
                <UDropdownMenu
                    v-if="user"
                    :items="items"
                >
                    <UAvatar
                        src="https://avatars.githubusercontent.com/u/81642663?v=4&size=64"
                    ></UAvatar>
                </UDropdownMenu>
            </ClientOnly>
        </div>
    </header>
</template>

<style lang="css" scoped></style>
