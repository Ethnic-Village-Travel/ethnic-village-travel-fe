const EXCEEDING_LIMIT_VALUE = 1.79769313e308;
const STANDARD_SUFFIXES = ['', 'K', 'M', 'B', 'T'];
const VND_TO_USD_RATE = 25000;

const EXTENDED_SUFFIXES: string[] = (() => {
  const suffixes: string[] = [];
  for (let i = 97; i < 123; i++) {
    for (let j = 97; j < 123; j++) {
      suffixes.push(String.fromCharCode(i) + String.fromCharCode(j));
    }
  }
  return suffixes;
})();

export function formatShortNumber(number: number | string | bigint | undefined | null, decimals: number = 2): string {
  const value = Number(number);
  if (!Number.isFinite(value) || value === 0) return '0';
  if (value > EXCEEDING_LIMIT_VALUE) return '999cz';

  let suffix = '';
  let formattedValue = value;

  if (Math.abs(value) < 1000) {
    formattedValue = Number(value.toFixed(decimals));
  } else if (value < 1e15) {
    // Standard suffixes: K, M, B, T
    const exponent = Math.min(Math.floor(Math.log10(value) / 3), STANDARD_SUFFIXES.length - 1);
    formattedValue = value / 10 ** (exponent * 3);
    suffix = STANDARD_SUFFIXES[exponent];
  } else {
    // Extended suffixes: aa, ab, ..., cz
    const exponent = Math.floor(Math.log10(value) / 3) - 4;
    if (exponent >= EXTENDED_SUFFIXES.length) return '999cz';
    formattedValue = value / 10 ** ((exponent + 4) * 3);
    suffix = EXTENDED_SUFFIXES[exponent];
  }

  return `${Number(formattedValue.toFixed(decimals))}${suffix}`;
}

export function formatNumber(
  number: number | bigint | string | undefined | null,
  config: {
    maxLength?: number;
    decimals?: number;
    limitNoShortNumber?: number;
  } = { maxLength: 10, decimals: 2, limitNoShortNumber: 100_000_000 },
): string {
  if (Number(number) < 0.000001) {
    return '0';
  }
  if (Number(number) > Number(config?.limitNoShortNumber)) {
    return formatShortNumber(number);
  }
  const numberString = Number(Number(number || 0).toFixed(config?.decimals)).toString();
  const parts = numberString.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const totalLength = parts.join('').length;
  if (totalLength > Number(config?.maxLength || 10)) {
    let remainingLength = Number(config?.maxLength || 10) - parts[0].length;
    if (remainingLength < 0) {
      remainingLength = 0;
    }
    parts[1] = parts[1]?.substring?.(0, remainingLength).replace(/([1-9])0+/g, '$1');
  }
  let result = /^0+$/.test(parts[1]) ? parts[0] : parts.join('.');
  if (result.endsWith('.')) {
    result = result.slice(0, -1);
  }

  return result;
}

export function currencyToNumber(value: string): number {
  const number = value.replace(/[^0-9]/g, '');
  return parseInt(number, 10);
}

export function formatCurrency(
  value: number | string | undefined | null,
  options?: {
    locale?: 'vi' | 'en' | 'ko';
    discount_percent?: number;
    max_discount_amount?: number;
  },
): string {
  if (value === undefined || value === null) return '0';

  const { locale = 'vi', discount_percent = 0, max_discount_amount = 0 } = options || {};

  let number = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(number)) return locale === 'vi' ? '0đ' : locale === 'ko' ? '₩0' : '$0';

  if (discount_percent && max_discount_amount) {
    number = calculateDiscount(number, discount_percent, max_discount_amount);
  }

  // Convert VND to USD for English locale
  if (locale === 'en') {
    number = Math.round((number / VND_TO_USD_RATE) * 100) / 100;
  }

  const currencyFormatters = {
    vi: (n: number) => n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ',
    en: (n: number) => '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    ko: (n: number) => '₩' + n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
  };

  return currencyFormatters[locale](number);
}

export function calculateDiscount(value: number, discountPercent: number, maxDiscountAmount: number) {
  const rawDiscount = (value * discountPercent) / 100;
  const discount = maxDiscountAmount ? Math.min(rawDiscount, maxDiscountAmount) : rawDiscount;
  return value - discount;
}

export function calculateRatingPercentage(
  ratingCounts: {
    [key: number]: number;
  },
  totalReviews: number,
) {
  const ratingPercentage: {
    [key: number]: number;
  } = {};

  for (let i = 1; i <= Object.keys(ratingCounts).length; i++) {
    ratingPercentage[i] = (ratingCounts[i] / totalReviews) * 100;
  }

  return ratingPercentage;
}
