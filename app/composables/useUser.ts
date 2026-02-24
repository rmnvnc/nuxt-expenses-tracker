import type { User } from '@supabase/supabase-js'
import type { TransactionViewOption } from '~/constants'

interface UserMetadata {
    full_name?: string
    avatar_url?: string
    preference?: {
        transaction_view?: TransactionViewOption
    }
}

interface AppUser extends Omit<User, 'user_metadata'> {
    user_metadata: UserMetadata
}

export const useUser = () => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const profile = computed(() => user.value as AppUser | null)
    const fullName = computed(() => profile.value?.user_metadata?.full_name ?? null)
    const email = computed(() => profile.value?.email ?? null)
    const avatarUrl = computed(() => profile.value?.user_metadata.avatar_url ?? null)
    const isLoggedIn = computed(() => !!profile.value)

    const refreshUser = async () => {
        const { data, error } = await supabase.auth.refreshSession()
        if (error) throw error
        return data.user
    }

    return {
        profile,
        fullName,
        email,
        avatarUrl,
        isLoggedIn,
        refreshUser,
    }
}
