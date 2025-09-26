import * as fs from 'fs';
import { TranscribedItem, UtteranceItem } from '../types/common';
import { backupFile } from './general';

/**
 * Creates an array of UtteranceItem objects by grouping TranscribedItem data based on utterance numbers.
 *
 * @param inputData - An array of TranscribedItem objects to be grouped into UtteranceItem objects.
 * @returns An array of UtteranceItem objects representing grouped transcribed data.
 *
 * @example
 * const transcribedData: TranscribedItem[] = [
 *   {
 *     utteranceNumber: 1,
 *     word: "thank",
 *     start: 0.2,
 *     end: 0.43,
 *     channel: 0,
 *   },
 *   // ... other TranscribedItem objects
 * ];
 *
 * const utteranceItems: UtteranceItem[] = createUtteranceJson(transcribedData);
 * // Returns an array of UtteranceItem objects with grouped utterances.
 */
export const createUtteranceJson = (
  inputData: TranscribedItem[]
): UtteranceItem[] => {
  const groupedData: { [utteranceNumber: number]: UtteranceItem } = {};

  for (const inputItem of inputData) {
    const { utteranceNumber, word, start, end, channel } = inputItem;

    if (!groupedData[utteranceNumber]) {
      groupedData[utteranceNumber] = {
        utteranceNumber,
        text: word,
        start,
        end,
        channel,
      };
    } else {
      groupedData[utteranceNumber].text += ` ${word}`;
      groupedData[utteranceNumber].end = end;
    }
  }

  const result = Object.values(groupedData);
  const filePath = './stt_data/utterance.json';
  backupFile('utterance.json', 'stt_data', 'backup');
  fs.writeFileSync(filePath, JSON.stringify(result, null, 2), 'utf8');

  return result;
};
