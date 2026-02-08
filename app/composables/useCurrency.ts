export const useCurrency = (amount: MaybeRef<number>) => {
    const currency = computed(() =>
        new Intl.NumberFormat('sk-SK', { style: 'currency', currency: 'EUR' }).format(unref(amount))
    )

    return { currency }
}
