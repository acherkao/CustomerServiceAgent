import * as fs from 'fs';
import {
  createUtteranceJson,
  sentimentAnalysis,
  convertSentimentToRadar,
  animateTerminalLoading,
} from './utils';


/**
 * Updates the utterance.json file with corrected transcript data, performs sentiment analysis, 
 * and generates radar graph values based on the corrected transcript.
 * 
 * @async
 * @param {string} updatedTranscript - The path to the corrected transcript JSON file.
 * @returns {Promise<void>} A Promise that resolves when the update process is complete.
 * 
 * @example
 * // Update utterance and perform sentiment analysis for the specified transcript file.
 * const selectedFile = process.argv[2] || 'test';
 * await updateUtterance(`../stt/stt_data/${selectedFile}`);
 */
const updateUtterance = async (updatedTranscript: string): Promise<void> => {
  try {
    const jsonData = fs.readFileSync(updatedTranscript, 'utf8');
    const transcribedData = JSON.parse(jsonData);
    
    const utteranceFile = createUtteranceJson(transcribedData);
    
    const sentimentResult = await sentimentAnalysis(utteranceFile, animateTerminalLoading);
    
    const radarData = convertSentimentToRadar(sentimentResult);
    
    console.log('Update complete');
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

const selectedFile = process.argv[2];

updateUtterance(`../stt/stt_data/${selectedFile}`);
