import { Type, InputSignal, InputSignalWithTransform } from '@angular/core';

export type UnwrapInput<T> =
  T extends InputSignalWithTransform<any, infer WriteT>
    ? WriteT
    : T extends InputSignal<infer ReadT>
      ? ReadT
      : T;

export type ComponentInputs<C> = {
  [K in keyof C]?: UnwrapInput<C[K]> | (UnwrapInput<C[K]> extends string ? string & {} : never);
};

export interface TableField<TData, TComponent = unknown> {
  label: string;
  component?: Type<TComponent>;
  getInputs?: (row: TData) => ComponentInputs<TComponent>;
  getValue?: (row: TData) => string | number | null | undefined;
  isHtml?: boolean;
  onClick?: (row: TData) => void;
}

export function create_table_field<TData, TComponent>(
  label: string,
  component: Type<TComponent>,
  getInputs: (row: TData) => ComponentInputs<TComponent>,
  onClick?: (row: TData) => void,
): TableField<TData, TComponent> {
  return { label, component, getInputs, onClick };
}

export function create_text_field<TData>(
  label: string,
  getValue: (row: TData) => string | number | null | undefined,
  onClick?: (row: TData) => void,
): TableField<TData> {
  return { label, getValue, onClick };
}

export function create_html_field<TData>(
  label: string,
  getValue: (row: TData) => string,
  onClick?: (row: TData) => void,
): TableField<TData> {
  return { label, getValue, isHtml: true, onClick };
}
