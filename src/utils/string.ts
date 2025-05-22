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
