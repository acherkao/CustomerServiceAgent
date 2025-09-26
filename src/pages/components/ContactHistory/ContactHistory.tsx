import React from 'react';
import {
  Tile,
  StructuredListWrapper,
  StructuredListBody,
} from 'carbon-components-react';
import ContactHistoryItem from './ContactHistoryItem';

const ContactHistory: React.FC<{ data: ContactHistoryData[] }> = ({ data }) => {
  return (
    <>
      <Tile className='row-span-3'>
        <h4 className='font-medium text-lg mb-2 tile-header'>
          Contact History
        </h4>
        <StructuredListWrapper className='contact-history-container'>
          <StructuredListBody>
            {data &&
              data.length > 0 &&
              data.map((item, key) => (
                <ContactHistoryItem data={item} key={key} />
              ))}
          </StructuredListBody>
        </StructuredListWrapper>
      </Tile>
    </>
  );
};

export default ContactHistory;
