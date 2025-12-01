# Export Data Feature Implementation

## Tổng quan

Tài liệu này mô tả việc triển khai chức năng export dữ liệu cho trang quản lý booking, sử dụng thư viện `xlsx` để tạo
file Excel.

## Yêu cầu chức năng

### 1. Component chung cho Export

- Tạo component `DataExporter` có thể tái sử dụng
- Nhận các props: title, columns, data
- Hỗ trợ export ra file Excel (.xlsx)
- Loại bỏ cột actions (ba chấm) tự động
- Thêm cột số thứ tự ở đầu

### 2. Xử lý dữ liệu

- Lấy toàn bộ dữ liệu từ database (không chỉ data table hiện tại)
- Giữ nguyên các filter và sort hiện tại
- Xử lý phân trang để lấy tất cả records

### 3. Preview Dialog

- Hiển thị popup preview giống Ctrl+P browser
- Cho phép xem trước dữ liệu sẽ được export
- Xác nhận trước khi tải xuống

## Cấu trúc Implementation

### 1. Thư viện cần thiết

```json
{
  "dependencies": {
    "xlsx": "^0.18.5"
  }
}
```

> **Lưu ý**: Thư viện xlsx đã được cài đặt

### 2. Types và Interfaces

```typescript
// src/types/export/export.types.ts
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
```

### 3. Component Structure

```
src/components/shared/export/
├── data-exporter.tsx              # Main export component
├── export-preview-dialog.tsx      # Preview dialog
├── export-button.tsx             # Export trigger button
├── hooks/
│   ├── use-excel-export.ts       # Excel export logic
│   └── use-export-data.ts        # Data fetching logic
└── utils/
    └── export-helpers.ts         # Utility functions
```

### 4. Component Implementation

#### 4.1 DataExporter Component

```typescript
// src/components/shared/export/data-exporter.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet } from 'lucide-react';

import { ExportConfig } from '@/types/export/export.types';
import { useExcelExport } from './hooks/use-excel-export';
import { ExportPreviewDialog } from './export-preview-dialog';

interface DataExporterProps {
  title: string;
  columns: ExportColumn[];
  onFetchAllData: (filters?: any) => Promise<any[]>;
  currentFilters?: any;
  className?: string;
}

export function DataExporter({
  title,
  columns,
  onFetchAllData,
  currentFilters,
  className
}: DataExporterProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [exportConfig, setExportConfig] = useState<ExportConfig | null>(null);

  const { exportToExcel, isExporting } = useExcelExport();

  const handleExportClick = async () => {
    try {
      const allData = await onFetchAllData(currentFilters);

      const config: ExportConfig = {
        title,
        filename: `${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`,
        columns: columns.filter(col => col.key !== 'actions'),
        data: allData,
        includeIndex: true
      };

      setExportConfig(config);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error('Failed to fetch export data:', error);
    }
  };

  const handleConfirmExport = () => {
    if (exportConfig) {
      exportToExcel(exportConfig);
      setIsPreviewOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportClick}
        disabled={isExporting}
        className={className}
      >
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Export Excel
      </Button>

      {exportConfig && (
        <ExportPreviewDialog
          config={exportConfig}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          onExport={handleConfirmExport}
          totalRecords={exportConfig.data.length}
          isLoading={isExporting}
        />
      )}
    </>
  );
}
```

#### 4.2 Export Preview Dialog

```typescript
// src/components/shared/export/export-preview-dialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileSpreadsheet, X } from 'lucide-react';

export function ExportPreviewDialog({
  config,
  isOpen,
  onClose,
  onExport,
  totalRecords,
  isLoading
}: ExportPreviewProps) {
  const previewData = config.data.slice(0, 10); // Show first 10 records

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-green-600" />
              <DialogTitle>Export Preview - {config.title}</DialogTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Xem trước dữ liệu sẽ được export. Tổng cộng: {totalRecords} bản ghi
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full border rounded-md">
            <div className="p-4">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    {config.includeIndex && (
                      <th className="border border-gray-200 p-2 text-left font-medium">
                        STT
                      </th>
                    )}
                    {config.columns.map((column) => (
                      <th key={column.key} className="border border-gray-200 p-2 text-left font-medium">
                        {column.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      {config.includeIndex && (
                        <td className="border border-gray-200 p-2">
                          {index + 1}
                        </td>
                      )}
                      {config.columns.map((column) => (
                        <td key={column.key} className="border border-gray-200 p-2">
                          {column.formatter
                            ? column.formatter(row[column.key])
                            : String(row[column.key] || '')
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalRecords > 10 && (
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  ... và {totalRecords - 10} bản ghi khác
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={onExport} disabled={isLoading}>
            {isLoading ? 'Đang export...' : 'Tải xuống Excel'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

#### 4.3 Excel Export Hook

```typescript
// src/components/shared/export/hooks/use-excel-export.ts
import { useState } from 'react';
import * as XLSX from 'xlsx';

import { ExportConfig } from '@/types/export/export.types';

export function useExcelExport() {
  const [isExporting, setIsExporting] = useState(false);

  const exportToExcel = async (config: ExportConfig) => {
    setIsExporting(true);

    try {
      // Prepare data with index column
      const exportData = config.data.map((row, index) => {
        const newRow: Record<string, any> = {};

        // Add index column if requested
        if (config.includeIndex) {
          newRow['STT'] = index + 1;
        }

        // Add data columns
        config.columns.forEach(column => {
          const value = row[column.key];
          newRow[column.title] = column.formatter ? column.formatter(value) : value || '';
        });

        return newRow;
      });

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      const colWidths = [];
      if (config.includeIndex) {
        colWidths.push({ wch: 5 }); // STT column
      }
      config.columns.forEach(() => {
        colWidths.push({ wch: 20 }); // Default column width
      });
      ws['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, config.title);

      // Generate and download file
      const fileName = `${config.filename}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  return { exportToExcel, isExporting };
}
```

### 5. Integration với Booking Management

#### 5.1 Cập nhật BookingTable Component

```typescript
// src/components/features/admin/booking-management/booking-list/components/booking-table.tsx

// Thêm import
import { DataExporter } from '@/components/shared/export/data-exporter';
import { useAdminBookingExport } from '../hooks/use-admin-booking-export';

// Trong component BookingTable
function BookingTable() {
  // ... existing code ...

  const { fetchAllBookings, exportColumns } = useAdminBookingExport();

  return (
    <>
      <DataTable table={table} loading={isLoading ?? false}>
        <div className="flex w-full items-start justify-between gap-2 p-1">
          <BookingTableFilter />
          <div className="flex items-center gap-2">
            <DataExporter
              title="Danh sách Booking"
              columns={exportColumns}
              onFetchAllData={fetchAllBookings}
              currentFilters={queryConfig}
            />
            <DataTableViewOptions table={table} />
          </div>
        </div>
      </DataTable>
      {/* ... rest of component ... */}
    </>
  );
}
```

#### 5.2 Export Hook cho Booking

```typescript
// src/components/features/admin/booking-management/booking-list/hooks/use-admin-booking-export.ts
import { useCallback } from 'react';
import { bookingApi } from '@/data/apis/booking.api';
import { formatBookingStatus, formatCurrency, formatDate } from '@/utils/formatters';

import { ExportColumn } from '@/types/export/export.types';

export function useAdminBookingExport() {
  const exportColumns: ExportColumn[] = [
    {
      key: 'bookingId',
      title: 'Mã Booking',
      dataType: 'string',
    },
    {
      key: 'bookerDetail.name',
      title: 'Tên khách hàng',
      dataType: 'string',
      formatter: value => value || 'N/A',
    },
    {
      key: 'bookerDetail.email',
      title: 'Email',
      dataType: 'string',
    },
    {
      key: 'bookerDetail.phone',
      title: 'Số điện thoại',
      dataType: 'string',
    },
    {
      key: 'tourTitle',
      title: 'Tour',
      dataType: 'string',
    },
    {
      key: 'tourDate',
      title: 'Ngày khởi hành',
      dataType: 'date',
      formatter: value => formatDate(value),
    },
    {
      key: 'totalPeople',
      title: 'Số người',
      dataType: 'number',
    },
    {
      key: 'totalPrice',
      title: 'Tổng tiền',
      dataType: 'number',
      formatter: value => formatCurrency(value),
    },
    {
      key: 'status',
      title: 'Trạng thái',
      dataType: 'string',
      formatter: value => formatBookingStatus(value),
    },
    {
      key: 'createdAt',
      title: 'Ngày tạo',
      dataType: 'date',
      formatter: value => formatDate(value),
    },
  ];

  const fetchAllBookings = useCallback(async (filters?: any) => {
    try {
      // Fetch all pages of data with current filters
      let allBookings = [];
      let currentPage = 0;
      let hasMoreData = true;

      while (hasMoreData) {
        const response = await bookingApi.getAdminBookingList({
          ...filters,
          page: currentPage,
          size: 100, // Large page size for efficient fetching
        });

        allBookings.push(...response.data.content);
        hasMoreData = !response.data.last;
        currentPage++;
      }

      return allBookings;
    } catch (error) {
      console.error('Failed to fetch all bookings for export:', error);
      throw error;
    }
  }, []);

  return {
    exportColumns,
    fetchAllBookings,
  };
}
```

### 6. Utility Functions

```typescript
// src/utils/formatters.ts
export function formatDate(date: string | Date): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('vi-VN');
}

export function formatCurrency(amount: number): string {
  if (typeof amount !== 'number') return '';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export function formatBookingStatus(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    CANCELLED: 'Đã hủy',
    COMPLETED: 'Hoàn thành',
  };

  return statusMap[status] || status;
}
```

## Kế hoạch triển khai

### Phase 1: Core Implementation

1. ✅ Cài đặt thư viện xlsx
2. 🔄 Tạo types và interfaces
3. 🔄 Implement DataExporter component
4. 🔄 Implement ExportPreviewDialog
5. 🔄 Tạo useExcelExport hook

### Phase 2: Booking Integration

1. 🔄 Tạo useAdminBookingExport hook
2. 🔄 Tích hợp vào BookingTable component
3. 🔄 Test với dữ liệu thực

### Phase 3: Testing & Optimization

1. 🔄 Test với dataset lớn
2. 🔄 Optimize performance
3. 🔄 Add error handling
4. 🔄 UI/UX improvements

### Phase 4: Expansion

1. 🔄 Áp dụng cho các trang khác (Tours, Users, etc.)
2. 🔄 Add more export formats (CSV, PDF)
3. 🔄 Advanced filtering options

## Lưu ý quan trọng

### Performance Considerations

- Sử dụng pagination với size lớn (100-500) để giảm số request
- Implement loading states cho UX tốt hơn
- Consider implementing streaming cho dataset cực lớn

### Error Handling

- Validate dữ liệu trước khi export
- Handle network errors gracefully
- Provide meaningful error messages

### Security

- Validate permissions trước khi export
- Log export activities
- Rate limiting cho export requests

### Browser Compatibility

- Test across different browsers
- Handle memory limitations
- Fallback cho browsers không support File APIs

## Testing Checklist

- [ ] Export với dữ liệu rỗng
- [ ] Export với 1 record
- [ ] Export với > 1000 records
- [ ] Export với filters applied
- [ ] Export với sorting applied
- [ ] Preview dialog functionality
- [ ] File download works correctly
- [ ] Excel file opens properly
- [ ] Column formatting is correct
- [ ] Index column displays correctly
- [ ] Actions column is excluded
- [ ] Error scenarios handled

## Future Enhancements

1. **Multiple Export Formats**: CSV, PDF, JSON
2. **Custom Column Selection**: Allow users to choose columns
3. **Export Scheduling**: Schedule regular exports
4. **Email Export**: Send export file via email
5. **Export Templates**: Predefined export configurations
6. **Data Transformation**: Advanced formatting options
7. **Batch Export**: Export multiple tables at once

---

**Tài liệu được tạo**: 30/11/2025
**Phiên bản**: 1.0
**Tác giả**: Development Team
