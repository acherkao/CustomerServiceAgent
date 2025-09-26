import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@ibm-generative-ai/node-sdk';
import {
  promptBuilder,
  promptBuilderV2,
  updateParametersForDecodingMethod,
} from './utilities';
import { PromptBuilderOptions, WatsonXParameters } from './types';

const WATSONX_BAM_ENDPOINT = process.env.WATSONX_BAM_ENDPOINT;
const WATSONX_BAM_API_KEY = process.env.WATSONX_BAM_API_KEY;

/**
 * API route handler for generating text with prompt
 *
 * @param {NextApiRequest} req - Incoming API request
 * @param {NextApiResponse} res - Outgoing API response
 * @throws {Error} - Any errors while handling
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = new Client({
      endpoint: WATSONX_BAM_ENDPOINT,
      apiKey: WATSONX_BAM_API_KEY,
    });

    const {
      instruction,
      input_prefix,
      output_prefix,
      input,
      examples = [],
      prompt_id = 'prompt_builder',
    }: PromptBuilderOptions = req.body;

    const {
      model_id = 'google/flan-t5-xxl',
      decoding_method = 'sample',
      temperature = 0.7,
      top_p = 1,
      top_k = 50,
      min_new_tokens = 50,
      max_new_tokens = 200,
      random_seed = 123,
      stop_sequences = ['Input: '],
      repetition_penalty = 1,
      followup_action = false,
    }: WatsonXParameters = req.body;

    const parameters = updateParametersForDecodingMethod({
      decoding_method: decoding_method,
      max_new_tokens: max_new_tokens,
      min_new_tokens: min_new_tokens,
      random_seed: random_seed,
      stop_sequences: stop_sequences,
      temperature: temperature,
      top_k: top_k,
      top_p: top_p,
      repetition_penalty: repetition_penalty,
      include_stop_sequence: false,
    });

    const generatedPrompt = promptBuilder({
      instruction,
      input_prefix,
      output_prefix,
      input,
      examples: examples,
      prompt_id,
      followup_action,
      model_id,
    });

    if (!generatedPrompt) {
      res.status(500).send({ err: 'Server error' });
      return;
    }

    console.log('WatsonX BAM call started');

    const parametersWithReturnOptions = {
      ...parameters,
      return_options: {
        input_text: true,
      },
    };

    const results = await client.text.generation.create({
      model_id: model_id,
      input: generatedPrompt,
      parameters: parametersWithReturnOptions,
    });

    console.log('WatsonX BAM call completed');
    console.log('---------------------------\n');
    if (followup_action) {
      console.log('Follwup action response');
      console.log(JSON.stringify(results.results, null, 2));
    }

    res.status(200).send(results.results[0]);
  } catch (err) {
    console.log(err);
  }
}
