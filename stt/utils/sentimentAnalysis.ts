import * as fs from 'fs';
import NaturalLanguageUnderstandingV1 from 'ibm-watson/natural-language-understanding/v1';
import { IamAuthenticator } from 'ibm-watson/auth';

import dotenv from 'dotenv';
import { UtteranceItem, SentimentItem } from '../types/common';
import { backupFile, rateLimiter } from './general';
dotenv.config();

const NLU_API_KEY = process.env.WATSON_NLU_API_KEY || '';
const NLU_URL = process.env.WATSON_NLU_URL || '';

/**
 * Perform sentiment analysis on a collection of textual data using IBM Watson Natural Language Understanding service.
 *
 * @param {UtteranceItem[]} data - An array of textual data items to analyze for sentiment.
 *
 * @throws {Error} Throws an error if there is an issue during sentiment analysis or backup process.
 *
 * @returns {Promise<SentimentItem[]>} A promise that resolves with an array of sentiment analysis results.
 *
 * @example
 * // Example usage:
 * const data: UtteranceItem[] = [
 *   { utteranceNumber: 1, text: 'This is a positive sentence.', start: 0, end: 5, channel: 0 },
 *   { utteranceNumber: 2, text: 'This is a negative sentence.', start: 6, end: 11, channel: 1 },
 *   // Add more data items as needed...
 * ];
 * const sentimentResults: SentimentItem[] = await sentimentAnalysis(data);
 */
export const sentimentAnalysis = async (
  data: UtteranceItem[],
  loading: Function
): Promise<SentimentItem[]> => {
  const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: '2022-04-07',
    authenticator: new IamAuthenticator({
      apikey: NLU_API_KEY,
    }),
    serviceUrl: NLU_URL,
  });

  const sentimentResults: SentimentItem[] = [];

  const promiseQueue = data.map((item) => {
    const transcript = item.text;
    const params = {
      text: transcript,
      returnAnalyzedText: true,
      features: {
        sentiment: {},
      },
      language: 'en',
    };
    return () =>
      new Promise<void>(async (resolve, reject) => {
        try {
          const nluResponse = await naturalLanguageUnderstanding.analyze(
            params
          );
          const sentiment = nluResponse.result.sentiment?.document;
          const resultItem = {
            channel: item.channel,
            utteranceNumber: item.utteranceNumber,
            score: sentiment?.score || 0,
            label: sentiment?.label || 'neutral',
            timestamp: Math.ceil(item.end),
          };
          sentimentResults.push(resultItem);
          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }
      });
  });

  const stopAnimation = loading('Watson NLU Started')
  // Rate limit so NLU request does not hit max
  await rateLimiter(promiseQueue, 5);
  stopAnimation()

  const filePath = './nlu_data/sentiment_data.json';
  backupFile('sentiment_data.json', 'nlu_data', 'backup');
  fs.writeFileSync(filePath, JSON.stringify(sentimentResults, null, 2), 'utf8');
  return sentimentResults;
};
