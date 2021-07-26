import axios from 'axios';
import clsx from 'clsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import get from 'lodash.get';
import React, { memo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FeedType, SubFeedType } from 'types/feed';
import { SECRET_KEY } from '../../../config';
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
      [dispatch, feeds, feedkey]
    );

    if (!Comments || Comments.length === 0) {
      return null;
    }

    return (
      <div>
        {Object.entries(Comments).map((item, index) => {
          const { UserFullName, Comment, PostedAt, UserID, isYouLiked, CommentKey, LikesCount } = item[1];

          return (
            <div className="flex items-start mt-4" key={`${UserID}_${index}`}>
              <img
                src={`http://socola.apax.online/api/avatar/view?cid=ekidpro&uid=${UserID}`}
                className="w-9 h-9 rounded-full"
              />
              <div className="ml-4">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <div>
                    <span className="font-semibold mr-2 text-blue-800 block">{UserFullName}</span>
                    <span className="block">
                      {Comment.split('<br />').map((item, index) => {
                        return (
                          <React.Fragment key={`${item}_${index}`}>
                            {item}
                            <br />
                          </React.Fragment>
                        );
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center mt-1">
                  {LikesCount > 0 && <span className="block mr-0.5">{LikesCount}</span>}
                  <button
                    onClick={() => onLikeComment(CommentKey)}
                    className={clsx({
                      'text-gray-500 duration-300 hover:text-blue-500': !isYouLiked,
                      'text-blue-500': isYouLiked,
                    })}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
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
  const [showFeedActions, setShowFeedActions] = useState<boolean>(false);

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

  const onEditFeed = useCallback(() => {
    const formData = new FormData();
    formData.set('content', valueInputFeed);
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

  const onDeleteFeed = useCallback(() => {
    const formData = new FormData();
    formData.set('feedid', `${ID}`);
    formData.set('secretkey', SECRET_KEY);

    axios
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
      .catch((error) => console.log(error.message));
  }, [ID, dispatch, feeds]);

  return (
    <FeedItemStyle className="mt-10">
      <div className="flex items-start">
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

            {!editMode && (
              <div className="feed-actions flex-col md:flex-row flex items-center md:justify-center flex-wrap">
                <div className="relative mt-20 md:mt-0">
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
                    <div className="wrapper-tooltip-bottom">
                      <div className="z-20 absolute transition duration-300 ease-in-out shadow-lg rounded left-0 tooltip-bottom">
                        <svg
                          className="absolute h-full arrow-bottom"
                          width="9px"
                          height="16px"
                          viewBox="0 0 9 16"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                          <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                            <g id="Tooltips-" transform="translate(-874.000000, -1029.000000)" fill="#f6f6f6">
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

                        <div className="bg-white w-40 rounded-md">
                          <button
                            onClick={() => {
                              setShowFeedActions(false);
                              setEditMode(true);
                            }}
                            className="flex items-center w-full text-gray-500 px-4 py-2 duration-300 hover:bg-indigo-50"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                              <path
                                fillRule="evenodd"
                                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="ml-2 text-gray-700">Edit comment</span>
                          </button>
                          <button
                            onClick={onDeleteFeed}
                            className="flex items-center w-full text-gray-500 px-4 py-2 duration-300 hover:bg-indigo-50"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="ml-2 text-gray-700">Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
                    'text-gray-500 duration-300 hover:text-blue-500': !isYouLiked,
                    'text-blue-500': isYouLiked,
                  })}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                </button>
              </>
            ) : null}

            {CommentCount > 0 && <span className="block mr-0.5">{CommentCount}</span>}
            <button className="mr-3 text-gray-500" onClick={() => setShowReplyInput(!showReplyInput)}>
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
        <div className="flex items-start justify-end">
          <div>
            {Content.date && (
              <div className="flex items-center justify-center mb-2">
                <span className="text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="font-semibold ml-2">{dayjs(Content.date).format('DD/MM/YYYY')}</span>
              </div>
            )}

            {Content.status && (
              <div>
                {Content.status === 'NORMAL' && (
                  <span className="font-semibold ml-2 px-3 py-1.5 bg-yellow-100 text-yellow-500 rounded-md">
                    Normal
                  </span>
                )}
                {Content.status === 'IMPORTANT' && (
                  <span className="font-semibold ml-2 px-3 py-1.5 bg-purple-100 text-purple-500 rounded-md">
                    Important
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </FeedItemStyle>
  );
};
