import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Tile, Search as CarbonSearch } from 'carbon-components-react';
import Loading from '../Loading';
import styles from './DiscoverySearch.module.scss';

import { watsonXOptions } from '../utilities';
import DiscoverySearchCard from './DiscoverySearchCard';

interface DiscoverySearchProps {
  data: DiscoverySearch[];
  playedSeconds: number;
}

const WATSONX_TYPE = process.env.NEXT_PUBLIC_WATSONX_TYPE || 'GA';

const API_VERSION = WATSONX_TYPE === 'BAM' ? 'watsonX' : 'watsonXGA';

const DiscoverySearch: React.FC<DiscoverySearchProps> = ({
  data,
  playedSeconds,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [processedItems, setProcessedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [discoveryCardDataList, setDiscoveryCardDataList] = useState<
    { tag: string; summary: string }[]
  >([]);

  const discoveryCardRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (discoveryCardRef.current) {
      console.log('Scrolling...');
      setTimeout(() => {
        if (discoveryCardRef.current) {
          discoveryCardRef.current.scrollTop =
            discoveryCardRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [discoveryCardDataList]);

  useEffect(() => {
    if (!playedSeconds || !data || data.length === 0) {
      return;
    }
    const fetchData = async (item: DiscoverySearch, index: number) => {
      try {
        if (!item.timestamp || processedItems.includes(index)) {
          return;
        }

        if (playedSeconds >= item.timestamp) {
          setProcessedItems([...processedItems, index]);
          setSearchTerm(item.queryTerm);

          const apiCallPromises = item.query.map(async (query, itemIndex) => {
            try {
              setLoading(true);

              const response = await axios.post('/api/watsonDiscovery', {
                query,
              });

              if (response.status !== 200) {
                setSearchTerm('');
                setLoading(false);

                throw new Error(
                  `Discovery call failed with status: ${response.status}`
                );
              }

              const documentOptions = watsonXOptions(
                'document',
                response.data.passage
              );
              const documentResponse = await axios.post<WatsonxResponse>(
                `/api/${API_VERSION}`,
                documentOptions
              );

              const cardFields = {
                tag: item.tag[itemIndex],
                summary: documentResponse.data.generated_text,
              };

              setDiscoveryCardDataList((prevList) => [...prevList, cardFields]);

              setSearchTerm('');
              setLoading(false);
            } catch (error) {
              console.error('API call failed:', error);
            }
          });

          await Promise.all(apiCallPromises);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    data.forEach(fetchData);
  }, [playedSeconds, data, processedItems]);

  return (
    <>
      <Tile className='row-span-2'>
        <h4 className='font-medium text-lg mb-2 tile-header'>
          Watsonx Knowledge Lookup
        </h4>
        <CarbonSearch
          size='md'
          placeholder='Search'
          labelText='Search'
          closeButtonLabelText='Clear search input'
          id='search-1'
          onChange={() => {}}
          onKeyDown={() => {}}
          value={searchTerm}
        />
        <div className='discovery-lookup-loading-container'>
          {discoveryCardDataList.length !== 0 && (
            <div
              className={`discovery-overflow-y-scroll py-2 px-1 max-h-96`}
              ref={discoveryCardRef}
            >
              {discoveryCardDataList.map((cardData, index) => (
                <div key={index}>
                  <DiscoverySearchCard data={cardData} />
                </div>
              ))}
            </div>
          )}
          {loading && (
            <div className={styles.loading__container}>
              <Loading />
            </div>
          )}
        </div>
      </Tile>
    </>
  );
};

export default DiscoverySearch;
