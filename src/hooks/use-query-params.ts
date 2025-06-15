import { useSearchParams } from 'next/navigation';

export const useQueryParams = () => {
  const searchParams = useSearchParams();
  const params: Record<string, string | string[]> = {};

  // Create a map to store unique values for each key
  const uniqueValuesMap = new Map<string, Set<string>>();

  // First pass: collect all unique values
  searchParams.forEach((value, key) => {
    if (!uniqueValuesMap.has(key)) {
      uniqueValuesMap.set(key, new Set());
    }
    uniqueValuesMap.get(key)?.add(value);
  });

  // Second pass: create the params object with unique values
  uniqueValuesMap.forEach((values, key) => {
    const valuesArray = Array.from(values);
    params[key] = valuesArray.length > 1 ? valuesArray : valuesArray[0];
  });

  return params;
};
