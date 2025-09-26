import React, { useState, useEffect } from 'react';
import {
  Tile,
  StructuredListWrapper,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
  SkeletonText,
  RadioButton,
} from 'carbon-components-react';
import axios from 'axios';

const WATSONX_TYPE = process.env.NEXT_PUBLIC_WATSONX_TYPE || 'GA';

const API_VERSION = WATSONX_TYPE === 'BAM' ? 'watsonX' : 'watsonXGA';

import { watsonXOptions } from '../utilities';

interface FollowUpActionListProps {
  followUpActions: { timestamp: number; value: string }[];
  playedSeconds: number;
  utterances?: UtteranceData[];
}
/**
 * This is the component for displaying and managing follow-up actions.
 * Currently, only BAM works reliably for live watsonx calls.
 * If using GA, will render the values of the followupActions field in the demo_script.json
 */
const FollowUpActionList: React.FC<FollowUpActionListProps> = ({
  followUpActions,
  playedSeconds,
  utterances,
}) => {
  //--------------------------------------------------------//
  // State for Demo Script rather than live watsonx calls   //
  //--------------------------------------------------------//
  const [visibleActions, setVisibleActions] = useState<
    { timestamp: number; value: string; loading: boolean }[]
  >([]);

  const [printedUtteranceNumbers, setPrintedUtteranceNumbers] = useState(
    new Set<number>()
  );

  //--------------------------------------------------------//
  // State for use with live watsonx calls                  //
  //--------------------------------------------------------//
  const [lastUtterance, setLastUtterance] = useState<string[]>([]);
  const [storedFollowupActions, setStoredFollowupActions] = useState<string[]>(
    []
  );
  const [visibleFollowupActions, setVisibleFollowupActions] = useState<
    { loading: boolean; value: string }[]
  >([]);

  //--------------------------------------------------------//
  // Functionality for live watsonx calls and responses     //
  //--------------------------------------------------------//
  useEffect(() => {
    if (!utterances || utterances.length === 0) return;
    // ok so find the utterance based on end timestamp, make api call if it hasnt been made yet,
    // and make sure its the agent only
    const currentUtterance = utterances.find(
      (utterance) =>
        playedSeconds - 0.3 <= utterance.end &&
        playedSeconds + 0.3 >= utterance.end &&
        !printedUtteranceNumbers.has(utterance.utteranceNumber) &&
        utterance.channel === 0
    );

    if (currentUtterance) {
      setLastUtterance((prevTexts) => {
        const updatedTexts = [...prevTexts, currentUtterance.text];
        // Decide how many previous Agent statements you want to look at
        // More utterances may give more descriptive actions, but more false positives as well
        const numberOfUtterancesToAnalyze = 1;
        return updatedTexts.slice(-numberOfUtterancesToAnalyze);
      });
      setPrintedUtteranceNumbers(
        (prevNumbers) =>
          new Set(prevNumbers.add(currentUtterance.utteranceNumber))
      );
    }
  }, [utterances, playedSeconds, printedUtteranceNumbers]);

  useEffect(() => {
    if (!lastUtterance || lastUtterance.length === 0) return;
    async function getFollowUp() {
      try {
        const combinedText = lastUtterance.join('\n');
        const followupActionOptions = watsonXOptions(
          'followupAction',
          combinedText
        );

       
        const newOptions = {
          ...followupActionOptions,
          followup_action: true,
          type: 'followup_action'
        }

        console.log('follow up action hit in client')
        const followupActionResponse = await axios.post<WatsonxResponse>(
          `/api/${API_VERSION}`,
          newOptions
        );

        const response = _convertResponseToCheckIfNull(
          followupActionResponse.data.generated_text
        );
        console.log(response)
        if (response !== null) {
          setStoredFollowupActions((prevState) => {
            return [...prevState, response];
          });
          setLastUtterance([]);
        }
      } catch (err) {
        console.log(err);
      }
    }
    getFollowUp();
  }, [lastUtterance]);

  const _convertResponseToCheckIfNull = (str: string) => {
    if (!str) return null;
    str = str.trim();
    if (str.toLowerCase() === 'none') return null;
    return str;
  };

  useEffect(() => {
    if (storedFollowupActions.length === 0) return;

    const newItem = storedFollowupActions.find(
      (action) => !visibleFollowupActions.some((item) => item.value === action)
    );

    if (newItem) {
      setVisibleFollowupActions((prevVisibleActions) => [
        ...prevVisibleActions,
        { loading: true, value: newItem },
      ]);
    }
    setTimeout(() => {
      setVisibleFollowupActions((prevVisibleActions) =>
        prevVisibleActions.map((item) =>
          item.value === newItem ? { ...item, loading: false } : item
        )
      );
    }, 2000);
  }, [storedFollowupActions]);

  //--------------------------------------------------------------//
  // Functionality for Demo Script rather than live watsonx calls //
  //--------------------------------------------------------------//
  useEffect(() => {
    const newActions = followUpActions.filter(
      (action) =>
        playedSeconds > action.timestamp &&
        !visibleActions.some(
          (existing) => existing.timestamp === action.timestamp
        )
    );

    if (newActions.length > 0) {
      setVisibleActions((prevActions) => [
        ...prevActions,
        ...newActions.map((action) => ({ ...action, loading: true })),
      ]);

      //Any time a new item is added to the list to be displayed, show a loader for 2 seconds
      setTimeout(() => {
        setVisibleActions((prevActions) =>
          prevActions.map((action) =>
            newActions.some(
              (newAction) => newAction.timestamp === action.timestamp
            )
              ? { ...action, loading: false }
              : action
          )
        );
      }, 2000);
    }
  }, [playedSeconds, visibleActions, followUpActions]);

  return (
    <>
      <Tile className='row-span-2 todo-list'>
        <h4 className='font-medium text-lg mb-2 tile-header'>
          Follow-Up Action List
        </h4>
        <StructuredListWrapper isCondensed>
          <StructuredListBody>
            {WATSONX_TYPE === 'BAM'
              ? visibleFollowupActions.map((action, index) => (
                  <StructuredListRow key={index} className='list-row'>
                    {action.loading ? (
                      <StructuredListCell className='align-middle'>
                        <SkeletonText lineCount={1} width='100%' />
                      </StructuredListCell>
                    ) : (
                      <>
                        <StructuredListCell className='align-middle'>
                          <span className='font-bold'>{action.value}</span>
                        </StructuredListCell>
                        <StructuredListCell className='align-middle'>
                          <RadioButton labelText='Completed' />
                        </StructuredListCell>
                      </>
                    )}
                  </StructuredListRow>
                ))
              : visibleActions.map((action, index) => (
                  <StructuredListRow key={index} className='list-row'>
                    {action.loading ? (
                      <StructuredListCell className='align-middle'>
                        <SkeletonText lineCount={1} width='100%' />
                      </StructuredListCell>
                    ) : (
                      <>
                        <StructuredListCell className='align-middle'>
                          <span className='font-bold'>{action.value}</span>
                        </StructuredListCell>
                        <StructuredListCell className='align-middle'>
                          <RadioButton labelText='Completed' />
                        </StructuredListCell>
                      </>
                    )}
                  </StructuredListRow>
                ))}
          </StructuredListBody>
        </StructuredListWrapper>
      </Tile>
    </>
  );
};

export default FollowUpActionList;
