import { ExportColumn } from '@/types/export/export.types';

/**
 * Helper function to get nested object value by key path
 * Example: getNestedValue({user: {name: 'John'}}, 'user.name') => 'John'
 */
export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Helper function to process export data and handle nested keys
 */
export function processExportData(data: any[], columns: ExportColumn[]): Record<string, any>[] {
  return data.map(row => {
    const processedRow: Record<string, any> = {};

    columns.forEach(column => {
      const value = getNestedValue(row, column.key);
      processedRow[column.key] = column.formatter ? column.formatter(value) : value;
    });

    return processedRow;
  });
}

/**
 * Helper function to sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Helper function to generate timestamp-based filename
 */
export function generateFilename(title: string): string {
  const sanitizedTitle = sanitizeFilename(title);
  const timestamp = new Date().toISOString().split('T')[0];
  return `${sanitizedTitle}_${timestamp}`;
}
