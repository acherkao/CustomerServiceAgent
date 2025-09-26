/**
 * Removes HTML tags from a given string and returns the cleaned text.
 *
 * This function takes an input string containing HTML content and removes
 * all HTML tags, returning the plain text content.
 *
 * @param str - The input string containing HTML content to be cleaned.
 * @returns A string with HTML tags removed, or an empty string if the input is falsy.
 *
 * @throws {Error} If the input is not a valid string.
 *
 * @example
 * const htmlContent = '<em>Example</em> <strong>Text</strong>';
 * const cleanedText = cleanPassageText(htmlContent);
 * // Result: 'Example Text'
 */
export const cleanPassageText = (str: string): string => {
  if (typeof str !== 'string') {
    throw new Error('Input must be a valid string');
  }

  if (!str) {
    return '';
  }

  const cleanText = str.replace(/<\/?[^>]+(>|$)/g, '');

  return cleanText;
};
