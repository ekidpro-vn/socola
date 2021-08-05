import axios from 'axios';
import clsx from 'clsx';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import request, { source } from '../../../../config/request';
import { setNewFeeds } from '../../../../store/action';
import { getFeeds, getProps } from '../../../../utils/helper';

export const FeedItemMoreAction: React.FC<{ ID: number; onTurnOnEditMode: () => void }> = ({
  ID,
  onTurnOnEditMode,
}) => {
  const [showFeedActions, setShowFeedActions] = useState<boolean>(false);
  const dispatch = useDispatch();
  const feeds = useSelector(getFeeds);
  const dataProps = useSelector(getProps);
  const { secretKey } = dataProps;

  const onDeleteFeed = useCallback(() => {
    const formData = new FormData();
    formData.set('feedid', `${ID}`);
    formData.set('secretkey', secretKey);

    request
      .post('/api/feed/deletefeed', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => {
        const { success, message } = response.data;
        if (!success || response.status > 400) {
          throw new Error(message || 'Delete failed');
        }
        setShowFeedActions(false);
        const newFeeds = feeds.filter((item) => item.ID !== ID);
        dispatch(setNewFeeds(newFeeds));
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          return;
        }
        toast.error(error.message, { autoClose: false });
      });

    return () => {
      source.cancel('Canceled by the user');
    };
  }, [ID, dispatch, feeds, secretKey]);

  return (
    <div className="feed-actions flex-col md:flex-row flex items-center md:justify-center flex-wrap">
      <div className="relative">
        <button
          onClick={() => setShowFeedActions(!showFeedActions)}
          className={clsx({
            'btn-more-option-feed duration-300 text-gray-500 w-7 h-7 flex items-center justify-center rounded-full':
              true,
            'hover:bg-indigo-50 btn-more-option-feed-hover': !showFeedActions,
            'bg-indigo-50': showFeedActions,
          })}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
        {showFeedActions && (
          <div className="wrapper-tooltip-more-action">
            <div className="z-20 absolute transition duration-300 ease-in-out shadow-lg rounded left-0 tooltip-more-action">
              <svg
                className="absolute h-full arrow-more-action"
                width="9px"
                height="16px"
                viewBox="0 0 9 16"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                  <g id="Tooltips-" transform="translate(-874.000000, -1029.000000)" fill="#fff">
                    <g id="Group-3-Copy-16" transform="translate(850.000000, 975.000000)">
                      <g id="Group-2" transform="translate(24.000000, 0.000000)">
                        <polygon
                          id="Triangle"
                          transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) "
                          points="4.5 57.5 12.5 66.5 -3.5 66.5"
                        />
                      </g>
                    </g>
                  </g>
                </g>
              </svg>

              <div className="bg-white w-48 rounded-md p-2.5">
                <button
                  onClick={() => {
                    setShowFeedActions(false);
                    onTurnOnEditMode();
                  }}
                  className="flex items-center w-full text-gray-500 px-4 py-2 duration-300 hover:bg-indigo-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path
                      fillRule="evenodd"
                      d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-2 text-gray-700 text-sm font-medium">Edit comment</span>
                </button>
                <hr />
                <button
                  onClick={onDeleteFeed}
                  className="flex items-center w-full text-gray-500 px-4 py-2 duration-300 hover:bg-indigo-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-2 text-gray-700 text-sm font-medium">Delete comment</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
