import {
  processAudioWithWatsonSpeechToText,
  transcribeMultipleChannels,
  createUtteranceJson,
  sentimentAnalysis,
  convertSentimentToRadar,
  animateTerminalLoading,
} from './utils';

const app = async (type: string, audio: string) => {
  try {
    // send audio to Watson STT
    // params in STT designed to transcribe a conversation between two speakers, one speaker will have unexpected behavior
    const sttResponse = await processAudioWithWatsonSpeechToText(
      type,
      audio,
      'audio/wav',
      animateTerminalLoading
    );

    // Create transcription for application
    const multiChannelTranscription = transcribeMultipleChannels(sttResponse);

    // Create utterance file to be used for watsonx/nlu sentiment
    const utteranceFile = createUtteranceJson(multiChannelTranscription);

    // Create sentiment log/json to then pass to convertSentimentToRadar.ts
    const sentimentResult = await sentimentAnalysis(
      utteranceFile,
      animateTerminalLoading
    );

    // Convert to data format readable by front end
    const radarData = convertSentimentToRadar(sentimentResult);

    console.log('Watson STT-NLU-Radar Pipeline completed completed');
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

// default to existing file in audio_files
const selectedFile = process.argv[2] || 'FSM-Agent-Assist-Combined.wav';

app('combined', `../audio_files/${selectedFile}`);
