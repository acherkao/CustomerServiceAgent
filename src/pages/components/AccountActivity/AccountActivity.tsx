import React, { useEffect, useState } from 'react';
import { Tile } from 'carbon-components-react';
import Loading from '../Loading';

interface AccountActivityProps {
  playedSeconds: number;
  data: AccountData;
}

interface Row {
  name: string;
  value: string;
}

const AccountActivity: React.FC<AccountActivityProps> = ({ playedSeconds, data }) => {
  const [showAccountInfo, setShowAccountInfo] = useState<boolean>(false);
  const [showAccountInfoLoading, setShowAccountInfoLoading] =
    useState<boolean>(false);


  useEffect(() => {
    if (playedSeconds > data.timestamp! - 3 && playedSeconds < data.timestamp!) {
      setShowAccountInfoLoading(true);
    }
    if (playedSeconds > data.timestamp!) {
      setShowAccountInfo(true);
      setShowAccountInfoLoading(false);
    } else {
      setShowAccountInfo(false);
    }
  }, [playedSeconds, data]);

  return (
    <>
      <Tile className='row-span-1'>
        <h4 className='font-medium text-lg mb-2 tile-header'>
          Account Activity
        </h4>
        <div className='flex flex-row gap-2 items-center justify-center account-activity'>
          <img
            src={data.icon}
            className='w-40 object-contain account-activity-icon'
          />
          {showAccountInfo ? (
            <p className='account-activity-items'>
              {data.rows && data.rows.map((row: Row, index: number) => (
                <React.Fragment key={index}>
                  <span className='font-bold'>{row.name}</span>: {row.value}{' '}
                  <br />
                </React.Fragment>
              ))}
            </p>
          ) : null}
          {showAccountInfoLoading && <Loading />}
        </div>
      </Tile>
    </>
  );
};

export default AccountActivity;
