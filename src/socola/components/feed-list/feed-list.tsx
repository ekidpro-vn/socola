import React, { useEffect } from 'react';
import { List } from 'react-content-loader';
import { useDispatch, useSelector } from 'react-redux';
import { getFeedsFromApi } from '../../../store/action';
import { getFeeds, getPaginationFeed, getProps } from '../../../utils/helper';
import { FeedItem } from '../feed-item/feed-item';
import { Pagination } from '../pagination/pagination';

export const FeedList: React.FC = () => {
  const dataProps = useSelector(getProps);
  const { moduleId, channelId, recordId } = dataProps;
  const dispatch = useDispatch();
  const feeds = useSelector(getFeeds);
  const pagination = useSelector(getPaginationFeed);

  useEffect(() => {
    if (moduleId) {
      dispatch(getFeedsFromApi(moduleId, recordId, channelId));
    }
  }, [moduleId, channelId, recordId, dispatch]);

  if (!feeds) {
    return (
      <div className="mt-10">
        <List />
      </div>
    );
  }

  if (feeds.length === 0) {
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
