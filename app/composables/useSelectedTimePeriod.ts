import type { Ref } from 'vue'
import type { TransactionViewOption } from '~/constants'
import {
    endOfDay,
    endOfMonth,
    endOfYear,
    startOfDay,
    startOfMonth,
    startOfYear,
    sub,
} from 'date-fns'

export const useSelectedTimePeriod = (period: Ref<TransactionViewOption>) => {
    const now = shallowRef(new Date())
    const current = computed(() => {
        const base = now.value
        switch (period.value) {
            case 'Yearly':
                return {
                    from: startOfYear(base),
                    to: endOfYear(base),
                }
            case 'Monthly':
                return {
                    from: startOfMonth(base),
                    to: endOfMonth(base),
                }
            case 'Daily':
                return {
                    from: startOfDay(base),
                    to: endOfDay(base),
                }
        }
    })
    const previous = computed(() => {
        const base = now.value
        switch (period.value) {
            case 'Yearly':
                return {
                    from: startOfYear(sub(base, { years: 1 })),
                    to: endOfYear(sub(base, { years: 1 })),
                }
            case 'Monthly':
                return {
                    from: startOfMonth(sub(base, { months: 1 })),
                    to: endOfMonth(sub(base, { months: 1 })),
                }
            case 'Daily':
                return {
                    from: startOfDay(sub(base, { days: 1 })),
                    to: endOfDay(sub(base, { days: 1 })),
                }
        }
    })
    return { current, previous }
}
