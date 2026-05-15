import { IconValue } from './icons';

export interface menuItemInterface {
  label: string;
  icon: IconValue;
  route: string;
}
export const menu_items = {
  home: { label: 'Inicio', icon: 'home', route: '/dashboard' } as menuItemInterface,
  calendar: {
    label: 'Calendario',
    icon: 'calendar',
    route: '/dashboard/calendar',
  } as menuItemInterface,
  profile: { label: 'Perfil', icon: 'profile', route: '/dashboard/profile' } as menuItemInterface,
  settings: { label: 'Ajustes', icon: 'close', route: '/dashboard/settings' } as menuItemInterface,
  chat: { label: 'Chat', icon: 'chat_ai', route: '/dashboard/chat' } as menuItemInterface,
  supplier: {
    label: 'Proveedores',
    icon: 'supplier',
    route: '/dashboard/supplier',
  } as menuItemInterface,
  notification: {
    label: 'Notificaciones',
    icon: 'notification',
    route: '/dashboard/notification',
  } as menuItemInterface,
};
