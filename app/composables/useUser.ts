export const useUser = () => {
    const supabase = useSupabaseClient()
    const profile = useState('user-profile', () => null as Awaited<ReturnType<typeof supabase.auth.getUser>>['data']['user'])
    const initialized = useState('user-initialized', () => false)

    const refreshUser = async () => {
        const { data, error } = await supabase.auth.getUser()
        if (error) {
            throw error
        }

        profile.value = data.user
        initialized.value = true
        return data.user
    }

    const initUser = async () => {
        if (initialized.value) {
            return profile.value
        }
        return await refreshUser()
    }

    return {
        profile,
        refreshUser,
        initUser,
    }
}
