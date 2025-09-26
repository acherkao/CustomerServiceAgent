import React, { useEffect, useState } from 'react';
import { Tag } from 'carbon-components-react';

interface DiscoverySearchCardProps {
  summary: string;
  tag: string;
}
const DiscoverySearchCard = ({ data }: { data: DiscoverySearchCardProps }) => {
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    if (!data || !data.summary) return;
    setShowCard(true);
  }, [data]);
  return (
    <>
      {showCard ? (
        <div className='rounded-lg border-[1px] border-[#525252] border-solid p-2 mb-2 knowledge-card'>
          <div className='mb-1'>
            <span className='font-bold'>Query Results for:</span>{' '}
            <Tag>
              <span>{data.tag}</span>
            </Tag>
          </div>
          <div className='mb-1'>
            <span className='font-bold'>Confidence Score:</span> 98%
          </div>
          <div className='mt-5'>
            <div className='mb-1'>
              <span className='font-medium'>
                <b>Watsonx summary of relevant docs:</b>
              </span>
            </div>
            <div className='mb-1'>{data.summary}</div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default DiscoverySearchCard;
