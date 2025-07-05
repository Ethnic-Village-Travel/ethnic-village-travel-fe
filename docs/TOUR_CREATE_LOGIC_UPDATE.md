# Tour Creation Logic Update

## Tổng quan
Tài liệu này mô tả các thay đổi cần thiết để cập nhật logic tạo tour theo các yêu cầu mới.

## Các yêu cầu cần thực hiện

### 1. Published Date Validation
- **Yêu cầu**: Published date phải được chọn sau ngày hiện tại ít nhất 1 tuần
- **Logic**: `publishedDate >= currentDate + 7 days`
- **Implementation**:
  - Thêm validation vào schema
  - Cập nhật date picker để disable các ngày không hợp lệ
  - Hiển thị thông báo lỗi rõ ràng

### 2. Duration Input Field
- **Yêu cầu**: Thêm input number để nhập số ngày của tour
- **Format**: Số ngày (ví dụ: 3 = 3 ngày 2 đêm)
- **Implementation**:
  - Thêm field `duration` vào form
  - Validation: minimum 1 ngày, maximum hợp lý (ví dụ: 30 ngày)
  - Hiển thị preview format "X ngày Y đêm"

### 3. Available Dates Logic Update
- **Yêu cầu**: Chỉ cần chọn ngày bắt đầu, ngày kết thúc tự động tính
- **Logic**: `endDate = startDate + duration - 1`
- **Implementation**:
  - Loại bỏ end date picker
  - Tự động tính toán end date khi start date hoặc duration thay đổi
  - Hiển thị end date dưới dạng readonly

### 4. Start Date Minimum Constraint
- **Yêu cầu**: Ngày bắt đầu phải cách published date ít nhất 1 tuần
- **Logic**: `startDate >= publishedDate + 7 days`
- **Implementation**:
  - Validation động dựa trên published date
  - Disable dates trong date picker
  - Update validation khi published date thay đổi

### 5. Start Date Spacing Constraint
- **Yêu cầu**: Các ngày bắt đầu không được conflict với bất kỳ available date nào đã tồn tại
- **Logic**: 
  ```typescript
  // Kiểm tra với tất cả available dates hiện có
  const hasConflict = existingDates.some(existingDate => {
    const existingStart = new Date(existingDate.startDate);
    const existingEnd = new Date(existingStart.getTime() + (duration - 1) * 24 * 60 * 60 * 1000);
    const newStart = new Date(newStartDate);
    const newEnd = new Date(newStart.getTime() + (duration - 1) * 24 * 60 * 60 * 1000);
    
    // Check overlap: new tour conflicts if it starts before existing ends and ends after existing starts
    return newStart <= existingEnd && newEnd >= existingStart;
  });
  ```
- **Implementation**:
  - Validation kiểm tra conflict với TẤT CẢ available dates hiện có
  - Không phụ thuộc vào thứ tự nhập liệu
  - Hiển thị ngày conflicts cụ thể trong error message
  - Suggest các ngày available tiếp theo

### 6. Employee Selection Integration
- **Yêu cầu**: Thay thế end date input bằng employee selection
- **Implementation**:
  - Sử dụng component `AvailableEmployeeSelect` đã có
  - Pass start date và calculated end date
  - Lưu thông tin employee assignment cho mỗi available date

## Cấu trúc dữ liệu mới

### Form Schema Update
```typescript
interface TourFormValues {
  // ... existing fields
  duration: number; // NEW: Duration in days
  availableDates: Array<{
    startDate: Date;
    // endDate: Date; // REMOVED
    maxSlots: number;
    assignedEmployees: EmployeeBasicResponse[]; // NEW: Employee assignments
  }>;
}
```

### API Payload Update
```typescript
interface TourCreateRequest {
  // ... existing fields
  duration: number; // Use form duration instead of calculated
  availableDates: Array<{
    startDate: Date;
    endDate: Date; // Calculated from startDate + duration
    maxSlots: number;
    employeeIds?: number[]; // NEW: Employee IDs for assignment
  }>;
}
```

## Implementation Steps

### Phase 1: Schema và Validation Updates
1. Cập nhật `createTourSchema` với duration field
2. Thêm validation cho published date (>= current + 7 days)
3. Thêm validation cho start date spacing
4. Cập nhật TypeScript interfaces

### Phase 2: Form Component Updates
1. Thêm Duration input field
2. Cập nhật Published Date picker với date constraints
3. Refactor AvailableDates component:
   - Loại bỏ end date picker
   - Thêm employee selection
   - Implement auto-calculation logic

### Phase 3: Business Logic Implementation
1. Implement end date auto-calculation
2. Implement start date validation based on published date
3. Implement start date spacing validation
4. Update form submission logic

### Phase 4: UI/UX Improvements
1. Hiển thị calculated end date
2. Thêm preview cho "X ngày Y đêm"
3. Improved error messages
4. Date picker enhancements với disabled dates

## Validation Rules Summary

| Field | Rule | Error Message |
|-------|------|---------------|
| publishedDate | >= currentDate + 7 days | "Ngày xuất bản phải sau ngày hiện tại ít nhất 1 tuần" |
| duration | >= 1 && <= 30 | "Thời gian tour từ 1 đến 30 ngày" |
| startDate | >= publishedDate + 7 days | "Ngày bắt đầu phải sau ngày xuất bản ít nhất 1 tuần" |
| startDate spacing | No overlap with any existing dates | "Ngày bắt đầu bị trùng với tour đã có (từ DD/MM/YYYY đến DD/MM/YYYY)" |

## Testing Scenarios

### Test Cases
1. **Published Date Validation**
   - Chọn ngày trong quá khứ → Error
   - Chọn ngày hiện tại → Error
   - Chọn ngày < 7 ngày từ hôm nay → Error
   - Chọn ngày >= 7 ngày từ hôm nay → Success

2. **Duration Input**
   - Nhập 0 → Error
   - Nhập số âm → Error
   - Nhập 1-30 → Success
   - Nhập > 30 → Error

3. **Start Date Constraints**
   - Start date < published date + 7 → Error
   - Start date overlap với bất kỳ available date nào → Error
   - Start date hợp lệ (không conflict) → Success

4. **End Date Calculation**
   - Duration 3, start 2025-07-15 → end 2025-07-17
   - Update duration → end date updates automatically
   - Update start date → end date updates automatically

5. **Employee Selection**
   - Load available employees for date range
   - Select multiple employees
   - Handle employees not available for selected dates

6. **Date Conflict Validation**
   - Thêm date giữa 2 dates đã có → Error
   - Thêm date overlap với đầu/cuối date đã có → Error
   - Thêm date không theo thứ tự thời gian → Still validate correctly
   - Example scenarios:
     - Existing: 15/07 - 17/07 (3 ngày)
     - Try add: 16/07 (3 ngày) → Error (overlap)
     - Try add: 14/07 (3 ngày) → Error (overlap: 14-16 conflicts với 15-17)
     - Try add: 18/07 (3 ngày) → Success (18-20, no conflict)
     - Try add: 12/07 (3 ngày) → Success (12-14, no conflict)

## Migration Notes

### Existing Data
- Tours hiện tại vẫn hoạt động bình thường
- Logic cũ vẫn được support trong read operations
- Chỉ áp dụng logic mới cho tour creation/editing

### Backward Compatibility
- API endpoints giữ nguyên structure
- Frontend tự động calculate end date before sending to API
- Database schema không cần thay đổi major

## Performance Considerations

1. **Employee API Calls**: Chỉ call API khi user focus vào employee select
2. **Date Calculations**: Use memoization để tránh re-calculate
3. **Validation**: Debounce validation để tránh quá nhiều checks
4. **Form State**: Optimize re-renders khi update calculated fields
