/**
 * Payment utility functions
 */

/**
 * Check if payment has expired
 */
export function isPaymentExpired(expiryDate: string | null | undefined): boolean {
  if (!expiryDate) return true;
  return new Date(expiryDate) <= new Date();
}

/**
 * Get time remaining until payment expiry
 * Returns null if expired or no expiry date
 */
export function getTimeRemaining(expiryDate: string | null | undefined): string | null {
  if (!expiryDate || isPaymentExpired(expiryDate)) {
    return null;
  }

  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffMs = expiry.getTime() - now.getTime();

  const minutes = Math.floor(diffMs / 60000);
  const seconds = Math.floor((diffMs % 60000) / 1000);

  if (minutes > 0) {
    return `${minutes} phút ${seconds} giây`;
  }
  return `${seconds} giây`;
}

/**
 * Check if booking can retry payment
 */
export function canRetryPayment(
  status: string,
  paymentExpiredDate: string | null | undefined,
): boolean {
  return status === 'PENDING_PAYMENT' && !isPaymentExpired(paymentExpiredDate);
}
