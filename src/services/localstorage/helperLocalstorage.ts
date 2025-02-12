/* eslint-disable no-console */
const isString = (value: unknown) => typeof value === 'string';

export const getLocalStorageState = <T>(
  nameItem: string,
  defaultValue: T,
): T | null => {
  let state = null;

  try {
    const storedData: string | null = window.localStorage.getItem(nameItem);

    if (storedData) {
      state = isString(storedData) ? storedData : { ...JSON.parse(storedData) };
    } else {
      state = defaultValue;
    }
  } catch (err) {
    console.error(err);
  }
  return state;
};

export const setLocalStorageState = <T extends string | object>(
  nameItem: string,
  value: T,
) => {
  const valueToStore = isString(value)
    ? (value as string)
    : JSON.stringify(value);

  window.localStorage.setItem(nameItem, valueToStore);
};
