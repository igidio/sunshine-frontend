export function get_ui_classes<T extends object>(obj: T, exclude_keys: (keyof T)[] = []) {
  const class_name = Object.entries(obj)
    .filter(([key]) => !exclude_keys.includes(key as keyof T))
    .map(([, value]) => value)
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    .join(' ');

  return { ...obj, class: class_name } as T & { class: string };
}

export function pick_classes<T extends object>(obj: T, keys: (keyof T)[]): string {
  return keys
    .map((key) => obj[key])
    .filter((value): value is any => typeof value === 'string' && value.trim().length > 0)
    .join(' ');
}
