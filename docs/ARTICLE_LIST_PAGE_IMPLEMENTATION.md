# Article List Page Implementation

## Overview
Tạo trang danh sách article tương tự như tour list page với filter và sort functionality.

## Requirements

### 1. Page Structure
- **File**: `src/app/[locale]/(marketing)/article/page.tsx`
- Tương tự `tour/page.tsx` với SearchBar (KHÔNG có date picker)
- Layout: SearchBar (top) + FilterSection (trái) + ContentSection (phải)

### 2. Move Components to Shared

#### 2.1. Filter Card Components
Di chuyển các component sau từ `tour/filter-card/` sang `shared/filter-card/`:
- `filter-card.tsx`
- `filter-card-group.tsx`

Cập nhật imports trong các file sử dụng:
- `tour/tour-list/filter-section.tsx`
- Các component khác sử dụng filter-card

### 3. Article Search Bar

**File**: `src/components/features/article/article-search/index.tsx`

#### Features:
- Search input với placeholder "Tìm kiếm bài viết..."
- Button tìm kiếm
- **KHÔNG có date picker** (khác với tour search bar)
- Submit search với query param `searchKey`

```tsx
<SearchBar>
  <SearchInput placeholder="Tìm kiếm bài viết..." />
  <SearchButton>Tìm kiếm</SearchButton>
</SearchBar>
```

### 4. Article Filter Section

**File**: `src/components/features/article/article-list/filter-section.tsx`

#### Filters:
1. **Location Filter**
   - Multi-select checkbox
   - Fetch data từ `useLocationList()`
   - Query param: `location`

2. **Ethnic Filter**
   - Multi-select checkbox
   - Fetch data từ `useEthnicList()`
   - Query param: `ethnic`

3. **Tag Filter**
   - Multi-select checkbox
   - Fetch data từ `useTagList()`
   - Query param: `tags`

### 5. Article Content Section

**File**: `src/components/features/article/article-list/content-section.tsx`

#### Features:
1. **Header với Sort Options**
   - Dropdown select để chọn sort order
   - View mode toggle (chỉ hiển thị horizontal)

2. **Sort Options** (orderBy):
   ```typescript
   const SORT_OPTIONS = {
     NEWEST: { value: 'published_date:desc', label: 'Mới nhất' }, // Default
     OLDEST: { value: 'published_date:asc', label: 'Cũ nhất' },
     MOST_VIEWED: { value: 'views:desc', label: 'Lượt xem giảm dần' },
     MOST_VOTED: { value: 'upvote:desc', label: 'Lượt upvote giảm dần' },
     RELEVANCE: { value: 'relevance:desc', label: 'Phù hợp nhất' }, // Only when searchKey exists
   };
   ```

3. **Results Count**
   - Hiển thị số lượng bài viết tìm được
   - Format: "Tìm thấy X kết quả"

4. **Article List**
   - Grid layout: 1 column (full width)
   - Sử dụng `ArticleItem` với `layout="horizontal"`

5. **Pagination**
   - Sử dụng `PaginationClient`
   - Items per page: 10

6. **Loading & Empty States**
   - Loading spinner khi đang fetch
   - Empty state component khi không có kết quả

### 6. Article Item - Horizontal Layout

**File**: `src/components/features/article/article-item.tsx`

#### Layout Requirements:
```
┌─────────────────────────────────────────────────────────────┐
│  ┌────────┐  ┌────────────────────────────────────────────┐ │
│  │        │  │  📅 DD/MM/YYYY                             │ │
│  │  Image │  │                                            │ │
│  │        │  │  📝 Title (2 lines max, bold, large)      │ │
│  │  Left  │  │                                            │ │
│  │        │  │  🏷️ [Tag 1] [Tag 2] [Tag 3]              │ │
│  │        │  │                                            │ │
│  │  280px │  │  📄 Summary (2-3 lines, gray text)        │ │
│  │        │  │                                            │ │
│  └────────┘  │  👁️ 250 views  ⬆️ 45 upvotes  │  ⏱️ 5 phút đọc │
│              └────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### Component Structure:
```tsx
<Card className="flex flex-row">
  {/* Left: Image */}
  <Link href={articleUrl} className="w-80 shrink-0">
    <div className="relative h-full min-h-[220px]">
      <Image src={imageUrl} alt={title} fill className="object-cover" />
    </div>
  </Link>

  {/* Right: Content */}
  <CardContent className="flex flex-1 flex-col p-5">
    {/* Published Date */}
    <div className="mb-2 text-sm text-gray-500">
      {dayjs(publishedDate).format('DD/MM/YYYY')}
    </div>

    {/* Title */}
    <Link href={articleUrl} className="mb-3">
      <h3 className="line-clamp-2 text-xl font-bold">{title}</h3>
    </Link>

    {/* Tags */}
    {tags && tags.length > 0 && (
      <div className="mb-3 flex flex-wrap gap-1.5">
        {tags.map(tag => (
          <Badge
            key={tag.id}
            style={{ backgroundColor: tag.color }}
          >
            {tag.name}
          </Badge>
        ))}
      </div>
    )}

    {/* Summary */}
    <p className="mb-auto line-clamp-3 text-sm text-gray-600">
      {summary}
    </p>

    {/* Meta Info */}
    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          <span>{views} lượt xem</span>
        </div>
        <div className="flex items-center gap-1">
          <ArrowBigUp className="h-5 w-5" fill="currentColor" />
          <span>{upvote} upvotes</span>
        </div>
      </div>
      <div>
        <span>{readTime} phút đọc</span>
      </div>
    </div>
  </CardContent>
</Card>
```

### 7. API Integration

#### useArticleList Hook Update:
```typescript
// src/hooks/useArticle.ts
export const useArticleList = (params?: ArticleListRequest) => {
  return useQuery({
    queryKey: [ARTICLE_QUERY_KEY.LIST, params],
    queryFn: () => articleApi.getArticleList(params),
  });
};
```

#### Query Parameters:
- `searchKey`: string (optional)
- `sortBy`: 'published_date' | 'views' | 'upvote' | 'relevance'
- `order`: 'asc' | 'desc'
- `location`: string[] (comma-separated)
- `ethnic`: string[] (comma-separated)
- `tags`: string[] (comma-separated)
- `page`: number (default: 0)
- `size`: number (default: 10)

### 8. Empty State Component

**File**: `src/components/features/article/article-list/empty-state.tsx`

```tsx
export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <FileText className="h-16 w-16 text-gray-400" />
      <h3 className="mt-4 text-lg font-semibold">Không tìm thấy bài viết</h3>
      <p className="mt-2 text-sm text-gray-500">
        Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
      </p>
    </div>
  );
}
```

### 9. Responsive Design

#### Desktop (>= 768px):
- FilterSection: Fixed width 256px (w-64)
- ContentSection: Flex 1
- ArticleItem: Horizontal layout

#### Mobile (< 768px):
- FilterSection: Collapsible/Drawer
- ContentSection: Full width
- ArticleItem: Vertical layout (fallback)

## Implementation Steps

1. ✅ **Move filter components to shared**
   - Create `src/components/shared/filter-card/`
   - Move and update imports

2. ✅ **Create article list structure**
   - Create `src/app/[locale]/(marketing)/article/page.tsx`
   - Create `src/components/features/article/article-list/` folder
   - Create `src/components/features/article/article-search/` folder

3. ✅ **Implement search bar**
   - Create article search bar (no date picker)
   - Integrate with searchKey query param

4. ✅ **Implement filter section**
   - Create `filter-section.tsx`
   - Integrate location, ethnic, tag filters

5. ✅ **Implement content section**
   - Create `content-section.tsx`
   - Add header with sort dropdown
   - Add article list grid
   - Add pagination

6. ✅ **Update ArticleItem component**
   - Enforce horizontal layout
   - Update layout structure as specified
   - Add all required meta information

7. ✅ **Create empty state**
   - Create `empty-state.tsx`

8. ✅ **Test & polish**
   - Test all filters
   - Test sorting
   - Test pagination
   - Responsive design
   - Loading states

## Notes

- **Có SearchBar** nhưng KHÔNG có date picker (khác với tour search bar)
- Search input trong SearchBar tích hợp với query param `searchKey`
- **ArticleItem chỉ dùng horizontal layout** - không cần vertical option
- **Sort relevance** chỉ xuất hiện khi có searchKey
- **Read time calculation**: Dựa vào content length (ước tính 200-250 chữ/phút)
- **Published date format**: DD/MM/YYYY (Vietnamese format)
- **i18n**: Sử dụng `useTranslations` với namespace `article` trong `vi.json` và `en.json`

## Dependencies

### New/Updated Files:
- `src/app/[locale]/(marketing)/article/page.tsx` ✨ NEW
- `src/components/features/article/article-search/index.tsx` ✨ NEW
- `src/components/features/article/article-list/filter-section.tsx` ✨ NEW
- `src/components/features/article/article-list/content-section.tsx` ✨ NEW
- `src/components/features/article/article-list/header-section.tsx` ✨ NEW
- `src/components/features/article/article-list/empty-state.tsx` ✨ NEW
- `src/components/features/article/article-item.tsx` 🔄 UPDATE
- `src/components/shared/filter-card/filter-card.tsx` 📦 MOVED
- `src/components/shared/filter-card/filter-card-group.tsx` 📦 MOVED

### Existing Dependencies:
- `useArticleList` hook
- `useLocationList` hook
- `useEthnicList` hook
- `useTagList` hook
- `useQueryConfig` hook
- `PaginationClient` component
- `Badge`, `Card`, `Input`, `Select` UI components
