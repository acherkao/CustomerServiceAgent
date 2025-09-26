import React from 'react';
import {Tile, Search as CarbonSearch} from 'carbon-components-react';
import Loading from '../Loading'

interface SearchProps {
  searchValue: string;
  showDiscoveryLookupLoading: boolean;
  internet: React.ReactNode;
  video: React.ReactNode;
  network: React.ReactNode;
}

const Search: React.FC<SearchProps> = ({searchValue, showDiscoveryLookupLoading, internet, video, network }) => {
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
          value={searchValue}
        />
        {showDiscoveryLookupLoading ? (
          <div className='discovery-lookup-loading-container'>
            <Loading />
          </div>
        ) : (
          <div className='overflow-y-scroll py-2 px-1 max-h-96'>
            {internet}
            {video}
            {network}
          </div>
        )}
      </Tile>
    </>
  );
};

export default Search;
