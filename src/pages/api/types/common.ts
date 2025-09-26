/**
 * Examples item interface
 */
export interface Example {
  input: string;
  output: string;
}
/**
 * Options for constructing templated prompts
 */
export interface PromptBuilderOptions {
  type?: string;
  model_id: string;
  followup_action?: boolean;
  /**
   * Instructions explaining desired output
   */
  instruction: string;

  /**
   * Prefix before input context in prompt
   */
  input_prefix: string;

  /**
   * Prefix before expected completion
   */
  output_prefix: string;

  /**
   * User input context
   */
  input: string[];

  /**
   * List of example ideal outputs
   */
  examples: Example[];

  /**
   * Unique identifier for prompt template
   */
  prompt_id: string;
}

/**
 * Options for constructing templated prompts via Node SDK v2
 */
export interface PromptBuilderOptionsV2 {
  type: string;
  model_id: string;
  followup_action?: boolean;
  /**
   * Instructions explaining desired output
   */
  instruction: string;

  /**
   * Prefix before input context in prompt
   */
  input_prefix: string;

  /**
   * Prefix before expected completion
   */
  output_prefix: string;

  /**
   * User input context
   */
  input: string[];

  /**
   * List of example ideal outputs
   */
  examples: Example[];

  /**
   * Unique identifier for prompt template
   */
  prompt_id: string;
}

export interface WatsonXParameters {
  /**
   * The decoding method to use for AI generation.
   */
  followup_action?: boolean;
  /**
   * The decoding method to use for AI generation.
   */
  decoding_method: 'sample' | 'greedy';

  /**
   * The temperature parameter, controlling the randomness of the generated output. Higher values make output more random.
   */
  temperature: number;

  /**
   * The top-p parameter, controlling the diversity of the generated output. Lower values make output more focused.
   */
  top_p: number;

  /**
   * The top-k parameter, controlling the number of tokens to consider during generation. Higher values make output more diverse.
   */
  top_k: number;

  /**
   * The minimum number of new tokens in the generated output.
   */
  min_new_tokens: number;

  /**
   * The maximum number of new tokens in the generated output.
   */
  max_new_tokens: number;

  /**
   * A random seed for generating consistent output.
   */
  random_seed: number;

  /**
   * A list of stop sequences that would tell the LLM to stop generating after those strings are generated.
   */
  stop_sequences?: string[];

  include_stop_sequence?: boolean;

  /**
   * The parameter for repetition penalty. 1.00 means no penalty
   */
  repetition_penalty?: number;

  /**
   * The unique identifier of the AI model to use for generation.
   */
  model_id: string;
}
