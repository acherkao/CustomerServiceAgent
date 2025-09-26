import * as fs from 'fs';
import { SpeakerLabel, TranscribedItem } from '../types/common';
import { backupFile } from './general';

/**
 * Transcribes multiple channels of speaker labels data into the specified format.
 * @param data - The JSON object containing the result data.
 * @returns An array of TranscribedItem objects representing the transcribed data.
 */
export const transcribeMultipleChannels = (data: any): TranscribedItem[] => {
  const output: TranscribedItem[] = [];
  let utteranceNumber = 0;
  let wordId = 0;

  if (data && data.result && data.result.speaker_labels) {
    const speakerLabels = data.result.speaker_labels;

    for (let i = 0; i < speakerLabels.length; i++) {
      const label = speakerLabels[i];

      if (i === 0 || label.speaker !== speakerLabels[i - 1].speaker) {
        utteranceNumber++;
        wordId = 0;
      }

      wordId++;

      const word = interpolateWordFromJSON(label.from, data);

      output.push({
        channel: label.speaker,
        // start: parseFloat((label.from - 0.02).toFixed(2)),
        start: label.from,
        end: label.to,
        utteranceNumber,
        word,
        id: wordId,
        offsetBegin: 1,
      });
    }
  }

  backupFile('transcribed_data.json', 'stt_data', 'backup');
  const filePath = './stt_data/transcribed_data.json';
  fs.writeFileSync(filePath, JSON.stringify(output, null, 2), 'utf8');

  return output;
};

/**
 * Interpolates a word from the given JSON data based on the provided timestamp.
 *
 * @param timestamp - The timestamp for which to retrieve the word.
 * @param data - The JSON data containing speech recognition results.
 * @returns The interpolated word at the specified timestamp or '<Unavailable>' if not found.
 *
 * @example
 * const word = interpolateWordFromJSON(0.2, jsonData);
 * // Returns the word at timestamp 0.2 seconds from the JSON data, or '<Unavailable>' if not found.
 */
function interpolateWordFromJSON(timestamp: number, data: any): string {
  if (data && data.result && data.result.results) {
    const results = data.result.results;
    for (const result of results) {
      if (result.alternatives && result.alternatives.length > 0) {
        const timestamps = result.alternatives[0].timestamps;
        for (const [word, start, end] of timestamps) {
          if (timestamp >= start && timestamp < end) {
            return word;
          }
        }
      }
    }
  }
  return '<Unavailable>';
}
