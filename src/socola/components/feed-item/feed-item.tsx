import axios from 'axios';
import clsx from 'clsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import get from 'lodash.get';
import React, { memo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FeedType, SubFeedType } from 'types/feed';
import { setNewFeeds } from '../../../store/action';
import { FeedItemStyle } from './feed-item.style';

dayjs.extend(relativeTime);

const SubFeedItem: React.FC<{ Comments: Record<string, SubFeedType> | []; feedkey: string }> = memo(
  ({ Comments, feedkey }) => {
    const dispatch = useDispatch();
    const feeds: FeedType[] | null = useSelector((state) => get(state, 'feeds'));

    const onLikeComment = useCallback(
      (commentkey: string) => {
        const formData = new FormData();
        formData.set('commentkey', commentkey);
        axios
          .post('/api/feed/likecomment', formData, {
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
                Object.entries(item.Comments).map((item2) => {
                  const { CommentKey } = item2[1];
                  if (commentkey === CommentKey) {
                    item2[1].LikesCount = LikesCount;
                    item2[1].isYouLiked = isYouLiked;
                  }
                  return item2;
                });
              }
              return item;
            });
            dispatch(setNewFeeds(newFeeds));
          })
          .catch((error) => console.log(error.message));
      },
      [dispatch, feeds]
    );

    if (!Comments || Comments.length === 0) {
      return null;
    }

    return (
      <div>
        {Object.entries(Comments).map((item) => {
          const { UserFullName, Comment, PostedAt, UserID, isYouLiked, CommentKey, LikesCount } = item[1];

          return (
            <div className="flex items-start mt-4">
              <img
                src={`http://socola.apax.online/api/avatar/view?cid=ekidpro&uid=${UserID}`}
                className="w-9 h-9 rounded-full"
              />
              <div className="ml-4">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <div>
                    <span className="font-semibold mr-2 text-blue-800">{UserFullName}</span>
                    <span>{Comment}</span>
                  </div>
                </div>
                <div className="flex items-center mt-1">
                  {LikesCount > 0 && <span className="block mr-0.5">{LikesCount}</span>}
                  <button
                    onClick={() => onLikeComment(CommentKey)}
                    className={clsx({
                      'text-gray-500 duration-300 hover:text-red-500': !isYouLiked,
                      'text-red-500': isYouLiked,
                    })}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <span className="block opacity-50 ml-2">{dayjs(PostedAt * 1000).fromNow()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

export const FeedItem: React.FC<{ item: FeedType }> = ({ item }) => {
  const [showReplyInput, setShowReplyInput] = useState<boolean>(false);
  const [valueInput, setValueInput] = useState<string>('');
  const { UserID, UserFullName, PostedAt, Comments, Content, LikesCount, FeedKey, isYouLiked } = item;

  const dispatch = useDispatch();
  const feeds: FeedType[] | null = useSelector((state) => get(state, 'feeds'));

  const onReplyComment = useCallback(
    (feedkey: string) => {
      const formData = new FormData();
      formData.set('feedkey', feedkey);
      formData.set('comment', valueInput);

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
          setValueInput('');
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
    [valueInput, dispatch, feeds]
  );

  const onLikeComment = useCallback(
    (feedkey: string) => {
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
    [dispatch, feeds]
  );

  return (
    <FeedItemStyle className="mt-10">
      <div className="flex items-start">
        <img
          src={`http://socola.apax.online/api/avatar/view?cid=ekidpro&uid=${UserID}`}
          className="w-10 h-10 rounded-full"
        />
        <div className="ml-4 w-full">
          <div className="bg-gray-100 px-4 py-2 rounded-lg primary-feed">
            <span className="block font-semibold text-blue-800">{UserFullName}</span>
            <span className="block">{Content.Content}</span>
          </div>
          <div className="flex items-center mt-1">
            {LikesCount > 0 && <span className="block mr-0.5">{LikesCount}</span>}
            <button
              onClick={() => onLikeComment(FeedKey)}
              className={clsx({
                'text-gray-500 duration-300 hover:text-red-500': !isYouLiked,
                'text-red-500': isYouLiked,
              })}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button className="mx-3 text-gray-500" onClick={() => setShowReplyInput(true)}>
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
                onKeyDown={(e) => {
                  if (e.code === 'Enter' && !e.shiftKey) {
                    onReplyComment(FeedKey);
                  }
                }}
                value={valueInput}
                placeholder="Reply to comment..."
                rows={1}
                autoFocus
                onChange={(e) => setValueInput(e.target.value)}
                className="w-full flex-1 flex items-center rounded-xl py-1.5 overflow-hidden border px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:border-blue-600 focus:outline-none"
              />
            </div>
          )}
          <SubFeedItem Comments={Comments} feedkey={FeedKey} />
        </div>
      </div>
    </FeedItemStyle>
  );
};
