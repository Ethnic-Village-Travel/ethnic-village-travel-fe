export const TourStatusEnum = {
  DRAFT: {
    value: '0',
    label: 'Draft',
    variant: 'gray',
  },
  APPROVED: {
    value: '1',
    label: 'Approved',
    variant: 'blue',
  },
  SCHEDULED: {
    value: '2',
    label: 'Scheduled',
    variant: 'purple',
  },
  PUBLISHED: {
    value: '3',
    label: 'Published',
    variant: 'teal',
  },
  FULLY_BOOKED: {
    value: '4',
    label: 'Fully Booked',
    variant: 'amber',
  },
  ONGOING: {
    value: '5',
    label: 'Ongoing',
    variant: 'green',
  },
  PAUSED: {
    value: '6',
    label: 'Paused',
    variant: 'orange',
  },
  COMPLETED: {
    value: '7',
    label: 'Completed',
    variant: 'blue',
  },
  CANCELLED: {
    value: '8',
    label: 'Cancelled',
    variant: 'red',
  },
} as const;
