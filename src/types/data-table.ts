import { DataTableConfig } from '@/libs/data-table-config';
import type { ColumnSort, RowData } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  type ColumnMeta<TData extends RowData, TValue> = {
    label?: string;
    placeholder?: string;
    variant?: FilterVariant;
    options?: Option[];
    range?: [number, number];
    unit?: string;
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  }
}

export type Option = {
  label: string;
  value: string;
  count?: number;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export type FilterOperator = DataTableConfig['operators'][number];
export type FilterVariant = DataTableConfig['filterVariants'][number];
export type JoinOperator = DataTableConfig['joinOperators'][number];

export type ExtendedColumnSort<TData> = {
  id: Extract<keyof TData, string>;
} & Omit<ColumnSort, 'id'>
