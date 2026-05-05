export const available_icons = {
  eye: 'icon-[ri--eye-line]',
  'eye-off': 'icon-[ri--eye-off-line]',
  login: 'icon-[ri--login-box-line]',
  google: 'icon-[logos--google-icon]',
  home: 'icon-[ri--home-2-line]',
  close: 'icon-[ri--close-large-line]',
} as const;

export type IconValue = keyof typeof available_icons;
