export enum ArticleStatus {
  DRAFT = 'DRAFT',
  REVIEWING = 'REVIEWING',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
}

export const ArticleStatusEnum: Record<
  ArticleStatus,
  {
    value: ArticleStatus;
    variant: string;
    label: string;
  }
> = {
  DRAFT: {
    value: 'DRAFT',
    variant: 'gray',
    label: 'DRAFT',
  },
  REVIEWING: {
    value: 'REVIEWING',
    variant: 'indigo',
    label: 'REVIEWING',
  },
  REJECTED: {
    value: 'REJECTED',
    variant: 'red',
    label: 'REJECTED',
  },
  APPROVED: {
    value: 'APPROVED',
    variant: 'blue',
    label: 'APPROVED',
  },
  SCHEDULED: {
    value: 'SCHEDULED',
    variant: 'purple',
    label: 'SCHEDULED',
  },
  PUBLISHED: {
    value: 'PUBLISHED',
    variant: 'teal',
    label: 'PUBLISHED',
  },
};
