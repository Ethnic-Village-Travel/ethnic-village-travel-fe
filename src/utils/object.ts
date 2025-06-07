interface EnumValue {
  value: string;
  label: string;
  [key: string]: any;
}

type EnumObject = Record<string, EnumValue>;

export const getEnumOptions = (obj: EnumObject) => {
  return Object.entries(obj).map(([_, value]) => ({
    id: value.value,
    name: value.label,
  }));
};

export const getEnumKey = (key: string) => {
  return key
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
