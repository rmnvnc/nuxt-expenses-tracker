export default defineNuxtRouteMiddleware(async () => {
    const supabase = useSupabaseClient()
    const { data } = await supabase.auth.getSession()
    if (data.session) {
        const { pluck } = useSupabaseCookieRedirect()
        return navigateTo(pluck() ?? '/dashboard')
    }
})
