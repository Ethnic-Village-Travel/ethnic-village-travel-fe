export type FilterItem = {
  label: string;
  value: string; // Used for URL query params
  apiValue?:
    | {
        min?: number;
        max?: number;
      }
    | string
    | number
    | boolean; // Used for API parameters
  id?: number;
};

export type FilterConfig = {
  title: string;
  name: string;
  items: FilterItem[];
  maxVisible: number;
  isMultiSelect?: boolean;
};

export const FILTERS: Record<string, FilterConfig> = {
  ethnic: {
    title: 'Ethnic',
    name: 'e',
    items: [],
    maxVisible: 4,
  },
  popular: {
    title: 'Popular Filter',
    name: 'p',
    items: [
      { label: 'ĐANG GIẢM GIÁ', value: 'on_sale', apiValue: true },
      // { label: '8+ Ấn tượng', value: 'rating_gte_8' },
      // { label: 'Được yêu thích nhất', value: 'most_favorited' },
      // { label: '7+ Days', value: 'duration_gte_7' },
    ],
    maxVisible: 4,
  },
  location: {
    title: 'Location',
    name: 'l',
    items: [],
    maxVisible: 5,
  },
  duration: {
    title: 'Duration',
    name: 'd',
    items: [
      {
        label: '1 Day',
        value: 'duration_eq_1',
        apiValue: { min: 1, max: 1 },
      },
      {
        label: '2-3 Days',
        value: 'duration_between_2_3',
        apiValue: { min: 2, max: 3 },
      },
      {
        label: '4-7 Days',
        value: 'duration_between_4_7',
        apiValue: { min: 4, max: 7 },
      },
      {
        label: '7+ Days',
        value: 'duration_gte_7',
        apiValue: { min: 7 },
      },
    ],
    maxVisible: 4,
    isMultiSelect: false,
  },
  rating: {
    title: 'Rating',
    name: 'r',
    items: [
      { label: '5 stars', value: 'rating_eq_5', apiValue: 5 },
      { label: '4 stars and up', value: 'rating_gte_4', apiValue: 4 },
      { label: '3 stars and up', value: 'rating_gte_3', apiValue: 3 },
    ],
    maxVisible: 3,
    isMultiSelect: false,
  },
};
