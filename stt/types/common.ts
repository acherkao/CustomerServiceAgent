/**
 * Represents a Speaker Label in the transcribed data.
 */
export interface SpeakerLabel {
  /**
   * The start time in seconds for the speaker label.
   */
  from: number;

  /**
   * The end time in seconds for the speaker label.
   */
  to: number;

  /**
   * The identifier of the speaker.
   */
  speaker: number;

  /**
   * Confidence score for the speaker label.
   */
  confidence: number;

  /**
   * Indicates whether the label is final or not.
   */
  final: boolean;
}

/**
 * Represents a transcribed item with speaker information.
 */
export interface TranscribedItem {
  /**
   * The channel or speaker identifier.
   */
  channel: number;

  /**
   * The start time in seconds for the transcribed item.
   */
  start: number;

  /**
   * The end time in seconds for the transcribed item.
   */
  end: number;

  /**
   * The utterance number, incremented when the speaker changes.
   */
  utteranceNumber: number;

  /**
   * The word content transcribed (replace with the actual word).
   */
  word: string;

  /**
   * The unique identifier for the transcribed item.
   */
  id: number;

  /**
   * The offset at the beginning of the transcribed item.
   */
  offsetBegin: number;
}

export interface UtteranceItem {
  utteranceNumber: number;
  text: string;
  start: number;
  end: number;
  channel: number;
}

export interface SentimentItem {
  channel: number;
  utteranceNumber: number;
  score: number;
  label: string;
  timestamp: number;
}

export interface RadarGraphItem {
  user: string;
  product: string;
  feature: string;
  score: number;
}

interface Entry {
  user: string;
  product: string;
  feature: string;
  score: number;
}

export interface TimestampData {
  utteranceNumber: number;
  timestamp: number;
  entries: Entry[];
}

export interface RadarData {
  data: TimestampData[];
}
