import type { NextApiRequest, NextApiResponse } from 'next';
import DiscoveryV2 from 'ibm-watson/discovery/v2';
import { IamAuthenticator } from 'ibm-watson/auth';

import { cleanPassageText } from './utilities';

const WATSON_DISCOVERY_KEY = process.env.WATSON_DISCOVERY_KEY;
const WATSON_DISCOVERY_URL = process.env.WATSON_DISCOVERY_URL;
const WATSON_DISCOVERY_PROJECTID =
  process.env.WATSON_DISCOVERY_PROJECTID;
const WATSON_DISCOVERY_VERSION =
  process.env.WATSON_DISCOVERY_VERSION || '2022-08-01';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (
      !WATSON_DISCOVERY_URL ||
      !WATSON_DISCOVERY_KEY ||
      !WATSON_DISCOVERY_PROJECTID ||
      !WATSON_DISCOVERY_VERSION
    ) {
      res.status(500).send({
        error: 'Watson Discovery environment variables incomplete/missing',
      });
      return;
    }

    const discovery = new DiscoveryV2({
      version: WATSON_DISCOVERY_VERSION,
      authenticator: new IamAuthenticator({
        apikey: WATSON_DISCOVERY_KEY,
      }),
      serviceUrl: WATSON_DISCOVERY_URL,
    });

    const { query } = req.body;

    const result = await discovery.query({
      projectId: WATSON_DISCOVERY_PROJECTID,
      naturalLanguageQuery: query,
      count: 1,
      tableResults: { enabled: false },
      _return: ['title', 'metadata.source.url'],
      passages: {
        enabled: true,
        characters: 700,
        // per_document: true,
        find_answers: false,
        fields: ['text'],
      },
    });

    const data =
      result.result?.results?.[0]?.document_passages?.[0]?.passage_text;
    if (!data) {
      res.status(404).send({ msg: 'No results available' });
      return;
    }
    res.status(200).send({ passage: cleanPassageText(data) });
  } catch (err) {
    console.error('An error occurred:', err);
    res.status(500).send({ error: 'Internal server error' });
  }
}
