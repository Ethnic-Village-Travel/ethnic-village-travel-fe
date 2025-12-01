export interface ExportColumn {
  key: string;
  title: string;
  dataType?: 'string' | 'number' | 'date' | 'boolean';
  formatter?: (value: any) => string;
}

export interface ExportConfig {
  title: string;
  filename: string;
  columns: ExportColumn[];
  data: Record<string, any>[];
  includeIndex?: boolean;
  excludeColumns?: string[];
}

export interface ExportPreviewProps {
  config: ExportConfig;
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  totalRecords: number;
  isLoading?: boolean;
}
