/**
 * Truncates text to a maximum length while respecting word boundaries
 * @param text - The text to truncate
 * @param maxLength - Maximum length of the truncated text
 * @param suffix - Suffix to add when text is truncated (default: '...')
 * @returns Truncated text with suffix if needed
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (!text || text.length <= maxLength) {
    return text;
  }

  // Find the last space within the maxLength limit
  const truncated = text.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');

  // If there's a space, truncate at word boundary
  // Otherwise, truncate at maxLength (for single long word)
  const finalText = lastSpaceIndex > 0 ? truncated.slice(0, lastSpaceIndex) : truncated;

  return finalText.trim() + suffix;
}

/**
 * Removes extra whitespace and normalizes text
 * @param text - The text to normalize
 * @returns Normalized text
 */
export function normalizeText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Strips HTML tags from text
 * @param html - HTML string to strip
 * @returns Plain text without HTML tags
 */
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}
