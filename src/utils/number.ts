import dayjs from 'dayjs';

import 'dayjs/locale/vi';

const EXCEEDING_LIMIT_VALUE = 1.79769313e308;
const STANDARD_SUFFIXES = ['', 'K', 'M', 'B', 'T'];

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

export function formatCurrency(
  value: number | string,
  options?: {
    locale?: 'vi' | 'en' | 'ko';
    discount_percent?: number;
    max_discount_amount?: number;
  },
): string {
  const { locale = 'vi', discount_percent, max_discount_amount } = options || {};

  let number = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(number)) return locale === 'vi' ? '0đ' : locale === 'ko' ? '₩0' : '$0';

  if (discount_percent && max_discount_amount) {
    number = calculateDiscount(number, discount_percent, max_discount_amount);
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

export function formatTimeAgo(timestamp: Date, locale = 'vi-VN') {
  let value;
  const diff = (new Date().getTime() - timestamp.getTime()) / 1000;
  const minutes = Math.floor(diff / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (years > 0) {
    value = rtf.format(0 - years, 'year');
  } else if (months > 0) {
    value = rtf.format(0 - months, 'month');
  } else if (days > 0) {
    value = rtf.format(0 - days, 'day');
  } else if (hours > 0) {
    value = rtf.format(0 - hours, 'hour');
  } else if (minutes > 0) {
    value = rtf.format(0 - minutes, 'minute');
  } else {
    value = rtf.format(0 - diff, 'second');
  }
  return value;
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

interface FormatTourDatesOptions {
  locale?: 'en' | 'vi';
  dateFormat?: string;
}

export function formatTourDates(startDate: Date, endDate: Date, options: FormatTourDatesOptions = {}) {
  const { locale = 'vi', dateFormat = 'MMM DD, YYYY' } = options;

  dayjs.locale(locale);

  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const days = end.diff(start, 'day') + 1;
  const nights = days - 1;

  return {
    startDate: start.format(dateFormat),
    endDate: end.format(dateFormat),
    duration: locale === 'en' ? `${days}D-${nights}N` : `${days} ngày ${nights} đêm`,
    durationShort: `${days}D-${nights}N`,
  };
}
