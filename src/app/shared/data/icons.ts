export const available_icons = {
  eye: 'icon-[ri--eye-line]',
  'eye-off': 'icon-[ri--eye-off-line]',
  login: 'icon-[ri--login-box-fill]',
  google: 'icon-[logos--google-icon]',
} as const;

export type IconValue = keyof typeof available_icons;
