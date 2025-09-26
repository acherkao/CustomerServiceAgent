import * as fs from 'fs';
import {
  SentimentItem,
  RadarData,
  TimestampData,
} from '../types/common';
import { backupFile } from './general';

interface GroupedData {
  agentSentimentData: SentimentItem[];
  customerSentimentData: SentimentItem[];
}

const TRANSCRIPT_SPEAKER_ONE = process.env.TRANSCRIPT_SPEAKER_ONE || 'Agent';
const TRANSCRIPT_SPEAKER_TWO = process.env.TRANSCRIPT_SPEAKER_TWO || 'Customer';

/**
 * Converts a sentiment JSON to be readable by React Charts Radar Graph.
 *
 * @param data - The sentiment data to be converted.
 * @returns RadarData - The converted radar data.
 */
export const convertSentimentToRadar = (data: SentimentItem[]): RadarData => {
  const groupedData = data.reduce<GroupedData>(
    (result, obj) => {
      obj.channel === 0
        ? result.agentSentimentData.push(obj)
        : result.customerSentimentData.push(obj);
      return result;
    },
    { agentSentimentData: [], customerSentimentData: [] }
  );

  const agentRadarData = _normalizationFunction(groupedData.agentSentimentData);
  const customerRadarData = _normalizationFunction(
    groupedData.customerSentimentData
  );

  const result = _mergeRadarData(agentRadarData, customerRadarData);

  const filePath = './radar_data/radar_data.json'
  backupFile('radar_data.json', 'radar_data', 'backup')
  fs.writeFileSync(
    filePath,
    JSON.stringify(result, null, 2),
    'utf8'
  );

  return result;
};

/**
 * Normalizes sentiment data.
 *
 * @param data - The sentiment data to be normalized.
 * @returns TimestampData[] - The normalized timestamp data.
 */
const _normalizationFunction = (data: SentimentItem[]): TimestampData[] => {
  const radarResult = data.map((item, index) => {
    const utteranceNumber = item.utteranceNumber;
    const currentScore = Math.floor(Math.abs(item.score * 100));
    const previousScore =
      index > 0 ? Math.floor(Math.abs(data[index - 1].score * 100)) : null;
    const currentLabel = item.label;
    const previousLabel = index > 0 ? data[index - 1].label : null;

    let positiveScore = 0;
    let negativeScore = 0;
    let neutralScore = 0;

    if (!previousScore || currentLabel === previousLabel) {
      if (currentLabel === 'positive') {
        positiveScore = currentScore;
        neutralScore = 100 - currentScore;
      } else if (currentLabel === 'negative'){
        negativeScore = currentScore;
        neutralScore = 100 - currentScore;
      } else {
        neutralScore = currentScore
      }
    } else {
      let normalized = Math.floor(previousScore / 3);
      let divisor = currentScore + normalized;
      let primaryValue = Math.floor((currentScore / divisor) * 100);
      let secondaryValue = Math.floor((normalized / divisor) * 100);
      if (currentLabel === 'positive') {
        positiveScore = primaryValue;
        previousLabel === 'negative' ? negativeScore = secondaryValue : neutralScore = secondaryValue
      } else if (currentLabel === 'negative'){
        negativeScore = primaryValue;
        previousLabel === 'positive' ? positiveScore = secondaryValue : neutralScore = secondaryValue
      } else {
        neutralScore = primaryValue;
        previousLabel === 'positive' ? positiveScore = secondaryValue : negativeScore = secondaryValue
      }
    }

    const result = {
      utteranceNumber: item.utteranceNumber,
      timestamp: item.timestamp,
      entries: [
        {
          user: item.channel === 0 ? TRANSCRIPT_SPEAKER_ONE : TRANSCRIPT_SPEAKER_TWO,
          product: 'Ongoing call',
          feature: 'neutral',
          score: neutralScore,
        },
        {
          user: item.channel === 0 ? TRANSCRIPT_SPEAKER_ONE : TRANSCRIPT_SPEAKER_TWO,
          product: 'Ongoing call',
          feature: 'positive',
          score: positiveScore,
        },
        {
          user: item.channel === 0 ? TRANSCRIPT_SPEAKER_ONE : TRANSCRIPT_SPEAKER_TWO,
          product: 'Ongoing call',
          feature: 'negative',
          score: negativeScore,
        },
      ],
    };

    return result;
  });

  return radarResult;
};

/**
 * Merges agent and customer radar data.
 *
 * @param agentData - The agent radar data.
 * @param customerData - The customer radar data.
 * @returns RadarData - The merged radar data.
 */
const _mergeRadarData = (
  agentData: TimestampData[],
  customerData: TimestampData[]
): RadarData => {
  const mergedList = [...agentData, ...customerData];
  const sortedList = mergedList.sort(
    (a, b) => a.utteranceNumber - b.utteranceNumber
  );
  const transformedData = _transformData(sortedList);

  // Unshifts the starting position of Radar Graph before transcript starts playing
  transformedData.unshift({
    utteranceNumber: 0,
    timestamp: 0,
    entries: [
      {
        user: 'Agent',
        product: 'Ongoing call',
        feature: 'neutral',
        score: 100,
      },
      {
        user: 'Agent',
        product: 'Ongoing call',
        feature: 'positive',
        score: 100,
      },
      {
        user: 'Agent',
        product: 'Ongoing call',
        feature: 'negative',
        score: 100,
      },
      {
        user: 'Customer',
        product: 'Ongoing call',
        feature: 'neutral',
        score: 0,
      },
      {
        user: 'Customer',
        product: 'Ongoing call',
        feature: 'positive',
        score: 0,
      },
      {
        user: 'Customer',
        product: 'Ongoing call',
        feature: 'negative',
        score: 0,
      },
    ],
  });
  const result = {
    data: transformedData,
  };

  return result;
};

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

/**
 * Transforms the merged data.
 *
 * @param data - The merged data to be transformed.
 * @returns Utterance[] - The transformed utterance data.
 */
const _transformData = (data: Utterance[]): Utterance[] => {
  const transformedData: Utterance[] = [];
  data.forEach((item, index) => {
    if (item.utteranceNumber === 1) {
      item.entries.push(
        ...[
          {
            user: 'Customer',
            product: 'Ongoing call',
            feature: 'neutral',
            score: 0,
          },
          {
            user: 'Customer',
            product: 'Ongoing call',
            feature: 'positive',
            score: 0,
          },
          {
            user: 'Customer',
            product: 'Ongoing call',
            feature: 'negative',
            score: 0,
          },
        ]
      );
    } else {
      if (item.entries[0].user === 'Customer') {
        const previousItems = data[index - 1].entries;
        const filteredItems = previousItems.filter(
          (item) => item.user === 'Agent'
        );
        item.entries.push(...filteredItems);
      } else {
        const previousItems = data[index - 1].entries;
        const filteredItems = previousItems.filter(
          (item) => item.user === 'Customer'
        );
        item.entries.push(...filteredItems);
      }
    }
    transformedData.push(item);
  });
  return transformedData;
};
