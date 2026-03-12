export const formatDate = (date: DateKey) =>
    new Intl.DateTimeFormat('sk-SK', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(date))
