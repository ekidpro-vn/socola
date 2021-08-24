import { LoadingComponent } from '@ekidpro/ui.loading';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFeedsFromApi } from '../../../store/action';
import { getFeeds, getProps } from '../../../utils/helper';
import { FeedItem } from '../feed-item/feed-item';
import { Pagination } from '../pagination/pagination';

export const FeedList: React.FC = () => {
  const dataProps = useSelector(getProps);
  const { moduleId, channelId, recordId, onError, token, secretKey, clientId } = dataProps;
  const dispatch = useDispatch();
  const feeds = useSelector(getFeeds);

  useEffect(() => {
    if (moduleId && token && secretKey && clientId) {
      dispatch(getFeedsFromApi(moduleId, recordId, channelId, undefined, onError));
    }
  }, [moduleId, channelId, recordId, dispatch, onError, token, secretKey, clientId]);

  if (!token || !secretKey || !clientId || !moduleId) {
    return null;
  }

  if (typeof feeds === 'undefined') {
    return (
      <div className="mt-10">
        <LoadingComponent />
      </div>
    );
  }

  // TODO: xem nên hiển thị gì khi không có data
  if (feeds === null || feeds.length === 0) {
    return null;
  }

  return (
    <div className="my-10">
      {feeds.map((item) => (
        <FeedItem item={item} key={item.ID} />
      ))}
      <Pagination />
    </div>
  );
};
