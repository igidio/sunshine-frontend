import { DateTime } from 'luxon';

export const js_date_to_string = (date: Date, format: string): string => {
  const date_time = DateTime.fromJSDate(date);
  return date_time.toFormat(format);
};

export const string_to_js_date = (date_string: string, format: string): Date => {
  const date_time = DateTime.fromFormat(date_string, format);
  return date_time.toJSDate();
};
