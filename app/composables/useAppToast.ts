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
                icon: 'ph:check-circle',
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
                icon: 'ph:warning-circle-light',
                color: 'error',
            })
        },
    }
}
