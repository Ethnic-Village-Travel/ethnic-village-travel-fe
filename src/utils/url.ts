type ParamKeyValuePair = [string, string];
type ParamValue = string | number | boolean | string[] | number[] | undefined | null;
type QueryConfig = Record<string, ParamValue>;

/**
 * Creates a URLSearchParams object from an object containing query parameters.
 *
 * @param init - Object containing key-value pairs to be converted into query parameters
 * @returns URLSearchParams object containing the processed parameters
 *
 * @example
 * // Using with single values
 * createSearchParams({ page: 1, search: "test" })
 * // => URLSearchParams: "page=1&search=test"
 *
 * // Using with arrays
 * createSearchParams({ tags: ["tag1", "tag2"] })
 * // => URLSearchParams: "tags=tag1,tag2"
 *
 * // Ignoring null/undefined values
 * createSearchParams({ page: 1, filter: null })
 * // => URLSearchParams: "page=1"
 */
export const createSearchParams = (init: QueryConfig): URLSearchParams => {
  const entries: ParamKeyValuePair[] = Object.entries(init).reduce((acc, [key, value]) => {
    if (value === undefined || value === null || value === '') return acc;

    if (Array.isArray(value)) {
      if (value.length > 0) {
        acc.push([key, value.join(',')]);
      }
    } else {
      acc.push([key, String(value)]);
    }
    return acc;
  }, [] as ParamKeyValuePair[]);

  return new URLSearchParams(entries);
};

export const normalizePath = (path: string): string => {
  // Thay thế các đoạn động (:id, :slug, v.v.) bằng định dạng chung
  return path.replace(/\/:[^/]+/g, '/[^/]+');
};
