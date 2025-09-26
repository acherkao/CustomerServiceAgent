import React from 'react';
import { Tile } from 'carbon-components-react';

interface CurrentRecommendedAction {
  type?: string | null;
  action?: string | null;
}

interface RecommendedActionsProps {
  currentRecommendedAction: CurrentRecommendedAction;
}

const RecommendedActions: React.FC<RecommendedActionsProps> = ({
  currentRecommendedAction: currentRecommendedAction,
}) => {
  return (
    <>
      <Tile className='row-span-1 recommended-action'>
        <h4 className='font-medium text-lg mb-2 tile-header'>
          Recommended Actions
        </h4>
        {currentRecommendedAction.action && (
          <p>
            <b>
              {`${currentRecommendedAction.type} ${currentRecommendedAction.type && ': '}`}
            </b>
            {currentRecommendedAction.action}
          </p>
        )}
      </Tile>
    </>
  );
};

export default RecommendedActions;
