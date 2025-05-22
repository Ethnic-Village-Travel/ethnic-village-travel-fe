type ParamKeyValuePair = [string, string];
type URLSearchParamsInit = string | string[][] | Record<string, string> | URLSearchParams;
export const createSearchParams = (init: URLSearchParamsInit): URLSearchParams => {
  if (typeof init === 'string' || Array.isArray(init) || init instanceof URLSearchParams) {
    return new URLSearchParams(init);
  }

  const entries: ParamKeyValuePair[] = Object.keys(init).reduce((acc, key) => {
    const value = init[key];
    if (Array.isArray(value)) {
      value.forEach(v => acc.push([key, v]));
    } else {
      acc.push([key, value]);
    }
    return acc;
  }, [] as ParamKeyValuePair[]);

  return new URLSearchParams(entries);
};
