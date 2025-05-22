/**
 * Function to check if string has white space
 * @param str - String to check
 * @returns Boolean
 */
export function hasWhiteSpace(str: string) {
  return /\s/g.test(str);
}

/**
 * Function to hash string to number
 * @param str - String to hash
 * @returns Number
 */
export function hashStringToNumber(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Function to remove Vietnamese tones
 * @param str - String to remove Vietnamese tones
 * @returns String without Vietnamese tones
 */
function removeVietnameseTones(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

/**
 * Function to slugify string
 * @param str - String to slugify
 * @returns Slugified string
 */
export function slugify(str: string) {
  return removeVietnameseTones(str)
    .toLowerCase()
    .replace(/[^a-zA-Z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/ /g, '-');
}
