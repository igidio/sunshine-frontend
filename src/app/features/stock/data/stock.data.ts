export const movement_types = {
  purchase: {
    value: 'purchase',
    color: 'success',
    label: 'Adquisición',
  },
  expired: {
    value: 'expired',
    color: 'danger',
    label: 'Vencido',
  },
  damaged: {
    value: 'damaged',
    color: 'danger',
    label: 'Dañado',
  },
  lost: {
    value: 'lost',
    color: 'danger',
    label: 'Perdido',
  },
  adjustment: {
    value: 'adjustment',
    color: 'warning',
    label: 'Ajuste',
  },
  internal_use: {
    value: 'internal_use',
    color: 'warning',
    label: 'Uso Interno',
  },
};

export const movement_types_array = Object.values(movement_types);
