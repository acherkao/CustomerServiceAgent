import * as fs from 'fs';
import SpeechToTextV1 from 'ibm-watson/speech-to-text/v1';
import { IamAuthenticator } from 'ibm-watson/auth';
import { backupFile } from './general';

import dotenv from 'dotenv';
dotenv.config();

const STT_API_KEY: string | undefined = process.env.WATSON_STT_API_KEY;
const STT_URL: string | undefined = process.env.WATSON_STT_URL;

const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: STT_API_KEY || '',
  }),
  serviceUrl: STT_URL || '',
});

/**
 * Processes audio using IBM Watson Speech to Text service and saves the results.
 *
 * @param type - The prefix to the transcribed audio file (e.g., 'combined', 'prelim', etc.).
 * @param audio - The path to the audio file to be processed.
 * @param contentType - The content type of the audio (e.g., "audio/wav").
 *
 * @throws Throws an error if there is an issue during the audio processing or backup process.
 *
 * @returns A promise that resolves with the Speech to Text response.
 *
 * @example
 * // Example usage:
 * const type: string = 'combined';
 * const audioFilePath: string = 'path/to/audio.wav';
 * const contentType: string = 'audio/wav';
 * const sttResponse: any = await processAudioWithWatsonSpeechToText(type, audioFilePath, contentType);
 */
export const processAudioWithWatsonSpeechToText = async (
  type: string,
  audio: string,
  contentType: string,
  loading: Function
) => {
  // terminal message (with loading animation! (very cool(works not great)))
  const recognizeParams = {
    audio: fs.createReadStream(audio),
    contentType: contentType,
    wordAlternativesThreshold: 0.5,
    speakerLabels: true,
    wordConfidence: true,
    timestamps: true,
  };
  try {
    const stopAnimation = loading('Watson STT working');
    const sttResponse = await speechToText.recognize(recognizeParams);
    const fileName = `${type}_stt_output.json`;

    // Log output from watson stt and make a copy and place it in the backup folder if one already exists
    backupFile(fileName, 'stt_data', 'backup');
    fs.writeFileSync(
      `./stt_data/${type}_stt_output.json`,
      JSON.stringify(sttResponse, null, 2),
      'utf8'
    );

    stopAnimation();
    console.log('Watson speech to text completed');
    return sttResponse;
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};
