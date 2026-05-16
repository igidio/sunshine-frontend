export interface NotificationResultInterface {
  notifications: NotificationInterface[];
  total: number;
}

export interface NotificationInterface {
  id: number;
  user_id: number;
  title: string;
  message: string;
  created_at: Date;
  deleted_at: Date | null;
  read_at: Date | null;
  goto_url: string;
  type: NotificationInterfaceType;
}

export enum NotificationInterfaceType {
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Success = 'success',
}
