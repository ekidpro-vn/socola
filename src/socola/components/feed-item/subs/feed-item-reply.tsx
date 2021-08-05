import axios from 'axios';
import clsx from 'clsx';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { SubFeedType } from 'types/feed';
import { LoadingSeemMoreIcon } from '../../../../assets/loading-see-more';
import { SOCOLA_AVATAR_URL } from '../../../../config/index';
import { setNewFeeds } from '../../../../store/action';
import { getDisplayTime, getFeeds, getProps } from '../../../../utils/helper';

const source = axios.CancelToken.source();

const LIMIT = 5;

export const FeedItemReply: React.FC<{
  Comments: Record<string, SubFeedType> | [];
  feedkey: string;
  CommentCount: number;
}> = ({ Comments, feedkey, CommentCount }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const feeds = useSelector(getFeeds);
  const dataProps = useSelector(getProps);
  const { readOnly } = dataProps;
  const [pageSeeMore, setPageSeeMore] = useState<number>(1);

  const onLikeComment = useCallback(
    (commentkey: string) => {
      if (readOnly) {
        return;
      }

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
        .catch((error) => {
          if (axios.isCancel(error)) {
            return;
          }
          toast.error(error.message, { autoClose: false });
        });

      return () => {
        source.cancel('Canceled by the user');
      };
    },
    [dispatch, feeds, feedkey, readOnly]
  );

  const onViewMore = useCallback(() => {
    setLoading(true);
    axios
      .get('/api/feed/getcomments', {
        params: {
          feedkey,
          page: pageSeeMore + 1,
          limit: LIMIT,
        },
      })
      .then((response) => {
        const { success, message, Comments } = response.data;
        if (!success || response.status > 400) {
          throw new Error(message || 'Reply failed');
        }
        setLoading(false);
        const newFeeds = feeds.map((item) => {
          if (item.FeedKey === feedkey) {
            item.Comments = { ...item.Comments, ...Comments };
          }
          return item;
        });
        dispatch(setNewFeeds(newFeeds));
        setPageSeeMore(pageSeeMore + 1);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          return;
        }
        toast.error(error.message, { autoClose: false });
        setLoading(false);
      });

    return () => {
      source.cancel('Canceled by the user');
    };
  }, [feedkey, dispatch, feeds, pageSeeMore]);

  if (!Comments || Comments.length === 0) {
    return null;
  }

  return (
    <div className="sm:pr-10">
      {Object.entries(Comments).map((item, index) => {
        const { UserFullName, Comment, PostedAt, UserID, isYouLiked, CommentKey, LikesCount } = item[1];

        return (
          <div className="flex items-start mt-4" key={`${UserID}_${index}`}>
            <img src={`${SOCOLA_AVATAR_URL}&uid=${UserID}`} className="w-8 h-8 rounded-full" />
            <div className="ml-4">
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <div>
                  <span className="font-semibold mr-2 text-blue-800 block text-reply">{UserFullName}</span>
                  <span className="block text-reply">
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
                {LikesCount > 0 && <span className="block mr-0.5 text-reply">{LikesCount}</span>}
                <button
                  onClick={() => onLikeComment(CommentKey)}
                  className={clsx({
                    'text-gray-500 duration-300 hover:text-blue-500': !isYouLiked && !readOnly,
                    'text-blue-500': isYouLiked && !readOnly,
                    'text-gray-500': readOnly,
                  })}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                </button>
                <span className="block opacity-70 ml-2 text-sm whitespace-nowrap">
                  {getDisplayTime(PostedAt * 1000)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      {CommentCount > 5 && LIMIT * pageSeeMore < CommentCount && (
        <button
          className="flex items-center rounded-md mt-4 ml-3 text-sm font-medium duration-300 hover:underline"
          onClick={onViewMore}
        >
          <span className="text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 transform rotate-180"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <div className="ml-2 flex items-center">
            <span className="text-gray-600 block mr-2">See other feedback</span>
            {loading && <LoadingSeemMoreIcon className="w-5 h-5" />}
          </div>
        </button>
      )}
    </div>
  );
};
