import React, { useEffect, useRef } from 'react';
import { Tile } from 'carbon-components-react';
import _ from 'lodash';
import dynamic from 'next/dynamic';


import transcript from '../../../../stt/stt_data/transcribed_data.json';
import bankingTranscript from '../../../../stt/stt_data/transcribed_data.json';
import wealthTranscript from '../../../../stt/stt_data/transcribed_data_wealth.json';
import insuranceTranscript from '../../../../stt/stt_data/transcribed_data_insurance.json';

const AUDIO_FILE =
  process.env.NEXT_PUBLIC_AUDIO_FILE || 'FSM-Agent-Assist-Combined.wav';

let audio_url: string;
// const audio_url = `/${AUDIO_FILE}`;

const TYPE = process.env.NEXT_PUBLIC_DEMO_TYPE;

let combinedTranscript: any;

switch (TYPE) {
  case 'wealth':
    combinedTranscript = wealthTranscript;
    audio_url = '/FSM-AA-Wealth-Combined.wav'
    break;
  case 'insurance':
    combinedTranscript = insuranceTranscript;
    audio_url = '/FSM-AA-Insurance-Combined.wav'
    break;
  case 'banking':
    combinedTranscript = bankingTranscript;
    audio_url = '/FSM-Agent-Assist-Combined.wav'
    break;
  default:
    combinedTranscript = transcript;
    audio_url = `/${AUDIO_FILE}`
    break;
}

import styles from './LiveTranscript.module.scss';

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

// TODO refactor live transcript
function getPrintableTranscript(transcript, playedSeconds) {
  let strs = [];
  let channelsNames = ['csr', 'customer'];
  let not_adding_all_words = false;
  const utterances = _.groupBy(transcript, (i) => i.utteranceNumber);
  for (let key in utterances) {
    let str = [];
    const words = utterances[key];
    const channels = words.map((w) => w.channel);
    const mainChannels = _.groupBy(channels, (c) => c);
    const arr = Object.keys(mainChannels).map((key) => {
      return {
        channel: +key,
        count: mainChannels[key].length,
      };
    });
    const orderedMainChannels = arr.sort((a, b) => b.count - a.count);
    const channel = orderedMainChannels[0].channel;
    let caller = channelsNames[channel];
    words.forEach((word, i) => {
      if (word.end < playedSeconds) {
        str.push(word);
      } else {
        not_adding_all_words = true;
      }
    });
    if (str.length !== 0) {
      // we have a word longer than 0
      strs.push({
        channel: caller,
        words: str,
      });
    }
  }
  return { strs, not_adding_all_words };
}

// wrapper that has the player and the transcript
export default function LiveTranscript(props: any) {
  const ref = useRef();
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const { playedSeconds, setPlayedSeconds, dramatisPersonae } = props;

  const { strs: printableTranscript, not_adding_all_words } =
    getPrintableTranscript(combinedTranscript, playedSeconds);

  // when the player update us to its state, update the seconds referenced by the transcript
  const onProgress = (progress: any) => {
    setPlayedSeconds(progress.playedSeconds);
  };

  const playing = false; // auto play
  const volume = 1; // 100%
  const muted = false;

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [printableTranscript]);

  // TODO move style to a separate file
  return (
    <Tile className='row-span-2'>
      <h4 className='font-medium text-lg mb-2 live-transcript-header'>
        <div className={styles.live_transcript_header}>
          <div className={styles.live_transcript_title}>Live Transcript</div>
          <div className={styles.react_player_wrapper}>
            <ReactPlayer
              ref={ref}
              width='100%'
              height='50px'
              url={audio_url}
              progressFrequency={300}
              controls={true} // added by Drew
              playing={playing}
              volume={volume}
              muted={muted}
              onProgress={onProgress}
            />
          </div>
        </div>
      </h4>
      <div
        className={`overflow-y-scroll ${styles.transcriptContainer}`}
        style={{ maxHeight: '30rem' }}
        ref={transcriptRef}
      >
        <LiveTranscriptCard
          printableTranscript={printableTranscript}
          dramatisPersonae={dramatisPersonae}
        />
      </div>
    </Tile>
  );
}

// mostly take from old code
export function LiveTranscriptCard(props: any) {
  const { audioUrl, printableTranscript, playedSeconds, dramatisPersonae } =
    props;

  return (
    <div
      style={{ height: props.height, overflowY: 'auto' }}
      id='findLiveTranscript'
    >
      <div>
        {printableTranscript.map((entry, i) => {
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                borderBottom: '3px rgba(41, 25, 62, 0.2) solid',
                marginTop: '5px',
                padding: '1rem',
                alignItems: 'center',
                color: 'rgba(0,0,0,.7)',
              }}
              className={styles.transcriptEntry}
            >
              <img
                style={{
                  order: entry.channel === 'csr' ? 1 : 2,
                  flex: '0 40px',
                  height: '40px',
                  marginLeft: '22px',
                  marginRight: '22px',
                  borderRadius: '10px',
                }}
                src={`/icons/${entry.channel === 'csr'
                    ? dramatisPersonae.agent.icon
                    : dramatisPersonae.customer.icon
                  }`}
              />
              <div
                style={{
                  order: entry.channel === 'csr' ? 2 : 1,
                  flex: 'auto',
                  overflowY: 'auto',
                  marginLeft: '22px',
                  marginRight: '22px',
                }}
              >
                {entry.words.map((word, j) => {
                  return (
                    <span
                      key={`${i}${j}`}
                      style={{ fontWeight: word.highlight ? '800' : '' }}
                    >{` ${word.word}`}</span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
