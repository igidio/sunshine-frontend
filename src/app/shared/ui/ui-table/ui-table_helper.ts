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
  name?: keyof TData;
  onClick?: (row: TData) => void;
}

interface CreateTableOptions {
  sortable: boolean;
}

export function create_table_field<TData, TComponent>(params: {
  label: string;
  component: Type<TComponent>;
  getInputs: (row: TData) => ComponentInputs<TComponent>;
  onClick?: (row: TData) => void;
  options?: CreateTableOptions;
  name?: keyof TData;
}): TableField<TData, TComponent> {
  const { label, component, getInputs, onClick, options, name } = params;
  return { label, component, getInputs, onClick, ...options, name };
}

export function create_text_field<TData>(params: {
  label: string;
  getValue: (row: TData) => string | number | null | undefined;
  onClick?: (row: TData) => void;
  options?: CreateTableOptions;
  name?: keyof TData;
}): TableField<TData> {
  const { label, getValue, onClick, options, name } = params;
  return { label, getValue, onClick, ...options, name };
}

export function create_html_field<TData>(params: {
  label: string;
  getValue: (row: TData) => string;
  onClick?: (row: TData) => void;
  options?: CreateTableOptions;
  name?: keyof TData;
}): TableField<TData> {
  const { label, getValue, onClick, options, name } = params;
  return { label, getValue, isHtml: true, onClick, ...options, name };
}
