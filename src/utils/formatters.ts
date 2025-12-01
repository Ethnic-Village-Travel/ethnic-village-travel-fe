// NOTE: These functions have been moved to their appropriate utility files:
// - formatDate -> @/utils/date
// - formatCurrency -> @/utils/number
// - formatBookingStatus -> use translations instead with @/admin/booking/list/status namespace

export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  // Format Vietnamese phone number
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
}
