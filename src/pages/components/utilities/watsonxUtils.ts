import merge from 'deepmerge';

interface OptionsOverride {
  instruction?: string;
  input_prefix?: string;
  output_prefix?: string;
  examples?: any[];
  model_id?: string;
  decoding_method?: string;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  min_new_tokens?: number;
  max_new_tokens?: number;
  random_seed?: number;
}

/**
 * Generate and return specific options based on the provided type.
 * @param type - The type of options to generate. Possible values are 'sentiment', 'summary', 'classification', 'document', or 'followupAction'.
 * @param input - The input data to be used in the generated options, typically a transcript.
 * @param optionsOverride - An optional object containing fields to override in the generated options.
 * @returns The options object corresponding to the provided type with optional overrides, or null if the type is not recognized.
 */
export const watsonXOptions = (
  type:
    | 'sentiment'
    | 'summary'
    | 'classification'
    | 'classification_wealth'
    | 'classification_insurance'
    | 'classification_banking'
    | 'document'
    | 'followupAction',
  input: string,
  optionsOverride?: OptionsOverride
): object | null => {
  if (!type || !input) {
    return null;
  }

  const optionsMap: Record<string, object> = {
    sentiment: {
      instruction: 'Classify this call transcript as positive or negative.',
      input_prefix: 'Transcript:',
      output_prefix: 'Classification:',
      examples: [],
      input: [input],
      model_id: 'mistralai/mixtral-8x7b-instruct-v01',
      decoding_method: 'greedy',
      temperature: 0.7,
      top_p: 1,
      top_k: 50,
      min_new_tokens: 1,
      max_new_tokens: 2,
      random_seed: 1,
    },
    summary: {
      instruction:
        'Write a short summary for the conversation. Do not make a list',
      input_prefix: 'Transcript:',
      output_prefix: 'Summary:',
      examples: [],
      input: [input],
      model_id: 'ibm/granite-3-8b-instruct',
      decoding_method: 'sample',
      temperature: 0.7,
      top_p: 1,
      top_k: 50,
      min_new_tokens: 50,
      max_new_tokens: 110,
      random_seed: 12345,
    },
    classification: {
      instruction:
        'The following paragraph is a consumer call transcript. The transcript is about one of these categories: Balance inquiry, Withdrawal dispute, Account setup, Money transfer, or Direct deposit. Read the following transcript and determine which category the conversation is about',
      input_prefix: 'Transcript:',
      output_prefix: 'Category:',
      examples: [],
      input: [input],
      model_id: 'mistralai/mixtral-8x7b-instruct-v01',
      decoding_method: 'sample',
      temperature: 0.7,
      top_p: 1,
      top_k: 50,
      min_new_tokens: 1,
      max_new_tokens: 5,
      random_seed: 123,
    },
    classification_insurance: {
      instruction:
        'The following paragraph is a consumer call transcript. The transcript is about one of these categories: Claim dispute, Account setup, Payment Options, Auto insurance, or Home insurance. Read the following transcript and determine which category the conversation is about',
      input_prefix: 'Transcript:',
      output_prefix: 'Category:',
      examples: [],
      input: [input],
      model_id: 'mistralai/mixtral-8x7b-instruct-v01',
      decoding_method: 'sample',
      temperature: 0.7,
      top_p: 1,
      top_k: 50,
      min_new_tokens: 1,
      max_new_tokens: 5,
      random_seed: 123,
    },
    classification_banking: {
      instruction:
        'The following paragraph is a consumer call transcript. The transcript is about one of these categories: Balance inquiry, Withdrawal dispute, Account setup, Money transfer, or Direct deposit. Read the following transcript and determine which category the conversation is about',
      input_prefix: 'Transcript:',
      output_prefix: 'Category:',
      examples: [],
      input: [input],
      model_id: 'mistralai/mixtral-8x7b-instruct-v01',
      decoding_method: 'sample',
      temperature: 0.7,
      top_p: 1,
      top_k: 50,
      min_new_tokens: 1,
      max_new_tokens: 5,
      random_seed: 123,
    },
    classification_wealth: {
      instruction:
        'The following paragraph is a consumer call transcript. The transcript is about one of these categories: Investment performance, Professional advice, Account setup, Money transfer, or Automatic contributions. Read the following transcript and determine which category the conversation is about',
      input_prefix: 'Transcript:',
      output_prefix: 'Category:',
      examples: [],
      input: [input],
      model_id: 'mistralai/mixtral-8x7b-instruct-v01',
      decoding_method: 'sample',
      temperature: 0.7,
      top_p: 1,
      top_k: 50,
      min_new_tokens: 1,
      max_new_tokens: 5,
      random_seed: 123,
    },
    document: {
      instruction:
        'Read the following document and write a short summary of the information. Answer in a format that is general, and not as if reading to a person. Instead of using the word "you", use "the customer" in the summary. Do not repeat the instructions',
      input_prefix: 'Document:',
      output_prefix: 'Summary of the information:',
      examples: [],
      input: [input],
      model_id: 'ibm/granite-3-8b-instruct',
      repetition_penalty: 1.2,
      decoding_method: 'sample',
      temperature: 0.7,
      top_p: 1,
      top_k: 50,
      typical_p: 1,
      min_new_tokens: 1,
      max_new_tokens: 200,
    },
    followupAction: {
      instruction:
        'If the input sentence implies a follow-up action that would take place after this current conversation ends, generate a sentence that acts as a reminder to perform the action, avoiding the use of first-person language or any references to oneself. Otherwise, return "None".',
      input_prefix: 'Sentence:',

      output_prefix: 'Followup Action:',
      stop_sequences: ['\nSentence:', 'Sentence:', '\nS'],
      examples: [
        {
          input:
            "Kate will be in touch later this afternoon. Well, this has been a productive call so far. I'm so happy for you. You said this wasn't the reason you called. What else can I do to help?",
          output: 'Have Kate give customer a call later in the afternoon.',
        },
        {
          input:
            'I just wanted to chat and catch up. No specific reason for the call.',
          output: 'None',
        },
        {
          input:
            "I need to discuss the upcoming project with you. Let's schedule a meeting.",
          output: 'Schedule a meeting to discuss the upcoming project.',
        },
        {
          input:
            "Done, I'll send you the agenda for the upcoming marketing strategy meeting, and a reminder for the statistics we need for the quarterly performance report. Have Sarah follow up, and we'll schedule our team brainstorming session for next week. It was a pleasure discussing this with you, and I hope you have a great time at the conference.",
          output:
            'Send the agenda for the marketing strategy meeting and a reminder for the quarterly performance report. Have Sarah follow up, and schedule the team brainstorming session for next week.',
        },
        {
          input: 'thank you for calling, how can I help you today',
          output: 'None',
        },
        {
          input:
            "that's very interesting I'll be sure to send you more information on the savings account we discussed Could you provide insight into the types of transactions that are leading to overdrafts in your other bank account, regarding your current financial circumstances",
          output: 'Send more information on the savings account',
        },
        {
          input:
            "I'm available to assist. Debt can be overwhelming, but there are options available to alleviate the stress. I recommend opening a specialized checking account with us. It comes with no overdraft fees and provides overdraft protection when paired with your current savings account. Would you like to explore this opportunity?",
          output: 'None',
        },
        {
          input: 'I will email over the details to you right after this',
          output: 'Email over details',
        },
        {
          input:
            'I will send an email with details regarding the Premium credit card application and the Enhanced checking account, along with a summary of our discussion today. Is there any other assistance you require?',
          output:
            'Send email with details on the Premium credit card, Enhanced checking account, and summary of discussion.',
        },
        {
          input:
            'Perhaps I can offer you some more information on this product',
          output: 'None',
        },
      ],
      input: [input],
      model_id: 'ibm/granite-3-8b-instruct',
      repetition_penalty: 1,
      decoding_method: 'greedy',
      min_new_tokens: 1,
      max_new_tokens: 25,
    },
  };

  const defaultOptions = optionsMap[type];

  if (optionsOverride) {
    return merge(defaultOptions, optionsOverride);
  }

  return defaultOptions || null;
};
