export const available_icons = {
  eye: 'icon-[ri--eye-line]',
  'eye-off': 'icon-[ri--eye-off-line]',
  login: 'icon-[ri--login-box-line]',
  google: 'icon-[logos--google-icon]',
  home: 'icon-[ri--home-2-line]',
  close: 'icon-[ri--close-large-line]',
  success: 'icon-[ri--checkbox-circle-line]',
  info: 'icon-[ri--information-line]',
  warning: 'icon-[ri--error-warning-line]',
  danger: 'icon-[ri--close-circle-line]',
  sun: 'icon-[ri--sun-fill]',
  moon: 'icon-[ri--moon-fill]',
  menu: 'icon-[ri--menu-line]',
  notification: 'icon-[ri--notification-3-fill]',
  profile: 'icon-[ri--account-circle-fill]',
  calendar: 'icon-[ri--calendar-2-fill]',
  chevron_right: 'icon-[ri--arrow-right-s-line]',
  chevron_left: 'icon-[ri--arrow-left-s-line]',
  chat_ai: 'icon-[ri--chat-smile-ai-3-fill]',
  send: 'icon-[ri--send-plane-fill]',
} as const;

export type IconValue = keyof typeof available_icons;
