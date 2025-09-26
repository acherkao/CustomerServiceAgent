import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { promptBuilder, updateParametersForDecodingMethod } from './utilities';
import { PromptBuilderOptions, WatsonXParameters } from './types';
import { generateBearerToken } from './utilities/generateBearerToken';

const IBM_API_KEY = process.env.IBM_API_KEY || '';
const WATSONX_GA_ENDPOINT = process.env.WATSONX_GA_ENDPOINT || '';
const PROJECT_ID = process.env.PROJECT_ID || '';

/**
 * API route handler for generating text with prompt using WatsonX GA
 *
 * @param {NextApiRequest} req - Incoming API request
 * @param {NextApiResponse} res - Outgoing API response
 * @throws {Error} - Any errors while handling
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = WATSONX_GA_ENDPOINT;

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
  }: WatsonXParameters = req.body;

  const {
    instruction,
    input_prefix,
    output_prefix,
    input,
    examples = [],
    prompt_id = 'prompt_builder',
  }: PromptBuilderOptions = req.body;

  const generatedPrompt = promptBuilder({
    input,
    input_prefix,
    instruction,
    output_prefix,
    examples,
    prompt_id,
    model_id,
  });

  console.log('WatsonX GA call has been made...');
  try {
    // ok lets generate the bearer token
    const bearer_token = await generateBearerToken(IBM_API_KEY);

    // will convert the following to follow my other method
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearer_token}`,
    };

    // had to add a function to ensure there are no extra parameters sent to GA if decoding_method is greedy, otherwise a we get a 400
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

    // will pass the text from client to here
    const body = {
      input: generatedPrompt,
      parameters: parameters,
      model_id: model_id,
      project_id: PROJECT_ID,
      // moderations comes from GA curl, I am not sure of its usefulness
      moderations: {},
    };

    const response = await axios.post(url, body, { headers });
    res.status(200).send(response.data.results[0]);
    console.log('--------------------------------------------');
  } catch (err) {
    console.error('Error:', err);
  }
}
