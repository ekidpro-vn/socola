import { LoadingComponent } from '@ekidpro/ui.loading';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFeedsFromApi } from '../../../store/action';
import { getFeeds, getPaginationFeed, getProps } from '../../../utils/helper';
import { FeedItem } from '../feed-item/feed-item';
import { Pagination } from '../pagination/pagination';

export const FeedList: React.FC = () => {
  const dataProps = useSelector(getProps);
  const { moduleId, channelId, recordId, onError } = dataProps;
  const dispatch = useDispatch();
  const feeds = useSelector(getFeeds);
  const pagination = useSelector(getPaginationFeed);

  console.log('ducnh4', feeds);

  useEffect(() => {
    if (moduleId) {
      dispatch(getFeedsFromApi(moduleId, recordId, channelId, undefined, onError));
    }
  }, [moduleId, channelId, recordId, dispatch, onError]);

  if (typeof feeds === 'undefined') {
    return (
      <div className="mt-10">
        <LoadingComponent />
      </div>
    );
  }

  if (feeds === null || feeds.length === 0) {
    return null;
  }

  return (
    <div className="my-10">
      {feeds.map((item) => (
        <FeedItem item={item} key={item.ID} />
      ))}
      <Pagination pagination={pagination} />
    </div>
  );
};
