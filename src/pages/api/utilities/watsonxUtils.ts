import { Client } from '@ibm-generative-ai/node-sdk';
import {
  PromptBuilderOptions,
  Example,
  PromptBuilderOptionsV2,
} from '../types';

const WATSONX_BAM_ENDPOINT = process.env.WATSONX_BAM_ENDPOINT;
const WATSONX_BAM_API_KEY = process.env.WATSONX_BAM_API_KEY;


/**
 * Function to create a prompt for Watson Generative AI, for use with Node V2 SDK.
 * Work in progress to use BAM's Prompt methods.
 *
 * @param {PromptBuilderOptionsV2} options - Options for building the prompt.
 * @param {string} options.instruction - Instructions for the desired output.
 * @param {string} options.input_prefix - Prefix to add before input context.
 * @param {string} options.output_prefix - Prefix for the expected completion.
 * @param {string[]} options.input - Input context string.
 * @param {Example[]} options.examples - List of example inputs and outputs.
 * @param {string} options.prompt_id - ID of prompt template.
 * @param {string} options.followup_action - is it a followup action?
 * @throws {Error} - Throws on missing required parameters.
 * @returns {Promise<string>} The prompt id used in the watsonx text generateion call.
 */
export const promptBuilderV2 = async (
  options: PromptBuilderOptionsV2
): Promise<string | undefined> => {
  const requiredProps: (keyof PromptBuilderOptionsV2)[] = [
    'instruction',
    'input_prefix',
    'input',
    'output_prefix',
    'examples',
    'prompt_id',
    'type',
  ];
  const missingProps = requiredProps.filter((prop) => !options[prop]);

  if (missingProps.length > 0) {
    throw new Error(`Missing required argument(s): ${missingProps.join(', ')}`);
  }

  const {
    instruction,
    input_prefix,
    input,
    output_prefix,
    examples = [],
    prompt_id,
    model_id,
    type,
  } = options;

  const client = new Client({
    endpoint: WATSONX_BAM_ENDPOINT,
    apiKey: WATSONX_BAM_API_KEY,
  });

  try {
    const prompt = await client.prompt.create({
      model_id: model_id,
      name: type || 'test_prompt',
      prompt_id: prompt_id,
      data: {
        instruction: instruction,
        input: input,
        input_prefix: input_prefix,
        output_prefix: output_prefix,
        examples: examples,
      },
    });

    return prompt.result.id;
  } catch (err) {
    console.log(err);
  }
};

/**
 * Function to create prompt for Watson Generative AI
 * No longer works, originally for Node SDK v1
 *
 * @async
 * @param {PromptBuilderOptions} options - Options for building the prompt
 * @param {string} options.instruction - Instructions for the desired output
 * @param {string} options.input_prefix - Prefix to add before input context
 * @param {string} options.output_prefix - Prefix for the expected completion
 * @param {string[]} options.input - Input context string
 * @param {string[]} options.examples - Example outputs
 * @param {string} options.prompt_id - ID of prompt template
 * @throws {Error} - Throws on missing required parameters
 * @returns {Promise<string|void>} The generated string result or void on failure
 */
// export const promptBuilder = async (
//   options: PromptBuilderOptions
// ): Promise<string[] | void> => {
//   const requiredProps: (keyof PromptBuilderOptions)[] = [
//     'input',
//     'instruction',
//     'input_prefix',
//     'output_prefix',
//     'examples',
//     'prompt_id',
//   ];
//   const missingProps = requiredProps.filter((prop) => !options[prop]);

//   if (missingProps.length > 0) {
//     throw new Error(`Missing required argument(s): ${missingProps.join(', ')}`);
//   }

//   const {
//     instruction,
//     input_prefix,
//     output_prefix,
//     examples,
//     input,
//     prompt_id,
//   } = options;

//   try {
//     const client = new Client({
//       endpoint: WATSONX_BAM_ENDPOINT,
//       apiKey: WATSONX_BAM_API_KEY,
//     });

//     // NO LONGER WORKS WITH Node SDK v2
//     // const old_result = await client.promptTemplateExecute({
//     //   inputs: input,
//     //   template: {
//     //     id: prompt_id,
//     //     data: {
//     //       instruction,
//     //       input_prefix,
//     //       output_prefix,
//     //       examples,
//     //     },
//     //   },
//     // });
//     // return old_result;
//   } catch (err) {
//     console.log(err);
//   }
//   return;
// };

/**
 * Function to create a prompt for Watson Generative AI GA, does not use SDK version of promptBuilder.
 *
 * @param {PromptBuilderOptions} options - Options for building the prompt.
 * @param {string} options.instruction - Instructions for the desired output.
 * @param {string} options.input_prefix - Prefix to add before input context.
 * @param {string} options.output_prefix - Prefix for the expected completion.
 * @param {string[]} options.input - Input context string.
 * @param {Example[]} options.examples - List of example inputs and outputs.
 * @param {string} options.prompt_id - ID of prompt template.
 * @param {string} options.followup_action - is it a followup action?
 * @throws {Error} - Throws on missing required parameters.
 * @returns {string[]} The generated prompt as a string array.
 */
export const promptBuilder = (options: PromptBuilderOptions): string => {
  const requiredProps: (keyof PromptBuilderOptions)[] = [
    'input',
    'instruction',
    'input_prefix',
    'output_prefix',
    'examples',
    'prompt_id',
  ];
  const missingProps = requiredProps.filter((prop) => !options[prop]);

  if (missingProps.length > 0) {
    throw new Error(`Missing required argument(s): ${missingProps.join(', ')}`);
  }

  const {
    instruction,
    input_prefix,
    output_prefix,
    examples = [],
    input,
  } = options;

  const examplesString = _convertExamplesToString(
    examples,
    input_prefix,
    output_prefix
  );

  const result = `${instruction}\n\n${examplesString}\n\n${input_prefix}${input}\n${output_prefix}`;

  return result;
};

/**
 * Converts an array of example inputs and outputs into a formatted string.
 * Each example input and output is prefixed with provided prefixes and separated by newline characters.
 *
 * @param examples - An array of example inputs and outputs.
 * @param input_prefix - The prefix to be placed before each example input.
 * @param output_prefix - The prefix to be placed before each example output.
 * @returns A formatted string containing all example inputs and outputs, prefixed accordingly.
 */
const _convertExamplesToString = (
  examples: Example[],
  input_prefix: string,
  output_prefix: string
): string => {
  return examples
    .map((example) => {
      return `${input_prefix}${example.input}\n${output_prefix}${example.output}`;
    })
    .join('\n');
};

interface Parameters {
  decoding_method: 'greedy' | 'sample';
  max_new_tokens: number;
  min_new_tokens: number;
  random_seed?: number;
  stop_sequences: string[];
  temperature?: number;
  top_k?: number;
  top_p?: number;
  repetition_penalty: number;
  include_stop_sequence: boolean;
}

/**
 * Update the parameters object based on the decoding method.
 * If the decoding method is "greedy", modifies the parameters accordingly.
 * If the decoding method is "sample", returns the parameters object as is.
 * @param parameters The original parameters object.
 * @returns The updated parameters object.
 * @throws {Error} If an invalid decoding method is provided.
 */
export function updateParametersForDecodingMethod(
  parameters: Parameters
): Parameters {
  if (parameters.decoding_method === 'greedy') {
    return {
      decoding_method: parameters.decoding_method,
      max_new_tokens: parameters.max_new_tokens,
      min_new_tokens: parameters.min_new_tokens,
      stop_sequences: parameters.stop_sequences,
      include_stop_sequence: parameters.include_stop_sequence,
      repetition_penalty: parameters.repetition_penalty,
    };
  } else if (parameters.decoding_method === 'sample') {
    return parameters;
  } else {
    throw new Error('Invalid decoding method');
  }
}
