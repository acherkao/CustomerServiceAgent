import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  StructuredListRow,
  StructuredListCell,
  StructuredListSkeleton,
  Tag,
  ModalWrapper,
  Modal,
  ModalBody,
  ModalFooter,
  Button,
} from 'carbon-components-react';
import ContactHistoryTranscript from './ContactHistoryTranscript';
import { watsonXOptions, jsonTranscriptToString } from '../utilities';

const WATSONX_TYPE = process.env.NEXT_PUBLIC_WATSONX_TYPE || 'GA';
const TYPE = process.env.NEXT_PUBLIC_DEMO_TYPE;

const API_VERSION = WATSONX_TYPE === 'BAM' ? 'watsonX' : 'watsonXGA';

const ContactHistoryItem: React.FC<{ data: ContactHistoryData }> = ({
  data,
}) => {
  const [openSubModal, setOpenSubModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [positiveSentiment, setPositiveSentiment] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>('');
  const [buttonTitle, setButtonTitle] = useState('');
  const [classificationType, setClassificationType] = useState<string>('');

  useEffect(() => {
    if (!data || !data.transcript) {
      return;
    }

    const { transcript } = data;
    const formattedTranscript = jsonTranscriptToString(transcript);

    async function getSentiment() {
      setLoading(true);
      try {
        const sentimentOptions = watsonXOptions(
          'sentiment',
          formattedTranscript
        );
        const summaryOptions = watsonXOptions('summary', formattedTranscript);

        // different classification types for the different use cases. For custom asset, will default to 'classification'
        const classificationType =
          TYPE === 'wealth'
            ? 'classification_wealth'
            : TYPE === 'insurance'
            ? 'classification_insurance'
            : TYPE === 'banking'
            ? 'classification_banking'
            : 'classification';

        console.log(`Classification type: ${classificationType}`)
        const classifcationOptions = watsonXOptions(
          classificationType,
          formattedTranscript
        );

        const sentimentResponse = await axios.post<WatsonxResponse>(
          `/api/${API_VERSION}`,
          sentimentOptions
        );
        const summaryResponse = await axios.post<WatsonxResponse>(
          `/api/${API_VERSION}`,
          summaryOptions
        );
        const classifcationResponse = await axios.post<WatsonxResponse>(
          `/api/${API_VERSION}`,
          classifcationOptions
        );

        setPositiveSentiment(
          _convertTextToSentiment(sentimentResponse.data.generated_text) ===
            'positive'
        );
        setSummary(summaryResponse.data.generated_text);

        // sometimes we get a period at the end of the title button text, so just use replace to remove it
        setButtonTitle(
          classifcationResponse.data.generated_text.replace(/\.$/, '')
        );
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
    getSentiment();
  }, []);

  const _convertTextToSentiment = (str: string) => {
    if (!str) return 'negative';
    str = str.toLowerCase().trim();
    if (str === 'positive' || str === 'pos') return 'positive';
    return 'negative';
  };

  return (
    <div>
      {loading ? (
        <StructuredListSkeleton rowCount={1} />
      ) : (
        <>
          <StructuredListRow className='structured-list-row'>
            <StructuredListCell className='align-middle'>
              {positiveSentiment ? (
                <img src='face--satisfied.svg' className='h-6 self-center' />
              ) : (
                <img src='face--dissatisfied.svg' className='h-6 self-center' />
              )}
            </StructuredListCell>
            <StructuredListCell className='align-middle' noWrap>
              {data.date}
            </StructuredListCell>
            <StructuredListCell className='align-middle'>
              <Tag>{data.tag}</Tag>
            </StructuredListCell>
            <StructuredListCell>
              <ModalWrapper
                buttonTriggerText={buttonTitle}
                modalHeading='Summarized Transcript'
                handleSubmit={() => {
                  setOpenSubModal(true);
                  return true;
                }}
                primaryButtonText='Full Transcript'
                className='contact-history-container-modal-wrapper'
              >
                {summary}
              </ModalWrapper>

              <Modal
                open={openSubModal}
                onRequestClose={() => {
                  setOpenSubModal(false);
                }}
                passiveModal
                modalHeading='Full Transcript'
                className='contact-history-container-modal-wrapper'
              >
                <ModalBody>
                  <ContactHistoryTranscript transcript={data.transcript} />
                </ModalBody>
                <ModalFooter>
                  <Button
                    kind='tertiary'
                    onClick={() => {
                      setOpenSubModal(false);
                    }}
                  >
                    Close
                  </Button>
                </ModalFooter>
              </Modal>
            </StructuredListCell>
          </StructuredListRow>
        </>
      )}
    </div>
  );
};

export default ContactHistoryItem;
