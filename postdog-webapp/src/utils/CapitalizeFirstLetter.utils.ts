
export const capitalizeFirstLetter = (text: string): string => {
  if (!text) return '';

  const trimmed = text.trimStart();
  const firstChar = trimmed.charAt(0).toUpperCase();
  return firstChar;
};
