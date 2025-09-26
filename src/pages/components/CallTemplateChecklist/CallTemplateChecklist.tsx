import React from 'react';
import {Tile} from 'carbon-components-react'

interface CallTemplateChecklistProps {
  callTemplateChecklistItems: CallTemplateChecklistItem[];
}

const CallTemplateChecklist: React.FC<CallTemplateChecklistProps> = ({ callTemplateChecklistItems }) => (
  <>
    <Tile className='row-span-1'>
      <h4 className='font-medium text-lg mb-2 tile-header'>
        Call Template Checklist
      </h4>
      <div className='grid gap-1 p-2'>
        {callTemplateChecklistItems.map((item, index) => (
          <div key={index} className='flex flex-row gap-2 items-center'>
            <div className={`${item.completed ? 'rounded-full bg-green-500 w-3 h-3': 'rounded-full bg-orange-500 w-3 h-3'}`}></div>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </Tile>
  </>
);

export default CallTemplateChecklist;
