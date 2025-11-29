# Requirements Document

## Introduction

Tài liệu này mô tả các yêu cầu cho việc tái cấu trúc components trong dự án Ethnic Village Travel Frontend. Mục tiêu là
cải thiện tổ chức code, tăng khả năng tái sử dụng, và đảm bảo tính nhất quán trong cách đặt tên và cấu trúc thư mục.

## Glossary

- **Component**: Một đơn vị UI có thể tái sử dụng được viết bằng React/TypeScript
- **Feature Component**: Component thuộc về một domain/tính năng cụ thể (tour, booking, auth...)
- **Shared Component**: Component dùng chung giữa nhiều features
- **UI Component**: Component primitive cơ bản (Button, Input, Dialog...)
- **Layout Component**: Component định nghĩa cấu trúc trang (Header, Footer, Sidebar...)
- **Barrel Export**: File index.ts/tsx export tất cả components từ một thư mục
- **Colocation**: Nguyên tắc đặt các file liên quan gần nhau

## Requirements

### Requirement 1: Chuẩn hóa cấu trúc thư mục Feature Components

**User Story:** Là một developer, tôi muốn có cấu trúc thư mục nhất quán cho tất cả feature components, để dễ dàng tìm
kiếm và bảo trì code.

#### Acceptance Criteria

1. WHEN một feature component được tạo mới THEN hệ thống cấu trúc thư mục SHALL tuân theo pattern:
   `features/{domain}/{feature-name}/` với các sub-components bên trong
2. WHEN một feature có nhiều hơn 3 sub-components THEN cấu trúc thư mục SHALL nhóm các sub-components liên quan vào thư
   mục con
3. WHEN một feature component folder được tạo THEN folder đó SHALL có file `index.ts` export component chính và các
   sub-components cần thiết
4. IF một feature component không có file index.ts THEN quá trình refactor SHALL tạo file index.ts với barrel exports
   phù hợp

### Requirement 2: Chuẩn hóa Shared Components

**User Story:** Là một developer, tôi muốn các shared components được tổ chức theo chức năng, để dễ dàng tìm và tái sử
dụng.

#### Acceptance Criteria

1. WHEN shared components được tổ chức THEN hệ thống SHALL nhóm chúng theo chức năng: `form/`, `data-display/`,
   `feedback/`, `navigation/`
2. WHEN một shared component được tạo mới THEN component đó SHALL có file riêng với tên kebab-case và export default
3. WHEN thư mục shared components được cập nhật THEN thư mục đó SHALL có file `index.ts` export tất cả components
4. IF một shared component chỉ được sử dụng bởi một feature THEN component đó SHALL được chuyển vào thư mục feature
   tương ứng

### Requirement 3: Chuẩn hóa UI Components

**User Story:** Là một developer, tôi muốn UI components tuân theo chuẩn shadcn/ui, để đảm bảo tính nhất quán và dễ bảo
trì.

#### Acceptance Criteria

1. WHEN UI components được tổ chức THEN hệ thống SHALL giữ cấu trúc flat với mỗi component một file
2. WHEN một UI component có variants THEN component đó SHALL sử dụng class-variance-authority (CVA) để quản lý variants
3. WHEN UI components được import THEN import path SHALL sử dụng alias `@/components/ui/{component-name}`
4. IF một UI component có sub-components (như Form với FormField, FormItem) THEN tất cả SHALL được export từ cùng một
   file

### Requirement 4: Chuẩn hóa Layout Components

**User Story:** Là một developer, tôi muốn layout components được tổ chức theo context sử dụng, để dễ dàng quản lý các
layout khác nhau.

#### Acceptance Criteria

1. WHEN layout components được tổ chức THEN hệ thống SHALL phân chia theo context: `admin/`, `marketing/`, `user/`
2. WHEN một layout folder được tạo THEN folder đó SHALL có file `index.ts` export tất cả layout components
3. WHEN layout components được sử dụng THEN chúng SHALL được import từ `@/components/layout/{context}`
4. IF một layout component được dùng chung giữa nhiều contexts THEN component đó SHALL được đặt trong `layout/shared/`

### Requirement 5: Chuẩn hóa Naming Convention

**User Story:** Là một developer, tôi muốn tất cả components tuân theo naming convention nhất quán, để code dễ đọc và
bảo trì.

#### Acceptance Criteria

1. WHEN một component file được tạo THEN tên file SHALL sử dụng kebab-case (ví dụ: `tour-detail-header.tsx`)
2. WHEN một component được export THEN tên component SHALL sử dụng PascalCase (ví dụ: `TourDetailHeader`)
3. WHEN một component folder được tạo THEN tên folder SHALL sử dụng kebab-case và match với component chính
4. WHEN một component có props interface THEN interface SHALL được đặt tên theo pattern `{ComponentName}Props`
5. IF một file chỉ chứa types THEN file đó SHALL có suffix `.types.ts`

### Requirement 6: Tối ưu hóa Component Exports

**User Story:** Là một developer, tôi muốn có cách import components nhất quán và ngắn gọn, để giảm boilerplate code.

#### Acceptance Criteria

1. WHEN một feature folder có index.ts THEN index.ts SHALL export component chính là default export
2. WHEN một feature folder có nhiều public components THEN index.ts SHALL export named exports cho các components phụ
3. WHEN components được import trong cùng feature THEN import SHALL sử dụng relative path
4. WHEN components được import từ feature khác THEN import SHALL sử dụng absolute path với alias `@/`
5. IF một component không được export từ index.ts THEN component đó SHALL được coi là internal/private

### Requirement 7: Xử lý Components không sử dụng

**User Story:** Là một developer, tôi muốn loại bỏ các components không còn sử dụng, để giảm kích thước codebase và
tránh nhầm lẫn.

#### Acceptance Criteria

1. WHEN quá trình refactor được thực hiện THEN hệ thống SHALL xác định các components không được import ở bất kỳ đâu
2. WHEN một component được xác định là không sử dụng THEN component đó SHALL được đánh dấu để review
3. WHEN một component được xác nhận không cần thiết THEN component đó SHALL được xóa khỏi codebase
4. IF một component có thể cần trong tương lai THEN component đó SHALL được di chuyển vào thư mục `_deprecated/` với
   comment giải thích
