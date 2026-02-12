export const useAppToast = () => {
    const toast = useToast()

    return {
        toastSuccess: ({
            title,
            description = undefined,
        }: {
            title: string
            description?: string | undefined
        }) => {
            toast.add({
                title,
                description,
                icon: 'heroicons:check-circle',
                color: 'success',
            })
        },
        toastError: ({
            title,
            description = undefined,
        }: {
            title: string
            description?: string | undefined
        }) => {
            toast.add({
                title,
                description,
                icon: 'heroicons:exclamation-circle',
                color: 'error',
            })
        },
    }
}
