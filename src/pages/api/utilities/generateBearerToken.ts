import axios from 'axios';

/**
 * Generates a bearer token using the provided API key.
 * @param apiKey - The API key used for authentication.
 * @returns A Promise that resolves to the generated bearer token.
 * @throws Throws an error if there is an issue generating the token.
 */
export const generateBearerToken = async (apiKey: string): Promise<string> => {
  const url = 'https://iam.cloud.ibm.com/identity/token';
  const data = new URLSearchParams();
  data.append('grant_type', 'urn:ibm:params:oauth:grant-type:apikey');
  data.append('apikey', apiKey);

  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting token:', error);
    throw error;
  }
};


