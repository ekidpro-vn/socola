import axios from 'axios';
import clsx from 'clsx';
import dayjs from 'dayjs';
import get from 'lodash.get';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FeedType, SubFeedType } from 'types/feed';
import { setNewFeeds } from '../../../../store/action';
import { getProps } from '../../../../utils/helper';

export const FeedItemReply: React.FC<{ Comments: Record<string, SubFeedType> | []; feedkey: string }> = ({
  Comments,
  feedkey,
}) => {
  const dispatch = useDispatch();
  const feeds: FeedType[] | null = useSelector((state) => get(state, 'feeds'));
  const dataProps = useSelector(getProps);
  const { readOnly } = dataProps;

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
        .catch((error) => console.log(error.message));
    },
    [dispatch, feeds, feedkey, readOnly]
  );

  // const onViewMore = () => {
  //   axios
  //     .get('/api/feed/getcomments', {
  //       params: {
  //         feedkey,
  //         page: 1,
  //         limit: 10,
  //       },
  //     })
  //     .then((response) => {
  //       console.log('ducnh');
  //     })
  //     .catch((error) => console.log(error.message));
  // };

  if (!Comments || Comments.length === 0) {
    return null;
  }

  return (
    <div className="sm:pr-10">
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
                    'text-gray-500 duration-300 hover:text-blue-500': !isYouLiked && !readOnly,
                    'text-blue-500': isYouLiked && !readOnly,
                    'text-gray-500': readOnly,
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
      {/* <button className="block" onClick={onViewMore}>
        View more
      </button> */}
    </div>
  );
};
