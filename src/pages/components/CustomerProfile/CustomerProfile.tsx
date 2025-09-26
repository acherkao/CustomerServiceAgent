import React from 'react';
import {
  Tile,
  StructuredListWrapper,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
  Tag,
} from 'carbon-components-react';
import styles from './CustomerProfile.module.scss';

interface Agent {
  icon: string;
  name: string;
}

interface Props {
  data: CustomerProfile | null;
  customer: Agent;
}

const CustomerProfile: React.FC<Props> = ({ data, customer }) => {
  if (!data || !Array.isArray(data.rows)) {
    return null;
  }
  return (
    <>
      <Tile className='row-span-2'>
        <h4 className='font-medium text-lg mb-2 tile-header'>
          Customer Profile
        </h4>
        <div className='mb-2 flex gap-4 mt-2'>
          <div className='rounded-full bg-[#525252] w-20 h-20 flex justify-center items-center overflow-hidden'>
            <img src={customer.icon} className='object-cover w-full h-full' />
          </div>
          <div>
            <p className='font-bold'>{customer.name}</p>
            <p>{data.phone_number}</p>
            <p>{data.sub_title}</p>
          </div>
        </div>
        <StructuredListWrapper isCondensed>
          <StructuredListBody>
            {data.rows.map((row, index) => (
              <StructuredListRow key={index}>
                <StructuredListCell noWrap>{row.name}</StructuredListCell>
                <StructuredListCell>
                  {row.tag ? <Tag>{row.value}</Tag> : row.value}
                </StructuredListCell>
              </StructuredListRow>
            ))}
          </StructuredListBody>
        </StructuredListWrapper>
      </Tile>
    </>
  );
};

export default CustomerProfile;
