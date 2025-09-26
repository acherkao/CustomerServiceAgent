import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Tile,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
} from 'carbon-components-react';

import Loading from '../Loading';

import { watsonXOptions, jsonTranscriptToString } from '../utilities';

import styles from './QuickSend.module.scss';

const WATSONX_TYPE = process.env.NEXT_PUBLIC_WATSONX_TYPE || 'GA';

const API_VERSION = WATSONX_TYPE === 'BAM' ? 'watsonX' : 'watsonXGA';

const QuickSend: React.FC<{ data: TranscriptMessage[] }> = ({ data }) => {
  const [openForm, setOpenForm] = useState(false);
  const [openNote, setOpenNote] = useState(false);
  const [summaryOfTranscript, setSummaryOfTranscript] = useState('');
  const [loading, setLoading] = useState(false);

  const formButtonClick = () => {
    setOpenForm(!openForm);
  };

  const noteButtonClick = () => {
    setOpenNote(!openNote);
  };

  useEffect(() => {
    if (!data || data.length === 0) {
      return;
    }
    async function getSummaryOfTranscript() {
      setLoading(true);
      try {
        const formattedTranscript = jsonTranscriptToString(data);
        const summaryOptions = watsonXOptions('summary', formattedTranscript);
        const summaryResponse = await axios.post<WatsonxResponse>(
          `/api/${API_VERSION}`,
          summaryOptions
        );
        setSummaryOfTranscript(summaryResponse.data.generated_text);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
    getSummaryOfTranscript();
  }, [data]);

  return (
    <>
      <Tile className='row-span-1 quick-send-container'>
        <h4 className='font-medium text-lg mb-2 tile-header'>Quick Send</h4>
        <div className='quick-send-btn-grp'>
          <Button
            onClick={formButtonClick}
            className='truist-btn'
            // kind='tertiary'
          >
            Send Email
          </Button>
          <Button onClick={noteButtonClick} className='truist-btn'>
            Edit Call Notes
          </Button>
        </div>
        <Modal
          open={openForm}
          onRequestClose={formButtonClick}
          passiveModal
          modalHeading='Email Information'
        >
          <ModalBody>
            <div>
              <label>
                Customer name:{' '}
                <input
                  type='text'
                  defaultValue='David Johnson'
                  className={styles.customer_info}
                />
              </label>
            </div>
            <br />
            <div>
              <label>
                Customer ID:{' '}
                <input
                  type='text'
                  defaultValue='23458723'
                  className={styles.customer_info}
                />
              </label>
            </div>
            <br />
            <div>
              <label>
                Category of Call:{' '}
                <input
                  type='text'
                  defaultValue='Meeting notes'
                  className={styles.customer_info}
                />
              </label>
            </div>
            <br />
            <div>
              <label>
                Email:{' '}
                <input
                  type='text'
                  defaultValue='davidjohnson@email.com'
                  className={styles.customer_info}
                />
              </label>
            </div>
            <br />
            <hr />
            <p>Summary of call:</p>
            {loading ? (
              <Loading />
            ) : (
              <textarea
                defaultValue={summaryOfTranscript}
                className={styles.summary_textarea}
              />
            )}
            <br />
            <hr></hr>
          </ModalBody>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ModalFooter>
              <Button
                kind='tertiary'
                className='truist-btn modal-btn'
                onClick={formButtonClick}
              >
                Send Email
              </Button>
            </ModalFooter>
          </div>
        </Modal>
        <Modal
          open={openNote}
          onRequestClose={noteButtonClick}
          passiveModal
          modalHeading='Call Notes'
        >
          <ModalBody>
            <p>Call Summary</p>
            {loading ? (
              <Loading />
            ) : (
              <textarea
                defaultValue={summaryOfTranscript}
                className={styles.summary_textarea}
              />
            )}
            <br />
          </ModalBody>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ModalFooter>
              <Button
                onClick={noteButtonClick}
                kind='tertiary'
                className='truist-btn modal-btn'
              >
                Close
              </Button>
            </ModalFooter>
          </div>
        </Modal>
      </Tile>
    </>
  );
};

export default QuickSend;
