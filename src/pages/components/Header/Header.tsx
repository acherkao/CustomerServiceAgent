import React from 'react';
import {
  Header as CarbonHeader,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
} from 'carbon-components-react';
import dotenv from 'dotenv';
dotenv.config();

const BRANDING_NAME = process.env.NEXT_PUBLIC_BRANDING_NAME;
const APPLICATION_NAME = process.env.NEXT_PUBLIC_APPLICATION_NAME || 'Agent Assist';

interface Agent {
  icon: string;
  name: string;
}

interface Props {
  agent: Agent;
}

const Header: React.FC<Props> = ({agent}) => {
  return (
    <CarbonHeader
      aria-label={BRANDING_NAME}
      className='mb-4 w-full flex justify-between pr-2 headerClass'
    >
      <HeaderName href='#' prefix={BRANDING_NAME} className='headerClass'>
        {APPLICATION_NAME}
      </HeaderName>
      <div className='flex items-center'>
        <h2 className='mr-2'>{agent.name}</h2>
        <HeaderGlobalBar className='global-bar'>
          <HeaderGlobalAction aria-label='Settings'>
            <img src={agent.icon} className='userIcon' />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </div>
    </CarbonHeader>
  );
};

export default Header;
