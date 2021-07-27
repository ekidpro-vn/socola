import axios from 'axios';
import clsx from 'clsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import get from 'lodash.get';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FeedType } from 'types/feed';
import { SECRET_KEY } from '../../../config';
import { setNewFeeds } from '../../../store/action';
import { getProps } from '../../../utils/helper';
import { FeedItemStyle } from './feed-item.style';
import { FeedItemMoreAction } from './subs/feed-item-more-action';
import { FeedItemReply } from './subs/feed-item-reply';
import { FeedItemSubInfo, FeedItemSubInfoMobile } from './subs/feed-item-sub-info';

dayjs.extend(relativeTime);

export const FeedItem: React.FC<{ item: FeedType }> = ({ item }) => {
  const dataProps = useSelector(getProps);
  const { readOnly, userInfo, renderType } = dataProps;
  const [showReplyInput, setShowReplyInput] = useState<boolean>(false);
  const [valueReplyInput, setValueReplyInput] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);
  const {
    UserID,
    UserFullName,
    PostedAt,
    Comments,
    Content,
    LikesCount,
    FeedKey,
    isYouLiked,
    isLike,
    CommentCount,
    ID,
  } = item;
  const [valueInputFeed, setValueInputFeed] = useState(`${Content.Content.split('<br />').join('')}`);

  const dispatch = useDispatch();
  const feeds: FeedType[] | null = useSelector((state) => get(state, 'feeds'));

  const permisionEditFeed = userInfo?.id === Number(UserID) || userInfo?.role === 'ADMIN';

  const onReplyComment = useCallback(
    (feedkey: string) => {
      const formData = new FormData();
      formData.set('feedkey', feedkey);
      formData.set('comment', valueReplyInput.trim());

      axios
        .post('/api/feed/comment', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const { success, message, Comments } = response.data;
          if (!success || response.status > 400) {
            throw new Error(message || 'Reply failed');
          }
          const newFeeds = feeds.map((item) => {
            if (item.FeedKey === feedkey) {
              item.Comments = Comments;
            }
            return item;
          });
          dispatch(setNewFeeds(newFeeds));
        })
        .catch((error) => console.log(error.message));
    },
    [valueReplyInput, dispatch, feeds]
  );

  const onLikeComment = useCallback(
    (feedkey: string) => {
      if (readOnly) {
        return;
      }

      const formData = new FormData();
      formData.set('feedkey', feedkey);
      axios
        .post('/api/feed/like', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const { success, message, LikesCount, isYouLiked } = response.data;
          if (!success || response.status > 400) {
            throw new Error(message || 'Reply failed');
          }
          const newFeeds = feeds.map((item) => {
            if (item.FeedKey === feedkey) {
              item.LikesCount = LikesCount;
              item.isYouLiked = isYouLiked;
            }
            return item;
          });
          dispatch(setNewFeeds(newFeeds));
        })
        .catch((error) => console.log(error.message));
    },
    [dispatch, feeds, readOnly]
  );

  const onEditFeed = useCallback(() => {
    const formData = new FormData();
    formData.set('content', valueInputFeed.trim());
    formData.set('feedid', `${ID}`);
    formData.set('secretkey', SECRET_KEY);

    axios
      .post('/api/feed/editfeed', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => {
        const { success, message, feeddata } = response.data;
        if (!success || response.status > 400) {
          throw new Error(message || 'Edit failed');
        }
        setEditMode(false);
        const newFeeds = [feeddata, ...feeds];
        dispatch(setNewFeeds(newFeeds));
      })
      .catch((error) => console.log(error.message));
  }, [valueInputFeed, ID, dispatch, feeds]);

  if (renderType === 'minimum') {
    return (
      <div>
        {Content.Content.split('<br />').map((text, index) => {
          const key = `${text}_${index}`;
          return (
            <React.Fragment key={key}>
              <li>{text}</li>
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <FeedItemStyle className="mt-10">
      <div className="sm:hidden">
        <FeedItemSubInfoMobile date={Content.date} status={Content.status} />
      </div>
      <div className="flex items-start justify-between">
        <img
          src={`http://socola.apax.online/api/avatar/view?cid=ekidpro&uid=${UserID}`}
          className="w-10 h-10 rounded-full"
        />
        <div className="ml-4 w-full">
          <div className="flex items-center one-primary-feed duration-300">
            <div
              className={clsx({
                'bg-gray-100 px-4 py-2 rounded-lg duration-300 mr-3': true,
                'w-full': editMode,
                'w-fit-content': !editMode,
              })}
            >
              <span className="block font-semibold text-blue-800">{UserFullName}</span>
              <div
                className={clsx({
                  'flex justify-between': true,
                  'items-start': !editMode,
                  'items-center': editMode,
                })}
              >
                {editMode ? (
                  <textarea
                    className="w-full flex-1 flex items-center rounded py-2 mt-1 overflow-hidden border px-3 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:border-blue-600 focus:outline-none"
                    rows={3}
                    autoFocus
                    onChange={(e) => setValueInputFeed(e.target.value)}
                    value={valueInputFeed}
                  />
                ) : (
                  <span>
                    {Content.Content.split('<br />').map((item, index) => {
                      return (
                        <React.Fragment key={`${item}_${index}`}>
                          {item}
                          <br />
                        </React.Fragment>
                      );
                    })}
                  </span>
                )}
                {editMode && (
                  <div className="ml-4 w-20">
                    <button
                      onClick={onEditFeed}
                      className="block w-full text-center font-semibold bg-blue-500 duration-300 rounded-md text-white hover:bg-blue-600 px-3 py-1"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="block w-full text-center font-semibold text-white bg-red-500 duration-300 rounded-md border hover:bg-red-600 px-3 py-1 mt-2.5"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {!editMode && !readOnly && permisionEditFeed && (
              <FeedItemMoreAction ID={ID} onTurnOnEditMode={() => setEditMode(true)} />
            )}
          </div>
          <div className="flex items-center mt-1">
            {isLike ? (
              <>
                {LikesCount > 0 && <span className="block mr-0.5">{LikesCount}</span>}
                <button
                  onClick={() => onLikeComment(FeedKey)}
                  className={clsx({
                    'mr-3': true,
                    'text-gray-500 duration-300 hover:text-blue-500': !isYouLiked && !readOnly,
                    'text-blue-500': isYouLiked && !readOnly,
                    'text-gray-500': readOnly,
                  })}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                </button>
              </>
            ) : null}

            {CommentCount > 0 && <span className="block mr-0.5">{CommentCount}</span>}
            <button
              className="mr-3 text-gray-500"
              onClick={() => {
                if (readOnly) {
                  return;
                }
                setShowReplyInput(!showReplyInput);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <span className="block opacity-50">{dayjs(PostedAt * 1000).fromNow()}</span>
          </div>

          {showReplyInput && (
            <div className="mt-2">
              <textarea
                onKeyUp={(e) => {
                  if (e.code === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    setValueReplyInput('');
                    onReplyComment(FeedKey);
                    return false;
                  }
                }}
                value={valueReplyInput}
                placeholder="Reply to comment..."
                rows={1}
                autoFocus
                onChange={(e) => setValueReplyInput(e.target.value)}
                className="w-full flex-1 flex items-center rounded-xl py-1.5 overflow-hidden border px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:border-blue-600 focus:outline-none"
              />
            </div>
          )}

          <FeedItemReply Comments={Comments} feedkey={FeedKey} />
        </div>
        <div className="hidden sm:block">
          <FeedItemSubInfo date={Content.date} status={Content.status} />
        </div>
      </div>
    </FeedItemStyle>
  );
};
