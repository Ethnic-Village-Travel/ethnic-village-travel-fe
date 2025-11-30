# Admin Booking List Implementation Plan

## Tổng quan

Tạo trang quản lý danh sách booking cho admin với khả năng lọc, tìm kiếm và xem chi tiết booking.

## 1. Cấu trúc File cần tạo

### 1.1 Route & Permission

- **Route**: Thêm vào `src/core/constants/route.ts`

  ```typescript
  admin_booking: '/admin/booking',
  ```

- **Permission**: Thêm vào `src/core/constants/permission-map.ts`
  ```typescript
  [RouteConstant.admin_booking]: ['ADMIN_BOOKING_READ'],
  ```

### 1.2 Page Component

- **File**: `src/app/[locale]/admin/booking/page.tsx`
- **Content**: Import và render AdminBookingListContent

### 1.3 Main Components

```
src/components/features/admin/booking-management/
├── booking-list/
│   ├── index.ts
│   ├── admin-booking-list-content.tsx
│   └── components/
│       ├── booking-list-header.tsx
│       ├── booking-table.tsx
│       ├── booking-table-filter.tsx
│       └── booking-table-columns.tsx
```

## 2. API Requirements

### 2.1 Tour List API (đã có)

- **Endpoint**: `GET /api/v1/admin/tour/search`
- **Method**: `searchTours`
- **Purpose**: Lấy danh sách tour cho TourSelect filter
- **Request Parameters**:
  ```typescript
  searchKey?: string // optional, default = ""
  ```
- **Response**:
  ```typescript
  List<TourBasicResponse> {
    id: UUID;
    title: string;
    slug: string;
  }
  ```

### 2.2 Tour Available Dates API (mới)

- **Endpoint**: `GET /api/v1/admin/tour-available-days`
- **Method**: `getTourAvailableDays`
- **Purpose**: Lấy danh sách ngày available theo tourId
- **Request Parameters**:
  ```typescript
  tourId: UUID; // required
  ```
- **Response**:
  ```typescript
  List<TourAvailableDate> {
    id: UUID;
    startDate: LocalDate;
    endDate: LocalDate;
    maxSlots: number;
    currentBookedSlots: number;
    status: TourAvailableDateStatus;
    tour: Tour; // basic tour info
  }
  ```

### 2.3 Admin Booking List API (mới)

- **Endpoint**: `GET /api/v1/admin/bookings`
- **Method**: `getBookings`
- **Purpose**: Lấy danh sách booking với filter
- **Request Parameters**:
  ```typescript
  interface AdminBookingListRequest {
    tourId?: UUID;
    tourAvailableDateIds?: UUID[];
    status?: BookingStatus[];
    fromDate?: string; // booking date từ (yyyy-MM-dd)
    toDate?: string; // booking date đến (yyyy-MM-dd)
    page: number; // 0-based
    size: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }
  ```
- **Response**:

  ```typescript
  Page<AdminBookingResponse> {
    content: AdminBookingResponse[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }

  interface AdminBookingResponse {
    id: UUID;
    tourAvailableDate: {
      id: UUID;
      startDate: LocalDate;
      endDate: LocalDate;
    };
    bookerDetail: {
      name: string;
      email: string;
      phone: string;
    };
    status: BookingStatus;
    totalPrice: BigDecimal;
    discountAmountApplied: BigDecimal;
    personCount: {
      adultCount: number;
      childCount: number;
    };
    paymentDate: LocalDateTime | null;
    paymentMethod: PaymentMethod | null;
    bookingDate: LocalDateTime;
  }
  ```

## 3. Component Details

### 3.1 AdminBookingListContent

```tsx
// Tương tự AdminTourListContent nhưng không có nút create
export default function AdminBookingListContent() {
  return (
    <div className="p-6">
      <BookingListHeader /> {/* Không có nút create */}
      <Shell className="gap-2">
        <Suspense fallback={<DataTableSkeleton />}>
          <BookingTable />
        </Suspense>
      </Shell>
    </div>
  );
}
```

### 3.2 BookingListHeader

```tsx
// Chỉ có title, description và nút export (không có create button)
export const BookingListHeader = () => {
  return (
    <div className="mb-3 flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold">Quản lý Booking</h1>
        <p className="text-muted-foreground mt-2 text-xl">Xem và quản lý danh sách booking từ khách hàng</p>
      </div>
      <div className="flex items-center gap-2.5">
        <Button variant="outline" className="gap-2">
          <span className="text-lg font-semibold">Xuất dữ liệu</span>
          <Download className="h-[18px] w-[18px]" />
        </Button>
      </div>
    </div>
  );
};
```

### 3.3 BookingTableFilter

```tsx
interface BookingTableFilterProps {
  onFilterChange: (filters: BookingFilters) => void;
}

interface BookingFilters {
  tourId?: string;
  tourAvailableDateIds?: string[];
  status?: BookingStatus[];
  fromDate?: string;
  toDate?: string;
}

export const BookingTableFilter = ({ onFilterChange }: BookingTableFilterProps) => {
  // TourSelect: Search và select tour từ API
  // TourAvailableDateSelect: Multiple select dates dựa trên tourId
  // StatusFilter: Multiple select booking status
  // FromDate & ToDate: Date picker cho booking date range
};
```

### 3.4 BookingTable Columns

```tsx
export const bookingColumns: ColumnDef<AdminBookingListResponse>[] = [
  {
    accessorKey: 'id',
    header: 'Booking ID',
  },
  {
    accessorKey: 'tourAvailableDate',
    header: 'Tour Date',
    cell: ({ row }) => {
      const { startDate, endDate } = row.getValue('tourAvailableDate');
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    },
  },
  {
    accessorKey: 'bookerDetail',
    header: 'Booker',
    cell: ({ row }) => {
      const booker = row.getValue('bookerDetail');
      return (
        <div>
          <div className="font-medium">{booker.name}</div>
          <div className="text-muted-foreground text-sm">{booker.email}</div>
          <div className="text-muted-foreground text-sm">{booker.phone}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status');
      return <Badge variant={getStatusBadgeVariant(status)}>{status}</Badge>;
    },
  },
  {
    accessorKey: 'pricing',
    header: 'Pricing',
    cell: ({ row }) => {
      const totalPrice = row.original.totalPrice;
      const discount = row.original.discountAmountApplied;
      const finalPrice = totalPrice - discount;
      return (
        <div>
          <div className="font-medium">{formatCurrency(finalPrice)}</div>
          {discount > 0 && <div className="text-muted-foreground text-sm">Giảm: {formatCurrency(discount)}</div>}
        </div>
      );
    },
  },
  {
    accessorKey: 'personCount',
    header: 'Participants',
    cell: ({ row }) => {
      const { adultCount, childCount } = row.getValue('personCount');
      return `${adultCount} người lớn, ${childCount} trẻ em`;
    },
  },
  {
    accessorKey: 'paymentDate',
    header: 'Payment Date',
    cell: ({ row }) => {
      const date = row.getValue('paymentDate');
      return date ? formatDate(date) : 'Chưa thanh toán';
    },
  },
  {
    accessorKey: 'paymentMethod',
    header: 'Payment Method',
    cell: ({ row }) => {
      const method = row.getValue('paymentMethod');
      return method || 'N/A';
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          // TODO: Navigate to booking detail
          console.log('View detail:', row.original.id);
        }}
      >
        Xem chi tiết
      </Button>
    ),
  },
];
```

## 4. Type Definitions

### 4.1 API Types (mới thêm)

```typescript
// src/types/tour/tour.response.ts (thêm vào)
export interface TourBasicResponse {
  id: string;
  title: string;
  slug: string;
}

// src/types/booking/booking.response.ts (thêm vào)
export interface TourAvailableDateResponse {
  id: string;
  startDate: string;
  endDate: string;
  maxSlots: number;
  currentBookedSlots: number;
  status: string;
  tour: {
    id: string;
    title: string;
  };
}

export interface AdminBookingResponse {
  id: string;
  tourAvailableDate: {
    id: string;
    startDate: string;
    endDate: string;
  };
  bookerDetail: {
    name: string;
    email: string;
    phone: string;
  };
  status: BookingStatus;
  totalPrice: number;
  discountAmountApplied: number;
  personCount: {
    adultCount: number;
    childCount: number;
  };
  paymentDate: string | null;
  paymentMethod: PaymentMethod | null;
  bookingDate: string;
}
```

### 4.2 Request Types (mới thêm)

```typescript
// src/types/booking/booking.request.ts (thêm vào)
export interface AdminBookingListRequest {
  tourId?: string;
  tourAvailableDateIds?: string[];
  status?: BookingStatus[];
  fromDate?: string; // yyyy-MM-dd format
  toDate?: string; // yyyy-MM-dd format
  page: number; // 0-based pagination
  size: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}
```

## 5. API Implementation

### 5.1 Tour List API (search)

```typescript
// src/data/apis/tour.api.ts (thêm method)
export const searchTours = async (searchKey: string = ''): Promise<TourBasicResponse[]> => {
  const response = await apiClient.get('/api/v1/admin/tour/search', {
    params: { searchKey },
  });
  return response.data;
};
```

### 5.2 Tour Available Dates API

```typescript
// src/data/apis/tour.api.ts (thêm method)
export const getTourAvailableDates = async (tourId: string): Promise<TourAvailableDateResponse[]> => {
  const response = await apiClient.get('/api/v1/admin/tour-available-days', {
    params: { tourId },
  });
  return response.data;
};
```

### 5.3 Admin Booking List API

```typescript
// src/data/apis/booking.api.ts (tạo mới hoặc thêm vào)
export const getAdminBookingList = async (
  params: AdminBookingListRequest,
): Promise<PaginatedResponse<AdminBookingResponse>> => {
  const response = await apiClient.get('/api/v1/admin/bookings', { params });
  return response.data;
};
```

## 6. Implementation Steps

### Phase 1: Setup cơ bản

1. ✅ Tạo route và permission
2. ✅ Tạo page component
3. ✅ Tạo basic layout (AdminBookingListContent + Header)

### Phase 2: Filter Components

1. ✅ Implement TourSelect (search + select)
2. ✅ Implement TourAvailableDateSelect (depends on tourId)
3. ✅ Implement StatusFilter (multiple select)
4. ✅ Implement DateRange picker (fromDate, toDate)

### Phase 3: Data Table

1. ✅ Define table columns
2. ✅ Implement BookingTable with pagination
3. ✅ Connect with API

### Phase 4: Integration

1. ✅ Connect filters with table data
2. ✅ Add loading states
3. ✅ Add error handling
4. ✅ Test responsive design

## 7. Translation Keys

```json
// messages/vi.json
{
  "admin": {
    "booking": {
      "list": {
        "title": "Quản lý Booking",
        "description": "Xem và quản lý danh sách booking từ khách hàng",
        "export": "Xuất dữ liệu",
        "filter": {
          "tour": "Chọn tour",
          "tour_dates": "Chọn ngày tour",
          "status": "Trạng thái",
          "date_range": "Khoảng thời gian booking"
        },
        "table": {
          "booking_id": "Mã booking",
          "tour_date": "Ngày tour",
          "booker": "Người đặt",
          "status": "Trạng thái",
          "pricing": "Giá tiền",
          "participants": "Số người",
          "payment_date": "Ngày thanh toán",
          "payment_method": "Phương thức thanh toán",
          "actions": "Thao tác",
          "view_detail": "Xem chi tiết"
        }
      }
    }
  }
}
```

## 8. Notes

- **Filter Dependencies**: TourAvailableDateSelect chỉ enabled khi đã chọn tour
- **Multiple Selection**: TourAvailableDateSelect và StatusFilter support multiple selection
- **API Integration**: Cần đảm bảo API response format match với mapper/model đã có
- **Responsive**: Table cần responsive trên mobile
- **Performance**: Consider pagination và lazy loading cho large datasets
- **Error Handling**: Proper error states cho failed API calls
