export const TourStatusEnum = {
  DRAFT: {
    value: '0',
    label: 'Draft',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
  },
  APPROVED: {
    value: '1',
    label: 'Approved',
    color: 'bg-blue-50 text-blue-800 border-blue-200',
  },
  SCHEDULED: {
    value: '2',
    label: 'Scheduled',
    color: 'bg-purple-50 text-purple-800 border-purple-200',
  },
  PUBLISHED: {
    value: '3',
    label: 'Published',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  FULLY_BOOKED: {
    value: '4',
    label: 'Fully Booked',
    color: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  ONGOING: {
    value: '5',
    label: 'Ongoing',
    color: 'bg-green-50 text-green-800 border-green-200',
  },
  PAUSED: {
    value: '6',
    label: 'Paused',
    color: 'bg-orange-50 text-orange-800 border-orange-200',
  },
  COMPLETED: {
    value: '7',
    label: 'Completed',
    color: 'bg-blue-50 text-blue-800 border-blue-200',
  },
  CANCELLED: {
    value: '8',
    label: 'Cancelled',
    color: 'bg-red-50 text-red-800 border-red-200',
  },
} as const;
