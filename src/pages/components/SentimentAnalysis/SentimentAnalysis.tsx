import React, { useState, useEffect } from 'react';
import { Tile } from 'carbon-components-react';
import { RadarChart } from '@carbon/charts-react';
import { RadarChartOptions } from '@carbon/charts/interfaces';

const TRANSCRIPT_SPEAKER_ONE =
  process.env.NEXT_PUBLIC_TRANSCRIPT_SPEAKER_ONE || 'Agent';
const TRANSCRIPT_SPEAKER_TWO =
  process.env.NEXT_PUBLIC_TRANSCRIPT_SPEAKER_TWO || 'Customer';

interface SentimentAnalysisProps {
  playedSeconds: number;
  radarData: Utterance[];
}

const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({
  playedSeconds = 0,
  radarData,
}) => {
  const [state, setState] = useState<Entry[]>([]);

  useEffect(() => {
    radarData.forEach((item) => {
      const { timestamp, entries } = item;
      const sec = Math.floor(playedSeconds);
      if (timestamp === sec) {
        setState(entries);
      }
    });
  }, [playedSeconds]);

  return (
    <>
      <Tile className='row-span-3'>
        <h4 className='font-medium text-lg mb-2 tile-header'>
          Sentiment Analysis
        </h4>
        <RadarChart
          data={state}
          options={{
            title: '',
            // color: {
            //   gradient: {
            //     enabled: true,
            //     colors: ['white', 'red'],
            //   },
            // },
            color: {
              scale: {
                [TRANSCRIPT_SPEAKER_ONE]: '#0530AD',
                [TRANSCRIPT_SPEAKER_TWO]: '#a1a8ab',
              },
            },
            radar: {
              axes: {
                angle: 'feature',
                value: 'score',
              },
              alignment: 'center',
            },
            data: {
              groupMapsTo: 'user',
            },
            height: '513px',
            theme: 'white',
          }}
        />
      </Tile>
    </>
  );
};

export default SentimentAnalysis;
