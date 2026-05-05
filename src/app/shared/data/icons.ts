export const available_icons = {
  eye: 'icon-[ri--eye-line]',
  'eye-off': 'icon-[ri--eye-off-line]',
} as const;

export type IconValue = keyof typeof available_icons;
