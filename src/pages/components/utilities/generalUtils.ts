/**
 * Converts an array of transcript messages into a formatted string.
 * Each message is concatenated with its type.
 *
 * @param data - An array of transcript messages.
 * @returns A formatted transcript string.
 */
export const jsonTranscriptToString = (data: TranscriptMessage[]): string => {
  const formattedTranscript = data.reduce((accumulator, item) => {
    return `${accumulator}${item.type}: ${item.message} `;
  }, '');
  return formattedTranscript;
};
