export enum ArticleStatus {
  DRAFT = 'DRAFT',
  REVIEWING = 'REVIEWING',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
}

export const ArticleStatusEnum = {
  DRAFT: {
    value: 'DRAFT',
    variant: 'gray',
  },
  REVIEWING: {
    value: 'REVIEWING',
    variant: 'indigo',
  },
  REJECTED: {
    value: 'REJECTED',
    variant: 'red',
  },
  APPROVED: {
    value: 'APPROVED',
    variant: 'blue',
  },
  SCHEDULED: {
    value: 'SCHEDULED',
    variant: 'purple',
  },
  PUBLISHED: {
    value: 'PUBLISHED',
    variant: 'teal',
  },
} as const;
