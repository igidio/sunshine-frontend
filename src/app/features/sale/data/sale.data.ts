export const payment_methods = {
    cash: {
        value: 'cash',
        color: 'success' as const,
        label: 'Efectivo',
    },
    card: {
        value: 'card',
        color: 'brand' as const,
        label: 'Tarjeta',
    },
    transfer: {
        value: 'transfer',
        color: 'warning' as const,
        label: 'Transferencia',
    },
};

export const payment_methods_labeled: Record<string, string> = {
    cash: payment_methods.cash.label,
    card: payment_methods.card.label,
    transfer: payment_methods.transfer.label,
};

export const payment_methods_colors: Record<string, string> = {
    cash: payment_methods.cash.color,
    card: payment_methods.card.color,
    transfer: payment_methods.transfer.color,
};
