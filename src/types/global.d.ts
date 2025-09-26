declare module '*.scss';

interface CustomerProfile {
  phone_number: string;
  sub_title: string;
  rows: {
    name: string;
    value: string;
    tag: boolean;
  }[];
}

type WatsonOptionTypes = 
  | 'classification_insurance'
  | 'classification_wealth'
  | 'classification_banking'
  | 'classification'
  | 'summary'
  | 'sentiment'
  | 'document'
  | 'followupAction';

interface AccountData {
  timestamp?: number;
  icon?: string;
  rows?: {
    name: string;
    value: string;
  }[];
}

interface DramatisPersonae {
  customer: {
    icon: string;
    name: string;
  };
  agent: {
    icon: string;
    name: string;
  };
}

interface RadarData {
  [key: string]: Array<{ product: string; feature: string; score: number }>;
}

interface Entry {
  user: string;
  product: string;
  feature: string;
  score: number;
}

interface Utterance {
  utteranceNumber: number;
  timestamp: number;
  entries: Entry[];
}

interface UtteranceData {
  utteranceNumber: number;
  text: string;
  start: number;
  end: number;
  channel: number;
}

interface RecommendedActions {
  timestamp: number;
  type: string | null;
  action: string | null;
}

interface RecommendedAction {
  timestamp?: number | null;
  type: string | null;
  action: string | null;
}

interface CallTemplateChecklistItem {
  label: string;
  timestamp: number;
  completed: boolean;
}

interface WatsonApiParams {
  instruction: string;
  input_prefix: string;
  output_prefix: string;
  input: string;
  examples: string[];
  prompt_id: string;
}

interface FollowUpActions {
  timestamp: number;
  value: string;
}


/**
 * Represents a transcript message with type and message content.
 */
interface TranscriptMessage {
  /**
   * The type of the transcript message (e.g., 'Agent', 'Customer', etc.).
   */
  type: string;

  /**
   * The content of the transcript message.
   */
  message: string;
}

interface ContactHistoryData {
  date: string;
  tag: string;
  review: string;
  transcript: TranscriptMessage[];
}

interface WatsonxResponse {
  generated_text: string;
  generated_token_count: number;
  input_token_count: number;
  stop_reason: string;
  seed: number;
}


interface DiscoverySearch {
  timestamp?: number;
  tag: string[];
  query: string[]
  queryTerm: string;
}

interface AccountActivityItem {
  timestamp: number;
  data: {
    type: string;
    value: string;
  }[];
}
